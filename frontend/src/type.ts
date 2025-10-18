
export type ColumnType = "text" | "number" | "timestamp" | "list";

export interface Column {
  name: string;
  type: ColumnType;
}

export interface Table {
  id: number;
  name: string;
  columns: Column[];
}
