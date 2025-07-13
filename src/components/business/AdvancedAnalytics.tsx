import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { ScrollArea } from "@/components/ui/scroll-area";

const AdvancedAnalytics = ({ data, columns }: { data: any[], columns: string[] }) => {
  const [groupByColumn, setGroupByColumn] = React.useState('');
  const [aggregateColumn, setAggregateColumn] = React.useState('');
  
  const categoricalColumns = React.useMemo(() => 
    columns.filter(col => {
      const value = data[0]?.[col];
      return value !== undefined && value !== null && value !== '' && isNaN(Number(value));
    }),
    [columns, data]
  );

  const numericColumns = React.useMemo(() => 
    columns.filter(col => {
      const value = data[0]?.[col];
      return value !== undefined && value !== null && value !== '' && !isNaN(Number(value));
    }),
    [columns, data]
  );

  const performAnalysis = () => {
    if (!groupByColumn || !aggregateColumn) {
      toast.error("Please select both grouping and aggregation columns");
      return null;
    }

    try {
      const results = data.reduce((acc, row) => {
        const key = row[groupByColumn];
        if (!key || key.toString().trim() === '') return acc;
        
        if (!acc[key]) {
          acc[key] = [];
        }
        
        const value = Number(row[aggregateColumn]);
        if (!isNaN(value)) {
          acc[key].push(value);
        }
        return acc;
      }, {});

      return Object.entries(results).map(([key, values]: [string, number[]]) => ({
        group: key,
        count: values.length,
        sum: values.reduce((a, b) => a + b, 0),
        average: values.reduce((a, b) => a + b, 0) / values.length,
        min: Math.min(...values),
        max: Math.max(...values)
      }));
    } catch (error) {
      console.error('Analysis error:', error);
      toast.error('Error performing analysis');
      return null;
    }
  };

  const analysisResults = React.useMemo(() => {
    if (groupByColumn && aggregateColumn) {
      return performAnalysis();
    }
    return null;
  }, [groupByColumn, aggregateColumn, data]);

  if (!data.length || !columns.length) {
    return (
      <Card className="p-4">
        <CardContent>
          <p className="text-center text-muted-foreground">
            No data available for analysis
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <ScrollArea className="h-[600px]">
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Advanced Data Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {categoricalColumns.length > 0 && (
                  <Select value={groupByColumn} onValueChange={setGroupByColumn}>
                    <SelectTrigger>
                      <SelectValue placeholder="Group by column" />
                    </SelectTrigger>
                    <SelectContent>
                      {categoricalColumns.map(col => (
                        <SelectItem key={col} value={col}>{col}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}

                {numericColumns.length > 0 && (
                  <Select value={aggregateColumn} onValueChange={setAggregateColumn}>
                    <SelectTrigger>
                      <SelectValue placeholder="Aggregate column" />
                    </SelectTrigger>
                    <SelectContent>
                      {numericColumns.map(col => (
                        <SelectItem key={col} value={col}>{col}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>

              {analysisResults && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                  {analysisResults.map((result, index) => (
                    <Card key={index} className="bg-white/50 dark:bg-gray-800/50">
                      <CardHeader>
                        <CardTitle className="text-sm">{result.group}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Count:</span>
                            <span>{result.count}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Sum:</span>
                            <span>{result.sum.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Average:</span>
                            <span>{result.average.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Min:</span>
                            <span>{result.min.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Max:</span>
                            <span>{result.max.toFixed(2)}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </ScrollArea>
  );
};

export default AdvancedAnalytics;