import React, { useRef, useMemo, useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  ChartBar, ChartLine, CircleDot, ChartPie, 
  Download, Filter, Palette, Gauge,
  FileCheck, FileWarning, Eye, EyeOff,
  BarChart3, AreaChart, Network, Hexagon
} from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { motion } from 'framer-motion';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { toast } from 'sonner';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import VisualizationControls from './VisualizationControls';
import ChartRenderer from './visualization/ChartRenderer';

interface DataVisualizationProps {
  data: any[];
  columns: string[];
}

const chartColors = [
  '#9b87f5', '#D946EF', '#F97316', '#0EA5E9', 
  '#8B5CF6', '#6E59A5', '#F59E0B', '#14B8A6',
  '#EC4899', '#10B981', '#6366F1', '#F43F5E'
];

const DataVisualization = ({ data, columns }: DataVisualizationProps) => {
  const [chartType, setChartType] = useState('bar');
  const [selectedColumns, setSelectedColumns] = useState<string[]>(['', '']);
  const [dataLimit, setDataLimit] = useState(50);
  const [qualityFilter, setQualityFilter] = useState('all');
  const [colorScheme, setColorScheme] = useState('default');
  const [aggregationType, setAggregationType] = useState('none');
  const [sortOrder, setSortOrder] = useState('asc');
  const chartRef = useRef<HTMLDivElement>(null);

  const hasErrors = (row: any) => {
    return Object.values(row).some(value => 
      value === null || 
      value === undefined || 
      String(value).trim() === '' ||
      (typeof value === 'number' && isNaN(value))
    );
  };

  const filteredData = useMemo(() => {
    let filtered = [...data];
    
    if (qualityFilter === 'clean') {
      filtered = filtered.filter(row => !hasErrors(row));
    } else if (qualityFilter === 'issues') {
      filtered = filtered.filter(row => hasErrors(row));
    }

    if (chartType !== 'pie') {
      filtered = filtered.slice(0, dataLimit);
    }

    if (aggregationType !== 'none' && selectedColumns[0] && selectedColumns[1]) {
      const aggregated = filtered.reduce((acc, row) => {
        const key = row[selectedColumns[0]];
        if (!acc[key]) {
          acc[key] = [];
        }
        acc[key].push(Number(row[selectedColumns[1]]) || 0);
        return acc;
      }, {});

      filtered = Object.entries(aggregated).map(([key, values]: [string, number[]]) => {
        const result: any = { [selectedColumns[0]]: key };
        switch (aggregationType) {
          case 'sum':
            result[selectedColumns[1]] = (values as number[]).reduce((a, b) => a + b, 0);
            break;
          case 'average':
            result[selectedColumns[1]] = (values as number[]).reduce((a, b) => a + b, 0) / values.length;
            break;
          case 'max':
            result[selectedColumns[1]] = Math.max(...values as number[]);
            break;
          case 'min':
            result[selectedColumns[1]] = Math.min(...values as number[]);
            break;
        }
        return result;
      });
    }

    if (selectedColumns[1]) {
      filtered.sort((a, b) => {
        const valueA = Number(a[selectedColumns[1]]) || 0;
        const valueB = Number(b[selectedColumns[1]]) || 0;
        return sortOrder === 'asc' ? valueA - valueB : valueB - valueA;
      });
    }
    
    return filtered;
  }, [data, qualityFilter, dataLimit, chartType, selectedColumns, aggregationType, sortOrder]);

  const getDataStats = useMemo(() => {
    const errorRows = filteredData.filter(row => hasErrors(row));
    const cleanRows = filteredData.filter(row => !hasErrors(row));
    return {
      total: filteredData.length,
      errorCount: errorRows.length,
      cleanCount: cleanRows.length,
      errorPercentage: ((errorRows.length / filteredData.length) * 100).toFixed(1),
      cleanPercentage: ((cleanRows.length / filteredData.length) * 100).toFixed(1)
    };
  }, [filteredData]);

  const handleExportPDF = async () => {
    try {
      if (!chartRef.current) return;
      toast.loading('Generating PDF...');
      const canvas = await html2canvas(chartRef.current);
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF();
      pdf.addImage(imgData, 'PNG', 10, 10, 190, 100);
      pdf.save('data-visualization.pdf');
      toast.success('Exported visualization to PDF');
    } catch (error) {
      toast.error('Failed to export visualization');
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <Card className="overflow-hidden border-0 shadow-lg bg-gradient-to-br from-white via-purple-50/30 to-indigo-50/30 dark:from-gray-900 dark:via-purple-900/10 dark:to-indigo-900/10 backdrop-blur-sm">
        <CardHeader className="border-b bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <CardTitle className="flex items-center gap-2 text-primary">
              <ChartBar className="w-5 h-5 text-purple-600" />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600">
                Interactive Data Visualization
              </span>
            </CardTitle>
            <div className="flex flex-wrap items-center gap-3">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={handleExportPDF}
                      className="flex items-center gap-2 border-purple-200 dark:border-purple-800 hover:bg-purple-100 dark:hover:bg-purple-900/30"
                    >
                      <Download className="w-4 h-4 text-purple-600" />
                      <span className="hidden sm:inline">Export PDF</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Export chart as PDF</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <Select value={qualityFilter} onValueChange={setQualityFilter}>
                <SelectTrigger className="w-[140px] sm:w-[180px] border-purple-200 dark:border-purple-800 bg-white/80 dark:bg-gray-800/80">
                  <SelectValue placeholder="Filter by quality" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">
                    <div className="flex items-center gap-2">
                      <Eye className="w-4 h-4 text-purple-500" />
                      All Records
                    </div>
                  </SelectItem>
                  <SelectItem value="clean">
                    <div className="flex items-center gap-2">
                      <FileCheck className="w-4 h-4 text-green-500" />
                      Clean Records
                    </div>
                  </SelectItem>
                  <SelectItem value="issues">
                    <div className="flex items-center gap-2">
                      <FileWarning className="w-4 h-4 text-amber-500" />
                      Records with Issues
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>

              <Select value={aggregationType} onValueChange={setAggregationType}>
                <SelectTrigger className="w-[140px] sm:w-[180px] border-purple-200 dark:border-purple-800 bg-white/80 dark:bg-gray-800/80">
                  <SelectValue placeholder="Aggregation" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No Aggregation</SelectItem>
                  <SelectItem value="sum">Sum</SelectItem>
                  <SelectItem value="average">Average</SelectItem>
                  <SelectItem value="max">Maximum</SelectItem>
                  <SelectItem value="min">Minimum</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortOrder} onValueChange={setSortOrder}>
                <SelectTrigger className="w-[140px] sm:w-[180px] border-purple-200 dark:border-purple-800 bg-white/80 dark:bg-gray-800/80">
                  <SelectValue placeholder="Sort Order" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="asc">Ascending</SelectItem>
                  <SelectItem value="desc">Descending</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex flex-wrap items-center gap-3 mb-4 bg-white/30 dark:bg-gray-800/30 rounded-xl p-3 border border-purple-100 dark:border-purple-900/30 shadow-inner">
            <motion.div 
              whileHover={{ scale: 1.03 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
              className="flex items-center gap-2 bg-gradient-to-r from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 p-2 rounded-lg shadow-sm border border-red-200 dark:border-red-800/30"
            >
              <FileWarning className="w-5 h-5 text-red-500" />
              <span className="font-medium text-red-700 dark:text-red-400">{getDataStats.errorCount} Issues</span>
            </motion.div>
            <motion.div 
              whileHover={{ scale: 1.03 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
              className="flex items-center gap-2 bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 p-2 rounded-lg shadow-sm border border-green-200 dark:border-green-800/30"
            >
              <FileCheck className="w-5 h-5 text-green-500" />
              <span className="font-medium text-green-700 dark:text-green-400">{getDataStats.cleanPercentage}% Clean</span>
            </motion.div>
          </div>
          
          <Separator className="my-4 bg-purple-100 dark:bg-purple-800/30" />
          
          <div className="space-y-6" ref={chartRef}>
            <div className="flex items-center gap-4 mb-4">
              <Select value={colorScheme} onValueChange={setColorScheme}>
                <SelectTrigger className="w-[150px] border-purple-200 dark:border-purple-800 bg-white/80 dark:bg-gray-800/80">
                  <div className="flex items-center gap-2">
                    <Palette className="w-4 h-4 text-purple-500" />
                    <SelectValue placeholder="Color Scheme" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">
                    <div className="flex items-center gap-2">
                      <Palette className="w-4 h-4 text-purple-500" />
                      Default
                    </div>
                  </SelectItem>
                  <SelectItem value="vibrant">Vibrant</SelectItem>
                  <SelectItem value="pastel">Pastel</SelectItem>
                  <SelectItem value="monochrome">Monochrome</SelectItem>
                  <SelectItem value="rainbow">Rainbow</SelectItem>
                  <SelectItem value="neon">Neon</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <VisualizationControls
              columns={columns}
              selectedColumns={selectedColumns}
              chartType={chartType}
              dataLimit={dataLimit}
              onColumnChange={setSelectedColumns}
              onChartTypeChange={setChartType}
              onDataLimitChange={setDataLimit}
            />

            <div className="mt-6 bg-white dark:bg-gray-800 rounded-xl p-4 shadow-inner min-h-[400px] border border-purple-100 dark:border-purple-800/30 overflow-hidden">
              <ScrollArea className="h-[400px] w-full">
                <ChartRenderer
                  chartType={chartType}
                  data={filteredData}
                  selectedColumns={selectedColumns}
                  colors={chartColors}
                  gradients={[
                    ['#9b87f5', '#D946EF'],
                    ['#F97316', '#0EA5E9'],
                    ['#8B5CF6', '#6E59A5'],
                    ['#F59E0B', '#14B8A6'],
                    ['#EC4899', '#10B981'],
                    ['#6366F1', '#F43F5E']
                  ]}
                />
              </ScrollArea>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default DataVisualization;
