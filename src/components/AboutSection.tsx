
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Code2, Brain, Rocket } from 'lucide-react';

const AboutSection = () => {
  return (
    <div className="space-y-8 animate-fade-in">
      <Card className="bg-gradient-to-br from-blue-50/90 to-purple-50/90 dark:from-blue-950/50 dark:to-purple-950/50 shadow-lg hover:shadow-xl transition-shadow duration-300">
        <CardHeader>
          <CardTitle className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            About InsightX
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="prose dark:prose-invert max-w-none">
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              A powerful and intuitive CSV analysis tool designed for seamless EDA, featuring advanced data visualization, 
              responsive design, and interactive data cleaning tools.
            </p>
            
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex flex-col items-center text-center space-y-3 p-4 rounded-lg bg-white/50 dark:bg-gray-800/50">
                <Code2 className="w-10 h-10 text-blue-500" />
                <h3 className="font-semibold text-lg">Advanced Analysis</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Comprehensive data analysis tools for deep insights
                </p>
              </div>
              
              <div className="flex flex-col items-center text-center space-y-3 p-4 rounded-lg bg-white/50 dark:bg-gray-800/50">
                <Brain className="w-10 h-10 text-purple-500" />
                <h3 className="font-semibold text-lg">Smart Features</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Intelligent data processing and analysis capabilities
                </p>
              </div>
              
              <div className="flex flex-col items-center text-center space-y-3 p-4 rounded-lg bg-white/50 dark:bg-gray-800/50">
                <Rocket className="w-10 h-10 text-indigo-500" />
                <h3 className="font-semibold text-lg">User Experience</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Intuitive interface with responsive design
                </p>
              </div>
            </div>

            <div className="mt-8 p-6 rounded-lg bg-white/50 dark:bg-gray-800/50">
              <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
                About the Developer
              </h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                Mohammed Maaz, a passionate and skilled developer, created InsightX to simplify data analysis. 
                With expertise in data science and a focus on user-friendly designs, he ensures every feature is 
                crafted to deliver efficiency and insight. His dedication to innovation and problem-solving reflects 
                in this robust and engaging tool.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AboutSection;
