
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Brain, 
  Sparkles, 
  TrendingUp, 
  Gauge, 
  Search, 
  LineChart, 
  BarChart, 
  PieChart,
  ListFilter,
  Table,
  Lightbulb,
  AlertCircle,
  Database
} from 'lucide-react';
import { motion } from 'framer-motion';

interface AISuggestionsProps {
  onSuggestionClick: (suggestion: string) => void;
  data: any[];
  columns: string[];
}

const AISuggestions = ({ onSuggestionClick, data, columns }: AISuggestionsProps) => {
  // Generate suggestions based on the dataset
  const getSuggestions = () => {
    const generalSuggestions = [
      {
        text: "Summarize my data",
        icon: Brain,
        prompt: "Please provide a comprehensive summary of my dataset.",
      },
      {
        text: "Find correlations",
        icon: TrendingUp,
        prompt: "Analyze my data and identify any significant correlations between variables.",
      },
      {
        text: "Data quality check",
        icon: Gauge,
        prompt: "Check my data for quality issues like missing values, outliers, or inconsistencies.",
      },
      {
        text: "Recommend visualizations",
        icon: LineChart,
        prompt: "What are the best visualizations to understand the patterns in my data?",
      }
    ];

    // Add more advanced suggestions
    const advancedSuggestions = [
      {
        text: "Identify outliers",
        icon: AlertCircle,
        prompt: "Can you detect and analyze outliers in my numerical columns?",
      },
      {
        text: "Predict trends",
        icon: TrendingUp,
        prompt: "Based on this data, what future trends might we expect to see?",
      },
      {
        text: "Segment the data",
        icon: ListFilter,
        prompt: "How could I segment this data into meaningful groups?",
      },
      {
        text: "SQL query help",
        icon: Database,
        prompt: "Give me some SQL queries I could use to analyze this kind of data.",
      }
    ];
    
    // Add data-specific suggestions if we have data
    const dataSpecificSuggestions = [];
    
    if (data.length > 0 && columns.length > 0) {
      const numericColumns = columns.filter(col => 
        !isNaN(Number(data[0][col])) || 
        (typeof data[0][col] === 'string' && !isNaN(Number(data[0][col])))
      );
      
      const categoricalColumns = columns.filter(col => 
        isNaN(Number(data[0][col])) || 
        (typeof data[0][col] === 'string' && isNaN(Number(data[0][col])))
      );
      
      if (numericColumns.length >= 2) {
        dataSpecificSuggestions.push({
          text: `Compare ${numericColumns[0]} & ${numericColumns[1]}`,
          icon: BarChart,
          prompt: `What's the relationship between ${numericColumns[0]} and ${numericColumns[1]}?`,
        });
      }
      
      if (categoricalColumns.length >= 1 && numericColumns.length >= 1) {
        dataSpecificSuggestions.push({
          text: `${categoricalColumns[0]} breakdown`,
          icon: PieChart,
          prompt: `Show me a breakdown of ${numericColumns[0]} by different ${categoricalColumns[0]} values.`,
        });
      }
      
      if (categoricalColumns.length >= 2) {
        dataSpecificSuggestions.push({
          text: `${categoricalColumns[0]} vs ${categoricalColumns[1]}`,
          icon: Table,
          prompt: `Analyze the relationship between ${categoricalColumns[0]} and ${categoricalColumns[1]}.`,
        });
      }
      
      if (numericColumns.length >= 3) {
        dataSpecificSuggestions.push({
          text: `${numericColumns[0]} factors`,
          icon: Lightbulb,
          prompt: `What factors most influence ${numericColumns[0]} in this dataset?`,
        });
      }
    }
    
    // Combine all suggestions but limit to a reasonable number
    const allSuggestions = [...generalSuggestions, ...dataSpecificSuggestions, ...advancedSuggestions];
    return allSuggestions.slice(0, 12); // Limit to 12 suggestions total
  };

  const suggestions = getSuggestions();

  return (
    <Card className="bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-950/20 dark:to-indigo-950/20 border-none shadow-md">
      <CardContent className="p-4">
        <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-purple-500" />
          AI Suggestions
        </h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {suggestions.map((suggestion, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              whileHover={{ scale: 1.02 }}
            >
              <Button
                variant="outline"
                className="w-full justify-start h-auto py-2 text-left flex items-center gap-2 hover:bg-purple-100/50 dark:hover:bg-purple-900/20 transition-all duration-200"
                onClick={() => onSuggestionClick(suggestion.prompt)}
              >
                <suggestion.icon className="h-4 w-4 text-purple-500 flex-shrink-0" />
                <span className="text-sm truncate">{suggestion.text}</span>
              </Button>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default AISuggestions;
