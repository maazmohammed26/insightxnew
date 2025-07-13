
import React from 'react';
import { FileSpreadsheet, ChartBar, Database, Sparkles, Brain, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

const HeroSection = () => {
  return (
    <div className="relative w-full overflow-hidden py-12 lg:py-20">
      {/* Background gradient circles - improved positioning */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 left-1/4 w-[30rem] h-[30rem] bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-[30rem] h-[30rem] bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-8 max-w-4xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="relative space-y-6"
          >
            <div className="flex justify-center items-center gap-4 sm:gap-6 mb-8">
              <motion.div
                animate={{ 
                  y: [0, -10, 0],
                  rotate: [0, 5, 0]
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="transform-gpu"
              >
                <FileSpreadsheet className="w-8 h-8 sm:w-12 sm:h-12 text-purple-600" />
              </motion.div>
              <motion.div
                animate={{ 
                  y: [0, -10, 0],
                  rotate: [0, -5, 0]
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.3
                }}
                className="transform-gpu"
              >
                <ChartBar className="w-8 h-8 sm:w-12 sm:h-12 text-indigo-600" />
              </motion.div>
              <motion.div
                animate={{ 
                  y: [0, -10, 0],
                  rotate: [0, 5, 0]
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.6
                }}
                className="transform-gpu"
              >
                <Database className="w-8 h-8 sm:w-12 sm:h-12 text-blue-600" />
              </motion.div>
            </div>
            
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 bg-clip-text text-transparent animate-fade-in tracking-tight">
              InsightX
            </h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="mt-6 text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto px-4"
            >
              Transform your CSV data into powerful insights with advanced analytics and beautiful visualizations
            </motion.p>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="flex flex-wrap justify-center gap-3 text-sm font-medium px-4"
          >
            <div className="flex items-center gap-2 px-4 py-2 bg-purple-100 dark:bg-purple-900/30 rounded-full text-purple-700 dark:text-purple-300 transform-gpu hover:scale-105 transition-transform">
              <Sparkles className="w-4 h-4" />
              <span className="whitespace-nowrap">Instant Analysis</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-full text-indigo-700 dark:text-indigo-300 transform-gpu hover:scale-105 transition-transform">
              <ChartBar className="w-4 h-4" />
              <span className="whitespace-nowrap">Beautiful Visualizations</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/30 rounded-full text-blue-700 dark:text-blue-300 transform-gpu hover:scale-105 transition-transform">
              <Brain className="w-4 h-4" />
              <span className="whitespace-nowrap">ML Insights</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-green-100 dark:bg-green-900/30 rounded-full text-green-700 dark:text-green-300 transform-gpu hover:scale-105 transition-transform">
              <Zap className="w-4 h-4" />
              <span className="whitespace-nowrap">Real-time Processing</span>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
