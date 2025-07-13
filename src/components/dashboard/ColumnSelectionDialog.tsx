
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Database, Table2, PieChart, BarChart2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface ColumnSelectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  columns: string[];
  selectedColumns: string[];
  onColumnSelect: (columns: string[]) => void;
  widgetType?: 'chart' | 'metric' | 'table' | 'kpi';
  chartType?: string;
  data: any[];
}

const ColumnSelectionDialog = ({
  open,
  onOpenChange,
  columns,
  selectedColumns,
  onColumnSelect,
  widgetType = 'chart',
  chartType,
  data
}: ColumnSelectionDialogProps) => {
  const [numericColumns, setNumericColumns] = useState<string[]>([]);
  const [localSelectedColumns, setLocalSelectedColumns] = useState<string[]>(selectedColumns);
  
  React.useEffect(() => {
    setLocalSelectedColumns(selectedColumns);
  }, [selectedColumns]);

  React.useEffect(() => {
    if (data && data.length > 0) {
      const numeric = columns.filter(col => 
        !isNaN(Number(data[0][col])) || 
        typeof data[0][col] === 'number'
      );
      setNumericColumns(numeric);
    }
  }, [columns, data]);

  const handleColumnToggle = (col: string) => {
    setLocalSelectedColumns(prev => {
      if (prev.includes(col)) {
        return prev.filter(c => c !== col);
      }
      return [...prev, col];
    });
  };

  const handleApply = () => {
    onColumnSelect(localSelectedColumns);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Database className="w-5 h-5" />
            Column Selection
          </DialogTitle>
          <DialogDescription>
            Select columns to visualize your data
          </DialogDescription>
        </DialogHeader>
        
        <ScrollArea className="h-[400px] pr-4">
          <Tabs defaultValue="all">
            <TabsList>
              <TabsTrigger value="all" className="flex items-center gap-2">
                <Table2 className="w-4 h-4" />
                All
              </TabsTrigger>
              <TabsTrigger value="numeric" className="flex items-center gap-2">
                <BarChart2 className="w-4 h-4" />
                Numeric
              </TabsTrigger>
              <TabsTrigger value="categorical" className="flex items-center gap-2">
                <PieChart className="w-4 h-4" />
                Categorical
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all">
              <div className="space-y-2">
                {columns.map((col) => (
                  <motion.div
                    key={col}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center justify-between p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
                  >
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={`all-${col}`}
                        checked={localSelectedColumns.includes(col)}
                        onChange={() => handleColumnToggle(col)}
                        className="rounded border-gray-300"
                      />
                      <label htmlFor={`all-${col}`} className="text-sm font-medium">
                        {col}
                      </label>
                    </div>
                    {numericColumns.includes(col) ? (
                      <Badge variant="secondary" className="flex items-center gap-1">
                        <BarChart2 className="w-3 h-3" />
                        Numeric
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="flex items-center gap-1">
                        <PieChart className="w-3 h-3" />
                        Text
                      </Badge>
                    )}
                  </motion.div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="numeric">
              <div className="space-y-2">
                {numericColumns.map((col) => (
                  <motion.div
                    key={col}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center space-x-2 p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
                  >
                    <input
                      type="checkbox"
                      id={`numeric-${col}`}
                      checked={localSelectedColumns.includes(col)}
                      onChange={() => handleColumnToggle(col)}
                      className="rounded border-gray-300"
                    />
                    <label htmlFor={`numeric-${col}`} className="text-sm font-medium">
                      {col}
                    </label>
                  </motion.div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="categorical">
              <div className="space-y-2">
                {columns
                  .filter(col => !numericColumns.includes(col))
                  .map((col) => (
                    <motion.div
                      key={col}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center space-x-2 p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
                    >
                      <input
                        type="checkbox"
                        id={`categorical-${col}`}
                        checked={localSelectedColumns.includes(col)}
                        onChange={() => handleColumnToggle(col)}
                        className="rounded border-gray-300"
                      />
                      <label htmlFor={`categorical-${col}`} className="text-sm font-medium">
                        {col}
                      </label>
                    </motion.div>
                  ))}
              </div>
            </TabsContent>
          </Tabs>
        </ScrollArea>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button onClick={handleApply}>
            Apply
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ColumnSelectionDialog;
