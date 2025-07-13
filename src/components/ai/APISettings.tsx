
import React from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { ScrollArea } from "@/components/ui/scroll-area";

interface APISettingsProps {
  onSaveSettings: () => void;
  onCancel: () => void;
}

const APISettings: React.FC<APISettingsProps> = ({
  onSaveSettings,
  onCancel
}) => {
  return (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: 'auto', opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      className="overflow-hidden mb-4"
    >
      <Card className="p-4 bg-gradient-to-br from-purple-50/90 to-indigo-50/90 dark:from-purple-900/20 dark:to-indigo-900/20 border border-purple-200/50 dark:border-purple-800/50 rounded-xl">
        <h3 className="font-medium mb-2 flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-purple-500" />
          AI Configuration
        </h3>
        <ScrollArea className="max-h-[200px] pr-2">
          <div className="space-y-3">
            <p className="text-sm">
              Your AI assistant is powered by Google's Gemini 2.0 Flash model.
              It's ready to help you analyze your data and provide valuable insights.
            </p>
            <p className="text-xs text-muted-foreground mb-2">
              The assistant uses advanced AI to understand your data context and answer your questions accurately.
            </p>
            
            <div className="grid grid-cols-2 gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={onCancel}
                className="border-purple-200 dark:border-purple-800/50"
              >
                Cancel
              </Button>
              <Button 
                variant="default" 
                size="sm"
                onClick={onSaveSettings}
                className="bg-purple-600 hover:bg-purple-700"
              >
                Start Using AI
              </Button>
            </div>
          </div>
        </ScrollArea>
      </Card>
    </motion.div>
  );
};

export default APISettings;
