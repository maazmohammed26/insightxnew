import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Brain, AlertTriangle, CheckCircle } from 'lucide-react';

interface MLInsightsProps {
  data: any[];
  columns: string[];
}

const MLInsights = ({ data, columns }: MLInsightsProps) => {
  const getDataQualityIssues = () => {
    const issues = [];
    
    // Check for missing values
    columns.forEach(column => {
      const missingCount = data.filter(row => !row[column]).length;
      if (missingCount > 0) {
        issues.push({
          type: 'warning',
          message: `${column} has ${missingCount} missing values`,
          solution: 'Consider imputing missing values using mean/median for numerical data or mode for categorical data'
        });
      }
    });

    // Check for outliers in numerical columns
    columns.forEach(column => {
      if (!isNaN(data[0]?.[column])) {
        const values = data.map(row => Number(row[column])).filter(v => !isNaN(v));
        const mean = values.reduce((a, b) => a + b, 0) / values.length;
        const std = Math.sqrt(values.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / values.length);
        const outliers = values.filter(v => Math.abs(v - mean) > 3 * std).length;
        
        if (outliers > 0) {
          issues.push({
            type: 'warning',
            message: `${column} has ${outliers} potential outliers`,
            solution: 'Consider using robust scaling or removing outliers if they are errors'
          });
        }
      }
    });

    return issues;
  };

  const getMLRecommendations = () => {
    const numericColumns = columns.filter(column => !isNaN(data[0]?.[column]));
    const categoricalColumns = columns.filter(column => isNaN(data[0]?.[column]));
    
    const recommendations = [];
    
    if (numericColumns.length >= 2) {
      recommendations.push({
        type: 'success',
        message: 'Dataset suitable for regression analysis',
        details: 'You can predict numerical values using features: ' + numericColumns.join(', ')
      });
    }
    
    if (categoricalColumns.length > 0) {
      recommendations.push({
        type: 'success',
        message: 'Dataset suitable for classification',
        details: 'You can predict categories using features: ' + categoricalColumns.join(', ')
      });
    }

    return recommendations;
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <Card className="bg-gradient-to-br from-blue-800 to-blue-950 text-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-6 h-6" />
            ML Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Data Quality Issues</h3>
              <div className="space-y-4">
                {getDataQualityIssues().map((issue, index) => (
                  <div key={index} className="bg-white/10 p-4 rounded-lg">
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="w-5 h-5 text-yellow-400 mt-1" />
                      <div>
                        <p className="font-medium">{issue.message}</p>
                        <p className="text-sm text-blue-200">{issue.solution}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">ML Recommendations</h3>
              <div className="space-y-4">
                {getMLRecommendations().map((rec, index) => (
                  <div key={index} className="bg-white/10 p-4 rounded-lg">
                    <div className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-green-400 mt-1" />
                      <div>
                        <p className="font-medium">{rec.message}</p>
                        <p className="text-sm text-blue-200">{rec.details}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MLInsights;