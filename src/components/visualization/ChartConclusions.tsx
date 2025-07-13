
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, AlertTriangle, LineChart, BarChart, PieChart, AreaChart, ChartBar } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface ChartConclusionsProps {
  data: any[];
  selectedColumns: string[];
  chartType: string;
}

const ChartConclusions = ({ data, selectedColumns, chartType }: ChartConclusionsProps) => {
  const [conclusions, setConclusions] = useState<any[]>([]);

  useEffect(() => {
    generateConclusions();
  }, [data, selectedColumns, chartType]);

  const generateConclusions = () => {
    if (!data.length || !selectedColumns.length) {
      setConclusions([]);
      return;
    }
    
    const newConclusions = [];
    const [xAxis, yAxis] = selectedColumns;
    
    // Calculate basic statistics
    const values = data.map(item => Number(item[yAxis])).filter(v => !isNaN(v));
    
    if (values.length > 0) {
      const avg = values.reduce((a, b) => a + b, 0) / values.length;
      const max = Math.max(...values);
      const min = Math.min(...values);
      
      // Trend analysis
      const recentValues = values.slice(-5);
      const recentAvg = recentValues.reduce((a, b) => a + b, 0) / recentValues.length;
      const trend = recentAvg > avg ? 'upward' : 'downward';
      
      newConclusions.push({
        title: 'Overall Trend',
        message: `Shows a ${trend} trend with an average of ${avg.toFixed(2)}`,
        icon: trend === 'upward' ? TrendingUp : TrendingDown,
        color: trend === 'upward' ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
      });
      
      // Range analysis
      const range = max - min;
      newConclusions.push({
        title: 'Data Range',
        message: `Values range from ${min.toFixed(2)} to ${max.toFixed(2)}`,
        icon: AlertTriangle,
        color: 'text-amber-600 dark:text-amber-400'
      });

      // Chart specific insights
      if (chartType === 'line' || chartType === 'area') {
        const volatility = Math.sqrt(values.reduce((acc, val) => acc + Math.pow(val - avg, 2), 0) / values.length);
        newConclusions.push({
          title: 'Volatility',
          message: `Data volatility: ${volatility.toFixed(2)}`,
          icon: LineChart,
          color: 'text-blue-600 dark:text-blue-400'
        });
      }
      
      // Add additional insights based on chart type
      if (chartType === 'bar') {
        newConclusions.push({
          title: 'Distribution Pattern',
          message: `Bar height variance indicates ${range > avg ? 'high' : 'low'} data spread`,
          icon: BarChart,
          color: 'text-purple-600 dark:text-purple-400'
        });
      }
      
      if (chartType === 'pie') {
        newConclusions.push({
          title: 'Segment Analysis',
          message: `${yAxis} shows significant grouping patterns`,
          icon: PieChart,
          color: 'text-indigo-600 dark:text-indigo-400'
        });
      }
      
      // Performance metric
      newConclusions.push({
        title: 'Performance Metrics',
        message: `${yAxis} ${trend === 'upward' ? 'exceeds' : 'falls below'} expected baseline by ${Math.abs((recentAvg - avg) / avg * 100).toFixed(1)}%`,
        icon: ChartBar,
        color: 'text-cyan-600 dark:text-cyan-400'
      });
    }
    
    // Add a default insight if there are none
    if (newConclusions.length === 0) {
      newConclusions.push({
        title: 'No Data Available',
        message: 'Select different columns or add more data to generate insights',
        icon: AlertTriangle,
        color: 'text-gray-600 dark:text-gray-400'
      });
    }
    
    setConclusions(newConclusions);
  };

  return (
    <div className="mt-6 space-y-4 animate-fade-in">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Key Insights</CardTitle>
      </CardHeader>
      <ScrollArea className="pr-2 max-h-[450px]" hideScrollbar={false}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pb-2">
          {conclusions.map((conclusion, index) => (
            <Card 
              key={index} 
              className="bg-white/50 dark:bg-gray-800/50 hover:bg-white/80 dark:hover:bg-gray-800/80 transition-colors border border-gray-200 dark:border-gray-700 shadow-sm"
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className={`p-1.5 rounded-full ${conclusion.color.includes('text-') ? conclusion.color.replace('text-', 'bg-').replace('600', '100').replace('400', '900/20') : ''} flex items-center justify-center`}>
                    <conclusion.icon className={`w-4 h-4 ${conclusion.color}`} />
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100">{conclusion.title}</h3>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {conclusion.message}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default ChartConclusions;
