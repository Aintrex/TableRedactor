import React, { useEffect, useState, useMemo } from "react";
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  Input,
  HStack,
  VStack,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useToast,
} from "@chakra-ui/react";
import { ChevronUpIcon, ChevronDownIcon, DownloadIcon, SearchIcon } from "@chakra-ui/icons";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { getTableData, addRow, deleteRow, importExcel, Row, Column } from "../api";
import RowForm from "./RowForm";

interface Props {
  tableId: number;
}

interface SortConfig {
  key: string;
  direction: 'asc' | 'desc';
}

const TableView: React.FC<Props> = ({ tableId }) => {
  const [rows, setRows] = useState<Row[]>([]);
  const [columns, setColumns] = useState<Column[]>([]);
  const [sortConfig, setSortConfig] = useState<SortConfig | null>(null);
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  const loadData = React.useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await getTableData(tableId);
      const colsRaw: any = (data.table_schema as any).columns_json;
      const cols = Array.isArray(colsRaw) ? colsRaw : JSON.parse(colsRaw);
      setColumns(cols);
      setRows(data.rows);
    } catch (error: any) {
      toast({
        title: "Error loading data",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  }, [tableId, toast]);

  const handleAddRow = async (row: Record<string, any>) => {
    try {
      await addRow(tableId, row);
      await loadData();
      toast({
        title: "Row added successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error: any) {
      toast({
        title: "Error adding row",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleDeleteRow = async (rowId: number) => {
    try {
      await deleteRow(tableId, rowId);
      await loadData();
      toast({ title: "Row deleted", status: "success", duration: 2000 });
    } catch (error: any) {
      toast({ title: "Error deleting row", description: error.message, status: "error", duration: 5000 });
    }
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      await importExcel(tableId, file);
      await loadData();
      toast({ title: "Imported successfully", status: "success", duration: 3000 });
    } catch (error: any) {
      toast({ title: "Import error", description: error.message, status: "error", duration: 5000 });
    } finally {
      e.target.value = "";
    }
  };

  const handleExport = async () => {
    try {
      const data = await getTableData(tableId);
      const rowsForExport = data.rows.map((r: any) => ({ 
        id: r.id, 
        ...r.data, 
        created_at: r.created_at 
      }));
      const ws = XLSX.utils.json_to_sheet(rowsForExport);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
      const buf = XLSX.write(wb, { bookType: "xlsx", type: "array" });
      saveAs(
        new Blob([buf], { type: "application/octet-stream" }), 
        `table_${tableId}.xlsx`
      );
      toast({
        title: "Table exported successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error: any) {
      toast({
        title: "Error exporting table",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig?.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const handleFilter = (column: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [column]: value,
    }));
  };

  const filteredAndSortedRows = useMemo(() => {
    let result = [...rows];

    // Apply filters
    Object.entries(filters).forEach(([column, filterValue]) => {
      if (filterValue) {
        result = result.filter(row => {
          const value = String(row.data[column] || '').toLowerCase();
          return value.includes(filterValue.toLowerCase());
        });
      }
    });

    // Apply sorting
    if (sortConfig) {
      result.sort((a, b) => {
        const aValue = a.data[sortConfig.key];
        const bValue = b.data[sortConfig.key];
        
        if (aValue < bValue) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }

    return result;
  }, [rows, filters, sortConfig]);

  return (
    <VStack spacing={4} align="stretch">
      <HStack justifyContent="space-between">
        <HStack>
          <Button
            leftIcon={<DownloadIcon />}
            colorScheme="green"
            onClick={handleExport}
            isLoading={isLoading}
          >
            Export to Excel
          </Button>
          <Input type="file" accept=".xlsx,.xls" onChange={handleImport} width="auto" />
        </HStack>
        <RowForm columns={columns} onSubmit={handleAddRow} />
      </HStack>

      <Box overflowX="auto">
        <Table variant="simple">
          <Thead>
            <Tr>
              {columns.map((column) => (
                <Th key={column.name}>
                  <VStack align="stretch" spacing={2}>
                    <HStack justifyContent="space-between">
                      <Box cursor="pointer" onClick={() => handleSort(column.name)}>
                        {column.name}
                        {sortConfig?.key === column.name && (
                          sortConfig.direction === 'asc' ? <ChevronUpIcon /> : <ChevronDownIcon />
                        )}
                      </Box>
                    </HStack>
                    <Input
                      size="sm"
                      placeholder="Filter..."
                      value={filters[column.name] || ''}
                      onChange={(e) => handleFilter(column.name, e.target.value)}
                    />
                  </VStack>
                </Th>
              ))}
            </Tr>
            <Tr>
              <Th>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {filteredAndSortedRows.map((row) => (
              <Tr key={row.id}>
                {columns.map((column) => (
                  <Td key={column.name}>{row.data[column.name]}</Td>
                ))}
                <Td>
                  <Button size="sm" colorScheme="red" onClick={() => handleDeleteRow(row.id)}>Delete</Button>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
    </VStack>
  );
};

export default TableView;
