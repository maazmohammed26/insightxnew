import React from 'react';
import { motion } from 'framer-motion';
import { FileText, ChartBar, ChartLine, ChartPie, Download, Upload, Laptop, Smartphone } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface ReportPreviewProps {
  fileName: string;
  dataSize: number;
  hasCharts: boolean;
}

const ReportPreview = ({ fileName, dataSize, hasCharts }: ReportPreviewProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/50 dark:to-indigo-900/50">
          <CardContent className="p-6">
            <FileText className="w-8 h-8 text-purple-600 mb-4" />
            <h3 className="font-semibold mb-2">{fileName}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {dataSize} rows analyzed
            </p>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/50 dark:to-cyan-900/50">
          <CardContent className="p-6">
            <div className="flex gap-2">
              <ChartBar className="w-6 h-6 text-blue-600" />
              <ChartLine className="w-6 h-6 text-blue-600" />
              <ChartPie className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="font-semibold mt-4 mb-2">Visualizations</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {hasCharts ? 'Charts available' : 'No charts yet'}
            </p>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/50 dark:to-emerald-900/50">
          <CardContent className="p-6">
            <div className="flex gap-2">
              <Laptop className="w-6 h-6 text-green-600" />
              <Smartphone className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="font-semibold mt-4 mb-2">Cross-Device</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Access on any device
            </p>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card className="bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-900/50 dark:to-amber-900/50">
          <CardContent className="p-6">
            <div className="flex gap-2">
              <Download className="w-6 h-6 text-orange-600" />
              <Upload className="w-6 h-6 text-orange-600" />
            </div>
            <h3 className="font-semibold mt-4 mb-2">Export & Share</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Share across devices
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default ReportPreview;