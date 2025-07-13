import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Brain, TrendingUp, Boxes } from 'lucide-react';

interface MLSuggestionsProps {
  data: any[];
  columns: string[];
}

const MLSuggestions = ({ data, columns }: MLSuggestionsProps) => {
  const getSuggestions = () => {
    const numericColumns = columns.filter(column => !isNaN(data[0]?.[column]));
    const categoricalColumns = columns.filter(column => isNaN(data[0]?.[column]));
    
    const suggestions = [];
    
    if (numericColumns.length >= 2) {
      suggestions.push({
        title: 'Regression Analysis',
        description: 'Consider using Linear Regression or Random Forest Regression to predict numerical values.',
        icon: TrendingUp,
      });
    }
    
    if (categoricalColumns.length >= 1) {
      suggestions.push({
        title: 'Classification',
        description: 'Use Classification algorithms like Random Forest or Support Vector Machines for categorical predictions.',
        icon: Boxes,
      });
    }
    
    if (numericColumns.length >= 3) {
      suggestions.push({
        title: 'Clustering',
        description: 'Apply K-means or Hierarchical Clustering to identify patterns in your numerical data.',
        icon: Brain,
      });
    }
    
    return suggestions;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-fade-in">
      {getSuggestions().map((suggestion, index) => (
        <Card key={index} className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-gray-800 dark:to-gray-900 hover:scale-105 transition-transform duration-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <suggestion.icon className="w-5 h-5" />
              {suggestion.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {suggestion.description}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default MLSuggestions;