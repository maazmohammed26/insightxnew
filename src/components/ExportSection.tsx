
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FileDown, MessageCircle, Share2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ExportButtons from './export/ExportButtons';
import DiscordShareDialog from './export/DiscordShareDialog';
import { Button } from '@/components/ui/button';

interface ExportSectionProps {
  data: any[];
  columns: string[];
  fileName: string;
}

const ExportSection = ({ data, columns, fileName }: ExportSectionProps) => {
  const [discordDialogOpen, setDiscordDialogOpen] = useState(false);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <Card className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950 dark:to-purple-950 border-indigo-100 dark:border-indigo-900/30 shadow-md hover:shadow-lg transition-all duration-300">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="flex items-center gap-2">
            <FileDown className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
            Export Analysis
          </CardTitle>
          
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              onClick={() => setDiscordDialogOpen(true)}
              variant="gradient-purple"
              size="sm"
              className="flex items-center gap-2"
            >
              <MessageCircle className="h-4 w-4" />
              <span className="hidden sm:inline">Share to Community</span>
            </Button>
          </motion.div>
        </CardHeader>
        <CardContent>
          <ExportButtons data={data} columns={columns} fileName={fileName} />
          
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2">
              <FileDown className="h-4 w-4" />
              Export your analysis for offline use
            </p>
            
            <motion.div
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="w-full sm:w-auto"
            >
              <Button
                onClick={() => setDiscordDialogOpen(true)}
                variant="outline"
                size="sm"
                className="w-full sm:w-auto flex items-center gap-2 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 border-indigo-200 dark:border-indigo-800/30 text-indigo-700 dark:text-indigo-300 hover:bg-gradient-to-r hover:from-indigo-100 hover:to-purple-100 dark:hover:from-indigo-900/30 dark:hover:to-purple-900/30"
              >
                <Share2 className="h-4 w-4" />
                Share with InsightX Community
              </Button>
            </motion.div>
          </div>
        </CardContent>
      </Card>

      <DiscordShareDialog
        open={discordDialogOpen}
        onOpenChange={setDiscordDialogOpen}
        data={data}
        columns={columns}
        fileName={fileName}
      />
    </motion.div>
  );
};

export default ExportSection;
