import React, { useEffect, useState } from "react";
import { Box, Button, Heading, Input, Table, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/react";
import { getTableData, addRow, deleteRow } from "../api";
import { Table as TableType } from "../type";

const DataTable: React.FC<{ table: TableType }> = ({ table }) => {
  const [rows, setRows] = useState<any[]>([]);
  const [newRow, setNewRow] = useState<any>({});

  const fetchData = async () => {
    const data = await getTableData(table.id);
    setRows(data.rows || []);
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
    <Box>
      <Heading size="md" mb={4}>Таблица: {table.name}</Heading>
      <Table variant="simple" size="sm">
        <Thead>
          <Tr>
            {table.columns.map((c) => (
              <Th key={c.name}>{c.name}</Th>
            ))}
            <Th>Действия</Th>
          </Tr>
        </Thead>
        <Tbody>
          {rows.map((row) => (
            <Tr key={row.id}>
              {table.columns.map((c) => (
                <Td key={c.name}>{row.data[c.name]}</Td>
              ))}
              <Td>
                <Button size="sm" colorScheme="red" onClick={() => handleDelete(row.id)}>
                  Удалить
                </Button>
              </Td>
            </Tr>
          ))}
          <Tr>
            {table.columns.map((c) => (
              <Td key={c.name}>
                <Input
                  size="sm"
                  value={newRow[c.name] || ""}
                  onChange={(e) =>
                    setNewRow({ ...newRow, [c.name]: e.target.value })
                  }
                />
              </Td>
            ))}
            <Td>
              <Button size="sm" colorScheme="green" onClick={handleAddRow}>
                Добавить
              </Button>
            </Td>
          </Tr>
        </Tbody>
      </Table>
    </Box>
  );
};

export default DataTable;
