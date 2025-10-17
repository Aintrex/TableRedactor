import axios from 'axios';
import { TableCreateRequest, TableInDB } from '../types/table';

// Базовый URL нашего бэкенда
const API_URL = 'http://127.0.0.1:8000/api/v1/tables';

export const createTable = async (data: TableCreateRequest): Promise<TableInDB> => {
  try {
    const response = await axios.post<TableInDB>(API_URL, data);
    return response.data;
  } catch (error) {
    // В случае ошибки бэкенда (например, 400 Bad Request)
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.detail || 'Ошибка при создании таблицы');
    }
    throw new Error('Не удалось подключиться к API');
  }
};

export const getTableSchema = async (tableId: number): Promise<TableInDB> => {
  const response = await axios.get<TableInDB>(`${API_URL}/${tableId}`);
  return response.data;
};