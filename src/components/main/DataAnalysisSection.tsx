
import React, { useState, lazy, Suspense, useTransition, useEffect, useRef, memo } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger, TabsScrollable } from '@/components/ui/tabs';
import { motion, AnimatePresence } from 'framer-motion';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from "@/components/ui/button";
import { Maximize2, Minimize2, WifiOff } from 'lucide-react';
import PageHeader from '../header/PageHeader';
import LoadingState from '../loading/LoadingState';
import { 
  Activity, AlertTriangle, BarChart3, 
  Database, Signal, TrendingUp, Gauge,
  History, FileWarning, AlertCircle, Loader2
} from 'lucide-react';
import AIChat from '../ai/AIChat';
import { AIFloatingButton } from '../ai/AIButtons';

// Lazy load components with better performance
const CSVScore = lazy(() => import('../CSVScore'));
const DataSummary = lazy(() => import('../DataSummary'));
const MLInsights = lazy(() => import('../MLInsights'));
const DataVisualization = lazy(() => import('../DataVisualization'));
const MLSuggestions = lazy(() => import('../MLSuggestions'));
const ProblemsSection = lazy(() => import('../ProblemsSection'));
const SolutionsSection = lazy(() => import('../SolutionsSection'));
const DataCleaning = lazy(() => import('../DataCleaning'));
const RawDataPreview = lazy(() => import('../RawDataPreview'));
const ExportSection = lazy(() => import('../ExportSection'));
const BusinessDashboard = lazy(() => import('../business/BusinessDashboard'));
const CustomDashboard = lazy(() => import('../dashboard/CustomDashboard'));
const AIDataInsightsComponent = lazy(() => import('../ai/AIDataInsights'));

const TabLoader = memo(() => (
  <div className="flex items-center justify-center p-8 min-h-[400px]">
    <div className="flex flex-col items-center gap-4">
      <Loader2 className="w-8 h-8 animate-spin text-primary" />
      <p className="text-sm text-muted-foreground">Loading content...</p>
    </div>
  </div>
));

interface DataAnalysisSectionProps {
  fileName: string;
  onNewUpload: () => void;
  isLoading: boolean;
  data: any[];
  columns: string[];
}

