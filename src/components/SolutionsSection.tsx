
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Copy, Check, FileSearch, Brain, FileWarning, FileCode } from 'lucide-react';
import { toast } from 'sonner';

interface SolutionsSectionProps {
  data: any[];
  columns: string[];
}

const SolutionsSection = ({ data, columns }: SolutionsSectionProps) => {
  const [activeTab, setActiveTab] = useState<string>('python');
  const [isCopied, setIsCopied] = useState<string | null>(null);
  const [numericColumns, setNumericColumns] = useState<string[]>([]);
  const [categoricalColumns, setCategoricalColumns] = useState<string[]>([]);

  useEffect(() => {
    if (data && data.length > 0 && columns) {
      const detectColumnTypes = () => {
        const numeric: string[] = [];
        const categorical: string[] = [];
        
        columns.forEach(column => {
          const sampleValue = data.find(row => row[column] !== null && row[column] !== undefined)?.[column];
          if (sampleValue !== undefined) {
            if (!isNaN(Number(sampleValue))) {
              numeric.push(column);
            } else {
              categorical.push(column);
            }
          }
        });
        
        setNumericColumns(numeric);
        setCategoricalColumns(categorical);
      };
      
      detectColumnTypes();
    }
  }, [data, columns]);

  const copyToClipboard = (code: string, language: string) => {
    navigator.clipboard.writeText(code);
    setIsCopied(language);
    toast.success('Code copied to clipboard!');
    
    setTimeout(() => {
      setIsCopied(null);
    }, 2000);
  };

  const pythonOutlierCode = `
import pandas as pd
import numpy as np
from sklearn.ensemble import IsolationForest
import matplotlib.pyplot as plt

df = pd.read_csv('your_data.csv')
numeric_cols = [${numericColumns?.map(c => `'${c}'`)?.join(', ') || ''}]
X = df[numeric_cols].dropna()

# Anomaly detection using Isolation Forest
model = IsolationForest(contamination=0.05)
df['anomaly'] = pd.Series(model.fit_predict(X))
df['anomaly'] = df['anomaly'].map({1: 0, -1: 1})

# Visualize anomalies
plt.figure(figsize=(12, 8))
for i, col in enumerate(numeric_cols[:3]):  # Plot first 3 columns
    plt.subplot(2, 2, i+1)
    plt.scatter(df.index, df[col], c=df['anomaly'], cmap='viridis')
    plt.title(f'Anomalies in {col}')
    plt.colorbar(label='Anomaly')

plt.tight_layout()
plt.savefig('anomalies.png')

# Filter anomalous data
anomalies = df[df['anomaly'] == 1]
print(f"Found {len(anomalies)} anomalies")

# Export clean data
df[df['anomaly'] == 0].drop('anomaly', axis=1).to_csv('clean_data.csv', index=False)
`;

  const pythonMissingCode = `
import pandas as pd
import numpy as np
from sklearn.impute import KNNImputer

# Load your data
df = pd.read_csv('your_data.csv')

# Identify columns with missing values
missing_cols = df.columns[df.isna().any()].tolist()
numeric_cols = df.select_dtypes(include=['number']).columns.tolist()
categorical_cols = list(set(df.columns) - set(numeric_cols))

# For numeric columns, use KNN imputation
if len(missing_cols) > 0:
    # For numeric columns
    numeric_missing = list(set(numeric_cols) & set(missing_cols))
    if numeric_missing:
        imputer = KNNImputer(n_neighbors=5)
        df[numeric_missing] = pd.DataFrame(
            imputer.fit_transform(df[numeric_missing]),
            columns=numeric_missing
        )
    
    # For categorical columns, use mode imputation
    categorical_missing = list(set(categorical_cols) & set(missing_cols))
    for col in categorical_missing:
        df[col] = df[col].fillna(df[col].mode()[0])

# Save the clean data
df.to_csv('imputed_data.csv', index=False)
print(f"Missing values filled in {len(missing_cols)} columns")
`;

  const pythonOutliersCode = `
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt

def remove_outliers(df, column, threshold=3):
    """Remove outliers from a DataFrame column using z-score method."""
    z_scores = np.abs((df[column] - df[column].mean()) / df[column].std())
    print(f"Found {(z_scores > threshold).sum()} outliers in {column}")
    return df[z_scores < threshold]

# Apply to numeric columns
for col in [${numericColumns?.map(c => `'${c}'`)?.join(', ') || ''}]:
    if df[col].dtype in ['int64', 'float64']:
        df = remove_outliers(df, col)

# Save the clean data
df.to_csv('no_outliers_data.csv', index=False)
print("Outliers removed successfully")
`;

  const rCode = `
# R code for data cleaning and analysis
library(tidyverse)
library(naniar)
library(outliers)

# Load your data
data <- read.csv("your_data.csv")

# Check for missing values
missing_summary <- miss_var_summary(data)
print(missing_summary)

# Handle missing values for numeric columns
numeric_cols <- sapply(data, is.numeric)
for(col in names(data)[numeric_cols]) {
  if(any(is.na(data[[col]]))) {
    data[[col]] <- impute(data[[col]], "median")
  }
}

# Handle outliers using IQR method
for(col in names(data)[numeric_cols]) {
  q1 <- quantile(data[[col]], 0.25, na.rm = TRUE)
  q3 <- quantile(data[[col]], 0.75, na.rm = TRUE)
  iqr <- q3 - q1
  
  lower_bound <- q1 - 1.5 * iqr
  upper_bound <- q3 + 1.5 * iqr
  
  # Replace outliers with bounds
  data[[col]][data[[col]] < lower_bound] <- lower_bound
  data[[col]][data[[col]] > upper_bound] <- upper_bound
}

# Save cleaned data
write.csv(data, "clean_data_r.csv", row.names = FALSE)
`;

  const sqlCode = `
-- SQL code for data cleaning and transformation

-- Create a table for the cleaned data
CREATE TABLE cleaned_data AS
SELECT * FROM original_data;

-- Find and handle missing values
UPDATE cleaned_data
SET 
  ${numericColumns.slice(0, 3).map(col => `${col} = COALESCE(${col}, (SELECT AVG(${col}) FROM cleaned_data))`).join(',\n  ')}
WHERE 
  ${numericColumns.slice(0, 3).map(col => `${col} IS NULL`).join(' OR ')};

-- Remove outliers using standard deviation method
-- First, create a view with non-outlier data
CREATE VIEW non_outlier_data AS
SELECT *
FROM cleaned_data
WHERE
  ${numericColumns.slice(0, 3).map(col => 
    `${col} BETWEEN 
      (SELECT AVG(${col}) - 3 * STDDEV(${col}) FROM cleaned_data) 
      AND 
      (SELECT AVG(${col}) + 3 * STDDEV(${col}) FROM cleaned_data)`
  ).join(' AND ')};

-- Create final cleaned table
CREATE TABLE final_clean_data AS
SELECT * FROM non_outlier_data;

-- Analyze the results
SELECT 
  COUNT(*) as total_rows_original,
  (SELECT COUNT(*) FROM final_clean_data) as total_rows_cleaned,
  COUNT(*) - (SELECT COUNT(*) FROM final_clean_data) as rows_removed
FROM cleaned_data;
`;

  return (
    <Card className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 border-amber-200 dark:border-amber-900/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-amber-700 dark:text-amber-400">
          <FileCode className="h-5 w-5" />
          Solution Code Snippets
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="python" className="data-[state=active]:bg-amber-100 dark:data-[state=active]:bg-amber-900/40">
              Python
            </TabsTrigger>
            <TabsTrigger value="r" className="data-[state=active]:bg-amber-100 dark:data-[state=active]:bg-amber-900/40">
              R
            </TabsTrigger>
            <TabsTrigger value="sql" className="data-[state=active]:bg-amber-100 dark:data-[state=active]:bg-amber-900/40">
              SQL
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="python" className="space-y-4">
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium flex items-center gap-1">
                    <FileWarning className="h-4 w-4 text-amber-600" />
                    <span>Anomaly Detection</span>
                  </h3>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => copyToClipboard(pythonOutlierCode, 'python-anomaly')}
                  >
                    {isCopied === 'python-anomaly' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    <span className="ml-1">{isCopied === 'python-anomaly' ? 'Copied' : 'Copy'}</span>
                  </Button>
                </div>
                <ScrollArea className="h-[200px] w-full rounded-md border border-amber-200 dark:border-amber-800/30 bg-white dark:bg-gray-900/50">
                  <pre className="p-4 text-sm overflow-auto"><code>{pythonOutlierCode}</code></pre>
                </ScrollArea>
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium flex items-center gap-1">
                    <FileSearch className="h-4 w-4 text-amber-600" />
                    <span>Missing Values</span>
                  </h3>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => copyToClipboard(pythonMissingCode, 'python-missing')}
                  >
                    {isCopied === 'python-missing' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    <span className="ml-1">{isCopied === 'python-missing' ? 'Copied' : 'Copy'}</span>
                  </Button>
                </div>
                <ScrollArea className="h-[200px] w-full rounded-md border border-amber-200 dark:border-amber-800/30 bg-white dark:bg-gray-900/50">
                  <pre className="p-4 text-sm overflow-auto"><code>{pythonMissingCode}</code></pre>
                </ScrollArea>
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium flex items-center gap-1">
                    <Brain className="h-4 w-4 text-amber-600" />
                    <span>Outlier Removal</span>
                  </h3>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => copyToClipboard(pythonOutliersCode, 'python-outliers')}
                  >
                    {isCopied === 'python-outliers' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    <span className="ml-1">{isCopied === 'python-outliers' ? 'Copied' : 'Copy'}</span>
                  </Button>
                </div>
                <ScrollArea className="h-[200px] w-full rounded-md border border-amber-200 dark:border-amber-800/30 bg-white dark:bg-gray-900/50">
                  <pre className="p-4 text-sm overflow-auto"><code>{pythonOutliersCode}</code></pre>
                </ScrollArea>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="r">
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium flex items-center gap-1">
                  <FileSearch className="h-4 w-4 text-amber-600" />
                  <span>R Data Cleaning</span>
                </h3>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => copyToClipboard(rCode, 'r-code')}
                >
                  {isCopied === 'r-code' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  <span className="ml-1">{isCopied === 'r-code' ? 'Copied' : 'Copy'}</span>
                </Button>
              </div>
              <ScrollArea className="h-[300px] w-full rounded-md border border-amber-200 dark:border-amber-800/30 bg-white dark:bg-gray-900/50">
                <pre className="p-4 text-sm overflow-auto"><code>{rCode}</code></pre>
              </ScrollArea>
            </div>
          </TabsContent>
          
          <TabsContent value="sql">
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium flex items-center gap-1">
                  <FileSearch className="h-4 w-4 text-amber-600" />
                  <span>SQL Data Cleaning</span>
                </h3>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => copyToClipboard(sqlCode, 'sql-code')}
                >
                  {isCopied === 'sql-code' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  <span className="ml-1">{isCopied === 'sql-code' ? 'Copied' : 'Copy'}</span>
                </Button>
              </div>
              <ScrollArea className="h-[300px] w-full rounded-md border border-amber-200 dark:border-amber-800/30 bg-white dark:bg-gray-900/50">
                <pre className="p-4 text-sm overflow-auto"><code>{sqlCode}</code></pre>
              </ScrollArea>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default SolutionsSection;
