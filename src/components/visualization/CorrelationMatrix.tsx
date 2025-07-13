import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface CorrelationMatrixProps {
  data: any[];
  columns: string[];
}

const calculateCorrelation = (x: number[], y: number[]): number => {
  const n = x.length;
  if (n === 0) return 0;

  // Calculate means
  const xMean = x.reduce((a, b) => a + b, 0) / n;
  const yMean = y.reduce((a, b) => a + b, 0) / n;

  // Calculate covariance and standard deviations
  let covariance = 0;
  let xStdDev = 0;
  let yStdDev = 0;

  for (let i = 0; i < n; i++) {
    const xDiff = x[i] - xMean;
    const yDiff = y[i] - yMean;
    covariance += xDiff * yDiff;
    xStdDev += xDiff * xDiff;
    yStdDev += yDiff * yDiff;
  }

  xStdDev = Math.sqrt(xStdDev / n);
  yStdDev = Math.sqrt(yStdDev / n);

  // Prevent division by zero
  if (xStdDev === 0 || yStdDev === 0) return 0;

  return covariance / (n * xStdDev * yStdDev);
};

const getCorrelationColor = (value: number): string => {
  const absValue = Math.abs(value);
  if (value > 0) {
    return `rgba(0, 136, 254, ${absValue})`; // Blue for positive correlations
  } else {
    return `rgba(234, 56, 76, ${absValue})`; // Red for negative correlations
  }
};

const getCorrelationStrength = (value: number): string => {
  const absValue = Math.abs(value);
  if (absValue >= 0.9) return 'Very Strong';
  if (absValue >= 0.7) return 'Strong';
  if (absValue >= 0.5) return 'Moderate';
  if (absValue >= 0.3) return 'Weak';
  return 'Very Weak';
};

const CorrelationMatrix = ({ data, columns }: CorrelationMatrixProps) => {
  const numericColumns = columns.filter(column => 
    data.some(row => !isNaN(Number(row[column])))
  );

  const correlationMatrix = numericColumns.map(column => ({
    name: column,
    correlations: numericColumns.map(otherColumn => ({
      column: otherColumn,
      value: calculateCorrelation(
        data.map(row => Number(row[column])).filter(val => !isNaN(val)),
        data.map(row => Number(row[otherColumn])).filter(val => !isNaN(val))
      )
    }))
  }));

  return (
    <Card className="w-full p-2 sm:p-4 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm animate-fade-in">
      <CardHeader className="p-2 sm:p-4">
        <CardTitle className="text-lg sm:text-xl">Correlation Matrix</CardTitle>
      </CardHeader>
      <CardContent className="p-0 sm:p-4">
        <div className="overflow-x-auto">
          <div className="min-w-max">
            <div className="grid grid-cols-[auto,repeat(var(--num-columns),minmax(60px,1fr))]" 
                 style={{ "--num-columns": numericColumns.length } as any}>
              {/* Header row */}
              <div className="sticky left-0 z-10 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm p-2"></div>
              {numericColumns.map((column) => (
                <div key={column} className="p-2">
                  <div className="transform -rotate-45 origin-left whitespace-nowrap text-xs sm:text-sm">
                    {column}
                  </div>
                </div>
              ))}

              {/* Matrix rows */}
              {correlationMatrix.map((row) => (
                <React.Fragment key={row.name}>
                  <div className="sticky left-0 z-10 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm p-2 whitespace-nowrap text-xs sm:text-sm">
                    {row.name}
                  </div>
                  {row.correlations.map((corr) => (
                    <TooltipProvider key={`${row.name}-${corr.column}`}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div
                            className={`p-2 text-center text-xs sm:text-sm transition-colors ${
                              Math.abs(corr.value) > 0.6 ? 'text-white' : 'text-gray-800 dark:text-gray-200'
                            }`}
                            style={{ backgroundColor: getCorrelationColor(corr.value) }}
                          >
                            {corr.value.toFixed(3)}
                          </div>
                        </TooltipTrigger>
                        <TooltipContent side="top" className="z-50">
                          <div className="text-xs sm:text-sm">
                            <p className="font-semibold">{row.name} vs {corr.column}</p>
                            <p>Correlation: {corr.value.toFixed(3)}</p>
                            <p>Strength: {getCorrelationStrength(corr.value)}</p>
                            <p>Direction: {corr.value > 0 ? 'Positive' : corr.value < 0 ? 'Negative' : 'No correlation'}</p>
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  ))}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CorrelationMatrix;