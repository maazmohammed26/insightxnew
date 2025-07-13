import React, { useMemo, useState } from 'react';
import {
  ResponsiveContainer, BarChart, LineChart, ScatterChart, PieChart,
  AreaChart, ComposedChart, Area, Bar, Line, Scatter, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ZAxis
} from 'recharts';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { List, ListChecks } from 'lucide-react';
import CustomTooltip from './CustomTooltip';
import CustomXAxisTick from './CustomXAxisTick';

interface ChartRendererProps {
  chartType: string;
  data: any[];
  selectedColumns: string[];
  colors?: string[];
  gradients?: string[][];
  hideControls?: boolean;
}

interface PieChartData {
  name: string;
  value: number;
  percentage: string;
}

const ChartRenderer = ({ 
  chartType, 
  data, 
  selectedColumns,
  colors = [
    '#9b87f5', '#D946EF', '#F97316', '#0EA5E9', 
    '#6366F1', '#10B981', '#F59E0B', '#14B8A6',
    '#EC4899', '#10B981', '#6366F1', '#F43F5E'
  ],
  gradients = [
    ['#9b87f5', '#D946EF'],
    ['#F97316', '#0EA5E9'],
    ['#8B5CF6', '#6E59A5'],
    ['#F59E0B', '#14B8A6']
  ],
  hideControls = false
}: ChartRendererProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const processPieChartData = useMemo((): PieChartData[] => {
    if (!selectedColumns || selectedColumns.length < 2 || !data || data.length === 0) {
      return [];
    }

    const [categoryColumn, valueColumn] = selectedColumns;
    const aggregatedData: { [key: string]: number } = {};

    data.forEach(item => {
      const category = String(item[categoryColumn] || 'Unknown');
      const value = Number(item[valueColumn]) || 0;
      aggregatedData[category] = (aggregatedData[category] || 0) + value;
    });

    const total = Object.values(aggregatedData).reduce((sum, value) => sum + value, 0);
    
    return Object.entries(aggregatedData)
      .map(([name, value]) => ({
        name,
        value,
        percentage: ((value / total) * 100).toFixed(1)
      }))
      .filter(item => item.value > 0)
      .sort((a, b) => b.value - a.value);
  }, [data, selectedColumns]);

  const processedData = useMemo(() => {
    if (!selectedColumns || selectedColumns.length < 2 || !data || data.length === 0) {
      return [];
    }

    return data.map(item => {
      const processedItem: { [key: string]: any } = {};
      selectedColumns.forEach(col => {
        processedItem[col] = Number(item[col]) || 0;
      });
      return processedItem;
    });
  }, [data, selectedColumns]);

  if (!selectedColumns || selectedColumns.length < 2) {
    return (
      <div className="flex items-center justify-center h-[400px] text-gray-500">
        <p>Please select both columns to visualize data</p>
      </div>
    );
  }

  const renderChart = () => {
    const commonProps = {
      width: "100%",
      height: 400,
      margin: { top: 20, right: 30, left: 20, bottom: 50 }
    };

    switch (chartType) {
      case 'pie':
        return (
          <div className="relative h-[400px]">
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={processPieChartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={140}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percentage }) => `${name}: ${percentage}%`}
                >
                  {processPieChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
            
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button 
                  variant="outline" 
                  className="absolute bottom-4 left-1/2 transform -translate-x-1/2"
                >
                  <ListChecks className="w-4 h-4 mr-2" />
                  See Full List
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Distribution List</DialogTitle>
                </DialogHeader>
                <ScrollArea className="h-[400px]">
                  {processPieChartData.map((item, index) => (
                    <div 
                      key={index}
                      className="flex items-center justify-between p-2 hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: colors[index % colors.length] }}
                        />
                        <span>{item.name}</span>
                      </div>
                      <span>{item.percentage}%</span>
                    </div>
                  ))}
                </ScrollArea>
              </DialogContent>
            </Dialog>
          </div>
        );

      case 'scatter':
        return (
          <ResponsiveContainer {...commonProps}>
            <ScatterChart>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                type="number" 
                dataKey={selectedColumns[0]} 
                name={selectedColumns[0]}
                tick={CustomXAxisTick}
              />
              <YAxis 
                type="number" 
                dataKey={selectedColumns[1]} 
                name={selectedColumns[1]} 
              />
              <Tooltip cursor={{ strokeDasharray: '3 3' }} />
              <Scatter 
                name={selectedColumns[1]} 
                data={processedData} 
                fill={colors[0]}
              />
            </ScatterChart>
          </ResponsiveContainer>
        );

      case 'area':
        return (
          <ResponsiveContainer {...commonProps}>
            <AreaChart data={processedData}>
              <defs>
                <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={colors[0]} stopOpacity={0.8}/>
                  <stop offset="95%" stopColor={colors[0]} stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey={selectedColumns[0]} 
                tick={CustomXAxisTick}
              />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey={selectedColumns[1]}
                stroke={colors[0]}
                fillOpacity={1}
                fill="url(#colorGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        );

      case 'stackedBar':
        return (
          <ResponsiveContainer {...commonProps}>
            <BarChart data={processedData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey={selectedColumns[0]}
                tick={CustomXAxisTick}
              />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              {selectedColumns.slice(1).map((column, index) => (
                <Bar
                  key={column}
                  dataKey={column}
                  stackId="a"
                  fill={colors[index % colors.length]}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        );

      case 'bar':
        return (
          <ResponsiveContainer {...commonProps}>
            <BarChart data={processedData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey={selectedColumns[0]}
                tick={CustomXAxisTick}
              />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar
                dataKey={selectedColumns[1]}
                fill={colors[0]}
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        );

      default:
        return (
          <div className="flex items-center justify-center h-[400px] text-gray-500">
            <p>Select a valid chart type</p>
          </div>
        );
    }
  };

  return (
    <div className="w-full h-[500px] bg-white dark:bg-gray-800 rounded-lg p-4">
      {renderChart()}
    </div>
  );
};

export default ChartRenderer;