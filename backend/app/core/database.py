from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from app.core.config import settings

# Инициализация движка базы данных
engine = create_engine(
    settings.DATABASE_URL,
    pool_pre_ping=True  # Проверка соединения перед использованием
)

# Создание сессии для работы с БД
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Базовый класс для всех моделей SQLAlchemy
Base = declarative_base()


# Dependency для получения сессии БД в роутах
def get_db():
    """Создает и закрывает сессию БД для каждого запроса."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def init_db():
    """Создает все таблицы, определенные в Base.metadata."""
    # Импортируем все модели, чтобы Base знал о них
    from app.models import table  # Убедитесь, что все модели импортированы

    Base.metadata.create_all(bind=engine)