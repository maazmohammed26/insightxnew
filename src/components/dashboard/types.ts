export type ChartType = 'line' | 'bar' | 'pie' | 'area' | 'scatter' | 'boxplot' | 'radial';
export type AggregationType = 'sum' | 'avg' | 'min' | 'max' | 'count';

export interface Widget {
  id: string;
  title: string;
  type: 'chart' | 'metric' | 'table' | 'kpi';
  columns: string[];
  width?: number;
  height?: number;
  position: {
    x: number;
    y: number;
  };
  chartType?: ChartType;
  aggregation?: AggregationType;
  filters?: {
    column: string;
    value: string;
    type: 'equals' | 'contains' | 'greater' | 'less';
  }[];
}