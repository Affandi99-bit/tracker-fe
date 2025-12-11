const GOOGLE_API_KEY = import.meta.env.VITE_API_KEY;
const ROLES_SPREADSHEET_ID = import.meta.env.VITE_ROLES_SPREADSHEET_ID;
const PRICELIST_SPREADSHEET_ID = import.meta.env.VITE_PRICELIST_SPREADSHEET_ID;

export const fetchGoogleSheetData = async (spreadsheetId, sheetName) => {
  try {
    // Method 1: Using gviz/tq (works for public sheets, no auth needed)
    const url = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/gviz/tq?tqx=out:json&sheet=${encodeURIComponent(
      sheetName
    )}`;

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const text = await response.text();
    // Remove the prefix "google.visualization.Query.setResponse(" and suffix ");"
    const jsonText = text.substring(47, text.length - 2);
    const data = JSON.parse(jsonText);

    if (!data.table || !data.table.rows) {
      return [];
    }

    // Extract headers from the first row
    const headers = data.table.cols.map((col) => col.label);

    // Convert rows to objects
    const rows = data.table.rows.map((row, index) => {
      const obj = { _rowIndex: index };
      row.c.forEach((cell, cellIndex) => {
        const header = headers[cellIndex] || `col${cellIndex}`;
        obj[header] = cell?.v || cell?.f || null;
      });
      return obj;
    });

    return rows;
  } catch (error) {
    console.error(`Error fetching Google Sheet data (gviz method):`, error);

    // Fallback: Try Sheets API v4 method
    try {
      return await fetchGoogleSheetDataV4(spreadsheetId, sheetName);
    } catch (v4Error) {
      console.error(`Error fetching Google Sheet data (v4 method):`, v4Error);
      throw new Error(`Failed to fetch sheet data: ${error.message}`);
    }
  }
};

export const fetchGoogleSheetDataV4 = async (spreadsheetId, sheetName) => {
  try {
    // Get the range (assumes data starts at A1, adjust if needed)
    const range = `${sheetName}!A:Z`;
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}?key=${GOOGLE_API_KEY}`;

    const response = await fetch(url);
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        `Sheets API error: ${errorData.error?.message || response.statusText}`
      );
    }

    const data = await response.json();

    if (!data.values || data.values.length === 0) {
      return [];
    }

    // First row is headers
    const headers = data.values[0];

    // Convert rows to objects
    const rows = data.values.slice(1).map((row, index) => {
      const obj = { _rowIndex: index };
      headers.forEach((header, colIndex) => {
        obj[header] = row[colIndex] || null;
      });
      return obj;
    });

    return rows;
  } catch (error) {
    console.error(`Error fetching Google Sheet data (v4 method):`, error);
    throw error;
  }
};

export const fetchRolesData = async (sheetName) => {
  try {
    const rows = await fetchGoogleSheetData(ROLES_SPREADSHEET_ID, sheetName);

    // Format data to match existing structure: { id, name, bobot }
    const formatted = rows
      .filter((row) => row.TITLE) // Only include rows with TITLE
      .map((row, index) => ({
        id: index,
        name: row.TITLE || "",
        bobot: row.Bobot || row.bobot || null,
      }));

    return formatted;
  } catch (error) {
    console.error(`Error fetching roles data for ${sheetName}:`, error);
    return [];
  }
};

export const fetchPricelistData = async (sheetName) => {
  try {
    const rows = await fetchGoogleSheetData(
      PRICELIST_SPREADSHEET_ID,
      sheetName
    );

    // Format data to match existing structure: { id, service, price }
    const formatted = rows
      .filter((row) => row.Nama || row.nama) // Only include rows with Nama
      .map((row, index) => ({
        id: index + 1,
        service: row.Nama || row.nama || "",
        price: Number(row.Harga || row.harga) || 0,
      }));

    return formatted;
  } catch (error) {
    console.error(`Error fetching pricelist data for ${sheetName}:`, error);
    return [];
  }
};

// Export spreadsheet IDs for reference
export { ROLES_SPREADSHEET_ID, PRICELIST_SPREADSHEET_ID, GOOGLE_API_KEY };
