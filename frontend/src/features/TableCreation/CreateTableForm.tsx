import React, { useState } from 'react';
import {
  Box, Button, Input, VStack, Select, Checkbox, HStack, Heading,
  IconButton, useToast, Text
} from '@chakra-ui/react';
import { AddIcon, DeleteIcon } from '@chakra-ui/icons';
import { createTable } from '../../services/tableApi';
import { ColumnSchema, ColumnType, TableCreateRequest } from '../../types/table';

// Начальное состояние для нового столбца
const initialColumn: ColumnSchema = {
  name: '',
  type: 'text',
  is_required: false,
  options: [],
};

const CreateTableForm: React.FC = () => {
  const [tableName, setTableName] = useState('');
  const [tableDescription, setTableDescription] = useState('');
  const [columns, setColumns] = useState<ColumnSchema[]>([initialColumn]);
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  const handleColumnChange = (index: number, field: keyof ColumnSchema, value: any) => {
    const newColumns = columns.map((col, i) => {
      if (i === index) {
        return { ...col, [field]: value };
      }
      return col;
    });
    setColumns(newColumns);
  };

  const addColumn = () => {
    setColumns([...columns, initialColumn]);
  };

  const removeColumn = (index: number) => {
    if (columns.length > 1) {
      setColumns(columns.filter((_, i) => i !== index));
    }
  };

  const handleTypeChange = (index: number, type: ColumnType) => {
    // Сброс options при смене типа с 'select' на другой
    handleColumnChange(index, 'type', type);
    if (type !== 'select') {
        handleColumnChange(index, 'options', []);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const tableData: TableCreateRequest = {
      name: tableName,
      description: tableDescription,
      columns: columns.map(col => ({
        ...col,
        // Удаляем пробелы, чтобы имя столбца было чистым для БД
        name: col.name.trim().replace(/\s+/g, '_').toLowerCase(),
      })),
    };

    try {
      const newTable = await createTable(tableData);
      toast({
        title: "Таблица создана!",
        description: `ID: ${newTable.id}, Имя: ${newTable.name}`,
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      // Очистка формы или редирект
    } catch (error) {
      toast({
        title: "Ошибка создания",
        description: error instanceof Error ? error.message : "Неизвестная ошибка",
        status: "error",
        duration: 6000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box p={8} maxW="container.xl" margin="auto">
      <Heading mb={6}>Создание новой таблицы 📝</Heading>
      <form onSubmit={handleSubmit}>
        <VStack spacing={4} align="stretch" mb={8}>
          <Input
            placeholder="Название таблицы (например, 'Отчет по браку')"
            value={tableName}
            onChange={(e) => setTableName(e.target.value)}
            isRequired
            size="lg"
          />
          <Input
            placeholder="Краткое описание"
            value={tableDescription}
            onChange={(e) => setTableDescription(e.target.value)}
            size="md"
          />
        </VStack>

        <Heading size="md" mb={4}>Настройка столбцов</Heading>
        <VStack spacing={4} align="stretch}>
          {columns.map((col, index) => (
            <HStack key={index} spacing={4} p={4} borderWidth="1px" borderRadius="lg" bg="gray.50">
              {/* Имя столбца */}
              <Input
                placeholder="Имя столбца"
                value={col.name}
                onChange={(e) => handleColumnChange(index, 'name', e.target.value)}
                isRequired
                w="200px"
              />

              {/* Тип данных */}
              <Select
                value={col.type}
                onChange={(e) => handleTypeChange(index, e.target.value as ColumnType)}
                w="150px"
              >
                <option value="text">Текст</option>
                <option value="number">Число</option>
                <option value="timestamp">Дата/Время</option>
                <option value="select">Список значений</option>
              </Select>

              {/* Обязательность */}
              <Checkbox
                isChecked={col.is_required}
                onChange={(e) => handleColumnChange(index, 'is_required', e.target.checked)}
              >
                Обязательное
              </Checkbox>

              {/* Варианты для списка */}
              {col.type === 'select' && (
                <Input
                  placeholder="Варианты (через запятую, например: ОК, Сломан)"
                  value={col.options.join(', ')}
                  onChange={(e) => handleColumnChange(index, 'options', e.target.value.split(',').map((s: string) => s.trim()))}
                  flex="1"
                />
              )}

              {/* Кнопка удаления */}
              <IconButton
                icon={<DeleteIcon />}
                aria-label="Удалить столбец"
                onClick={() => removeColumn(index)}
                isDisabled={columns.length === 1}
                colorScheme="red"
                variant="ghost"
              />
            </HStack>
          ))}
        </VStack>

        <Button
          leftIcon={<AddIcon />}
          mt={4}
          onClick={addColumn}
          colorScheme="blue"
          variant="outline"
        >
          Добавить столбец
        </Button>

        <Button
          type="submit"
          colorScheme="green"
          size="lg"
          width="100%"
          mt={8}
          isLoading={isLoading}
          isDisabled={!tableName || columns.some(c => !c.name || (c.type === 'select' && c.options.length === 0))}
        >
          Создать таблицу в базе данных
        </Button>
      </form>
    </Box>
  );
};

export default CreateTableForm;