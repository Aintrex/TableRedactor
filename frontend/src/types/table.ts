// Соответствует нашей Pydantic схеме ColumnSchema
export type ColumnType = "text" | "number" | "timestamp" | "select";

export interface ColumnSchema {
  name: string;
  type: ColumnType;
  is_required: boolean;
  options: string[]; // Используется, если type === 'select'
}

// Соответствует нашей Pydantic схеме TableCreate
export interface TableCreateRequest {
  name: string;
  description: string;
  columns: ColumnSchema[];
}

// Соответствует нашей Pydantic схеме TableInDB
export interface TableInDB extends TableCreateRequest {
  id: number;
  // В реальном приложении: columns_json будет распарсен в columns
}