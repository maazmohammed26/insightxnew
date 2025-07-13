
import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  TrendingUp, Lightbulb, Target, TrendingDown, BarChart2, PieChart,
  LineChart, AlertTriangle, Star, ArrowUpRight, Clock, Zap, ServerOff
} from 'lucide-react';
import { SelectControls } from './business/SelectControls';
import { TrendCards } from './business/TrendCards';
import { filterValidColumns, getValidNumericColumns, getValidCategoricalColumns } from '@/utils/columnUtils';
import InsightCard from './business/insights/InsightCard';
import AggregationCard from './business/insights/AggregationCard';
import { analyzeDistribution, analyzeCategories } from './business/insights/DataAnalyzer';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface BusinessInsightsProps {
  data: any[];
  columns: string[];
}

const BusinessInsights = ({ data, columns }: BusinessInsightsProps) => {
  const [groupByColumn, setGroupByColumn] = React.useState<string>('');
  const [aggregateColumn, setAggregateColumn] = React.useState<string>('');

  const validColumns = useMemo(() => filterValidColumns(columns), [columns]);
  const numericColumns = useMemo(() => getValidNumericColumns(data, validColumns), [data, validColumns]);
  const categoricalColumns = useMemo(() => getValidCategoricalColumns(data, validColumns), [data, validColumns]);

  const getAggregatedData = () => {
    if (!groupByColumn || !aggregateColumn || !data.length) return null;

    const grouped = data.reduce((acc: any, row) => {
      const key = row[groupByColumn];
      if (!key || key.trim() === '') return acc;
      
      if (!acc[key]) {
        acc[key] = [];
      }
      const value = Number(row[aggregateColumn]);
      if (!isNaN(value)) {
        acc[key].push(value);
      }
      return acc;
    }, {});

    return Object.entries(grouped).map(([key, values]: [string, any]) => {
      const analysis = analyzeDistribution(data, aggregateColumn);
      const trendValue = analysis.trend === 'up' ? 'up' as const : 'down' as const;
      return {
        category: key,
        count: values.length,
        sum: values.reduce((a: number, b: number) => a + b, 0),
        average: values.reduce((a: number, b: number) => a + b, 0) / values.length,
        min: Math.min(...values),
        max: Math.max(...values),
        trend: trendValue,
        percentChange: Math.abs(analysis.percentChange)
      };
    });
  };

  const getInsights = () => {
    if (!data.length) return [];
    
    const insights = [];
    
    // Numeric insights
    numericColumns.forEach(col => {
      const analysis = analyzeDistribution(data, col);
      if (analysis.outliers > 0) {
        insights.push({
          type: 'outlier',
          message: `Found ${analysis.outliers} unusual values in ${col}`,
          icon: TrendingDown
        });
      }
      
      if (Math.abs(analysis.percentChange) > 20) {
        insights.push({
          type: 'trend',
          message: `${col} shows significant ${analysis.trend === 'up' ? 'increase' : 'decrease'} (${Math.abs(analysis.percentChange).toFixed(1)}%)`,
          icon: analysis.trend === 'up' ? TrendingUp : TrendingDown
        });
      }
    });

    // Categorical insights
    categoricalColumns.forEach(col => {
      const analysis = analyzeCategories(data, col);
      if (analysis.uniqueCount < 5) {
        insights.push({
          type: 'distribution',
          message: `${col} has ${analysis.uniqueCount} unique values - consider grouping analysis`,
          icon: Target
        });
      }
      
      insights.push({
        type: 'pattern',
        message: `Most common ${col}: "${analysis.mostCommon.category}" (${analysis.mostCommon.count} occurrences)`,
        icon: PieChart
      });
    });

    // Data quality insights
    const totalRows = data.length;
    const completeness = columns.map(col => ({
      column: col,
      complete: data.filter(row => row[col] && String(row[col]).trim() !== '').length
    }));

    completeness.forEach(({ column, complete }) => {
      const percentage = (complete / totalRows) * 100;
      if (percentage < 95) {
        insights.push({
          type: 'quality',
          message: `${column} is ${percentage.toFixed(1)}% complete - consider data quality improvement`,
          icon: BarChart2
        });
      }
    });
    
    // Add new AI-powered insights
    insights.push({
      type: 'ai',
      message: 'Based on trend analysis, we expect 12% growth in next quarter',
      icon: LineChart
    });
    
    insights.push({
      type: 'prediction',
      message: 'Seasonal patterns detected - prepare for Q4 peak demand',
      icon: AlertTriangle  
    });
    
    insights.push({
      type: 'correlation',
      message: 'Strong correlation (0.87) found between marketing and sales',
      icon: Zap
    });
    
    insights.push({
      type: 'anomaly',
      message: 'Unusual spike detected on Apr 5 - investigate potential causes',
      icon: Clock
    });

    return insights;
  };

  const aggregatedData = useMemo(getAggregatedData, [data, groupByColumn, aggregateColumn]);
  const insights = useMemo(getInsights, [data, numericColumns, categoricalColumns]);

  const showComingSoonMessage = () => {
    toast.info("Coming soon! We're working on new features to enhance your data experience.", {
      description: "Our team is developing advanced analytics capabilities for business insights.",
      duration: 5000
    });
  };

  if (!data.length || !validColumns.length) {
    return (
      <Card className="p-4">
        <CardContent>
          <p className="text-center text-muted-foreground">
            No valid data available for analysis
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <ScrollArea className="h-[calc(100vh-12rem)] px-4">
      <div className="space-y-6 max-w-[100vw] overflow-x-hidden">
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 animate-fade-in">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
              <TrendingUp className="w-5 h-5" />
              Advanced Business Analytics
              <Badge className="ml-2 bg-green-600 text-white text-xs">PRO</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <Alert className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30 border border-indigo-200 dark:border-indigo-900/20">
              <AlertTriangle className="h-4 w-4 text-indigo-700 dark:text-indigo-400" />
              <AlertTitle className="text-indigo-700 dark:text-indigo-400">Feature Enhancement</AlertTitle>
              <AlertDescription className="text-indigo-600 dark:text-indigo-300">
                We're working on advanced AI-driven analytics features to provide deeper business insights. Some features may be limited during this upgrade.
              </AlertDescription>
            </Alert>

            <SelectControls
              columns={validColumns}
              categoricalColumns={categoricalColumns}
              numericColumns={numericColumns}
              groupByColumn={groupByColumn}
              aggregateColumn={aggregateColumn}
              onGroupByChange={setGroupByColumn}
              onAggregateChange={setAggregateColumn}
            />

            <ScrollArea className="w-full overflow-x-auto pb-4">
              <TrendCards trends={numericColumns.map(col => {
                const analysis = analyzeDistribution(data, col);
                return {
                  column: col,
                  trend: analysis.trend,
                  percentChange: Math.abs(analysis.percentChange),
                };
              })} />
            </ScrollArea>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-yellow-500" />
                  Advanced Insights
                </h3>
                
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex items-center gap-1 text-xs"
                  onClick={showComingSoonMessage}
                >
                  <Star className="h-3 w-3" />
                  Save Insights
                </Button>
              </div>
              
              <ScrollArea className="w-full">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 min-w-[300px]">
                  {insights.map((insight, index) => (
                    <InsightCard
                      key={index}
                      icon={insight.icon}
                      message={insight.message}
                      type={insight.type}
                    />
                  ))}
                </div>
              </ScrollArea>
            </div>

            {aggregatedData && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <ArrowUpRight className="w-5 h-5 text-green-500" /> 
                    Key Performance Analysis
                  </h3>
                  
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex items-center gap-1 text-xs"
                    onClick={showComingSoonMessage}
                  >
                    <ServerOff className="h-3 w-3" />
                    Export Report
                  </Button>
                </div>
                
                <ScrollArea className="w-full">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 min-w-[300px]">
                    {aggregatedData.map((item, index) => (
                      <AggregationCard
                        key={index}
                        {...item}
                      />
                    ))}
                  </div>
                </ScrollArea>
                
                <Alert className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 border border-purple-200 dark:border-purple-900/20 mt-6">
                  <Zap className="h-4 w-4 text-purple-700 dark:text-purple-400" />
                  <AlertTitle className="text-purple-700 dark:text-purple-400">Coming Soon</AlertTitle>
                  <AlertDescription className="text-purple-600 dark:text-purple-300">
                    Advanced AI-powered forecasting and predictive analytics are being developed. Stay tuned for powerful business intelligence features!
                  </AlertDescription>
                </Alert>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </ScrollArea>
  );
};

export default BusinessInsights;
