import React from 'react';
import { Line, Rectangle } from 'recharts';

interface BoxPlotProps {
  data: {
    x: string;
    min: number;
    q1: number;
    median: number;
    q3: number;
    max: number;
    outliers?: number[];
  };
  color: string;
}

const CustomBoxPlot: React.FC<BoxPlotProps> = ({ data, color }) => {
  if (!data) return null;

  return (
    <g>
      {/* Vertical line from min to max */}
      <Line
        type="linear"
        stroke={color}
        strokeWidth={2}
        y1={data.min}
        y2={data.max}
        x1={0}
        x2={0}
      />
      
      {/* Box from Q1 to Q3 */}
      <Rectangle
        fill={color}
        opacity={0.3}
        x={-20}
        y={data.q3}
        width={40}
        height={data.q1 - data.q3}
      />
      
      {/* Median line */}
      <Line
        type="linear"
        stroke={color}
        strokeWidth={2}
        y1={data.median}
        y2={data.median}
        x1={-20}
        x2={20}
      />
      
      {/* Outliers */}
      {data.outliers?.map((value, index) => (
        <circle
          key={index}
          cx={0}
          cy={value}
          r={3}
          fill={color}
          opacity={0.6}
        />
      ))}
    </g>
  );
};

export default CustomBoxPlot;