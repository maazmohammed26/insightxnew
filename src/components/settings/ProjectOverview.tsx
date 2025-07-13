
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Code, Database, BarChart3, Brain, Zap, Shield, 
  FileSpreadsheet, GitBranch, Cpu, Globe, Layers,
  BookOpen, Settings, Users, TrendingUp
} from 'lucide-react';
import { motion } from 'framer-motion';

const ProjectOverview = () => {
  const technologies = [
    { name: 'React 18', icon: Code, category: 'Frontend' },
    { name: 'TypeScript', icon: Code, category: 'Language' },
    { name: 'Tailwind CSS', icon: Layers, category: 'Styling' },
    { name: 'Vite', icon: Zap, category: 'Build Tool' },
    { name: 'Framer Motion', icon: Cpu, category: 'Animation' },
    { name: 'Recharts', icon: BarChart3, category: 'Visualization' },
    { name: 'Shadcn/UI', icon: Settings, category: 'Components' },
    { name: 'Papa Parse', icon: FileSpreadsheet, category: 'CSV Parser' },
  ];

  const features = [
    { name: 'CSV Analysis', status: 'Active', icon: FileSpreadsheet },
    { name: 'Data Visualization', status: 'Active', icon: BarChart3 },
    { name: 'Statistical Analysis', status: 'Active', icon: TrendingUp },
    { name: 'Business Intelligence', status: 'Active', icon: Brain },
    { name: 'ML Insights', status: 'Beta', icon: Brain },
    { name: 'Team Collaboration', status: 'Coming Soon', icon: Users },
    { name: 'Cloud Integration', status: 'Coming Soon', icon: Globe },
    { name: 'API Access', status: 'Planned', icon: Database },
  ];

  const algorithms = [
    'Descriptive Statistics (Mean, Median, Mode, Std Dev)',
    'Quartile Analysis (Q1, Q3, IQR)',
    'Correlation Analysis (Pearson Correlation)',
    'Outlier Detection (IQR Method)',
    'Data Quality Scoring (Completeness, Consistency)',
    'Distribution Analysis (Skewness, Range)',
    'Missing Value Detection',
    'Duplicate Row Identification',
  ];

  const workflows = [
    'CSV Upload & Parsing',
    'Data Validation & Cleaning',
    'Statistical Computation',
    'Visualization Generation',
    'Insight Extraction',
    'Report Generation',
    'Export & Sharing',
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <BookOpen className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
        <h3 className="text-lg font-semibold">Project Overview</h3>
      </div>

      <ScrollArea className="h-96">
        <div className="space-y-6 pr-4">
          {/* Technologies */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Code className="h-4 w-4" />
                Technologies & Libraries
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-2">
                {technologies.map((tech, index) => (
                  <motion.div
                    key={tech.name}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center gap-2 p-2 rounded-lg bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900"
                  >
                    <tech.icon className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                    <div>
                      <div className="text-sm font-medium">{tech.name}</div>
                      <Badge variant="secondary" className="text-xs">{tech.category}</Badge>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Features */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Zap className="h-4 w-4" />
                Features Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {features.map((feature, index) => (
                  <motion.div
                    key={feature.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50"
                  >
                    <div className="flex items-center gap-2">
                      <feature.icon className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                      <span className="text-sm">{feature.name}</span>
                    </div>
                    <Badge 
                      variant={
                        feature.status === 'Active' ? 'default' :
                        feature.status === 'Beta' ? 'secondary' :
                        'outline'
                      }
                      className="text-xs"
                    >
                      {feature.status}
                    </Badge>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Algorithms */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Brain className="h-4 w-4" />
                Algorithms & Methods
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {algorithms.map((algorithm, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="text-sm p-2 rounded bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/20 dark:to-purple-950/20 border border-indigo-100 dark:border-indigo-900/30"
                  >
                    • {algorithm}
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Workflow */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <GitBranch className="h-4 w-4" />
                Data Processing Workflow
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {workflows.map((step, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center gap-3 p-2"
                  >
                    <div className="w-6 h-6 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xs flex items-center justify-center font-bold">
                      {index + 1}
                    </div>
                    <span className="text-sm">{step}</span>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </ScrollArea>
    </div>
  );
};

export default ProjectOverview;
