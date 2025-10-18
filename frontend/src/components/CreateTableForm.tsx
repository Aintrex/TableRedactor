import React, { useState } from "react";
import {
  Box,
  Button,
  Input,
  VStack,
  Select,
  FormControl,
  FormLabel,
  FormErrorMessage,
  useToast,
  IconButton,
} from "@chakra-ui/react";
import { DeleteIcon } from "@chakra-ui/icons";
import { createTable, Column } from "../api";

interface Props {
  onCreated: (tableId: number) => void;
}

const CreateTableForm: React.FC<Props> = ({ onCreated }) => {
  const [name, setName] = useState("");
  const [columns, setColumns] = useState<Column[]>([{ name: "", type: "text", is_required: true, options: [] }]);
  const [error, setError] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const toast = useToast();

  const addColumn = () => setColumns([...columns, { name: "", type: "text", is_required: true, options: [] }]);

  const removeColumn = (index: number) => {
    if (columns.length > 1) {
      setColumns(columns.filter((_, i) => i !== index));
    }
  };

  const updateColumn = (index: number, field: keyof Column, value: any) => {
    const newCols = columns.map((col, i) => {
      if (i === index) {
        return { ...col, [field]: value };
      }
      return col;
    });
    setColumns(newCols);
  };

  const validateForm = (): boolean => {
    if (!name.trim()) {
      setError("Table name is required");
      return false;
    }
    
    if (!columns.every(col => col.name.trim())) {
      setError("All columns must have names");
      return false;
    }

    if (new Set(columns.map(col => col.name)).size !== columns.length) {
      setError("Column names must be unique");
      return false;
    }

    setError("");
    return true;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const table = await createTable({ 
        name, 
        columns: columns.map(col => ({
          name: col.name.trim(),
          type: col.type,
          is_required: col.is_required,
          options: col.type === 'select' ? (col.options || []) : []
        }))
      });
      toast({
        title: "Table created successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      onCreated(table.id);
    } catch (err: any) {
      const errorMessage = err?.response?.data?.detail || err.message || "Network error";
      setError(errorMessage);
      toast({
        title: "Error creating table",
        description: errorMessage,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box borderWidth="1px" p={6} borderRadius="lg" shadow="md" w="full" maxW="800px" m="auto">
      <form onSubmit={handleSubmit}>
        <VStack spacing={4} align="stretch">
          <FormControl isInvalid={!!error && !name}>
            <FormLabel>Table Name</FormLabel>
            <Input
              placeholder="Enter table name"
              value={name}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
              isDisabled={isSubmitting}
            />
            <FormErrorMessage>Table name is required</FormErrorMessage>
          </FormControl>

          <VStack spacing={4} align="stretch">
            {columns.map((col, i) => (
              <Box key={i} display="flex" gap={3} alignItems="center">
                <FormControl isInvalid={!!error && !col.name}>
                  <Input
                    placeholder="Column name"
                    value={col.name}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      updateColumn(i, "name", e.target.value)
                    }
                    isDisabled={isSubmitting}
                  />
                </FormControl>
                
                <Select
                  value={col.type}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                    updateColumn(i, "type", e.target.value)
                  }
                  w="150px"
                  isDisabled={isSubmitting}
                >
                  <option value="text">Text</option>
                  <option value="number">Number</option>
                  <option value="timestamp">Date/Time</option>
                  <option value="select">List</option>
                </Select>

                {col.type === 'select' && (
                  <Input
                    placeholder="Comma-separated options"
                    value={(col.options || []).join(", ")}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      updateColumn(i, "options", e.target.value.split(",").map(s => s.trim()).filter(Boolean))
                    }
                    isDisabled={isSubmitting}
                  />
                )}

                <IconButton
                  aria-label="Remove column"
                  icon={<DeleteIcon />}
                  onClick={() => removeColumn(i)}
                  isDisabled={columns.length === 1 || isSubmitting}
                  colorScheme="red"
                  variant="ghost"
                />
              </Box>
            ))}
          </VStack>

          {error && (
            <Box color="red.500" fontSize="sm" mt={2}>
              {error}
            </Box>
          )}

          <Button
            onClick={addColumn}
            colorScheme="blue"
            variant="ghost"
            leftIcon={<>+</>}
            isDisabled={isSubmitting}
          >
            Add Column
          </Button>

          <Button
            type="submit"
            colorScheme="green"
            isLoading={isSubmitting}
            loadingText="Creating..."
          >
            Create Table
          </Button>
        </VStack>
      </form>
    </Box>
  );
};

export default CreateTableForm;
