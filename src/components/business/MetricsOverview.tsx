
import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, BarChart, PieChart, TrendingUp, AlertTriangle, ArrowUpRight, ArrowDownRight, Brain, Target, Sparkles } from 'lucide-react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';

interface MetricsOverviewProps {
  data: any[];
  columns: string[];
}

const MetricsOverview = ({ data, columns }: MetricsOverviewProps) => {
  const numericColumns = useMemo(() => 
    columns.filter(col => !isNaN(data[0]?.[col])),
    [columns, data]
  );

  const categoricalColumns = useMemo(() => 
    columns.filter(col => isNaN(data[0]?.[col])),
    [columns, data]
  );

  const getOutliers = (values: number[]) => {
    if (!values.length) return 0;
    const avg = values.reduce((a, b) => a + b, 0) / values.length;
    const stdDev = Math.sqrt(
      values.reduce((a, b) => a + Math.pow(b - avg, 2), 0) / values.length
    );
    return values.filter(v => Math.abs(v - avg) > 2 * stdDev).length;
  };

  const insights = useMemo(() => {
    const results = [];
    
    if (!data.length || !columns.length) {
      return [{
        column: 'No data',
        type: 'info',
        count: 0,
        message: 'Upload data to see insights'
      }];
    }
    
    numericColumns.forEach(col => {
      const values = data.map(row => Number(row[col])).filter(v => !isNaN(v));
      const outlierCount = getOutliers(values);
      if (outlierCount > 0) {
        results.push({
          column: col,
          type: 'outlier',
          count: outlierCount,
          message: `Found ${outlierCount} unusual values`
        });
      }
    });

    categoricalColumns.forEach(col => {
      const uniqueValues = new Set(data.map(row => row[col]));
      if (uniqueValues.size < 4) {
        results.push({
          column: col,
          type: 'distribution',
          count: uniqueValues.size,
          message: `Has only ${uniqueValues.size} unique values`
        });
      }
    });

    // Add at least one insight if none are found
    if (results.length === 0) {
      results.push({
        column: 'Data Quality',
        type: 'info',
        count: 1,
        message: 'Your data looks good with no obvious anomalies'
      });
    }

    return results;
  }, [data, numericColumns, categoricalColumns]);

  const trends = useMemo(() => {
    if (!data.length || !numericColumns.length) return [];
    
    return numericColumns.map(col => {
      const values = data.map(row => Number(row[col])).filter(v => !isNaN(v));
      if (values.length === 0) return { column: col, trend: 'neutral', percentChange: 0 };
      
      const avg = values.reduce((a, b) => a + b, 0) / values.length;
      const recent = values.slice(-Math.min(5, values.length));
      const recentAvg = recent.reduce((a, b) => a + b, 0) / recent.length;
      const percentChange = avg !== 0 ? ((recentAvg - avg) / avg * 100) : 0;
      
      return {
        column: col,
        trend: recentAvg > avg ? 'up' : 'down',
        percentChange: Math.abs(Number(percentChange.toFixed(1))),
      };
    });
  }, [data, numericColumns]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <ScrollArea className="h-[600px] pr-2" hideScrollbar={false}>
      <motion.div 
        className="space-y-6 p-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
          variants={containerVariants}
        >
          <motion.div variants={itemVariants}>
            <Card className="hover:shadow-lg transition-shadow duration-300 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900 dark:to-indigo-900 border border-blue-100 dark:border-blue-800/20">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total Records</CardTitle>
                <Users className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{data.length}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Total data points analyzed
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card className="hover:shadow-lg transition-shadow duration-300 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900 dark:to-pink-900 border border-purple-100 dark:border-purple-800/20">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Numeric Fields</CardTitle>
                <BarChart className="h-4 w-4 text-purple-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{numericColumns.length}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Quantitative variables
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card className="hover:shadow-lg transition-shadow duration-300 bg-gradient-to-br from-green-50 to-teal-50 dark:from-green-900 dark:to-teal-900 border border-green-100 dark:border-green-800/20">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Categorical Fields</CardTitle>
                <PieChart className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {categoricalColumns.length}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Qualitative variables
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card className="hover:shadow-lg transition-shadow duration-300 bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900 dark:to-red-900 border border-orange-100 dark:border-orange-800/20">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Insights Found</CardTitle>
                <Brain className="h-4 w-4 text-orange-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{insights.length}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Key findings discovered
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
          variants={containerVariants}
        >
          {trends.map((trend, index) => (
            <motion.div key={index} variants={itemVariants}>
              <Card className="hover:shadow-lg transition-shadow duration-300 bg-white/50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">{trend.column}</CardTitle>
                  {trend.trend === 'up' ? (
                    <ArrowUpRight className="h-4 w-4 text-green-500" />
                  ) : (
                    <ArrowDownRight className="h-4 w-4 text-red-500" />
                  )}
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {trend.percentChange}%
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {trend.trend === 'up' ? 'Increase' : 'Decrease'} from average
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        <Card className="border border-purple-100 dark:border-purple-800/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-500" />
              Key Insights
              <Badge className="ml-auto bg-purple-500 text-white">NEW</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[400px] pr-2" type="always" hideScrollbar={false}>
              <motion.div 
                className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-4"
                variants={containerVariants}
              >
                {insights.map((insight, index) => (
                  <motion.div key={index} variants={itemVariants}>
                    <Card className="hover:shadow-lg transition-shadow duration-300 bg-white/70 dark:bg-gray-800/70 border border-gray-200 dark:border-gray-700">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <p className="font-medium text-purple-700 dark:text-purple-400">{insight.column}</p>
                          <div className="p-1.5 bg-purple-100 dark:bg-purple-900/30 rounded-full">
                            <Target className="h-4 w-4 text-purple-500" />
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {insight.message}
                        </p>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
            </ScrollArea>
          </CardContent>
        </Card>
      </motion.div>
    </ScrollArea>
  );
};

export default MetricsOverview;
