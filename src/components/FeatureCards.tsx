import React from 'react';
import { FileSpreadsheet, History, HelpCircle, ChartBar, Brain, Download, Sparkles, Zap, LineChart, PieChart, BarChart, Workflow } from 'lucide-react';
import { motion } from 'framer-motion';

const FeatureCard = ({ icon: Icon, title, description, delay, gradient }: { 
  icon: any, 
  title: string, 
  description: string,
  delay: number,
  gradient: string
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.5 }}
    whileHover={{ scale: 1.02 }}
    className={`p-6 ${gradient} rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 backdrop-blur-sm border border-purple-200/50 dark:border-purple-800/50 transform-gpu`}
  >
    <div className="relative flex flex-col items-center text-center">
      <div className="relative">
        <Icon className="w-10 h-10 sm:w-12 sm:h-12 text-purple-600 dark:text-purple-400 mb-4" />
        <div className="absolute -top-2 -right-2 w-8 h-8 bg-purple-200 dark:bg-purple-800 rounded-full blur-xl opacity-50" />
      </div>
      <h3 className="text-lg sm:text-xl font-semibold mb-2 text-gray-800 dark:text-gray-200">{title}</h3>
      <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">{description}</p>
    </div>
  </motion.div>
);

const FeatureCards = () => {
  const features = [
    {
      icon: FileSpreadsheet,
      title: "Data Analysis",
      description: "Get instant insights about your CSV data with advanced analytics",
      gradient: "bg-gradient-to-br from-purple-50/90 to-indigo-50/90 dark:from-purple-900/90 dark:to-indigo-900/90"
    },
    {
      icon: ChartBar,
      title: "Beautiful Visualizations",
      description: "Transform your data into stunning, interactive charts and graphs",
      gradient: "bg-gradient-to-br from-indigo-50/90 to-blue-50/90 dark:from-indigo-900/90 dark:to-blue-900/90"
    },
    {
      icon: Brain,
      title: "ML Insights",
      description: "Get intelligent suggestions and predictions from your data",
      gradient: "bg-gradient-to-br from-blue-50/90 to-purple-50/90 dark:from-blue-900/90 dark:to-purple-900/90"
    },
    {
      icon: History,
      title: "Analysis History",
      description: "Keep track of your previous analyses and export reports",
      gradient: "bg-gradient-to-br from-purple-50/90 to-indigo-50/90 dark:from-purple-900/90 dark:to-indigo-900/90"
    },
    {
      icon: Download,
      title: "Export Options",
      description: "Export your analysis results in various formats",
      gradient: "bg-gradient-to-br from-indigo-50/90 to-blue-50/90 dark:from-indigo-900/90 dark:to-blue-900/90"
    },
    {
      icon: HelpCircle,
      title: "Help & Support",
      description: "Get answers to common questions and learn how to use the tool",
      gradient: "bg-gradient-to-br from-blue-50/90 to-purple-50/90 dark:from-blue-900/90 dark:to-purple-900/90"
    },
    {
      icon: Workflow,
      title: "Automated Workflows",
      description: "Create custom workflows for repeated analysis tasks",
      gradient: "bg-gradient-to-br from-purple-50/90 to-indigo-50/90 dark:from-purple-900/90 dark:to-indigo-900/90"
    },
    {
      icon: Sparkles,
      title: "Smart Features",
      description: "Access advanced features powered by AI technology",
      gradient: "bg-gradient-to-br from-indigo-50/90 to-blue-50/90 dark:from-indigo-900/90 dark:to-blue-900/90"
    }
  ];

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {features.map((feature, index) => (
          <FeatureCard
            key={index}
            icon={feature.icon}
            title={feature.title}
            description={feature.description}
            delay={index * 0.1}
            gradient={feature.gradient}
          />
        ))}
      </div>
    </div>
  );
};

export default FeatureCards;