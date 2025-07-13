
import React from 'react';
import { Button } from "@/components/ui/button";
import { LayoutDashboard, TrendingUp, LineChart, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

interface BusinessDashboardButtonProps {
  setActiveTab: (tab: string) => void;
}

const BusinessDashboardButton = ({ setActiveTab }: BusinessDashboardButtonProps) => {
  const handleClick = () => {
    setActiveTab('business');
    toast.success("Business Analytics Dashboard loaded!", {
      description: "Explore advanced analytics tools and visualizations for your data.",
      duration: 3000
    });
  };

  return (
    <Button 
      variant="outline" 
      className="flex items-center gap-2 bg-gradient-to-r from-white/50 to-blue-50/50 hover:bg-white/80 dark:from-white/5 dark:to-blue-800/10 dark:hover:bg-white/10 transition-all duration-300 animate-fade-in group shadow-sm hover:shadow-md border-blue-200/30 dark:border-blue-700/30"
      onClick={handleClick}
    >
      <div className="flex items-center gap-1 text-blue-600 dark:text-blue-400">
        <LayoutDashboard className="w-4 h-4 group-hover:hidden" />
        <TrendingUp className="w-4 h-4 hidden group-hover:block text-green-500" />
        <LineChart className="w-4 h-4 animate-pulse" />
        <Sparkles className="w-3 h-3 text-amber-500" />
      </div>
      <span>Business Analytics Dashboard</span>
    </Button>
  );
};

export default BusinessDashboardButton;
