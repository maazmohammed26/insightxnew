import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Share2, Undo, Redo, LayoutGrid, Table, ChartBar, PieChart } from 'lucide-react';
import { toast } from 'sonner';

export const DashboardControls = () => {
  const handleAddWidget = (type: string) => {
    toast.success(`New ${type} widget added`);
  };

  return (
    <Card className="p-4 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
      <div className="flex flex-wrap gap-4 justify-between items-center">
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            onClick={() => handleAddWidget('chart')}
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-none"
          >
            <ChartBar className="w-4 h-4 mr-2" />
            Add Chart
          </Button>
          <Button 
            variant="outline" 
            onClick={() => handleAddWidget('table')}
            className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white border-none"
          >
            <Table className="w-4 h-4 mr-2" />
            Add Table
          </Button>
          <Button 
            variant="outline" 
            onClick={() => handleAddWidget('metric')}
            className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white border-none"
          >
            <PieChart className="w-4 h-4 mr-2" />
            Add KPI
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="hover:bg-gray-100 dark:hover:bg-gray-700">
            <Undo className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" className="hover:bg-gray-100 dark:hover:bg-gray-700">
            <Redo className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
};