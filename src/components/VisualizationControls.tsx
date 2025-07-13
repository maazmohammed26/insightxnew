import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { 
  BarChart, LineChart, CircleDot, PieChart, 
  AreaChart, Network, BarChart3, GitGraph
} from 'lucide-react';
import { Card } from './ui/card';
import { motion } from 'framer-motion';
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';
import { toast } from 'sonner';

interface VisualizationControlsProps {
  columns: string[];
  selectedColumns: string[];
  chartType: string;
  dataLimit: number;
  onColumnChange: (columns: string[]) => void;
  onChartTypeChange: (type: string) => void;
  onDataLimitChange: (limit: number) => void;
}

const VisualizationControls = ({
  columns,
  selectedColumns,
  chartType,
  dataLimit,
  onColumnChange,
  onChartTypeChange,
  onDataLimitChange,
}: VisualizationControlsProps) => {
  const validColumns = columns.filter(col => col && col.trim() !== '');

  const handleXAxisChange = (value: string) => {
    const newColumns = [value, selectedColumns[1] || ''];
    onColumnChange(newColumns);
    toast.success('X-axis updated');
  };

  const handleYAxisChange = (value: string) => {
    const newColumns = [selectedColumns[0] || '', value];
    onColumnChange(newColumns);
    toast.success('Y-axis updated');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="space-y-4 p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-gray-800 dark:to-gray-900 rounded-lg">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <Select value={chartType || 'bar'} onValueChange={onChartTypeChange}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Select visualization type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="bar">
                <div className="flex items-center gap-2">
                  <BarChart className="w-4 h-4" />
                  Bar Chart
                </div>
              </SelectItem>
              <SelectItem value="stackedBar">
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-4 h-4" />
                  Stacked Bar
                </div>
              </SelectItem>
              <SelectItem value="line">
                <div className="flex items-center gap-2">
                  <LineChart className="w-4 h-4" />
                  Line Chart
                </div>
              </SelectItem>
              <SelectItem value="area">
                <div className="flex items-center gap-2">
                  <AreaChart className="w-4 h-4" />
                  Area Chart
                </div>
              </SelectItem>
              <SelectItem value="scatter">
                <div className="flex items-center gap-2">
                  <CircleDot className="w-4 h-4" />
                  Scatter Plot
                </div>
              </SelectItem>
              <SelectItem value="pie">
                <div className="flex items-center gap-2">
                  <PieChart className="w-4 h-4" />
                  Pie Chart
                </div>
              </SelectItem>
              <SelectItem value="correlation">
                <div className="flex items-center gap-2">
                  <GitGraph className="w-4 h-4" />
                  Correlation Matrix
                </div>
              </SelectItem>
            </SelectContent>
          </Select>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
            <Select value={selectedColumns[0]} onValueChange={handleXAxisChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select X-axis" />
              </SelectTrigger>
              <SelectContent>
                {validColumns.map((column) => (
                  <SelectItem key={column} value={column}>
                    {column}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedColumns[1]} onValueChange={handleYAxisChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select Y-axis" />
              </SelectTrigger>
              <SelectContent>
                {validColumns.map((column) => (
                  <SelectItem key={column} value={column}>
                    {column}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Data Points Limit: {dataLimit}</label>
          <Slider
            value={[dataLimit]}
            onValueChange={([value]) => onDataLimitChange(value)}
            min={10}
            max={500}
            step={10}
            className="w-full sm:w-[300px]"
          />
        </div>
      </Card>
    </motion.div>
  );
};

export default VisualizationControls;