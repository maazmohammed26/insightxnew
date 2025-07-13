import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export interface AggregationCardProps {
  category: string;
  count: number;
  sum: number;
  average: number;
  min: number;
  max: number;
  trend?: 'up' | 'down';
  percentChange?: number;
}

const AggregationCard = ({ 
  category, 
  count, 
  sum, 
  average, 
  min, 
  max,
  trend,
  percentChange 
}: AggregationCardProps) => {
  return (
    <Card className="bg-white/50 dark:bg-gray-800/50 hover:scale-105 transition-transform duration-200">
      <CardHeader>
        <CardTitle className="text-sm">{category}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 text-sm">
          <p>Count: {count}</p>
          <p>Sum: {sum.toFixed(2)}</p>
          <p>Average: {average.toFixed(2)}</p>
          <p>Range: {min.toFixed(2)} - {max.toFixed(2)}</p>
          {trend && percentChange && (
            <p className={`text-${trend === 'up' ? 'green' : 'red'}-500`}>
              {trend === 'up' ? '↑' : '↓'} {percentChange.toFixed(1)}% from average
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default AggregationCard;