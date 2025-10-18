import os
from dotenv import load_dotenv

# Загружаем переменные из .env файла
load_dotenv()

class Settings:
    """Класс для хранения настроек приложения."""
    DATABASE_URL: str = os.getenv("DATABASE_URL") or "sqlite:///./app.db"
    SECRET_KEY: str = os.getenv("SECRET_KEY") or "dev-secret-key"
    # Другие настройки...

settings = Settings()