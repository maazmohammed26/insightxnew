
import React from 'react';
import { motion } from 'framer-motion';

interface CustomXAxisTickProps {
  x: number;
  y: number;
  payload: {
    value: string;
  };
}

const CustomXAxisTick = ({ x, y, payload }: CustomXAxisTickProps) => (
  <g transform={`translate(${x},${y})`}>
    <motion.text
      x={0}
      y={0}
      dy={16}
      textAnchor="end"
      fill="#6B7280"
      transform="rotate(-45)"
      className="text-xs font-medium"
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
    >
      {payload.value}
    </motion.text>
  </g>
);

export default CustomXAxisTick;
