
import React, { useState, useCallback } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Settings, X, Maximize2, BarChart as BarChartIcon, 
  LineChart as LineChartIcon, PieChart as PieChartIcon,
  ChevronDown, Filter, Download, Share2, Move
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';
import { ChartType, AggregationType, Widget } from './types';
import { toast } from 'sonner';
import { getAggregatedValue } from '@/utils/dashboardUtils';
import DashboardCropDialog from './DashboardCropDialog';
import ColumnSelectionDialog from './ColumnSelectionDialog';

interface DashboardWidgetProps {
  widget: Widget;
  data: any[];
  columns: string[];
  onUpdate: (updates: Partial<Widget>) => void;
  onRemove: () => void;
  arrangement: 'horizontal' | 'vertical';
  onDataSelect?: (selectedData: any) => void;
  selectedDataRange?: { start: number; end: number };
  onCropChange: (dimensions: { width: number; height: number }) => void;
}

const DashboardWidget = ({ 
  widget, 
  data, 
  columns, 
  onUpdate, 
  onRemove, 
  arrangement,
  onDataSelect,
  selectedDataRange,
  onCropChange
}: DashboardWidgetProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [showColumnSelection, setShowColumnSelection] = useState(false);
  const [showChartTypeDialog, setShowChartTypeDialog] = useState(false);
  const [selectedColumns, setSelectedColumns] = useState<string[]>(widget.columns || []);

  const handleColumnSelect = useCallback((cols: string[]) => {
    setSelectedColumns(cols);
    onUpdate({ columns: cols });
    setShowColumnSelection(false);
    
    // Delay showing chart type dialog to prevent UI freeze
    if (widget.type === 'chart' && cols.length >= 2) {
      setTimeout(() => {
        setShowChartTypeDialog(true);
      }, 100);
    }
  }, [widget.type, onUpdate]);

  const handleChartTypeSelect = useCallback((type: ChartType) => {
    onUpdate({ chartType: type });
    setShowChartTypeDialog(false);
    toast.success('Chart type updated');
  }, [onUpdate]);

  const handleExport = useCallback(() => {
    toast.success('Widget data exported');
  }, []);

  const handleShare = useCallback(() => {
    toast.success('Widget shared');
  }, []);

  const handleEditClick = useCallback(() => {
    if (isEditing) {
      setIsEditing(false);
    } else {
      setIsEditing(true);
      if (widget.type === 'chart') {
        setShowColumnSelection(true);
      }
    }
  }, [isEditing, widget.type]);

  const renderKPIContent = () => {
    if (widget.type !== 'kpi' || !widget.columns?.[0]) return null;

    const value = getAggregatedValue(data, widget.columns[0], widget.aggregation || 'count');
    
    return (
      <div className="p-4 text-center">
        <h3 className="text-lg font-semibold mb-2">{widget.title}</h3>
        <p className="text-3xl font-bold">{value}</p>
        <p className="text-sm text-muted-foreground mt-2">
          {widget.aggregation} of {widget.columns[0]}
        </p>
      </div>
    );
  };

  const renderChartContent = () => {
    if (widget.type !== 'chart' || !widget.columns || widget.columns.length < 2) {
      return (
        <div className="flex flex-col items-center justify-center h-[300px] text-muted-foreground space-y-4">
          <p>Please select columns to visualize</p>
          {isEditing && (
            <Button
              variant="outline"
              onClick={() => setShowColumnSelection(true)}
            >
              Select Columns
            </Button>
          )}
        </div>
      );
    }
    
    const chartData = data.map(item => ({
      name: item[widget.columns[0]] || 'N/A',
      value: Number(item[widget.columns[1]]) || 0
    })).filter(item => item.name !== 'N/A' && !isNaN(item.value));

    const height = 300;

    const commonProps = {
      data: chartData,
      margin: { top: 5, right: 30, left: 20, bottom: 5 },
      onClick: (data: any) => {
        if (onDataSelect) {
          onDataSelect(data);
        }
      }
    };

    switch (widget.chartType) {
      case 'line':
        return (
          <ResponsiveContainer width="100%" height={height}>
            <LineChart {...commonProps}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="name"
                angle={-45}
                textAnchor="end"
                height={70}
                interval={0}
              />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke="#8884d8"
                isAnimationActive={true}
              />
            </LineChart>
          </ResponsiveContainer>
        );
      
      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={height}>
            <BarChart {...commonProps}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="name"
                angle={-45}
                textAnchor="end"
                height={70}
                interval={0}
              />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar 
                dataKey="value" 
                fill="#8884d8"
                isAnimationActive={true}
              />
            </BarChart>
          </ResponsiveContainer>
        );

      case 'pie':
        return (
          <ResponsiveContainer width="100%" height={height}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                isAnimationActive={true}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        );

      default:
        return null;
    }
  };

  const COLORS = [
    '#9b87f5', '#D946EF', '#F97316', '#0EA5E9', 
    '#8B5CF6', '#6E59A5', '#F59E0B', '#14B8A6',
    '#EC4899', '#10B981', '#6366F1', '#F43F5E'
  ];

  return (
    <>
      <motion.div
        layout
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.2 }}
        className="h-full"
        style={{
          width: widget.width || 'auto',
          height: widget.height || 'auto'
        }}
      >
        <Card className="relative p-4 overflow-hidden h-full border-2 hover:border-primary/20 transition-all duration-200">
          <div className="absolute top-2 right-2 left-2 z-10 flex justify-between items-center gap-2 bg-background/80 backdrop-blur-sm rounded-lg p-2">
            <div className="flex items-center gap-2">
              {isEditing ? (
                <Input
                  value={widget.title}
                  onChange={(e) => onUpdate({ title: e.target.value })}
                  className="max-w-[200px]"
                />
              ) : (
                <h3 className="text-lg font-semibold">{widget.title}</h3>
              )}
            </div>
            <div className="flex items-center gap-1">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <Filter className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem onClick={() => setShowColumnSelection(true)}>
                    Select Columns
                  </DropdownMenuItem>
                  {widget.type === 'chart' && widget.columns && widget.columns.length >= 2 && (
                    <DropdownMenuItem onClick={() => setShowChartTypeDialog(true)}>
                      Change Chart Type
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Download className="h-4 w-4 mr-2" />
                    Export Data
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Share2 className="h-4 w-4 mr-2" />
                    Share Widget
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <DashboardCropDialog onCropChange={onCropChange} />
              
              {widget.type === 'chart' && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={() => setIsFullScreen(true)}
                >
                  <Maximize2 className="h-4 w-4" />
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => setIsEditing(!isEditing)}
              >
                <Settings className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                onClick={onRemove}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <ScrollArea className="h-[calc(100%-4rem)] mt-14">
            <div className="p-4">
              <AnimatePresence>
                {isEditing && widget.type === 'kpi' && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-4 mb-4"
                  >
                    <Select
                      value={widget.columns?.[0] || ''}
                      onValueChange={(value) => onUpdate({ columns: [value] })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Column" />
                      </SelectTrigger>
                      <SelectContent>
                        {columns.map((col) => (
                          <SelectItem key={col} value={col}>
                            {col}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Select
                      value={widget.aggregation || 'count'}
                      onValueChange={(value: AggregationType) => onUpdate({ aggregation: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Aggregation Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sum">Sum</SelectItem>
                        <SelectItem value="avg">Average</SelectItem>
                        <SelectItem value="min">Minimum</SelectItem>
                        <SelectItem value="max">Maximum</SelectItem>
                        <SelectItem value="count">Count</SelectItem>
                      </SelectContent>
                    </Select>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="min-h-[300px] flex items-center justify-center">
                {widget.type === 'kpi' ? renderKPIContent() : renderChartContent()}
              </div>
            </div>
          </ScrollArea>

          <div className="absolute bottom-2 right-2 opacity-30 hover:opacity-100 transition-opacity">
            <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
              <Move className="h-3 w-3" />
            </Button>
          </div>
        </Card>
      </motion.div>

      {/* Chart Type Selection Dialog */}
      <Dialog open={showChartTypeDialog} onOpenChange={setShowChartTypeDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Select Chart Type</DialogTitle>
            <DialogDescription>
              Choose the best visualization for your data
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-3 gap-4 py-4">
            <Button
              variant="outline"
              className="flex flex-col items-center gap-2 p-4 h-auto"
              onClick={() => handleChartTypeSelect('bar')}
            >
              <BarChartIcon className="w-8 h-8" />
              <span>Bar</span>
            </Button>
            <Button
              variant="outline"
              className="flex flex-col items-center gap-2 p-4 h-auto"
              onClick={() => handleChartTypeSelect('line')}
            >
              <LineChartIcon className="w-8 h-8" />
              <span>Line</span>
            </Button>
            <Button
              variant="outline"
              className="flex flex-col items-center gap-2 p-4 h-auto"
              onClick={() => handleChartTypeSelect('pie')}
            >
              <PieChartIcon className="w-8 h-8" />
              <span>Pie</span>
            </Button>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Full Screen Dialog */}
      <Dialog open={isFullScreen} onOpenChange={setIsFullScreen}>
        <DialogContent className="max-w-[90vw] max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>{widget.title}</DialogTitle>
          </DialogHeader>
          <ScrollArea className="flex-1 min-h-[500px]">
            {renderChartContent()}
          </ScrollArea>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Close</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Column Selection Dialog */}
      <ColumnSelectionDialog
        open={showColumnSelection}
        onOpenChange={setShowColumnSelection}
        columns={columns}
        selectedColumns={selectedColumns}
        onColumnSelect={handleColumnSelect}
        widgetType={widget.type}
        chartType={widget.chartType}
        data={data}
      />
    </>
  );
};

export default DashboardWidget;
