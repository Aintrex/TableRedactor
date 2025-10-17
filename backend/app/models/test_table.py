from sqlalchemy import Column, Integer, String, Float, DateTime
from app.core.database import Base
import datetime


# Модель для фиксированной таблицы "Испытания материалов"
class TestResult(Base):
    __tablename__ = "test_results"

    id = Column(Integer, primary_key=True, index=True)

    # Колонки, как в кейсе:
    sample_name = Column(String, nullable=False, comment="Образец (текст)")
    strength_limit = Column(Float, comment="Предел прочности, МПа (число)")
    temperature = Column(Float, comment="Температура, °С (число)")

    # Для колонки "Результат" (список: ОК, Сломан) используем String
    result = Column(String, comment="Результат (список: ОК, Сломан)")

    created_at = Column(DateTime, default=datetime.datetime.utcnow)