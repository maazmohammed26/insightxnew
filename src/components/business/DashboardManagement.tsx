
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Sliders, Workflow, Save, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';
import { ScrollArea } from '@/components/ui/scroll-area';

interface DashboardManagementProps {
  isMobile: boolean;
}

interface DashboardOption {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  description?: string; // Optional description
}

const DashboardManagement = ({ isMobile }: DashboardManagementProps) => {
  const dashboardManagementOptions: DashboardOption[] = [
    { 
      id: "tools", 
      label: "Dashboard Tools", 
      icon: Sliders,
      description: "Create, customize and manage your dashboard tools"
    },
    { 
      id: "flow", 
      label: "Process Flow", 
      icon: Workflow,
      description: "Design data flow processes and automation"
    },
    { 
      id: "saved", 
      label: "Saved Dashboards", 
      icon: Save,
      description: "Access your previously saved dashboard layouts"
    }
  ];

  const showComingSoonMessage = () => {
    toast.info("Coming soon! We're working on new features to enhance your data experience.", {
      description: "Our team is developing advanced analytics capabilities for business insights.",
      duration: 5000
    });
  };

  return (
    <Card className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 border border-blue-100 dark:border-blue-900/20 shadow-md">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg text-center">Dashboard Management Center</CardTitle>
        <p className="text-sm text-center text-muted-foreground">Create, manage, and access interactive dashboards for your data analysis</p>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-full max-h-[300px] pr-2">
          <div className="flex flex-col gap-3">
            {dashboardManagementOptions.map((option) => (
              <motion.button
                key={option.id}
                className="flex flex-col items-start justify-center gap-1 p-4 w-full bg-gradient-to-r from-white/90 to-white/70 dark:from-gray-800/60 dark:to-gray-800/40 hover:from-blue-50 hover:to-indigo-50 dark:hover:from-blue-900/30 dark:hover:to-indigo-900/30 rounded-lg border border-blue-100 dark:border-blue-800/20 transition-all duration-200 shadow-sm hover:shadow-md"
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={showComingSoonMessage}
              >
                <div className="flex items-center gap-3 w-full">
                  <div className="bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-800/40 dark:to-indigo-800/40 p-2.5 rounded-md shadow-inner">
                    <option.icon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="flex flex-col items-start flex-1">
                    <span className="font-medium text-blue-800 dark:text-blue-300">{option.label}</span>
                    {option.description && (
                      <span className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2">{option.description}</span>
                    )}
                  </div>
                  <div className="ml-auto bg-blue-500/10 dark:bg-blue-400/10 rounded-full p-1 transition-all group-hover:bg-blue-500/20">
                    <ChevronRight className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default DashboardManagement;
