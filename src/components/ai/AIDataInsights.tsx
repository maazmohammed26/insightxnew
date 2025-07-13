
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles, AlertCircle, CheckCircle, Brain, LineChart, BarChart3 } from 'lucide-react';
import { motion } from 'framer-motion';

interface AIDataInsightsProps {
  data: any[];
  columns: string[];
}

const AIDataInsights = ({ data, columns }: AIDataInsightsProps) => {
  // Generate AI insights based on data characteristics
  const getInsights = () => {
    if (!data.length || !columns.length) {
      return [
        {
          type: 'info',
          title: 'No data available',
          description: 'Please upload data to generate AI insights.',
          icon: AlertCircle
        }
      ];
    }

    const insights = [];
    
    // Numeric columns detection
    const numericColumns = columns.filter(col => 
      data.some(row => row[col] !== null && !isNaN(Number(row[col])))
    );
    
    // Categorical columns detection
    const categoricalColumns = columns.filter(col => 
      !numericColumns.includes(col) && 
      data.some(row => row[col] !== null && row[col] !== '')
    );
    
    // Date columns detection (simplified check)
    const dateColumns = columns.filter(col => 
      data.some(row => 
        row[col] && 
        typeof row[col] === 'string' && 
        (row[col].includes('-') || row[col].includes('/')) && 
        !isNaN(Date.parse(row[col]))
      )
    );
    
    // Add insights based on data types
    if (numericColumns.length > 0) {
      insights.push({
        type: 'success',
        title: 'Numerical Analysis Ready',
        description: `${numericColumns.length} numeric columns detected. Consider using regression or correlation analysis.`,
        icon: LineChart
      });
    }
    
    if (categoricalColumns.length > 0) {
      insights.push({
        type: 'success',
        title: 'Category Analysis Ready',
        description: `${categoricalColumns.length} categorical columns detected. Consider frequency analysis or chi-square tests.`,
        icon: BarChart3
      });
    }
    
    if (dateColumns.length > 0) {
      insights.push({
        type: 'success',
        title: 'Time Series Potential',
        description: `${dateColumns.length} date columns detected. Consider time-series analysis or trend visualization.`,
        icon: Brain
      });
    }
    
    // Add quality insights
    const missingValueColumns = columns.filter(col => 
      data.some(row => row[col] === null || row[col] === '')
    );
    
    if (missingValueColumns.length > 0) {
      insights.push({
        type: 'warning',
        title: 'Data Quality Issue',
        description: `${missingValueColumns.length} columns have missing values. Consider data imputation techniques.`,
        icon: AlertCircle
      });
    }
    
    return insights;
  };

  return (
    <Card className="bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-950/30 dark:to-indigo-950/30 border-purple-100 dark:border-purple-900/20 shadow-md">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-purple-500" />
          AI Data Insights
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {getInsights().map((insight, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className={`p-4 rounded-lg border ${
                insight.type === 'success' 
                  ? 'bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-900/30' 
                  : insight.type === 'warning'
                  ? 'bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-900/30'
                  : 'bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-900/30'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`mt-1 ${
                  insight.type === 'success' 
                    ? 'text-green-600 dark:text-green-400' 
                    : insight.type === 'warning'
                    ? 'text-amber-600 dark:text-amber-400'
                    : 'text-blue-600 dark:text-blue-400'
                }`}>
                  <insight.icon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-medium mb-1">{insight.title}</h3>
                  <p className="text-sm text-muted-foreground">{insight.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default AIDataInsights;
