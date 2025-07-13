import React from 'react';

interface DataAnalyzerProps {
  data: any[];
  columns: string[];
}

export const getStandardDeviation = (values: number[]) => {
  const avg = values.reduce((a, b) => a + b, 0) / values.length;
  const squareDiffs = values.map(v => Math.pow(v - avg, 2));
  return Math.sqrt(squareDiffs.reduce((a, b) => a + b, 0) / values.length);
};

export const analyzeDistribution = (data: any[], column: string) => {
  const values = data.map(row => Number(row[column])).filter(v => !isNaN(v));
  const avg = values.reduce((a, b) => a + b, 0) / values.length;
  const stdDev = getStandardDeviation(values);
  const outliers = values.filter(v => Math.abs(v - avg) > 2 * stdDev);
  
  return {
    average: avg,
    standardDeviation: stdDev,
    outliers: outliers.length,
    min: Math.min(...values),
    max: Math.max(...values),
    trend: values.slice(-5).reduce((a, b) => a + b, 0) / 5 > avg ? 'up' : 'down',
    percentChange: ((values.slice(-5).reduce((a, b) => a + b, 0) / 5 - avg) / avg * 100)
  };
};

export const analyzeCategories = (data: any[], column: string) => {
  const categories = new Set(data.map(row => row[column]));
  const categoryCounts = Array.from(categories).map(cat => ({
    category: cat,
    count: data.filter(row => row[column] === cat).length
  }));
  
  return {
    uniqueCount: categories.size,
    distribution: categoryCounts,
    mostCommon: categoryCounts.sort((a, b) => b.count - a.count)[0]
  };
};

const DataAnalyzer = ({ data, columns }: DataAnalyzerProps) => {
  // This is a utility component that provides analysis functions
  // It doesn't render anything directly
  return null;
};

export default DataAnalyzer;