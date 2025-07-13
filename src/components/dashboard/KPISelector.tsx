import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Plus, Minus, Check, X, Filter, LayoutGrid } from 'lucide-react';
import { motion } from 'framer-motion';

interface KPISelectorProps {
  columns: string[];
  selectedKPIs: string[];
  onKPISelect: (kpi: string) => void;
  onKPIRemove: (kpi: string) => void;
}

const KPISelector = ({ columns, selectedKPIs, onKPISelect, onKPIRemove }: KPISelectorProps) => {
  const numericColumns = columns.filter(col => {
    // Simple numeric check - can be enhanced based on data
    return !isNaN(Number(col)) || col.toLowerCase().includes('count') || 
           col.toLowerCase().includes('total') || col.toLowerCase().includes('amount');
  });

  return (
    <Card className="p-4 bg-white/50 dark:bg-gray-800/50">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium">KPI Selection</h3>
        <Filter className="w-4 h-4 text-muted-foreground" />
      </div>
      <ScrollArea className="h-[200px]">
        <div className="space-y-2">
          {numericColumns.map((col) => (
            <motion.div
              key={col}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-between p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
            >
              <span className="text-sm">{col}</span>
              {selectedKPIs.includes(col) ? (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onKPIRemove(col)}
                  className="h-6 w-6 p-0"
                >
                  <Minus className="h-4 w-4 text-red-500" />
                </Button>
              ) : (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onKPISelect(col)}
                  className="h-6 w-6 p-0"
                >
                  <Plus className="h-4 w-4 text-green-500" />
                </Button>
              )}
            </motion.div>
          ))}
        </div>
      </ScrollArea>
    </Card>
  );
};

export default KPISelector;