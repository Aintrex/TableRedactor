import React, { useEffect, useState } from "react";
import { getTableData, addRow, deleteRow } from "../api";
import { Table } from "../type";

const DataTable: React.FC<{ table: Table }> = ({ table }) => {
  const [rows, setRows] = useState<any[]>([]);
  const [newRow, setNewRow] = useState<any>({});

  const fetchData = async () => {
    const data = await getTableData(table.id);
    setRows(data);
  };

  useEffect(() => {
    fetchData();
  }, [table]);

  const handleAddRow = async () => {
    await addRow(table.id, newRow);
    setNewRow({});
    fetchData();
  };

  const handleDelete = async (id: number) => {
    await deleteRow(table.id, id);
    fetchData();
  };

  return (
    <div>
      <h2>Таблица: {table.name}</h2>
      <table border={1}>
        <thead>
          <tr>
            {table.columns.map((c) => (
              <th key={c.name}>{c.name}</th>
            ))}
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id}>
              {table.columns.map((c) => (
                <td key={c.name}>{row[c.name]}</td>
              ))}
              <td>
                <button onClick={() => handleDelete(row.id)}>Удалить</button>
              </td>
            </tr>
          ))}
          <tr>
            {table.columns.map((c) => (
              <td key={c.name}>
                <input
                  value={newRow[c.name] || ""}
                  onChange={(e) =>
                    setNewRow({ ...newRow, [c.name]: e.target.value })
                  }
                />
              </td>
            ))}
            <td>
              <button onClick={handleAddRow}>Добавить</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;
