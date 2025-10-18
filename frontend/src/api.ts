const API_URL = "http://localhost:8000"; 

export async function getTables() {
  const res = await fetch(`${API_URL}/tables/`);
  return res.json();
}

export async function createTable(data: any) {
  const res = await fetch(`${API_URL}/tables/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function getTableData(tableId: number) {
  const res = await fetch(`${API_URL}/tables/${tableId}/rows`);
  return res.json();
}

export async function addRow(tableId: number, row: any) {
  const res = await fetch(`${API_URL}/tables/${tableId}/rows`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(row),
  });
  return res.json();
}

export async function deleteRow(tableId: number, rowId: number) {
  await fetch(`${API_URL}/tables/${tableId}/rows/${rowId}`, {
    method: "DELETE",
  });
}



