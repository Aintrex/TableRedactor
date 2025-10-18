import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8000/tables",
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface Column {
  name: string;
  type: string;
  is_required?: boolean;
  options?: string[];
}

export interface Table {
  id: number;
  name: string;
  description?: string;
  columns_json: any;
}

export interface Row {
  id: number;
  created_at: string;
  data: Record<string, any>;
}

// Tables API
export const getTables = () => 
  API.get<Table[]>("/").then((res) => res.data);

export const createTable = (payload: { name: string; columns: Column[] }) =>
  API.post<Table>("/", payload).then((res) => res.data);

export const getTable = (id: number) =>
  API.get<Table>(`/${id}`).then((res) => res.data);

export const updateTable = (id: number, payload: Partial<Table>) =>
  API.put<Table>(`/${id}`, payload).then((res) => res.data);

export const deleteTable = (id: number) =>
  API.delete(`/${id}`).then((res) => res.data);

// Table Data API
export const getTableData = (tableId: number) =>
  API.get<{ table_schema: Table; rows: Row[] }>(`/${tableId}/data`).then((res) => res.data);

export const addRow = (tableId: number, data: Record<string, any>) =>
  API.post<Row>(`/${tableId}/rows`, { data }).then((res) => res.data);

export const updateRow = (tableId: number, rowId: number, data: Record<string, any>) =>
  API.put<Row>(`/${tableId}/rows/${rowId}`, { data }).then((res) => res.data);

export const deleteRow = (tableId: number, rowId: number) =>
  API.delete(`/${tableId}/rows/${rowId}`).then((res) => res.data);

// Excel Import/Export
export const importExcel = (tableId: number, file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  return API.post<{ rows: Row[] }>(`/${tableId}/import`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }).then((res) => res.data);
};