const DataAnalysisSection = memo(({ fileName, onNewUpload, isLoading, data, columns }: DataAnalysisSectionProps) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isPending, startTransition] = useTransition();
  const [lastUpdate] = useState(new Date());
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  const [showAIChat, setShowAIChat] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleOnlineStatus = () => setIsOnline(navigator.onLine);
    const handleResize = () => setIsMobile(window.innerWidth < 768);

    window.addEventListener('online', handleOnlineStatus);
    window.addEventListener('offline', handleOnlineStatus);
    window.addEventListener('resize', handleResize);
    
    handleResize();
    
    return () => {
      window.removeEventListener('online', handleOnlineStatus);
      window.removeEventListener('offline', handleOnlineStatus);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleTabChange = (value: string) => {
    startTransition(() => {
      setActiveTab(value);
    });
  };

  const contentVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.2 } },
    exit: { opacity: 0, y: -10, transition: { duration: 0.15 } }
  };

  const toggleFullscreen = () => {
    const element = document.querySelector('[data-fullscreen="container"]');
    if (!element) return;
    
    if (!document.fullscreenElement) {
      element.requestFullscreen?.().catch(err => {
        console.error(`Error attempting to enable full-screen mode: ${err.message}`);
      });
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.().catch(err => {
        console.error(`Error attempting to exit full-screen mode: ${err.message}`);
      });
      setIsFullscreen(false);
    }
  };

  const tabItems = [
    { id: 'overview', label: 'Overview', icon: Gauge, color: 'from-blue-500 to-indigo-600' },
    { id: 'analysis', label: 'Analysis', icon: BarChart3, color: 'from-indigo-500 to-purple-600' },
    { id: 'quality', label: 'Quality', icon: FileWarning, color: 'from-purple-500 to-pink-600' },
    { id: 'data', label: 'Data', icon: Database, color: 'from-pink-500 to-rose-600' },
    { id: 'business', label: 'Business', icon: TrendingUp, color: 'from-rose-500 to-orange-600' },
    { id: 'dashboard', label: 'Dashboard', icon: Activity, color: 'from-orange-500 to-amber-600' },
  ];

  return (
    <div className="bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-900 dark:to-slate-800 min-h-screen">
      {!isOnline && (
        <div className="bg-yellow-100 dark:bg-yellow-900/30 border border-yellow-300 dark:border-yellow-700 p-3 sm:p-4 rounded-lg mb-4 flex items-center gap-3 mx-2 sm:mx-0">
          <WifiOff className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-700 dark:text-yellow-400 shrink-0" />
          <p className="text-yellow-700 dark:text-yellow-400 text-xs sm:text-sm">
            You are currently offline. Some features may not work properly until you reconnect to the internet.
          </p>
        </div>
      )}

      <div className="space-y-4">
        <div className="flex justify-between items-center px-2 sm:px-0">
          <PageHeader fileName={fileName} onNewUpload={onNewUpload} />
          <AIFloatingButton onClick={() => setShowAIChat(true)} isOpen={showAIChat} />
        </div>
        
        {/* Centered Tab Navigation */}
        <div className="flex justify-center mb-4 sm:mb-6 mx-2 sm:mx-0">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 via-indigo-500/20 to-blue-500/20 dark:from-purple-400/30 dark:via-indigo-400/30 dark:to-blue-400/30 rounded-xl blur-xl opacity-70"></div>
            
            <div className="relative bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-purple-200/50 dark:border-purple-800/30 rounded-xl overflow-hidden shadow-lg">
              <div className="flex items-center justify-center px-2 sm:px-3 py-2 gap-1 sm:gap-2">
                {tabItems.map((tab) => (
                  <motion.div
                    key={tab.id}
                    whileHover={{ scale: isMobile ? 1.01 : 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="shrink-0"
                  >
                    <motion.button
                      onClick={() => handleTabChange(tab.id)}
                      className={`
                        relative flex items-center gap-1 sm:gap-2 px-3 py-2 sm:px-4 sm:py-2.5 
                        min-w-[70px] sm:min-w-[90px] text-center text-xs sm:text-sm rounded-lg
                        transition-all duration-200 focus:outline-none
                        ${activeTab === tab.id 
                          ? `bg-gradient-to-r ${tab.color} text-white shadow-lg` 
                          : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/50 hover:shadow'
                        }
                      `}
                    >
                      {activeTab === tab.id && (
                        <motion.div
                          className={`absolute inset-0 rounded-lg bg-gradient-to-r ${tab.color}`}
                          layoutId="activeTabBackground"
                          initial={false}
                          transition={{
                            type: "spring",
                            stiffness: 300,
                            damping: 30
                          }}
                        />
                      )}
                      
                      <span className="relative z-10 flex items-center justify-center gap-1">
                        <tab.icon className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span className="whitespace-nowrap font-medium">
                          {tab.label}
                        </span>
                      </span>
                    </motion.button>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="px-2 sm:px-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              variants={contentVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="relative"
            >
              <div className="relative" data-fullscreen="container">
                <Button
                  variant="outline"
                  size="icon"
                  className="absolute top-2 right-2 sm:top-4 sm:right-4 z-50 w-8 h-8 sm:w-10 sm:h-10"
                  onClick={toggleFullscreen}
                >
                  {isFullscreen ? (
                    <Minimize2 className="h-3 w-3 sm:h-4 sm:w-4" />
                  ) : (
                    <Maximize2 className="h-3 w-3 sm:h-4 sm:w-4" />
                  )}
                </Button>

                <Tabs value={activeTab} className="w-full">
                  <TabsContent value="overview" className="mt-0">
                    <Card className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border-none shadow-lg">
                      <CardContent className="p-3 sm:p-6">
                        <div className="space-y-4 sm:space-y-6">
                          <Suspense fallback={<TabLoader />}>
                            <CSVScore data={data} columns={columns} />
                            <DataSummary data={data} columns={columns} />
                            <MLInsights data={data} columns={columns} />
                            <AIDataInsightsComponent data={data} columns={columns} />
                          </Suspense>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="analysis" className="mt-0">
                    <Card className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border-none shadow-lg">
                      <CardContent className="p-3 sm:p-6">
                        <div className="space-y-4 sm:space-y-6">
                          <Suspense fallback={<TabLoader />}>
                            <DataVisualization data={data} columns={columns} />
                            <MLSuggestions data={data} columns={columns} />
                          </Suspense>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="quality" className="mt-0">
                    <Card className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border-none shadow-lg">
                      <CardContent className="p-3 sm:p-6">
                        <div className="space-y-4 sm:space-y-6">
                          <Suspense fallback={<TabLoader />}>
                            <ProblemsSection data={data} columns={columns} />
                            <SolutionsSection data={data} columns={columns} />
                            <DataCleaning data={data} columns={columns} />
                          </Suspense>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="data" className="mt-0">
                    <Card className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border-none shadow-lg">
                      <CardContent className="p-3 sm:p-6">
                         <div className="space-y-6 sm:space-y-8">
                           <Suspense fallback={<TabLoader />}>
                             <RawDataPreview 
                               data={data} 
                               columns={columns}
                               onDataChange={(newData) => {
                                 // Update the data state if needed
                                 console.log('Data updated:', newData);
                               }}
                             />
                             <ExportSection data={data} columns={columns} fileName={fileName} />
                           </Suspense>
                         </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="business" className="mt-0">
                    <Card className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border-none shadow-lg">
                      <CardContent className="p-3 sm:p-6">
                        <Suspense fallback={<TabLoader />}>
                          <BusinessDashboard data={data} columns={columns} />
                        </Suspense>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="dashboard" className="mt-0">
                    <Card className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border-none shadow-lg">
                      <CardContent className="p-3 sm:p-6">
                        <Suspense fallback={<TabLoader />}>
                          <CustomDashboard data={data} columns={columns} />
                        </Suspense>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
      
      <AIChat 
        open={showAIChat} 
        onOpenChange={setShowAIChat} 
        data={data} 
        columns={columns} 
      />
    </div>
  );
});

DataAnalysisSection.displayName = 'DataAnalysisSection';

export default DataAnalysisSection;
