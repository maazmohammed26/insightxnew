import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { toast } from "sonner";
import { filterValidColumns } from '@/utils/columnUtils';

const TrendAnalysis = ({ data, columns }: { data: any[], columns: string[] }) => {
  const [selectedMetric, setSelectedMetric] = React.useState('');
  const numericColumns = React.useMemo(() => 
    columns.filter(col => !isNaN(data[0]?.[col])),
    [columns, data]
  );

  const validNumericColumns = React.useMemo(() => 
    filterValidColumns(numericColumns),
    [numericColumns]
  );

  const analyzeTrends = (metric: string) => {
    if (!metric) return null;
    
    const values = data.map((row, index) => ({
      index: index + 1,
      value: Number(row[metric]),
      originalValue: row[metric]
    })).filter(v => !isNaN(v.value));

    // Calculate moving average
    const windowSize = 5;
    const movingAverage = values.map((v, i) => {
      const window = values.slice(Math.max(0, i - windowSize), i + 1);
      const avgValue = window.reduce((a, b) => a + b.value, 0) / window.length;
      return {
        index: v.index,
        value: v.value,
        movingAverage: avgValue,
        tooltip: v.originalValue
      };
    });

    return movingAverage;
  };

  const handleMetricChange = (value: string) => {
    setSelectedMetric(value);
    toast.success(`Analyzing trends for ${value}`);
  };

  const trendData = React.useMemo(() => analyzeTrends(selectedMetric), [selectedMetric, data]);

  return (
    <div className="space-y-6 animate-fade-in">
      <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950">
        <CardHeader>
          <CardTitle>Trend Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Select value={selectedMetric} onValueChange={handleMetricChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select metric to analyze" />
              </SelectTrigger>
              <SelectContent>
                {validNumericColumns.map(col => (
                  <SelectItem key={col} value={col}>{col}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            {trendData && (
              <div className="h-[400px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={trendData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-50" />
                    <XAxis 
                      dataKey="index" 
                      label={{ value: 'Data Points', position: 'bottom' }}
                    />
                    <YAxis 
                      label={{ 
                        value: selectedMetric, 
                        angle: -90, 
                        position: 'insideLeft' 
                      }} 
                    />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="value" 
                      stroke="#8884d8" 
                      dot={false}
                      name={selectedMetric}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="movingAverage" 
                      stroke="#82ca9d" 
                      dot={false}
                      name="Moving Average"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TrendAnalysis;