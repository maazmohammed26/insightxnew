
import React from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronUp, ChevronDown, Info, CheckCircle2, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { AIServiceOptions } from './types';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ScrollArea } from "@/components/ui/scroll-area";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

interface ModelOptionsProps {
  aiOptions: AIServiceOptions;
  onOptionsChange: (options: Partial<AIServiceOptions>) => void;
  onToggle: () => void;
  showOptions: boolean;
}

const ModelOptions: React.FC<ModelOptionsProps> = ({
  aiOptions,
  onOptionsChange,
  onToggle,
  showOptions
}) => {
  if (!showOptions) {
    return (
      <div className="flex items-center justify-between px-2 mb-4">
        <div className="text-sm text-muted-foreground">
          {/* Dynamic data info comes from parent */}
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-xs"
          onClick={onToggle}
        >
          Show Options
          <ChevronDown className="h-3 w-3 ml-1" />
        </Button>
      </div>
    );
  }

  const modelOptions = [
    {
      id: 'gemini-2.0-flash',
      name: 'Gemini 2.0 Flash',
      description: 'Fast responses, good for quick analysis',
      icon: <Sparkles className="h-4 w-4 text-amber-500" />
    },
    {
      id: 'gemini-2.0-pro',
      name: 'Gemini 2.0 Pro',
      description: 'More detailed analysis, better understanding',
      icon: <Sparkles className="h-4 w-4 text-purple-500" />
    },
    {
      id: 'gemini-2.0-ultra',
      name: 'Gemini 2.0 Ultra',
      description: 'Highest quality responses for complex tasks',
      icon: <Sparkles className="h-4 w-4 text-blue-500" />
    }
  ];

  return (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: 'auto', opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      className="overflow-hidden mb-4"
    >
      <Card className="p-3 bg-gradient-to-br from-gray-50 to-white dark:from-gray-800/70 dark:to-gray-900/70 border border-gray-200 dark:border-gray-700/50 shadow-md">
        <div className="mb-3 border-b border-gray-200 dark:border-gray-700 pb-2">
          <h3 className="text-sm font-semibold flex items-center">
            <Sparkles className="h-4 w-4 mr-1 text-purple-500" />
            AI Assistant Options
          </h3>
        </div>
        
        <ScrollArea className="pr-3 max-h-[250px] theme-scrollbar">
          <div className="grid grid-cols-1 gap-4 text-sm px-1">
            <div>
              <label className="block text-xs mb-2 flex items-center justify-between">
                <span className="font-medium">Model Selection</span>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-3 w-3 text-muted-foreground cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-xs max-w-[250px]">
                        Select a Gemini model. Different models offer different capabilities and performance.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </label>
              <RadioGroup 
                value={aiOptions.model} 
                onValueChange={(value: string) => {
                  // Type assertion to ensure the value matches the expected type
                  const modelValue = value as "gemini-2.0-flash" | "gemini-2.0-pro" | "gemini-2.0-ultra";
                  onOptionsChange({model: modelValue});
                }}
                className="flex flex-col gap-2"
              >
                {modelOptions.map((model) => (
                  <div key={model.id} className={`flex items-center space-x-2 border p-2 rounded-lg cursor-pointer transition-colors ${
                    aiOptions.model === model.id 
                      ? 'bg-purple-100 dark:bg-purple-900/30 border-purple-300 dark:border-purple-700' 
                      : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-750'
                  }`}>
                    <RadioGroupItem value={model.id} id={model.id} className="sr-only" />
                    <Label htmlFor={model.id} className="flex items-center justify-between w-full cursor-pointer">
                      <div className="flex items-center gap-2">
                        {model.icon}
                        <div className="flex flex-col">
                          <span className="font-medium">{model.name}</span>
                          <span className="text-xs text-muted-foreground">{model.description}</span>
                        </div>
                      </div>
                      {aiOptions.model === model.id && (
                        <CheckCircle2 className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                      )}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
            
            <div className="py-2">
              <label className="block text-xs mb-2 flex items-center justify-between font-medium">
                <span>Temperature</span>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-3 w-3 text-muted-foreground cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-xs max-w-[200px]">
                        Controls randomness: lower values are more precise, higher values more creative.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </label>
              <Slider 
                min={0} 
                max={1} 
                step={0.1}
                value={[aiOptions.temperature]}
                onValueChange={(value) => onOptionsChange({temperature: value[0]})}
                className="my-2"
              />
              <div className="flex justify-between text-xs">
                <span>Precise</span>
                <span className="font-medium text-purple-600 dark:text-purple-400">{aiOptions.temperature}</span>
                <span>Creative</span>
              </div>
            </div>
          </div>
        </ScrollArea>
        
        <div className="flex justify-between mt-3 pt-2 border-t border-gray-200 dark:border-gray-700">
          <Button 
            variant="outline" 
            size="sm" 
            className="text-xs"
            onClick={() => onOptionsChange({temperature: 0.7, model: 'gemini-2.0-flash'})}
          >
            Reset to Default
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-xs"
            onClick={onToggle}
          >
            Hide Options
            <ChevronUp className="h-3 w-3 ml-1" />
          </Button>
        </div>
      </Card>
    </motion.div>
  );
};

export default ModelOptions;
