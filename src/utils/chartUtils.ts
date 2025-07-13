export const prepareCategoricalData = (data: any[], column: string) => {
  const categories: { [key: string]: number } = {};
  
  data.forEach(item => {
    const value = item[column];
    if (value) {
      categories[value] = (categories[value] || 0) + 1;
    }
  });

  return Object.entries(categories).map(([name, value]) => ({
    name,
    value
  }));
};

export const calculateBoxPlotData = (data: any[], column: string) => {
  const values = data
    .map(item => Number(item[column]))
    .filter(val => !isNaN(val))
    .sort((a, b) => a - b);

  if (values.length === 0) return null;

  const q1Index = Math.floor(values.length * 0.25);
  const medianIndex = Math.floor(values.length * 0.5);
  const q3Index = Math.floor(values.length * 0.75);

  const q1 = values[q1Index];
  const median = values[medianIndex];
  const q3 = values[q3Index];
  const iqr = q3 - q1;
  const min = Math.max(q1 - 1.5 * iqr, values[0]);
  const max = Math.min(q3 + 1.5 * iqr, values[values.length - 1]);

  const outliers = values.filter(v => v < min || v > max);

  return {
    x: column,
    min,
    q1,
    median,
    q3,
    max,
    outliers
  };
};

export const saveToHistory = (data: any) => {
  const history = JSON.parse(localStorage.getItem('dataHistory') || '[]');
  history.unshift({
    ...data,
    timestamp: new Date().toISOString(),
    id: Date.now()
  });
  localStorage.setItem('dataHistory', JSON.stringify(history.slice(0, 10)));
};

export const getHistory = () => {
  return JSON.parse(localStorage.getItem('dataHistory') || '[]');
};

export const calculateCorrelation = (x: number[], y: number[]): number => {
  const n = x.length;
  if (n !== y.length || n === 0) return 0;

  const sumX = x.reduce((a, b) => a + b, 0);
  const sumY = y.reduce((a, b) => a + b, 0);
  const sumXY = x.reduce((sum, xi, i) => sum + xi * y[i], 0);
  const sumX2 = x.reduce((sum, xi) => sum + xi * xi, 0);
  const sumY2 = y.reduce((sum, yi) => sum + yi * yi, 0);

  const numerator = n * sumXY - sumX * sumY;
  const denominator = Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY));

  return denominator === 0 ? 0 : numerator / denominator;
};

export const getCorrelationColor = (correlation: number): string => {
  // Convert correlation from [-1, 1] to [0, 1] for color interpolation
  const normalized = (correlation + 1) / 2;
  
  // Define color stops
  const colors = {
    negative: { r: 239, g: 68, b: 68 },  // red-500
    neutral: { r: 249, g: 250, b: 251 }, // gray-50
    positive: { r: 34, g: 197, b: 94 }   // green-500
  };

  let finalColor;
  if (normalized <= 0.5) {
    // Interpolate between negative and neutral
    const t = normalized * 2;
    finalColor = {
      r: Math.round(colors.negative.r + (colors.neutral.r - colors.negative.r) * t),
      g: Math.round(colors.negative.g + (colors.neutral.g - colors.negative.g) * t),
      b: Math.round(colors.negative.b + (colors.neutral.b - colors.negative.b) * t)
    };
  } else {
    // Interpolate between neutral and positive
    const t = (normalized - 0.5) * 2;
    finalColor = {
      r: Math.round(colors.neutral.r + (colors.positive.r - colors.neutral.r) * t),
      g: Math.round(colors.neutral.g + (colors.positive.g - colors.neutral.g) * t),
      b: Math.round(colors.neutral.b + (colors.positive.b - colors.neutral.b) * t)
    };
  }

  return `rgb(${finalColor.r}, ${finalColor.g}, ${finalColor.b})`;
};
