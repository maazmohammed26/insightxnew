export type AggregationType = 'sum' | 'avg' | 'min' | 'max' | 'count';

export const getAggregatedValue = (data: any[], column: string, aggregationType: AggregationType = 'count'): string => {
  if (!data || !column) return '0';

  const values = data
    .map(item => Number(item[column]))
    .filter(val => !isNaN(val));

  if (values.length === 0) return '0';

  switch (aggregationType) {
    case 'sum':
      const sum = values.reduce((acc, val) => acc + val, 0);
      return formatNumber(sum);
    
    case 'avg':
      const avg = values.reduce((acc, val) => acc + val, 0) / values.length;
      return formatNumber(avg);
    
    case 'min':
      const min = Math.min(...values);
      return formatNumber(min);
    
    case 'max':
      const max = Math.max(...values);
      return formatNumber(max);
    
    case 'count':
      return formatNumber(values.length);
    
    default:
      return '0';
  }
};

export const formatNumber = (value: number): string => {
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1)}M`;
  }
  if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}K`;
  }
  return value.toLocaleString();
};