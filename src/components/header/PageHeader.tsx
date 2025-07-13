
import React from 'react';
import { Button } from '@/components/ui/button';
import { Upload, Home, ChevronRight, FileSpreadsheet } from 'lucide-react';
import { motion } from 'framer-motion';

interface PageHeaderProps {
  fileName: string;
  onNewUpload: () => void;
}

const PageHeader = ({ fileName, onNewUpload }: PageHeaderProps) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8"
    >
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-gradient-to-r from-purple-900/90 via-indigo-900/90 to-blue-900/90 p-5 rounded-xl shadow-lg backdrop-blur-sm border border-purple-500/40 dark:border-purple-500/30">
        <div className="flex items-center gap-3">
          <motion.div
            initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 0.5, type: "spring", stiffness: 260, damping: 20 }}
            className="bg-indigo-600/30 p-3 rounded-lg border border-indigo-500/30"
          >
            <FileSpreadsheet className="h-6 w-6 text-indigo-200" />
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-purple-300 via-indigo-200 to-blue-300 bg-clip-text text-transparent drop-shadow-sm"
          >
            {fileName ? `Analyzing: ${fileName}` : 'InsightX'}
          </motion.h1>
        </div>
        
        <div className="flex gap-3">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <Button 
              onClick={onNewUpload}
              variant="secondary"
              size="lg"
              className="flex items-center gap-2 bg-white/10 hover:bg-white/20 dark:bg-white/5 dark:hover:bg-white/10 backdrop-blur-sm border border-white/20 transition-all duration-300 text-white shadow-md"
            >
              <Home className="h-4 w-4" />
              <span>Home</span>
            </Button>
          </motion.div>
          
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <Button 
              onClick={onNewUpload}
              variant="secondary"
              size="lg"
              className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white border border-white/20 shadow-md transition-all duration-300"
            >
              <Upload className="h-4 w-4" />
              <span>Upload New File</span>
              <ChevronRight className="h-4 w-4 animate-pulse" />
            </Button>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default PageHeader;
