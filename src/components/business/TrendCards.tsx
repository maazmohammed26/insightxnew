import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface TrendCardsProps {
  trends: Array<{
    column: string;
    trend: string;
    percentChange: number;
  }>;
}

export const TrendCards = ({ trends }: TrendCardsProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
      {trends.map((trend, index) => (
        <Card key={index} className="bg-white/50 dark:bg-gray-800/50 hover:scale-105 transition-transform duration-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">{trend.column}</p>
              {trend.trend === 'up' ? (
                <ArrowUpRight className="w-4 h-4 text-green-500" />
              ) : (
                <ArrowDownRight className="w-4 h-4 text-red-500" />
              )}
            </div>
            <p className="text-2xl font-bold mt-2">
              {trend.percentChange}%
            </p>
            <p className="text-sm text-gray-500">
              {trend.trend === 'up' ? 'Increase' : 'Decrease'} from average
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};