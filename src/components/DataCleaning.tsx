import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileEdit, Download, RefreshCw, AlertTriangle, Filter, Wand2, Type, Wifi, WifiOff, Save, BarChart, Clipboard, History } from 'lucide-react';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger, TabsScrollable } from '@/components/ui/tabs';
import { motion } from 'framer-motion';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';

interface DataCleaningProps {
  data: any[];
  columns: string[];
}

interface ColumnTypeConfig {
  column: string;
  targetType: 'string' | 'number' | 'date' | 'boolean';
}

interface CleaningHistory {
  timestamp: Date;
  action: string;
  affectedRows: number;
  details: string;
}

const DataCleaning = ({ data, columns }: DataCleaningProps) => {
  const [cleanedData, setCleanedData] = useState<any[]>([]);
  const [cleaningStats, setCleaningStats] = useState<{
    nullValues: number;
    duplicates: number;
    outliers: number;
    formatted: number;
    standardized: number;
    typeConverted: number;
  }>({ 
    nullValues: 0, 
    duplicates: 0, 
    outliers: 0, 
    formatted: 0, 
    standardized: 0,
    typeConverted: 0 
  });
  const [columnTypeConfigs, setColumnTypeConfigs] = useState<ColumnTypeConfig[]>([]);
  const [cleaningHistory, setCleaningHistory] = useState<CleaningHistory[]>([]);
  const [savedCleaningConfigs, setSavedCleaningConfigs] = useState<{name: string, config: ColumnTypeConfig[]}[]>([]);
  const [configName, setConfigName] = useState<string>('');
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<string>('operations');
  const [advancedOptions, setAdvancedOptions] = useState<{
    removeOutliers: boolean;
    standardizeDates: boolean;
    removeDuplicates: boolean;
    trimWhitespace: boolean;
    replaceNulls: boolean
  }>({
    removeOutliers: true,
    standardizeDates: true,
    removeDuplicates: true,
    trimWhitespace: true,
    replaceNulls: true
  });

  const tabItems = [
    { id: 'operations', label: 'Cleaning Operations', icon: RefreshCw },
    { id: 'types', label: 'Data Types', icon: Type },
    { id: 'advanced', label: 'Advanced Options', icon: Filter },
    { id: 'configs', label: 'Saved Configs', icon: Save },
    { id: 'stats', label: 'Cleaning Stats', icon: BarChart },
    { id: 'history', label: 'History', icon: History },
  ];

  useEffect(() => {
    const handleOnlineStatus = () => {
      setIsOnline(navigator.onLine);
    };

    window.addEventListener('online', handleOnlineStatus);
    window.addEventListener('offline', handleOnlineStatus);
    
    setIsOnline(navigator.onLine);

    const savedConfigs = localStorage.getItem('cleaningConfigs');
    if (savedConfigs) {
      setSavedCleaningConfigs(JSON.parse(savedConfigs));
    }

    return () => {
      window.removeEventListener('online', handleOnlineStatus);
      window.removeEventListener('offline', handleOnlineStatus);
    };
  }, []);

  const convertValue = (value: any, targetType: string): any => {
    if (value === null || value === undefined) return null;
    if (value === '' || (typeof value === 'string' && value.trim() === '')) return null;
    
    switch (targetType) {
      case 'number':
        // Handle various numeric formats and null values
        if (typeof value === 'string') {
          // Remove currency symbols, commas, and extra spaces
          const cleanValue = value.replace(/[$,\s%]/g, '').trim();
          if (cleanValue === '' || cleanValue === 'null' || cleanValue === 'NULL' || cleanValue === 'N/A' || cleanValue === 'n/a') return 0;
          const num = Number(cleanValue);
          return isNaN(num) ? 0 : num;
        }
        const num = Number(value);
        return isNaN(num) ? 0 : num;
      case 'date':
        // Handle various date formats and null values
        if (typeof value === 'string' && (value.toLowerCase() === 'null' || value.toLowerCase() === 'n/a')) return null;
        const date = new Date(value);
        return isNaN(date.getTime()) ? null : date.toISOString().split('T')[0];
      case 'boolean':
        if (typeof value === 'string') {
          const lower = value.toLowerCase().trim();
          if (['null', 'n/a', '', 'undefined'].includes(lower)) return false;
          return ['true', 'yes', '1', 'on', 'y'].includes(lower);
        }
        return Boolean(value);
      default:
        // Handle null values for strings
        if (typeof value === 'string' && (value.toLowerCase() === 'null' || value.toLowerCase() === 'n/a')) return '';
        return String(value);
    }
  };

  const handleCleanData = () => {
    let stats = { 
      nullValues: 0, 
      duplicates: 0, 
      outliers: 0, 
      formatted: 0, 
      standardized: 0,
      typeConverted: 0 
    };
    
    // Optimized data processing with better null handling
    let typedData = data.map(row => {
      const newRow = { ...row };
      columnTypeConfigs.forEach(config => {
        const oldValue = newRow[config.column];
        const newValue = convertValue(oldValue, config.targetType);
        if (newValue !== oldValue) {
          stats.typeConverted++;
        }
        newRow[config.column] = newValue;
      });
      
      // Handle null values for columns not in type configs
      columns.forEach(col => {
        if (!columnTypeConfigs.find(c => c.column === col)) {
          const value = newRow[col];
          if (value === null || value === undefined || 
              (typeof value === 'string' && (value.trim() === '' || value.toLowerCase() === 'null' || value.toLowerCase() === 'n/a'))) {
            newRow[col] = null;
            stats.nullValues++;
          }
        }
      });
      
      return newRow;
    });

    const basicCleaned = typedData.map(row => {
      const cleanedRow = { ...row };
      columns.forEach(col => {
        if (typeof cleanedRow[col] === 'string' && advancedOptions.trimWhitespace) {
          const trimmed = cleanedRow[col].trim();
          if (trimmed !== cleanedRow[col]) stats.formatted++;
          cleanedRow[col] = trimmed;
        }
        
        if (isDateString(cleanedRow[col]) && advancedOptions.standardizeDates) {
          try {
            const standardizedDate = new Date(cleanedRow[col]).toISOString().split('T')[0];
            if (standardizedDate !== cleanedRow[col]) {
              cleanedRow[col] = standardizedDate;
              stats.standardized++;
            }
          } catch (e) {
            console.log('Date standardization failed for:', cleanedRow[col]);
          }
        }

        // Enhanced null value handling
        if ((cleanedRow[col] === '' || cleanedRow[col] === 'null' || cleanedRow[col] === 'N/A' || 
             cleanedRow[col] === 'n/a' || cleanedRow[col] === 'NULL' || cleanedRow[col] === undefined) && 
             advancedOptions.replaceNulls) {
          // Intelligently fill null values based on column type
          const typeConfig = columnTypeConfigs.find(c => c.column === col);
          if (typeConfig?.targetType === 'number') {
            cleanedRow[col] = 0;
          } else if (typeConfig?.targetType === 'boolean') {
            cleanedRow[col] = false;
          } else {
            cleanedRow[col] = null;
          }
          stats.nullValues++;
        }
      });
      return cleanedRow;
    });

    let deduped = basicCleaned;
    if (advancedOptions.removeDuplicates) {
      const uniqueRows = new Set();
      deduped = basicCleaned.filter(row => {
        const key = JSON.stringify(row);
        const isDuplicate = uniqueRows.has(key);
        uniqueRows.add(key);
        if (isDuplicate) stats.duplicates++;
        return !isDuplicate;
      });
    }

    let cleaned = deduped;
    if (advancedOptions.removeOutliers) {
      cleaned = deduped.map(row => {
        const cleanedRow = { ...row };
        columns.forEach(col => {
          if (typeof cleanedRow[col] === 'number') {
            const values = deduped.map(r => r[col]).filter(v => typeof v === 'number');
            const mean = values.reduce((a, b) => a + b, 0) / values.length;
            const std = Math.sqrt(values.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / values.length);
            if (Math.abs(cleanedRow[col] - mean) > 3 * std) {
              cleanedRow[col] = mean;
              stats.outliers++;
            }
          }
        });
        return cleanedRow;
      });
    }

    setCleanedData(cleaned);
    setCleaningStats(stats);
    
    const historyEntry: CleaningHistory = {
      timestamp: new Date(),
      action: "Clean Data",
      affectedRows: cleaned.length,
      details: `Converted ${stats.typeConverted} values, fixed ${stats.nullValues} nulls, removed ${stats.duplicates} duplicates, handled ${stats.outliers} outliers`
    };
    setCleaningHistory(prev => [historyEntry, ...prev]);
    
    toast.success('Data cleaned successfully', {
      description: `Processed ${cleaned.length} rows of data`,
      duration: 3000,
    });
  };

  const handleTypeConfigChange = (column: string, targetType: 'string' | 'number' | 'date' | 'boolean') => {
    setColumnTypeConfigs(prev => {
      const existing = prev.find(c => c.column === column);
      if (existing) {
        return prev.map(c => c.column === column ? { ...c, targetType } : c);
      }
      return [...prev, { column, targetType }];
    });
  };

  const isDateString = (value: any): boolean => {
    if (typeof value !== 'string') return false;
    const date = new Date(value);
    return date instanceof Date && !isNaN(date.getTime());
  };

  const downloadCleanedData = () => {
    if (cleanedData.length === 0) {
      toast.error('Please clean the data first');
      return;
    }

    const csvContent = [
      columns.join(','),
      ...cleanedData.map(row => 
        columns.map(col => {
          const value = row[col];
          return value === null ? '' : String(value);
        }).join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'cleaned_data.csv';
    a.click();
    window.URL.revokeObjectURL(url);
    
    toast.success('Cleaned data downloaded successfully');
  };

  const saveCleaningConfig = () => {
    if (configName.trim() === '') {
      toast.error('Please enter a name for your configuration');
      return;
    }

    if (columnTypeConfigs.length === 0) {
      toast.error('No configuration to save');
      return;
    }

    const newConfig = {
      name: configName,
      config: [...columnTypeConfigs]
    };

    const updatedConfigs = [...savedCleaningConfigs, newConfig];
    setSavedCleaningConfigs(updatedConfigs);
    localStorage.setItem('cleaningConfigs', JSON.stringify(updatedConfigs));
    setConfigName('');
    toast.success('Configuration saved successfully');
  };

  const loadCleaningConfig = (config: ColumnTypeConfig[]) => {
    setColumnTypeConfigs(config);
    toast.success('Configuration loaded successfully');
  };

  const copyToClipboard = () => {
    if (cleanedData.length === 0) {
      toast.error('Please clean the data first');
      return;
    }

    const jsonData = JSON.stringify(cleanedData, null, 2);
    navigator.clipboard.writeText(jsonData).then(() => {
      toast.success('Data copied to clipboard as JSON');
    }, () => {
      toast.error('Failed to copy data');
    });
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6 w-full"
    >
      {!isOnline && (
        <div className="bg-yellow-100 dark:bg-yellow-900/30 border border-yellow-300 dark:border-yellow-700 p-4 rounded-lg flex items-center gap-3 mb-4">
          <WifiOff className="h-5 w-5 text-yellow-700 dark:text-yellow-400" />
          <p className="text-yellow-700 dark:text-yellow-400 text-sm">
            You are currently offline. Some features may not work properly until you reconnect to the internet.
          </p>
        </div>
      )}

      <Card className="bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-900 dark:to-blue-900">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl font-bold">
            <Wand2 className="h-6 w-6 text-green-600" />
            Advanced Data Cleaning & Quality Enhancement
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="w-full overflow-hidden rounded-lg bg-white/70 dark:bg-gray-800/70 border border-green-100 dark:border-green-900/30 shadow-sm">
            <div className="w-full overflow-x-auto scrollbar-hide">
              <div className="flex gap-1 p-1">
                {tabItems.map((item) => (
                  <motion.button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`
                      flex items-center gap-1.5 px-4 py-2.5 rounded-lg whitespace-nowrap transition-all duration-200
                      ${activeTab === item.id 
                        ? 'bg-gradient-to-r from-green-500 to-blue-500 text-white shadow-md' 
                        : 'bg-white/50 dark:bg-gray-800/50 hover:bg-white dark:hover:bg-gray-700/70 text-gray-700 dark:text-gray-300'}
                    `}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <item.icon className={`h-4 w-4 ${activeTab === item.id ? 'text-white' : 'text-green-600 dark:text-green-400'}`} />
                    <span className="text-sm font-medium">{item.label}</span>
                  </motion.button>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-6">
            {activeTab === 'operations' && (
              <Card className="bg-white/50 dark:bg-gray-800/50">
                <CardContent className="pt-6">
                  <ul className="list-disc list-inside space-y-2 text-sm">
                    <li>Remove leading/trailing whitespace</li>
                    <li>Convert empty strings to null</li>
                    <li>Standardize date formats</li>
                    <li>Remove duplicate rows</li>
                    <li>Handle outliers in numeric columns</li>
                    <li>Format data consistently</li>
                    <li>Convert data types as specified</li>
                  </ul>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                    <Button 
                      onClick={handleCleanData}
                      className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
                      disabled={!isOnline}
                    >
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin-slow" />
                      Clean Data
                    </Button>
                    <Button 
                      onClick={downloadCleanedData}
                      className="w-full bg-gradient-to-r from-blue-600 to-indigo-600"
                      disabled={cleanedData.length === 0 || !isOnline}
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Download CSV
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
                    <Button 
                      onClick={copyToClipboard}
                      variant="outline"
                      className="w-full"
                      disabled={cleanedData.length === 0}
                    >
                      <Clipboard className="mr-2 h-4 w-4" />
                      Copy as JSON
                    </Button>
                    <Button 
                      onClick={() => {
                        const displayedStats = `Statistics: Fixed ${cleaningStats.nullValues} null values, removed ${cleaningStats.duplicates} duplicates, handled ${cleaningStats.outliers} outliers, formatted ${cleaningStats.formatted} values, standardized ${cleaningStats.standardized} dates, converted ${cleaningStats.typeConverted} types`;
                        toast.info(displayedStats);
                      }}
                      variant="outline"
                      className="w-full"
                      disabled={cleanedData.length === 0}
                    >
                      <BarChart className="mr-2 h-4 w-4" />
                      Show Stats
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === 'types' && (
              <Card className="bg-white/50 dark:bg-gray-800/50">
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <h3 className="font-medium flex items-center gap-2">
                      <Type className="h-4 w-4" />
                      Configure Column Data Types
                    </h3>
                    <ScrollArea className="h-[40vh] pr-4">
                      <div className="grid gap-4">
                        {columns.map((column) => (
                          <div key={column} className="flex items-center gap-4">
                            <span className="min-w-[180px] font-medium truncate">{column}</span>
                            <Select
                              value={columnTypeConfigs.find(c => c.column === column)?.targetType || 'string'}
                              onValueChange={(value: 'string' | 'number' | 'date' | 'boolean') => 
                                handleTypeConfigChange(column, value)
                              }
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select type" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="string">Text</SelectItem>
                                <SelectItem value="number">Number</SelectItem>
                                <SelectItem value="date">Date</SelectItem>
                                <SelectItem value="boolean">Boolean</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                    <div className="flex flex-col sm:flex-row gap-3 mt-4">
                      <div className="flex-1">
                        <input
                          type="text"
                          placeholder="Configuration Name"
                          value={configName}
                          onChange={(e) => setConfigName(e.target.value)}
                          className="w-full px-3 py-2 border rounded-md bg-white/80 dark:bg-gray-800/80"
                        />
                      </div>
                      <Button 
                        onClick={saveCleaningConfig}
                        variant="cyan"
                        disabled={!configName.trim() || columnTypeConfigs.length === 0 || !isOnline}
                      >
                        <Save className="mr-2 h-4 w-4" />
                        Save Configuration
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === 'advanced' && (
              <Card className="bg-white/50 dark:bg-gray-800/50">
                <CardContent className="pt-6">
                  <h3 className="font-medium mb-4">Advanced Cleaning Options</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-white/70 dark:bg-gray-700/70 rounded-lg">
                      <div>
                        <h4 className="font-medium">Remove Outliers</h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Replace statistical outliers with mean values</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={advancedOptions.removeOutliers}
                          onChange={() => setAdvancedOptions(prev => ({ ...prev, removeOutliers: !prev.removeOutliers }))}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-white/70 dark:bg-gray-700/70 rounded-lg">
                      <div>
                        <h4 className="font-medium">Standardize Dates</h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Convert all dates to YYYY-MM-DD format</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={advancedOptions.standardizeDates}
                          onChange={() => setAdvancedOptions(prev => ({ ...prev, standardizeDates: !prev.standardizeDates }))}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-white/70 dark:bg-gray-700/70 rounded-lg">
                      <div>
                        <h4 className="font-medium">Remove Duplicates</h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Filter out duplicate rows</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={advancedOptions.removeDuplicates}
                          onChange={() => setAdvancedOptions(prev => ({ ...prev, removeDuplicates: !prev.removeDuplicates }))}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-white/70 dark:bg-gray-700/70 rounded-lg">
                      <div>
                        <h4 className="font-medium">Trim Whitespace</h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Remove leading/trailing spaces</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={advancedOptions.trimWhitespace}
                          onChange={() => setAdvancedOptions(prev => ({ ...prev, trimWhitespace: !prev.trimWhitespace }))}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-white/70 dark:bg-gray-700/70 rounded-lg">
                      <div>
                        <h4 className="font-medium">Replace Empty with Null</h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Convert empty strings to null values</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={advancedOptions.replaceNulls}
                          onChange={() => setAdvancedOptions(prev => ({ ...prev, replaceNulls: !prev.replaceNulls }))}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === 'configs' && (
              <Card className="bg-white/50 dark:bg-gray-800/50">
                <CardContent className="pt-6">
                  <h3 className="font-medium mb-4">Saved Configurations</h3>
                  {savedCleaningConfigs.length > 0 ? (
                    <ScrollArea className="h-[40vh] pr-4">
                      <div className="space-y-3">
                        {savedCleaningConfigs.map((savedConfig, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-white/70 dark:bg-gray-700/70 rounded-lg">
                            <div>
                              <h4 className="font-medium">{savedConfig.name}</h4>
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                {savedConfig.config.length} column configurations
                              </p>
                            </div>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => loadCleaningConfig(savedConfig.config)}
                            >
                              Load
                            </Button>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  ) : (
                    <div className="text-center py-8">
                      <Save className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                      <p className="text-gray-500">No saved configurations</p>
                      <p className="text-sm text-gray-400 mt-1">
                        Save your configurations in the Data Types tab
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
            
            {activeTab === 'stats' && (
              <Card className="bg-white/50 dark:bg-gray-800/50">
                <CardContent className="pt-6 space-y-4">
                  {cleanedData.length > 0 ? (
                    <>
                      <ScrollArea className="h-[40vh]">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="p-4 rounded-lg bg-red-50 dark:bg-red-900/20">
                            <p className="font-semibold">Null Values Fixed</p>
                            <p className="text-2xl">{cleaningStats.nullValues}</p>
                          </div>
                          <div className="p-4 rounded-lg bg-yellow-50 dark:bg-yellow-900/20">
                            <p className="font-semibold">Duplicates Removed</p>
                            <p className="text-2xl">{cleaningStats.duplicates}</p>
                          </div>
                          <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20">
                            <p className="font-semibold">Outliers Handled</p>
                            <p className="text-2xl">{cleaningStats.outliers}</p>
                          </div>
                          <div className="p-4 rounded-lg bg-green-50 dark:bg-green-900/20">
                            <p className="font-semibold">Values Formatted</p>
                            <p className="text-2xl">{cleaningStats.formatted}</p>
                          </div>
                          <div className="p-4 rounded-lg bg-purple-50 dark:bg-purple-900/20">
                            <p className="font-semibold">Dates Standardized</p>
                            <p className="text-2xl">{cleaningStats.standardized}</p>
                          </div>
                          <div className="p-4 rounded-lg bg-indigo-50 dark:bg-indigo-900/20">
                            <p className="font-semibold">Types Converted</p>
                            <p className="text-2xl">{cleaningStats.typeConverted}</p>
                          </div>
                        </div>
                      </ScrollArea>
                      <Button 
                        onClick={downloadCleanedData}
                        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600"
                        disabled={!isOnline}
                      >
                        <Download className="mr-2 h-4 w-4" />
                        Download Cleaned CSV
                      </Button>
                    </>
                  ) : (
                    <div className="text-center py-4">
                      <AlertTriangle className="h-12 w-12 text-yellow-500 mx-auto mb-2" />
                      <p>No cleaning statistics available. Clean your data first.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {activeTab === 'history' && (
              <Card className="bg-white/50 dark:bg-gray-800/50">
                <CardContent className="pt-6">
                  <h3 className="font-medium mb-4 flex items-center gap-2">
                    <History className="w-5 h-5" />
                    Cleaning History
                  </h3>
                  {cleaningHistory.length > 0 ? (
                    <ScrollArea className="h-[40vh] pr-4">
                      <div className="space-y-3">
                        {cleaningHistory.map((entry, index) => (
                          <div key={index} className="p-3 bg-white/70 dark:bg-gray-700/70 rounded-lg">
                            <div className="flex justify-between items-start">
                              <h4 className="font-medium">{entry.action}</h4>
                              <span className="text-xs text-gray-500">
                                {entry.timestamp.toLocaleTimeString()}
                              </span>
                            </div>
                            <p className="text-sm text-gray-500 mt-1">
                              Affected {entry.affectedRows} rows
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              {entry.details}
                            </p>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  ) : (
                    <div className="text-center py-8">
                      <History className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                      <p className="text-gray-500">No cleaning history available</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default DataCleaning;
