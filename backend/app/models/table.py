from sqlalchemy import Column, Integer, String, JSON
from app.core.database import Base

class Table(Base):
    """Модель для хранения метаданных созданных пользователем таблиц."""
    __tablename__ = "tables_metadata"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True, nullable=False)
    description = Column(String)
    # Храним структуру столбцов в формате JSON
    columns_json = Column(JSON, nullable=False)