import React, { useState } from "react";
import { ChakraProvider, Box, Heading } from "@chakra-ui/react";
import CreateTableForm from "./components/CreateTableForm";
import TableView from "./components/TableView";

const App: React.FC = () => {
  const [tableId, setTableId] = useState<number | null>(null);

  return (
    <ChakraProvider>
      <Box p={4}>
        <Heading mb={4}>Динамические Таблицы</Heading>
        {!tableId ? (
          <CreateTableForm onCreated={(id) => setTableId(id)} />
        ) : (
          <TableView tableId={tableId} />
        )}
      </Box>
    </ChakraProvider>
  );
};

export default App;
