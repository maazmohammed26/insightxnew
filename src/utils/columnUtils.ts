export const filterValidColumns = (columns: string[]): string[] => {
  if (!Array.isArray(columns)) return [];
  return columns.filter(col => 
    col && 
    typeof col === 'string' && 
    col.trim() !== '' && 
    col !== 'undefined' && 
    col !== 'null' &&
    col !== 'empty'
  );
};

export const validateColumnSelection = (column: string | undefined, validColumns: string[]): string => {
  if (!column || !validColumns.includes(column)) {
    return validColumns[0] || 'default-column';
  }
  return column;
};

export const getValidNumericColumns = (data: any[], columns: string[]): string[] => {
  if (!data.length || !Array.isArray(columns)) return [];
  
  const validCols = filterValidColumns(columns);
  return validCols.filter(col => {
    const value = data[0]?.[col];
    return value !== undefined && value !== null && !isNaN(Number(value));
  });
};

export const getValidCategoricalColumns = (data: any[], columns: string[]): string[] => {
  if (!data.length || !Array.isArray(columns)) return [];
  
  const validCols = filterValidColumns(columns);
  return validCols.filter(col => {
    const value = data[0]?.[col];
    return value !== undefined && value !== null && isNaN(Number(value));
  });
};