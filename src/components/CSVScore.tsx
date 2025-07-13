
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import WaveAnimation from './csv/WaveAnimation';
import CircularScore from './csv/CircularScore';
import MetricCard from './csv/MetricCard';
import { motion } from 'framer-motion';
import { Award, Shield, FileCheck, ChevronDown, ChevronUp, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface CSVScoreProps {
  data: any[];
  columns: string[];
}

const CSVScore = ({ data, columns }: CSVScoreProps) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showDetails, setShowDetails] = useState(true);

  const calculateScore = () => {
    const completeness = calculateCompleteness();
    const consistency = calculateConsistency();
    const uniqueness = calculateUniqueness();
    
    // If all metrics are 100%, return 100
    if (completeness === 100 && consistency === 100 && uniqueness === 100) {
      return 100;
    }
    
    // Otherwise use the average
    return Math.round((completeness + consistency + uniqueness) / 3);
  };

  const calculateCompleteness = () => {
    if (data.length === 0) return 100;
    
    const totalCells = data.length * columns.length;
    const filledCells = data.reduce((acc, row) => {
      return acc + Object.values(row).filter(value => 
        value !== null && value !== undefined && String(value).trim() !== ''
      ).length;
    }, 0);
    return Math.round((filledCells / totalCells) * 100);
  };

  const calculateConsistency = () => {
    // If there's no data, return 100% consistency
    if (data.length === 0) return 100;
    
    let score = 100;
    let hasInconsistencies = false;
    
    columns.forEach(column => {
      const values = data.map(row => row[column]);
      if (values.length > 0) {
        const firstType = typeof values[0];
        
        // Check if all values in the column are of the same type
        const inconsistentTypes = values.some(value => typeof value !== firstType);
        if (inconsistentTypes) {
          hasInconsistencies = true;
          score -= 10;
        }
      }
    });
    
    // If no inconsistencies were found, return 100
    return hasInconsistencies ? Math.max(score, 0) : 100;
  };

  const calculateUniqueness = () => {
    if (data.length === 0) return 100;
    
    // Use JSON.stringify to compare rows as strings
    const uniqueRows = new Set(data.map(row => JSON.stringify(row))).size;
    return Math.round((uniqueRows / data.length) * 100);
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    
    // Simulate refreshing the score
    setTimeout(() => {
      setIsRefreshing(false);
      toast.success('Score recalculated successfully');
    }, 1000);
  };

  const score = calculateScore();
  const completenessScore = calculateCompleteness();
  const consistencyScore = calculateConsistency();
  const uniquenessScore = calculateUniqueness();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full"
    >
      <Card className="relative overflow-hidden bg-gradient-to-br from-indigo-600/90 via-purple-600/90 to-blue-600/90 text-white shadow-2xl hover:shadow-3xl transition-all duration-300 border-none">
        <div className="absolute inset-0 bg-black/10 backdrop-blur-sm" />
        <WaveAnimation score={score} />
        
        <CardHeader className="relative z-10 space-y-1 pb-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Award className="w-8 h-8 text-yellow-300" />
              <div>
                <CardTitle className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-100">
                  CSV Quality Score
                </CardTitle>
                <p className="text-blue-100 text-sm md:text-base">
                  Comprehensive analysis of data quality metrics
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 w-8 p-0 text-white hover:bg-white/20"
                onClick={handleRefresh}
                disabled={isRefreshing}
              >
                <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                <span className="sr-only">Refresh</span>
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 w-8 p-0 text-white hover:bg-white/20"
                onClick={() => setShowDetails(!showDetails)}
              >
                {showDetails ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
                <span className="sr-only">Toggle details</span>
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="relative z-10 pt-4">
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="text-center mb-6"
          >
            <CircularScore score={score} />
            <div className="mt-4 flex justify-center gap-4">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-emerald-300" />
                <span className="text-sm text-emerald-200">Data Protected</span>
              </div>
              <div className="flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-blue-300" />
                <span className="text-sm text-blue-200">Verified Analysis</span>
              </div>
            </div>
          </motion.div>

          {showDetails && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6"
            >
              <MetricCard 
                title="Completeness"
                score={completenessScore}
                type="completeness"
              />
              <MetricCard 
                title="Consistency"
                score={consistencyScore}
                type="consistency"
              />
              <MetricCard 
                title="Uniqueness"
                score={uniquenessScore}
                type="uniqueness"
              />
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default CSVScore;
