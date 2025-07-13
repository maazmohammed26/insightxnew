
// Import Papa Parse using a CDN since workers can't use npm modules directly
importScripts('https://cdnjs.cloudflare.com/ajax/libs/PapaParse/5.4.1/papaparse.min.js');

self.onmessage = (e) => {
  const { csv } = e.data;
  
  Papa.parse(csv, {
    header: true,
    complete: (results) => {
      if (results.data && results.data.length > 0) {
        // Filter out empty rows - rows where all values are empty
        const filteredData = results.data.filter(row => {
          // Check if this is an empty row (all properties are empty strings)
          const isEmpty = Object.values(row).every(value => 
            value === undefined || value === null || value === '');
          return !isEmpty; // Keep the row only if it's not empty
        });
        
        // Only use the column names from the first valid row
        const columnNames = Object.keys(results.data[0]);
        
        self.postMessage({ data: filteredData, columns: columnNames });
      } else {
        self.postMessage({ error: 'No data found' });
      }
    },
    error: (error) => {
      self.postMessage({ error: error.message });
    }
  });
};
