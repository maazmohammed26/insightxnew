import React, { useEffect, useState, useCallback, useRef } from 'react';
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  ChartPie, BarChart, LineChart, TrendingUp, Database, Layers, 
  Grid2X2, Filter, RefreshCw, Clock, Sparkles, Brain, Target, 
  ArrowUpRight, WifiOff, LayoutDashboard, Workflow, Zap, Settings, FileText, Sliders, Save
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import TrendAnalysis from './TrendAnalysis';
import MetricsOverview from './MetricsOverview';
import AdvancedAnalytics from './AdvancedAnalytics';
import DataSorting from './DataSorting';
import BusinessInsights from '../BusinessInsights';
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from 'sonner';
import DashboardManagement from './DashboardManagement';

interface BusinessDashboardProps {
  data: any[];
  columns: string[];
}

const BusinessDashboard = ({ data, columns }: BusinessDashboardProps) => {
  const [refreshKey, setRefreshKey] = useState(0);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [isLoading, setIsLoading] = useState(true);
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  const [activeTab, setActiveTab] = useState("overview");
  const [isMobile, setIsMobile] = useState(false);
  const tabsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOnlineStatus = () => {
      setIsOnline(navigator.onLine);
    };

    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };

    window.addEventListener('online', handleOnlineStatus);
    window.addEventListener('offline', handleOnlineStatus);
    window.addEventListener('resize', handleResize);
    
    setIsOnline(navigator.onLine);
    handleResize();

    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('online', handleOnlineStatus);
      window.removeEventListener('offline', handleOnlineStatus);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleRefresh = useCallback(() => {
    setIsLoading(true);
    setRefreshKey(prev => prev + 1);
    setLastUpdated(new Date());
    
    setTimeout(() => {
      setIsLoading(false);
      toast.success('Dashboard refreshed successfully');
    }, 800);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };

  const featureCards = [
    { icon: BarChart, title: 'Real-time Metrics', description: 'Live data analysis', color: 'text-blue-500' },
    { icon: Brain, title: 'AI Insights', description: 'Smart predictions', color: 'text-purple-500' },
    { icon: Target, title: 'Performance Tracking', description: 'Goal monitoring', color: 'text-green-500' },
    { icon: Workflow, title: 'Workflow Integration', description: 'Seamless processes', color: 'text-amber-500' },
    { icon: FileText, title: 'Report Generation', description: 'Auto documentation', color: 'text-cyan-500' },
    { icon: Zap, title: 'Quick Actions', description: 'Instant insights', color: 'text-rose-500' },
  ];

  const tabItems = [
    { id: "overview", label: "Overview", icon: Grid2X2, color: "from-blue-500 to-blue-600" },
    { id: "trends", label: "Trends", icon: TrendingUp, color: "from-purple-500 to-purple-600" },
    { id: "advanced", label: "Advanced", icon: Layers, color: "from-green-500 to-green-600" },
    { id: "insights", label: "Insights", icon: ChartPie, color: "from-amber-500 to-amber-600" }
  ];

  return (
    <ScrollArea className="h-full pr-4 theme-scrollbar" hideScrollbar={false}>
      <motion.div 
        className="space-y-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Database className="w-5 h-5 text-purple-500 animate-pulse" />
            <span className="text-sm text-muted-foreground">
              Last updated: {lastUpdated.toLocaleTimeString()}
            </span>
          </div>
          <Button 
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            className="rounded-full w-8 h-8 p-0"
            disabled={!isOnline}
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </Button>
        </div>

        {!isOnline && (
          <div className="bg-yellow-100 dark:bg-yellow-900/30 border border-yellow-300 dark:border-yellow-700 p-4 rounded-lg mb-4 flex items-center gap-3">
            <WifiOff className="h-5 w-5 text-yellow-700 dark:text-yellow-400 shrink-0" />
            <p className="text-yellow-700 dark:text-yellow-400 text-sm">
              You are currently offline. Some features may not work properly until you reconnect to the internet.
            </p>
          </div>
        )}

        <DashboardManagement isMobile={isMobile} />

        <Card className="p-4 bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-950 dark:to-indigo-950 shadow-lg border border-purple-100 dark:border-purple-900/20">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div 
              ref={tabsRef}
              className="flex items-center justify-center gap-2 mb-6 overflow-x-auto py-2 theme-scrollbar"
            >
              {tabItems.map((tab) => (
                <motion.div
                  key={tab.id}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="shrink-0"
                >
                  <motion.button
                    onClick={() => setActiveTab(tab.id)}
                    className={`
                      relative rounded-xl p-2 sm:p-3 flex flex-col items-center gap-1 sm:gap-2
                      transition-all duration-300 overflow-hidden min-w-[75px] sm:min-w-[90px]
                      ${activeTab === tab.id 
                        ? `bg-gradient-to-r ${tab.color} shadow-lg text-white` 
                        : 'bg-white/60 dark:bg-gray-800/40 hover:bg-white/80 dark:hover:bg-gray-800/60 text-gray-700 dark:text-gray-300'
                      }
                    `}
                  >
                    <tab.icon className={`w-5 h-5 ${activeTab === tab.id ? 'text-white' : ''}`} />
                    <span className="font-medium text-xs sm:text-sm whitespace-nowrap">{tab.label}</span>
                    
                    {activeTab === tab.id && (
                      <motion.div 
                        className="absolute bottom-0 left-0 w-full h-1 bg-white/30"
                        layoutId="activeTab"
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      />
                    )}
                  </motion.button>
                </motion.div>
              ))}
            </div>

            <motion.div 
              className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 mb-6"
              variants={containerVariants}
            >
              {featureCards.map((card, index) => (
                <motion.div 
                  key={index}
                  variants={itemVariants}
                  whileHover={{ scale: 1.05, y: -5 }}
                  transition={{ duration: 0.2 }}
                >
                  <Card className="p-3 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm shadow-sm hover:shadow-md border border-white/10 dark:border-white/5 h-full flex flex-col justify-between">
                    <div className="flex items-center justify-between">
                      <card.icon className={`w-5 h-5 ${card.color}`} />
                      <ArrowUpRight className="w-3 h-3 text-gray-400" />
                    </div>
                    <div>
                      <h3 className="mt-2 font-semibold text-xs sm:text-sm">{card.title}</h3>
                      <p className="text-xs text-muted-foreground hidden sm:block">{card.description}</p>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </motion.div>

            <motion.div 
              className={`flex ${isMobile ? 'flex-col space-y-3' : 'flex-row space-x-3'} mb-6`}
              variants={containerVariants}
            >
              <motion.div 
                variants={itemVariants}
                className={`${isMobile ? 'w-full' : 'w-2/3'}`}
              >
                <Card className="h-full p-4 bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-950/50 dark:to-indigo-950/50 border border-purple-100 dark:border-purple-900/30">
                  <div className="flex items-start gap-3">
                    <LayoutDashboard className="w-5 h-5 text-purple-600 dark:text-purple-400 mt-1 shrink-0" />
                    <div className="text-left">
                      <h3 className="font-semibold">Interactive Dashboard Tools</h3>
                      <p className="text-sm text-muted-foreground mb-3">Customize and analyze your data with powerful tools</p>
                      <div className="flex flex-wrap gap-2">
                        {['Visualization', 'Filtering', 'Reporting', 'Sharing'].map((tool, i) => (
                          <span key={i} className="text-xs bg-white/50 dark:bg-gray-800/50 px-2 py-1 rounded-full border border-purple-100 dark:border-purple-800/30">
                            {tool}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
              
              <motion.div variants={itemVariants} className={`${isMobile ? 'w-full' : 'w-1/3'}`}>
                <Card className="h-full p-4 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/50 dark:to-cyan-950/50 border border-blue-100 dark:border-blue-900/30">
                  <div className="flex items-start gap-3">
                    <Settings className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-1 shrink-0" />
                    <div className="text-left">
                      <h3 className="font-semibold">Dashboard Settings</h3>
                      <p className="text-sm text-muted-foreground mb-3">Configure your workspace preferences</p>
                      <Button variant="outline" size="sm" className="text-xs w-full">
                        Configure
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            </motion.div>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <TabsContent value="overview" className="mt-4 space-y-4">
                  <ScrollArea className="h-[60vh] custom-scrollbar-thin" 
                    style={{
                      scrollbarWidth: 'thin',
                      scrollbarColor: '#9b87f5 transparent'
                    }}
                  >
                    {isLoading ? (
                      <div className="space-y-6">
                        <Skeleton className="h-[200px] w-full rounded-xl" />
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <Skeleton className="h-[120px] rounded-xl" />
                          <Skeleton className="h-[120px] rounded-xl" />
                        </div>
                        <Skeleton className="h-[180px] w-full rounded-xl" />
                      </div>
                    ) : (
                      <MetricsOverview key={refreshKey} data={data} columns={columns} />
                    )}
                  </ScrollArea>
                </TabsContent>

                <TabsContent value="trends" className="mt-4 space-y-4">
                  <ScrollArea className="h-[60vh] custom-scrollbar-thin" 
                    style={{
                      scrollbarWidth: 'thin',
                      scrollbarColor: '#9b87f5 transparent'
                    }}
                  >
                    {isLoading ? (
                      <div className="space-y-6">
                        <Skeleton className="h-[300px] w-full rounded-xl" />
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          <Skeleton className="h-[100px] rounded-xl" />
                          <Skeleton className="h-[100px] rounded-xl" />
                          <Skeleton className="h-[100px] rounded-xl" />
                        </div>
                      </div>
                    ) : (
                      <TrendAnalysis key={refreshKey} data={data} columns={columns} />
                    )}
                  </ScrollArea>
                </TabsContent>

                <TabsContent value="advanced" className="mt-4 space-y-4">
                  <ScrollArea className="h-[60vh] custom-scrollbar-thin" 
                    style={{
                      scrollbarWidth: 'thin',
                      scrollbarColor: '#9b87f5 transparent'
                    }}
                  >
                    {isLoading ? (
                      <div className="space-y-6">
                        <Skeleton className="h-[250px] w-full rounded-xl" />
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <Skeleton className="h-[180px] rounded-xl" />
                          <Skeleton className="h-[180px] rounded-xl" />
                        </div>
                      </div>
                    ) : (
                      <AdvancedAnalytics key={refreshKey} data={data} columns={columns} />
                    )}
                  </ScrollArea>
                </TabsContent>

                <TabsContent value="insights" className="mt-4 space-y-4">
                  <ScrollArea className="h-[60vh] custom-scrollbar-thin" 
                    style={{
                      scrollbarWidth: 'thin',
                      scrollbarColor: '#9b87f5 transparent'
                    }}
                  >
                    {isLoading ? (
                      <div className="space-y-6">
                        <Skeleton className="h-[220px] w-full rounded-xl" />
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <Skeleton className="h-[150px] rounded-xl" />
                          <Skeleton className="h-[150px] rounded-xl" />
                          <Skeleton className="h-[150px] rounded-xl" />
                          <Skeleton className="h-[150px] rounded-xl" />
                        </div>
                      </div>
                    ) : (
                      <BusinessInsights key={refreshKey} data={data} columns={columns} />
                    )}
                  </ScrollArea>
                </TabsContent>
              </motion.div>
            </AnimatePresence>
          </Tabs>
        </Card>
      </motion.div>
    </ScrollArea>
  );
};

export default BusinessDashboard;
