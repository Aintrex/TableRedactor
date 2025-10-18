import React from "react";
import { Table } from "../type";

interface Props {
  tables: Table[];
  onSelect: (table: Table) => void;
}

const TableList: React.FC<Props> = ({ tables, onSelect }) => {
  return (
    <div>
      <h2>Список таблиц</h2>
      <ul>
        {tables.map((table) => (
          <li key={table.id}>
            <button onClick={() => onSelect(table)}>{table.name}</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TableList;
