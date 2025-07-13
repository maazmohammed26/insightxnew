import { SharedAnalysis } from '@/types/profile';
import CryptoJS from 'crypto-js';

export const generateDataInsights = (data: any[], columns: string[]): string[] => {
  const insights: string[] = [];
  
  // Calculate basic statistics
  const numericColumns = columns.filter(col => !isNaN(Number(data[0]?.[col])));
  
  numericColumns.forEach(col => {
    const values = data.map(row => Number(row[col])).filter(val => !isNaN(val));
    const avg = values.reduce((a, b) => a + b, 0) / values.length;
    const max = Math.max(...values);
    const min = Math.min(...values);
    
    insights.push(`${col}: Average is ${avg.toFixed(2)}, ranging from ${min} to ${max}`);
    
    // Trend analysis
    const recentValues = values.slice(-5);
    const recentAvg = recentValues.reduce((a, b) => a + b, 0) / recentValues.length;
    const trend = recentAvg > avg ? 'increasing' : 'decreasing';
    insights.push(`${col} shows a ${trend} trend in recent data points`);

    // Distribution analysis
    const median = values.sort((a, b) => a - b)[Math.floor(values.length / 2)];
    if (Math.abs(median - avg) > avg * 0.2) {
      insights.push(`${col} shows significant skew (median: ${median.toFixed(2)} vs mean: ${avg.toFixed(2)})`);
    }
  });

  // Categorical analysis
  const categoricalColumns = columns.filter(col => isNaN(Number(data[0]?.[col])));
  
  categoricalColumns.forEach(col => {
    const categories = new Set(data.map(row => row[col]));
    insights.push(`${col} has ${categories.size} unique values`);
    
    // Distribution analysis
    const distribution: { [key: string]: number } = {};
    data.forEach(row => {
      const value = row[col];
      distribution[value] = (distribution[value] || 0) + 1;
    });
    
    const mostCommon = Object.entries(distribution)
      .sort(([,a], [,b]) => b - a)[0];
    
    if (mostCommon) {
      insights.push(`Most common ${col}: "${mostCommon[0]}" (${mostCommon[1]} occurrences)`);
      
      // Pattern detection
      const dominantPercentage = (mostCommon[1] / data.length) * 100;
      if (dominantPercentage > 70) {
        insights.push(`${col} shows strong dominance of "${mostCommon[0]}" (${dominantPercentage.toFixed(1)}% of entries)`);
      }
    }
  });

  // Missing data analysis
  columns.forEach(col => {
    const missingCount = data.filter(row => !row[col] || String(row[col]).trim() === '').length;
    if (missingCount > 0) {
      const percentage = (missingCount / data.length) * 100;
      insights.push(`${col} has ${percentage.toFixed(1)}% missing values`);
    }
  });

  return insights;
};

export const encryptAnalysis = (analysis: SharedAnalysis, password: string): string => {
  return CryptoJS.AES.encrypt(JSON.stringify(analysis), password).toString();
};

export const decryptAnalysis = (encryptedData: string, password: string): SharedAnalysis | null => {
  try {
    const bytes = CryptoJS.AES.decrypt(encryptedData, password);
    const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
    return JSON.parse(decryptedData);
  } catch (error) {
    console.error('Failed to decrypt analysis:', error);
    return null;
  }
};

export const saveSharedAnalysis = (analysis: SharedAnalysis, password?: string) => {
  const sharedAnalyses = JSON.parse(localStorage.getItem('sharedAnalyses') || '[]');
  const analysisToSave = password ? encryptAnalysis(analysis, password) : analysis;
  sharedAnalyses.push(analysisToSave);
  localStorage.setItem('sharedAnalyses', JSON.stringify(sharedAnalyses));
};

export const importSharedAnalysis = async (file: File, password?: string): Promise<SharedAnalysis> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const fileContent = e.target?.result as string;
        let analysis: SharedAnalysis;
        
        if (password) {
          const decryptedAnalysis = decryptAnalysis(fileContent, password);
          if (!decryptedAnalysis) {
            throw new Error('Invalid password or corrupted file');
          }
          analysis = decryptedAnalysis;
        } else {
          analysis = JSON.parse(fileContent);
        }
        
        if (!analysis.id || !analysis.data || !analysis.sharedWith) {
          throw new Error('Invalid analysis file');
        }
        
        saveSharedAnalysis(analysis);
        resolve(analysis);
      } catch (error) {
        reject(new Error('Failed to import analysis'));
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
};

export const exportSharedAnalysis = (analysis: SharedAnalysis, password?: string) => {
  const dataToExport = password ? encryptAnalysis(analysis, password) : analysis;
  const blob = new Blob([JSON.stringify(dataToExport)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `analysis-${analysis.id}${password ? '-protected' : ''}.json`;
  a.click();
  URL.revokeObjectURL(url);
};
