import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';

interface InsightCardProps {
  icon: LucideIcon;
  message: string;
  type: string;
}

const InsightCard = ({ icon: Icon, message, type }: InsightCardProps) => {
  return (
    <Card className="bg-white/50 dark:bg-gray-800/50 hover:scale-105 transition-transform duration-200">
      <CardContent className="p-4">
        <div className="flex items-center gap-2">
          <Icon className="w-4 h-4" />
          <p className="text-sm">{message}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default InsightCard;