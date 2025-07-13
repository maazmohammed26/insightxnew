import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { motion } from 'framer-motion';
import { FileText, BarChart3 } from 'lucide-react';

interface DataSummaryProps {
  data: any[];
  columns: string[];
}

const DataSummary = ({ data, columns }: DataSummaryProps) => {
  const getColumnType = (column: string) => {
    const value = data[0]?.[column];
    if (!isNaN(value)) return 'Numeric';
    if (typeof value === 'string') return 'Text';
    return 'Unknown';
  };

  const calculateStats = (column: string) => {
    const values = data.map(row => parseFloat(row[column])).filter(val => !isNaN(val));
    if (values.length === 0) return null;

    const sorted = [...values].sort((a, b) => a - b);
    const sum = values.reduce((a, b) => a + b, 0) / values.length;
    const mean = sum / values.length;
    const median = sorted.length % 2 === 0 
      ? (sorted[sorted.length/2 - 1] + sorted[sorted.length/2]) / 2
      : sorted[Math.floor(sorted.length/2)];
    
    const variance = values.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / values.length;
    const stdDev = Math.sqrt(variance);

    const q1 = sorted[Math.floor(sorted.length * 0.25)];
    const q3 = sorted[Math.floor(sorted.length * 0.75)];
    const iqr = q3 - q1;

    const skewness = values.reduce((acc, val) => acc + Math.pow((val - mean) / stdDev, 3), 0) / values.length;

    return {
      count: values.length,
      min: Math.min(...values),
      max: Math.max(...values),
      mean: mean.toFixed(2),
      median: median.toFixed(2),
      stdDev: stdDev.toFixed(2),
      q1: q1.toFixed(2),
      q3: q3.toFixed(2),
      iqr: iqr.toFixed(2),
      skewness: skewness.toFixed(2),
      range: (Math.max(...values) - Math.min(...values)).toFixed(2)
    };
  };

  const getCategoricalStats = (column: string) => {
    const counts: { [key: string]: number } = {};
    let totalCount = 0;
    
    data.forEach(row => {
      const value = String(row[column]);
      if (value && value.trim() !== '') {
        counts[value] = (counts[value] || 0) + 1;
        totalCount++;
      }
    });
    
    const sortedCounts = Object.entries(counts)
      .sort(([,a], [,b]) => b - a);
    
    const mode = sortedCounts[0]?.[0];
    const uniqueRatio = (Object.keys(counts).length / totalCount * 100).toFixed(2);
    
    return {
      uniqueValues: Object.keys(counts).length,
      totalCount,
      mode,
      uniqueRatio,
      topCategories: sortedCounts.slice(0, 5).map(([category, count]) => ({
        category,
        count,
        percentage: ((count/totalCount) * 100).toFixed(1)
      }))
    };
  };

  const StatCard = ({ title, children, delay = 0 }: { title: string; children: React.ReactNode; delay?: number }) => (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ 
        duration: 0.5, 
        delay: delay * 0.1,
        type: "spring",
        stiffness: 100
      }}
      whileHover={{ 
        scale: 1.02,
        boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 10px 10px -5px rgb(0 0 0 / 0.04)"
      }}
      className="h-full"
    >
      <Card className="h-full bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 border-2 border-transparent hover:border-indigo-200 dark:hover:border-indigo-700 transition-all duration-300 shadow-lg">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm sm:text-base font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          {children}
        </CardContent>
      </Card>
    </motion.div>
  );

  const EmptyStateCard = ({ delay = 0 }: { delay?: number }) => (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ 
        duration: 0.5, 
        delay: delay * 0.1,
        type: "spring",
        stiffness: 100
      }}
      className="h-full"
    >
      <Card className="h-full bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800/50 dark:to-gray-700/50 border-2 border-dashed border-gray-300 dark:border-gray-600">
        <CardContent className="p-6 flex flex-col items-center justify-center text-center min-h-[200px]">
          <div className="mb-4 p-3 rounded-full bg-gray-200 dark:bg-gray-700">
            <BarChart3 className="w-6 h-6 text-gray-400 dark:text-gray-500" />
          </div>
          <h3 className="text-base font-semibold text-gray-400 dark:text-gray-500 mb-2">
            More Statistics Available
          </h3>
          <p className="text-xs text-gray-400 dark:text-gray-500">
            Add more data columns to see additional statistical insights here
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );

  const numericColumns = columns.filter(col => !isNaN(data[0]?.[col]));
  const categoricalColumns = columns.filter(col => isNaN(data[0]?.[col]));
  const totalStatCards = numericColumns.length + categoricalColumns.length;
  const shouldShowEmptyState = totalStatCards > 0 && totalStatCards < 6; // Show empty state if we have some data but less than 6 cards

  return (
    <div className="w-full">
      <ScrollArea className="h-[800px] w-full pr-4" hideScrollbar={false}>
        <div className="space-y-6 pb-4">
          {/* Dataset Overview */}
          <StatCard title="Dataset Overview" delay={0}>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
              {[
                { label: "Total Rows", value: data.length, color: "from-blue-500 to-blue-600", icon: "📊" },
                { label: "Total Columns", value: columns.length, color: "from-green-500 to-green-600", icon: "📋" },
                { label: "Missing Values", value: countMissingValues(data), color: "from-yellow-500 to-yellow-600", icon: "⚠️" },
                { label: "Duplicate Rows", value: countDuplicateRows(data), color: "from-purple-500 to-purple-600", icon: "📝" }
              ].map((metric, index) => (
                <motion.div
                  key={metric.label}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 + index * 0.1, type: "spring" }}
                  whileHover={{ scale: 1.05 }}
                  className={`bg-gradient-to-r ${metric.color} p-3 sm:p-4 rounded-xl text-white shadow-lg hover:shadow-xl transition-all duration-300`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-base sm:text-lg">{metric.icon}</span>
                    <span className="text-lg sm:text-xl font-bold">{metric.value}</span>
                  </div>
                  <p className="text-xs font-medium opacity-90">{metric.label}</p>
                </motion.div>
              ))}
            </div>
          </StatCard>

          {/* Statistics Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
            {/* Numeric Statistics */}
            {numericColumns.length > 0 ? (
              numericColumns.map((column, index) => {
                const stats = calculateStats(column);
                if (!stats) return null;
                
                return (
                  <StatCard key={column} title={`${column} Statistics`} delay={index + 1}>
                    <ScrollArea className="h-72 sm:h-64">
                      <div className="space-y-2 sm:space-y-3 pr-2">
                        {[
                          { label: "Count", value: stats.count, icon: "🔢" },
                          { label: "Min", value: stats.min, icon: "📉" },
                          { label: "Max", value: stats.max, icon: "📈" },
                          { label: "Range", value: stats.range, icon: "📏" },
                          { label: "Mean", value: stats.mean, icon: "➕" },
                          { label: "Median", value: stats.median, icon: "🎯" },
                          { label: "Std Dev", value: stats.stdDev, icon: "📊" },
                          { label: "Q1", value: stats.q1, icon: "1️⃣" },
                          { label: "Q3", value: stats.q3, icon: "3️⃣" },
                          { label: "IQR", value: stats.iqr, icon: "📐" },
                          { label: "Skewness", value: stats.skewness, icon: "🔄" }
                        ].map((stat, idx) => (
                          <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 * idx }}
                            className="flex items-center justify-between p-2 rounded-lg bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                          >
                            <span className="flex items-center gap-2 font-medium text-gray-700 dark:text-gray-300 text-xs">
                              <span className="text-xs">{stat.icon}</span>
                              {stat.label}:
                            </span>
                            <span className="font-bold text-indigo-600 dark:text-indigo-400 text-xs">{stat.value}</span>
                          </motion.div>
                        ))}
                      </div>
                    </ScrollArea>
                  </StatCard>
                );
              })
            ) : null}

            {/* Categorical Statistics */}
            {categoricalColumns.length > 0 ? (
              categoricalColumns.map((column, index) => {
                const stats = getCategoricalStats(column);
                
                return (
                  <StatCard key={column} title={`${column} Categories`} delay={index + numericColumns.length + 1}>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-2 sm:gap-3">
                        {[
                          { label: "Unique Values", value: stats.uniqueValues, icon: "🔄" },
                          { label: "Total Count", value: stats.totalCount, icon: "📊" },
                          { label: "Mode", value: stats.mode, icon: "🎯" },
                          { label: "Unique Ratio", value: `${stats.uniqueRatio}%`, icon: "📈" }
                        ].map((stat, idx) => (
                          <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.1 * idx }}
                            className="p-2 rounded-lg bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 border border-indigo-100 dark:border-indigo-800"
                          >
                            <div className="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-400 mb-1">
                              <span>{stat.icon}</span>
                              {stat.label}
                            </div>
                            <div className="font-bold text-indigo-600 dark:text-indigo-400 truncate text-xs">{stat.value}</div>
                          </motion.div>
                        ))}
                      </div>
                      
                      <div>
                        <h4 className="font-semibold mb-2 text-gray-700 dark:text-gray-300 flex items-center gap-2 text-xs">
                          <span>🏆</span>
                          Top Categories:
                        </h4>
                        <ScrollArea className="h-32">
                          <div className="space-y-2 pr-2">
                            {stats.topCategories.map(({ category, count, percentage }, idx) => (
                              <motion.div
                                key={idx}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.1 * idx }}
                                className="flex justify-between items-center p-2 rounded bg-white dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700"
                              >
                                <span className="font-medium text-gray-800 dark:text-gray-200 truncate flex-1 pr-2 text-xs">{category}</span>
                                <div className="text-right">
                                  <div className="font-bold text-indigo-600 dark:text-indigo-400 text-xs">{count}</div>
                                  <div className="text-xs text-gray-500 dark:text-gray-400">({percentage}%)</div>
                                </div>
                              </motion.div>
                            ))}
                          </div>
                        </ScrollArea>
                      </div>
                    </div>
                  </StatCard>
                );
              })
            ) : null}

            {/* Empty State Cards - show when there's space */}
            {shouldShowEmptyState && Array.from({ length: Math.min(2, 6 - totalStatCards) }).map((_, index) => (
              <EmptyStateCard key={`empty-${index}`} delay={totalStatCards + index + 1} />
            ))}

            {/* No Data States */}
            {numericColumns.length === 0 && (
              <StatCard title="Numeric Statistics" delay={1}>
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <div className="text-2xl mb-4">📊</div>
                  <h3 className="text-base font-semibold text-gray-700 dark:text-gray-300 mb-2">No Numeric Columns Found</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Your dataset doesn't contain any numeric columns that can be analyzed for statistical insights.
                  </p>
                </div>
              </StatCard>
            )}

            {categoricalColumns.length === 0 && (
              <StatCard title="Categorical Statistics" delay={1}>
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <div className="text-2xl mb-4">📝</div>
                  <h3 className="text-base font-semibold text-gray-700 dark:text-gray-300 mb-2">No Categorical Columns Found</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Your dataset doesn't contain any text-based columns that can be analyzed for categorical insights.
                  </p>
                </div>
              </StatCard>
            )}
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};

const countMissingValues = (data: any[]) => {
  return data.reduce((count, row) => {
    return count + Object.values(row).filter(value => !value).length;
  }, 0);
};

const countDuplicateRows = (data: any[]) => {
  const stringified = data.map(row => JSON.stringify(row));
  return stringified.length - new Set(stringified).size;
};

export default DataSummary;
