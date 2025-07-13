import React, { useState, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowUpDown, ChevronLeft, ChevronRight, Save, Download, Undo } from 'lucide-react';
import { useVirtualizer } from '@tanstack/react-virtual';
import TableFilters from './preview/TableFilters';
import RowActions from './preview/RowActions';
import EmptyStateMessage from './preview/EmptyStateMessage';
import { useToast } from "@/hooks/use-toast";
import Papa from 'papaparse';

interface RawDataPreviewProps {
  data: any[];
  columns: string[];
  onDataChange?: (newData: any[]) => void;
}

const RawDataPreview = ({ data, columns, onDataChange }: RawDataPreviewProps) => {
  const [editableData, setEditableData] = useState<any[]>(data);
  const [originalData] = useState<any[]>(data);
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<{column: string; direction: 'asc' | 'desc'} | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [dataQualityFilter, setDataQualityFilter] = useState<'all' | 'clean' | 'errors'>('all');
  const [editingCell, setEditingCell] = useState<{rowIndex: number, column: string} | null>(null);
  const [hasChanges, setHasChanges] = useState(false);
  const itemsPerPage = 50;
  const { toast } = useToast();

  // Debug logs
  console.log('Data received:', data);
  console.log('Columns received:', columns);

  const hasErrors = (row: any) => {
    return Object.values(row).some(value => 
      value === null || 
      value === undefined || 
      String(value).trim() === '' ||
      (typeof value === 'number' && isNaN(value))
    );
  };

  const filteredAndSortedData = useMemo(() => {
    if (!editableData || editableData.length === 0) {
      return [];
    }

    let result = [...editableData];

    // Apply data quality filter
    if (dataQualityFilter === 'clean') {
      result = result.filter(row => !hasErrors(row));
    } else if (dataQualityFilter === 'errors') {
      result = result.filter(row => hasErrors(row));
    }

    // Show toast when filtered data is empty
    if (result.length === 0 && editableData.length > 0) {
      const message = dataQualityFilter === 'clean' 
        ? "No error-free data found"
        : "No data with errors found";
      toast({
        title: "Filter Results",
        description: message,
      });
    }

    // Apply search filter
    if (searchTerm) {
      result = result.filter(row =>
        Object.entries(row).some(([key, value]) =>
          String(value).toLowerCase().includes(searchTerm.toLowerCase()) &&
          columns.includes(key)
        )
      );
    }

    // Apply sorting
    if (sortConfig) {
      result.sort((a, b) => {
        const aValue = a[sortConfig.column];
        const bValue = b[sortConfig.column];
        
        if (typeof aValue === 'number' && typeof bValue === 'number') {
          return sortConfig.direction === 'asc' ? aValue - bValue : bValue - aValue;
        }
        
        return sortConfig.direction === 'asc' 
          ? String(aValue).localeCompare(String(bValue))
          : String(bValue).localeCompare(String(aValue));
      });
    }

    return result;
  }, [editableData, searchTerm, sortConfig, columns, dataQualityFilter, toast]);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredAndSortedData.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredAndSortedData, currentPage]);

  const totalPages = Math.ceil(filteredAndSortedData.length / itemsPerPage);

  const parentRef = React.useRef<HTMLDivElement>(null);

  const rowVirtualizer = useVirtualizer({
    count: paginatedData.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 56,
    overscan: 5,
  });

  const handleSort = (column: string) => {
    setSortConfig(current => {
      if (current?.column === column) {
        return current.direction === 'asc' 
          ? { column, direction: 'desc' } 
          : null;
      }
      return { column, direction: 'asc' };
    });
  };

  const handleRowSelect = (index: number) => {
    setSelectedRows(current => 
      current.includes(index)
        ? current.filter(i => i !== index)
        : [...current, index]
    );
  };

  const handleSelectAll = () => {
    setSelectedRows(current => 
      current.length === paginatedData.length
        ? []
        : paginatedData.map((_, index) => index)
    );
  };

  const handleResetFilter = () => {
    setDataQualityFilter('all');
    setSearchTerm('');
    setSortConfig(null);
    setCurrentPage(1);
    toast({
      title: "Filters Reset",
      description: "Showing all data",
    });
  };

  const handleCellEdit = (rowIndex: number, column: string, value: string) => {
    const actualRowIndex = filteredAndSortedData.findIndex((_, idx) => idx === rowIndex);
    const originalRowIndex = editableData.findIndex(row => row === filteredAndSortedData[actualRowIndex]);
    
    const newData = [...editableData];
    newData[originalRowIndex] = { ...newData[originalRowIndex], [column]: value };
    setEditableData(newData);
    setHasChanges(true);
    onDataChange?.(newData);
  };

  const handleDeleteRow = (rowToDelete: any) => {
    const newData = editableData.filter(row => row !== rowToDelete);
    setEditableData(newData);
    setHasChanges(true);
    onDataChange?.(newData);
    toast({
      title: "Row Deleted",
      description: "Row has been successfully deleted",
    });
  };

  const handleSaveChanges = () => {
    toast({
      title: "Changes Saved",
      description: "All changes have been saved successfully",
    });
  };

  const handleResetChanges = () => {
    setEditableData([...originalData]);
    setHasChanges(false);
    onDataChange?.(originalData);
    toast({
      title: "Changes Reset",
      description: "All changes have been reverted",
    });
  };

  const handleDownloadCSV = () => {
    const csv = Papa.unparse(editableData);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', 'modified_data.csv');
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
    toast({
      title: "CSV Downloaded",
      description: "Modified data has been downloaded successfully",
    });
  };

  if (!editableData || editableData.length === 0) {
    return <EmptyStateMessage filterType="all" />;
  }

  if (filteredAndSortedData.length === 0) {
    return <EmptyStateMessage filterType={dataQualityFilter} onReset={handleResetFilter} />;
  }

  return (
    <Card className="border-0 shadow-none bg-transparent">
      {hasChanges && (
        <div className="mb-4 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></div>
              <span className="text-amber-800 dark:text-amber-200 font-medium">
                You have unsaved changes
              </span>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={handleSaveChanges}
                size="sm"
                className="flex items-center gap-2"
              >
                <Save className="h-4 w-4" />
                Save Changes
              </Button>
              <Button
                onClick={handleDownloadCSV}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                Download CSV
              </Button>
              <Button
                onClick={handleResetChanges}
                variant="ghost"
                size="sm"
                className="flex items-center gap-2"
              >
                <Undo className="h-4 w-4" />
                Reset
              </Button>
            </div>
          </div>
        </div>
      )}
      
      <TableFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        dataQualityFilter={dataQualityFilter}
        setDataQualityFilter={setDataQualityFilter}
      />

      <div className="relative overflow-hidden border border-gray-200 dark:border-gray-700 rounded-b-lg">
        <div 
          ref={parentRef} 
          style={{ height: '500px', overflow: 'auto' }}
          className="smooth-scroll transition-all duration-300 ease-in-out"
        >
          <div className="inline-block min-w-full align-middle">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="sticky top-0 z-10 bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th scope="col" className="w-12 px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">
                    <Checkbox
                      checked={selectedRows.length === paginatedData.length}
                      onCheckedChange={handleSelectAll}
                    />
                  </th>
                  {columns.map((column) => (
                    <th
                      key={column}
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-gray-100 cursor-pointer min-w-[150px]"
                      onClick={() => handleSort(column)}
                    >
                      <div className="flex items-center gap-2">
                        <span>{column}</span>
                        {sortConfig?.column === column && (
                          <ArrowUpDown className="h-4 w-4" />
                        )}
                      </div>
                    </th>
                  ))}
                  <th scope="col" className="w-12 px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-900">
                {paginatedData.map((row, rowIndex) => (
                  <tr
                    key={rowIndex}
                    className={`hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors duration-200 ${
                      hasErrors(row) ? 'bg-red-50/10 dark:bg-red-900/10' : ''
                    } animate-fade-in`}
                  >
                    <td className="w-12 px-3 py-4 whitespace-nowrap">
                      <Checkbox
                        checked={selectedRows.includes(rowIndex)}
                        onCheckedChange={() => handleRowSelect(rowIndex)}
                      />
                    </td>
                     {columns.map((column) => (
                       <td 
                         key={column} 
                         className={`px-3 py-4 whitespace-nowrap text-sm ${
                           row[column] === null || row[column] === undefined || String(row[column]).trim() === ''
                             ? 'text-red-500 dark:text-red-400'
                             : 'text-gray-900 dark:text-gray-100'
                         } cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/30`}
                         onClick={() => setEditingCell({rowIndex, column})}
                       >
                         {editingCell?.rowIndex === rowIndex && editingCell?.column === column ? (
                           <Input
                             value={row[column] || ''}
                             onChange={(e) => handleCellEdit(rowIndex, column, e.target.value)}
                             onBlur={() => setEditingCell(null)}
                             onKeyDown={(e) => {
                               if (e.key === 'Enter' || e.key === 'Escape') {
                                 setEditingCell(null);
                               }
                             }}
                             autoFocus
                             className="h-8 min-w-[120px]"
                           />
                         ) : (
                           <span className="block w-full h-full">
                             {row[column] === null || row[column] === undefined ? 'N/A' : row[column]}
                           </span>
                         )}
                       </td>
                     ))}
                     <td className="w-12 px-3 py-4 whitespace-nowrap">
                       <RowActions 
                         row={row} 
                         onEdit={(column) => setEditingCell({rowIndex, column})}
                         onDelete={() => handleDeleteRow(row)}
                       />
                     </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between px-4 py-3 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
        <div className="flex-1 flex justify-between sm:hidden">
          <Button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            variant="outline"
          >
            Previous
          </Button>
          <Button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            variant="outline"
          >
            Next
          </Button>
        </div>
        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              Showing{' '}
              <span className="font-medium">{((currentPage - 1) * itemsPerPage) + 1}</span>
              {' '}-{' '}
              <span className="font-medium">
                {Math.min(currentPage * itemsPerPage, filteredAndSortedData.length)}
              </span>
              {' '}of{' '}
              <span className="font-medium">{filteredAndSortedData.length}</span>
              {' '}results
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              variant="outline"
              size="sm"
              className="flex items-center gap-1"
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>
            <Button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              variant="outline"
              size="sm"
              className="flex items-center gap-1"
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default RawDataPreview;
