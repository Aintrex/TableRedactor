import React, { useState } from "react";
import { createTable } from "../api";

const CreateTableForm: React.FC<{ onCreated: () => void }> = ({ onCreated }) => {
  const [name, setName] = useState("");
  const [columns, setColumns] = useState([{ name: "", type: "text" }]);

  const addColumn = () => setColumns([...columns, { name: "", type: "text" }]);

  const updateColumn = (index: number, field: string, value: string) => {
    const newCols = [...columns];
    (newCols[index] as any)[field] = value;
    setColumns(newCols);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createTable({ name, columns });
    onCreated();
  };

  return (
    <div>
      <h2>Создать таблицу</h2>
      <form onSubmit={handleSubmit}>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Имя таблицы"
        />
        {columns.map((col, i) => (
          <div key={i}>
            <input
              value={col.name}
              onChange={(e) => updateColumn(i, "name", e.target.value)}
              placeholder="Имя колонки"
            />
            <select
              value={col.type}
              onChange={(e) => updateColumn(i, "type", e.target.value)}
            >
              <option value="text">Текст</option>
              <option value="number">Число</option>
              <option value="timestamp">Дата/время</option>
              <option value="list">Список</option>
            </select>
          </div>
        ))}
        <button type="button" onClick={addColumn}>
          + Добавить колонку
        </button>
        <button type="submit">Создать</button>
      </form>
    </div>
  );
};

export default CreateTableForm;
