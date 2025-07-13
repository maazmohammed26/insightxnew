import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, AlertCircle, Ban, FileWarning, Shield, CheckCircle2, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

interface ProblemsSectionProps {
  data: any[];
  columns: string[];
}

const ProblemsSection = ({ data, columns }: ProblemsSectionProps) => {
  const findProblems = () => {
    const problems = [];
    
    // Check for missing values
    const missingValues = columns.map(column => ({
      column,
      count: data.filter(row => !row[column] || String(row[column]).trim() === '').length
    })).filter(p => p.count > 0);
    
    if (missingValues.length > 0) {
      problems.push({
        type: 'Missing Values',
        icon: <AlertTriangle className="w-8 h-8 text-yellow-500" />,
        description: 'Some columns contain missing or empty values',
        details: missingValues.map(mv => `${mv.column}: ${mv.count} missing values`)
      });
    }
    
    // Check for duplicate rows
    const stringifyRow = (row: any) => JSON.stringify(row);
    const duplicateCount = data.length - new Set(data.map(stringifyRow)).size;
    if (duplicateCount > 0) {
      problems.push({
        type: 'Duplicate Entries',
        icon: <Ban className="w-8 h-8 text-red-500" />,
        description: 'Dataset contains duplicate rows',
        details: [`${duplicateCount} duplicate rows found`]
      });
    }
    
    // Check for inconsistent data types
    const inconsistentTypes = columns.filter(column => {
      const types = new Set(data.map(row => typeof row[column]));
      return types.size > 1;
    });
    
    if (inconsistentTypes.length > 0) {
      problems.push({
        type: 'Inconsistent Data Types',
        icon: <FileWarning className="w-8 h-8 text-orange-500" />,
        description: 'Some columns contain mixed data types',
        details: inconsistentTypes.map(column => `${column} has inconsistent data types`)
      });
    }
    
    // Check for outliers in numeric columns
    const numericOutliers = columns.filter(column => {
      const values = data.map(row => Number(row[column])).filter(v => !isNaN(v));
      if (values.length === 0) return false;
      
      const mean = values.reduce((a, b) => a + b, 0) / values.length;
      const std = Math.sqrt(values.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / values.length);
      const outliers = values.filter(v => Math.abs(v - mean) > 3 * std);
      
      return outliers.length > 0;
    });
    
    if (numericOutliers.length > 0) {
      problems.push({
        type: 'Potential Outliers',
        icon: <AlertCircle className="w-8 h-8 text-purple-500" />,
        description: 'Some numeric columns contain potential outliers',
        details: numericOutliers.map(column => `${column} contains potential outliers`)
      });
    }
    
    return problems;
  };

  const problems = findProblems();

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 flex items-center gap-2">
          <Shield className="w-6 h-6 text-indigo-500" />
          Data Quality Analysis
        </h2>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {problems.length} issues found
        </span>
      </div>
      
      {problems.length === 0 ? (
        <Card className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 border-emerald-100 dark:border-emerald-800">
          <CardContent className="pt-6">
            <div className="flex items-center justify-center gap-3 text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="w-6 h-6" />
              <span className="text-lg font-medium">No significant data quality issues found</span>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {problems.map((problem, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="hover:shadow-lg transition-all duration-300 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border-l-4 hover:scale-[1.02]"
                    style={{ borderLeftColor: getProblemColor(problem.type) }}>
                <CardHeader className="flex flex-row items-center space-x-4 pb-2">
                  {problem.icon}
                  <CardTitle className="text-lg">{problem.type}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">{problem.description}</p>
                  <ul className="space-y-2">
                    {problem.details.map((detail, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                        <ArrowRight className="w-4 h-4 text-gray-400" />
                        {detail}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

const getProblemColor = (type: string): string => {
  switch (type) {
    case 'Missing Values':
      return '#FCD34D'; // Yellow
    case 'Duplicate Entries':
      return '#EF4444'; // Red
    case 'Inconsistent Data Types':
      return '#F97316'; // Orange
    case 'Potential Outliers':
      return '#8B5CF6'; // Purple
    default:
      return '#6B7280'; // Gray
  }
};

export default ProblemsSection;