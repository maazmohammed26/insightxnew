
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Settings, Palette, Info, Shield, Zap } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import ThemeSettings from './settings/ThemeSettings';
import AdvancedSettings from './settings/AdvancedSettings';
import PerformanceSettings from './settings/PerformanceSettings';
import ProjectOverview from './settings/ProjectOverview';
import { motion } from 'framer-motion';

const SettingsDialog = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              data-settings-trigger
              className="h-8 w-8 sm:h-10 sm:w-10 hover:bg-gradient-to-r hover:from-gray-100 hover:to-slate-100 dark:hover:from-gray-900/20 dark:hover:to-slate-900/20 transition-all duration-300 rounded-full hover:scale-110"
            >
              <motion.div
                whileHover={{ rotate: 180 }}
                transition={{ duration: 0.3 }}
              >
                <Settings className="h-4 w-4 sm:h-5 sm:w-5" />
              </motion.div>
            </Button>
          </TooltipTrigger>
          <TooltipContent>Settings & Configuration</TooltipContent>
        </Tooltip>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
            Settings & Configuration
          </DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="theme" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-4">
            <TabsTrigger value="theme" className="flex items-center gap-2">
              <Palette className="h-4 w-4" />
              <span className="hidden sm:inline">Theme</span>
            </TabsTrigger>
            <TabsTrigger value="performance" className="flex items-center gap-2">
              <Zap className="h-4 w-4" />
              <span className="hidden sm:inline">Performance</span>
            </TabsTrigger>
            <TabsTrigger value="advanced" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              <span className="hidden sm:inline">Advanced</span>
            </TabsTrigger>
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <Info className="h-4 w-4" />
              <span className="hidden sm:inline">Overview</span>
            </TabsTrigger>
          </TabsList>
          
          <ScrollArea className="h-[500px] w-full">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <TabsContent value="theme" className="mt-0">
                <ThemeSettings />
              </TabsContent>
              
              <TabsContent value="performance" className="mt-0">
                <PerformanceSettings />
              </TabsContent>
              
              <TabsContent value="advanced" className="mt-0">
                <AdvancedSettings />
              </TabsContent>
              
              <TabsContent value="overview" className="mt-0">
                <ProjectOverview />
              </TabsContent>
            </motion.div>
          </ScrollArea>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default SettingsDialog;
