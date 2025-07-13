
import React from 'react';
import { Card } from '@/components/ui/card';
import { motion } from 'framer-motion';

interface CustomTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
}

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.2 }}
      >
        <Card className="bg-white/95 dark:bg-gray-800/95 p-4 rounded-xl shadow-xl border-2 border-purple-200 dark:border-purple-800/50 backdrop-blur-md">
          <p className="font-semibold text-lg mb-2 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600">
            {label}
          </p>
          <div className="space-y-2">
            {payload.map((pld: any, index: number) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center gap-2 py-1"
              >
                <motion.div 
                  className="w-4 h-4 rounded-full shadow-md" 
                  style={{ backgroundColor: pld.color || pld.fill }}
                  whileHover={{ scale: 1.2 }}
                />
                <span className="text-gray-700 dark:text-gray-300">
                  {pld.name}: {' '}
                  <span className="font-mono font-semibold">
                    {typeof pld.value === 'number' ? pld.value.toFixed(2) : pld.value}
                  </span>
                </span>
              </motion.div>
            ))}
          </div>
        </Card>
      </motion.div>
    );
  }
  return null;
};

export default CustomTooltip;
