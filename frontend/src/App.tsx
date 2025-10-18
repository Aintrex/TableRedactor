import React, { useEffect, useState } from "react";
import { getTables, createTable } from "./api";
import TableList from "./components/TableList";
import CreateTableForm from "./components/CreateTableFrom";
import DataTable from "./components/DataTable";
import { Table } from "./type";

const App: React.FC = () => {
  const [tables, setTables] = useState<Table[]>([]);
  const [selected, setSelected] = useState<Table | null>(null);

  const loadTables = async () => {
    const data = await getTables();
    setTables(data);
  };

  useEffect(() => {
    loadTables();
  }, []);

  return (
    <div style={{ display: "flex", gap: "2rem", padding: "1rem" }}>
      <div>
        <h2>Создать таблицу</h2>
        <CreateTableForm onCreated={loadTables} />
      </div>

      <div>
        <h2>Список таблиц</h2>
        <TableList tables={tables} onSelect={setSelected} />
      </div>

      <div style={{ flex: 1 }}>
        {selected ? (
          <DataTable table={selected} />
        ) : (
          <p>Выберите таблицу слева или создайте новую.</p>
        )}
      </div>
    </div>
  );
};

export default App;
