from pydantic import BaseModel, Field, conint
from typing import List, Dict, Any, Literal, Optional

# --- Типы данных для конструктора (без изменений) ---

ColumnType = Literal["text", "number", "timestamp", "select"]


class ColumnSchema(BaseModel):
    """Схема для описания одного столбца таблицы."""
    name: str = Field(..., description="Уникальное имя столбца (должно быть в нижнем регистре)")
    type: ColumnType = Field(..., description="Тип данных: text, number, timestamp, select")
    is_required: bool = Field(False, description="Обязательность заполнения")
    options: List[str] = Field(default_factory=list, description="Варианты для типа 'select'")


# --- Схемы для Метаданных Таблиц (без изменений) ---

class TableBase(BaseModel):
    """Базовая схема для создания новой таблицы."""
    name: str = Field(..., description="Название таблицы")
    description: Optional[str] = Field(None, description="Описание таблицы")
    columns: List[ColumnSchema] = Field(..., description="Массив с описанием столбцов")


class TableCreate(TableBase):
    """Схема для запроса создания новой таблицы."""
    pass


class TableInDB(BaseModel):
    """Схема данных таблицы, возвращаемых из БД."""
    id: int = Field(..., description="Уникальный ID таблицы в системе")
    name: str
    description: Optional[str] = None
    columns_json: Any

    class Config:
        from_attributes = True


# --- Схемы для CRUD строк (НОВЫЕ) ---

class RowDataRequest(BaseModel):
    """Схема для создания/обновления одной строки данных."""
    # Data — это словарь, содержащий {имя_столбца: значение}
    data: Dict[str, Any] = Field(..., description="Словарь данных строки")


class RowDataResponse(RowDataRequest):
    """Схема для ответа, включает ID строки и служебные поля."""
    id: conint(ge=1)
    created_at: str  # Дата/время создания, возвращается как строка


class DynamicTableData(BaseModel):
    """Схема для возврата полных данных таблицы."""
    table_schema: TableInDB
    rows: List[RowDataResponse]