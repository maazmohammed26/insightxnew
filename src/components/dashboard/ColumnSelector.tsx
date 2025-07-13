import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Check, X, LayoutGrid } from 'lucide-react';
import { motion } from 'framer-motion';

interface ColumnSelectorProps {
  columns: string[];
  selectedColumns: string[];
  onColumnSelect: (column: string) => void;
  onColumnDeselect: (column: string) => void;
}

const ColumnSelector = ({
  columns,
  selectedColumns,
  onColumnSelect,
  onColumnDeselect
}: ColumnSelectorProps) => {
  return (
    <Card className="p-4 bg-white/50 dark:bg-gray-800/50">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium">Column Selection</h3>
        <LayoutGrid className="w-4 h-4 text-muted-foreground" />
      </div>
      <ScrollArea className="h-[200px]">
        <div className="space-y-2">
          {columns.map((col) => (
            <motion.div
              key={col}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-between p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
            >
              <span className="text-sm">{col}</span>
              {selectedColumns.includes(col) ? (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onColumnDeselect(col)}
                  className="h-6 w-6 p-0"
                >
                  <X className="h-4 w-4 text-red-500" />
                </Button>
              ) : (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onColumnSelect(col)}
                  className="h-6 w-6 p-0"
                >
                  <Check className="h-4 w-4 text-green-500" />
                </Button>
              )}
            </motion.div>
          ))}
        </div>
      </ScrollArea>
    </Card>
  );
};

export default ColumnSelector;