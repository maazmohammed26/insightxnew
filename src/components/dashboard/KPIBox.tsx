import React from 'react';
import { Card } from '@/components/ui/card';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { motion } from 'framer-motion';

interface KPIBoxProps {
  title: string;
  value: string | number;
  change: number;
  icon: React.ReactNode;
  color: string;
}

const KPIBox = ({ title, value, change, icon, color }: KPIBoxProps) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="w-full"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <Card className={`p-4 bg-gradient-to-br ${color} hover:shadow-lg transition-all duration-300`}>
        <div className="flex items-center justify-between mb-2">
          <div className={`p-2 rounded-lg bg-white/10 backdrop-blur-sm`}>
            {icon}
          </div>
          <div className={`flex items-center gap-1 text-sm ${change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            {change >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
            <span>{Math.abs(change)}%</span>
          </div>
        </div>
        <h3 className="text-sm font-medium text-gray-600 dark:text-gray-300">{title}</h3>
        <p className="text-2xl font-bold mt-1">{value}</p>
      </Card>
    </motion.div>
  );
};

export default KPIBox;