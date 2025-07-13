import React from 'react';
import { Info, ArrowLeft } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

interface EmptyStateMessageProps {
  filterType: 'all' | 'clean' | 'errors';
  onReset?: () => void;
}

const EmptyStateMessage = ({ filterType, onReset }: EmptyStateMessageProps) => {
  const messages = {
    all: "No data available. Please upload a CSV file to view the data.",
    clean: "No error-free data found in the current dataset.",
    errors: "No data with errors found in the current dataset.",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
    >
      <Card className="p-8 text-center animate-fade-in">
        <div className="flex flex-col items-center gap-4">
          <Info className="w-12 h-12 text-gray-400 animate-pulse" />
          <p className="text-gray-500">{messages[filterType]}</p>
          {filterType !== 'all' && onReset && (
            <Button
              variant="outline"
              onClick={onReset}
              className="mt-4 flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              View All Data
            </Button>
          )}
        </div>
      </Card>
    </motion.div>
  );
};

export default EmptyStateMessage;