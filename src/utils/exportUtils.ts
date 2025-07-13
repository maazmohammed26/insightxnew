import { SharedAnalysis } from '@/types/profile';
import CryptoJS from 'crypto-js';

export const generateDataInsights = (data: any[], columns: string[]): string[] => {
  const insights: string[] = [];
  
  // Early return if no data or columns
  if (!data.length || !columns.length) {
    return ['No data available for analysis'];
  }
  
  // Calculate basic statistics
  const numericColumns = columns.filter(col => 
    data[0] && !isNaN(Number(data[0][col]))
  );
  
  numericColumns.forEach(col => {
    const values = data.map(row => Number(row[col])).filter(val => !isNaN(val));
    
    if (values.length === 0) return;
    
    const avg = values.reduce((a, b) => a + b, 0) / values.length;
    const max = Math.max(...values);
    const min = Math.min(...values);
    
    insights.push(`${col}: Average is ${avg.toFixed(2)}, ranging from ${min} to ${max}`);
    
    // Trend analysis - only if we have enough data points
    if (values.length >= 5) {
      const recentValues = values.slice(-5);
      const recentAvg = recentValues.reduce((a, b) => a + b, 0) / recentValues.length;
      const trend = recentAvg > avg ? 'increasing' : 'decreasing';
      insights.push(`${col} shows a ${trend} trend in recent data points`);
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

export const importSharedAnalysis = async (file: File, pin?: string): Promise<SharedAnalysis> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const fileContent = e.target?.result as string;
        const importedData = JSON.parse(fileContent);
        
        if (importedData.isProtected) {
          if (!pin) {
            throw new Error('This analysis is PIN protected. Please enter the PIN.');
          }
          
          if (!importedData.encryptedData) {
            throw new Error('Invalid protected analysis file.');
          }
          
          const decryptedAnalysis = decryptAnalysis(importedData.encryptedData, pin);
          if (!decryptedAnalysis) {
            throw new Error('Invalid PIN or corrupted file');
          }
          
          saveSharedAnalysis(decryptedAnalysis);
          resolve(decryptedAnalysis);
        } else {
          // Handle unprotected analysis
          const analysis: SharedAnalysis = {
            id: importedData.id || `${Date.now()}-${Math.random().toString(36).substring(7)}`,
            data: importedData.data,
            insights: importedData.insights || [],
            timestamp: Date.now(),
            sharedBy: 'anonymous',
            sharedWith: 'public'
          };
          
          saveSharedAnalysis(analysis);
          resolve(analysis);
        }
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
};

export const encryptAnalysis = (analysis: SharedAnalysis, pin: string): string => {
  return CryptoJS.AES.encrypt(JSON.stringify(analysis), pin).toString();
};

export const decryptAnalysis = (encryptedData: string, pin: string): SharedAnalysis | null => {
  try {
    const bytes = CryptoJS.AES.decrypt(encryptedData, pin);
    const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
    return JSON.parse(decryptedData);
  } catch (error) {
    console.error('Failed to decrypt analysis:', error);
    return null;
  }
};

export const saveSharedAnalysis = (analysis: SharedAnalysis) => {
  const sharedAnalyses = JSON.parse(localStorage.getItem('sharedAnalyses') || '[]');
  sharedAnalyses.push(analysis);
  localStorage.setItem('sharedAnalyses', JSON.stringify(sharedAnalyses));
};

export const exportSharedAnalysis = (analysis: SharedAnalysis, pin?: string) => {
  const dataToExport = pin ? {
    isProtected: true,
    encryptedData: encryptAnalysis(analysis, pin)
  } : analysis;
  
  const blob = new Blob([JSON.stringify(dataToExport)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `analysis-${analysis.id}${pin ? '-protected' : ''}.json`;
  a.click();
  URL.revokeObjectURL(url);
};

export const generateDiscordShareText = (
  fileName: string, 
  data: any[], 
  columns: string[], 
  insights: string[],
  message?: string,
  username?: string
): string => {
  let shareText = `**InsightX Analysis: ${fileName}**\n`;
  
  if (username) {
    shareText += `*Shared by: ${username}*\n`;
  }
  
  if (message) {
    shareText += `\n${message}\n`;
  }
  
  shareText += `\n**Summary:**\n- ${data.length} rows of data analyzed\n- ${columns.length} columns processed\n`;
  
  if (insights.length > 0) {
    shareText += `\n**Key Insights:**\n`;
    insights.slice(0, 5).forEach(insight => {
      shareText += `- ${insight}\n`;
    });
    if (insights.length > 5) {
      shareText += `- ... and ${insights.length - 5} more insights\n`;
    }
  }
  
  shareText += `\n*Shared from InsightX CSV Analyzer*`;
  
  return shareText;
};

export const openDiscordShare = (shareText: string, discordLink: string = "https://discord.gg/FSb9cacK5B") => {
  try {
    // Copy to clipboard
    navigator.clipboard.writeText(shareText);
    
    // Open Discord in a new tab
    window.open(discordLink, '_blank');
    
    return true;
  } catch (error) {
    console.error('Error sharing to Discord:', error);
    return false;
  }
};
