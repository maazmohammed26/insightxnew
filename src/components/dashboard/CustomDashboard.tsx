
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Download, ExternalLink, PanelRightOpen, Database, 
  LineChart, BarChart3, PieChart, ArrowRight, Edit3, Save, 
  Gauge, SparkleIcon, FileSpreadsheet, RefreshCw, Link2, Palette, 
  PanelRight, CheckCircle, FileText, Globe, Play, Settings, 
  DollarSign, BarChart4, Signal, Sliders, LayoutDashboard, 
  Settings2, ChartPie, Lightbulb, ListFilter, ChevronRight, Users2,
  Calendar, TrendingUp, Zap, Workflow, PieChartIcon, Plus
} from 'lucide-react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";

interface CustomDashboardProps {
  data: any[];
  columns: string[];
}

const CustomDashboard = ({ data, columns }: CustomDashboardProps) => {
  const [savedDashboards, setSavedDashboards] = useState(() => {
    const saved = localStorage.getItem('savedDashboards');
    return saved ? JSON.parse(saved) : [];
  });
  const [dashboardUrl, setDashboardUrl] = useState('');
  const [dashboardName, setDashboardName] = useState('');
  const [dashboardType, setDashboardType] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('tools');
  const [isAnimating, setIsAnimating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [animationComplete, setAnimationComplete] = useState(false);
  const [quickSaveUrl, setQuickSaveUrl] = useState('');
  const [quickSaveName, setQuickSaveName] = useState('');
  const [quickSaveType, setQuickSaveType] = useState('Power BI');
  const [showQuickSaveForm, setShowQuickSaveForm] = useState(false);

  useEffect(() => {
    // Animation for progress bar when saving dashboard
    if (isSaving) {
      setProgress(0);
      setIsAnimating(true);
      const timer = setInterval(() => {
        setProgress((prevProgress) => {
          if (prevProgress >= 100) {
            clearInterval(timer);
            setIsAnimating(false);
            setAnimationComplete(true);
            return 100;
          }
          return prevProgress + 5;
        });
      }, 50);
      return () => clearInterval(timer);
    }
  }, [isSaving]);

  // Reset animation complete state when form changes
  useEffect(() => {
    if (animationComplete) {
      setAnimationComplete(false);
    }
  }, [dashboardUrl, dashboardName, dashboardType]);

  const handleSaveDashboard = (isQuickSave = false) => {
    const url = isQuickSave ? quickSaveUrl : dashboardUrl;
    const name = isQuickSave ? quickSaveName : dashboardName;
    const type = isQuickSave ? quickSaveType : dashboardType;

    if (!url || !name || !type) {
      toast.error('Please fill in all fields');
      return;
    }

    setIsSaving(true);
    
    try {
      const newDashboard = {
        id: Date.now().toString(),
        name: name,
        url: url,
        type: type,
        createdAt: new Date().toISOString()
      };
      
      setTimeout(() => {
        const updatedDashboards = [...savedDashboards, newDashboard];
        setSavedDashboards(updatedDashboards);
        localStorage.setItem('savedDashboards', JSON.stringify(updatedDashboards));
        
        toast.success('Dashboard saved successfully');
        
        if (isQuickSave) {
          setQuickSaveUrl('');
          setQuickSaveName('');
          setShowQuickSaveForm(false);
        } else {
          setDashboardUrl('');
          setDashboardName('');
          setActiveTab('saved');
        }
        
        setIsSaving(false);
      }, 1500); // Simulate saving delay for animation
    } catch (error) {
      console.error('Error saving dashboard:', error);
      toast.error('Failed to save dashboard');
      setIsSaving(false);
    }
  };

  const downloadCsvData = () => {
    try {
      const csvContent = [
        columns.join(','),
        ...data.map(row => columns.map(col => row[col]).join(','))
      ].join('\n');
      
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `cleaned_data_${Date.now()}.csv`;
      a.click();
      URL.revokeObjectURL(url);
      
      toast.success('Cleaned data downloaded successfully');
    } catch (error) {
      console.error('Error downloading CSV:', error);
      toast.error('Failed to download CSV');
    }
  };

  const openDashboard = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const deleteSavedDashboard = (id: string) => {
    const updatedDashboards = savedDashboards.filter(
      (dashboard: any) => dashboard.id !== id
    );
    setSavedDashboards(updatedDashboards);
    localStorage.setItem('savedDashboards', JSON.stringify(updatedDashboards));
    toast.success('Dashboard removed');
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  // Widget data for the dashboard tools section
  const dashboardWidgets = [
    {
      id: 'widget1',
      title: 'Interactive Charts',
      description: 'Create responsive and interactive visualizations',
      icon: ChartPie,
      color: 'from-purple-500 to-indigo-600',
      features: ['Bar charts', 'Line charts', 'Pie charts', 'Area charts']
    },
    {
      id: 'widget2',
      title: 'Real-time Data',
      description: 'Connect to live data sources for up-to-date insights',
      icon: Zap,
      color: 'from-cyan-500 to-blue-600',
      features: ['Streaming data', 'Automatic refreshes', 'Live metrics', 'Real-time alerts']
    },
    {
      id: 'widget3',
      title: 'Advanced Filters',
      description: 'Filter and segment your data for deeper analysis',
      icon: ListFilter,
      color: 'from-amber-500 to-orange-600',
      features: ['Date filters', 'Category filters', 'Value ranges', 'Custom expressions']
    },
    {
      id: 'widget4',
      title: 'Custom Metrics',
      description: 'Create your own KPIs and track performance',
      icon: Gauge,
      color: 'from-green-500 to-emerald-600',
      features: ['Custom formulas', 'Goal tracking', 'Comparative analysis', 'Trend indicators']
    }
  ];

  return (
    <div className="p-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-6"
      >
        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
          Dashboard Management Center
        </h1>
        <p className="text-muted-foreground">
          Create, manage, and access interactive dashboards for your data analysis
        </p>
      </motion.div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 mb-6">
          <TabsTrigger value="tools" className="flex items-center gap-2">
            <Palette className="w-4 h-4" />
            <span>Dashboard Tools</span>
          </TabsTrigger>
          <TabsTrigger value="process" className="flex items-center gap-2">
            <LineChart className="w-4 h-4" />
            <span>Process Flow</span>
          </TabsTrigger>
          <TabsTrigger value="saved" className="flex items-center gap-2">
            <Database className="w-4 h-4" />
            <span>Saved Dashboards</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="tools" className="space-y-6">
          {/* Main dashboard services section */}
          <motion.div 
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            <motion.div variants={item}>
              <Card className="overflow-hidden border-none shadow-lg transition-all duration-300 hover:shadow-xl bg-gradient-to-br from-blue-500 to-blue-700 text-white">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <BarChart3 className="h-6 w-6" />
                      <CardTitle>Power BI</CardTitle>
                    </div>
                    <Badge variant="outline" className="bg-blue-600/20 text-white border-blue-400">
                      Microsoft
                    </Badge>
                  </div>
                  <CardDescription className="text-blue-100">
                    Create interactive visualizations and business intelligence
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-sm space-y-4">
                  <div className="bg-white/10 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">Features:</h4>
                    <ul className="list-disc list-inside space-y-1 text-blue-50">
                      <li>Drag-and-drop visualization creation</li>
                      <li>AI-powered data insights</li>
                      <li>Real-time dashboards</li>
                      <li>Enterprise-grade security</li>
                    </ul>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    variant="secondary" 
                    className="w-full bg-white text-blue-700 hover:bg-blue-50"
                    onClick={() => window.open('https://powerbi.microsoft.com/', '_blank', 'noopener,noreferrer')}
                  >
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Go to Power BI
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>

            <motion.div variants={item}>
              <Card className="overflow-hidden border-none shadow-lg transition-all duration-300 hover:shadow-xl bg-gradient-to-br from-orange-500 to-amber-600 text-white">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <PieChart className="h-6 w-6" />
                      <CardTitle>Tableau</CardTitle>
                    </div>
                    <Badge variant="outline" className="bg-orange-600/20 text-white border-orange-400">
                      Salesforce
                    </Badge>
                  </div>
                  <CardDescription className="text-orange-100">
                    Advanced analytics and data visualization platform
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-sm space-y-4">
                  <div className="bg-white/10 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">Features:</h4>
                    <ul className="list-disc list-inside space-y-1 text-orange-50">
                      <li>Powerful visual analytics</li>
                      <li>Interactive dashboards</li>
                      <li>Data blending and preparation</li>
                      <li>Mobile-friendly design</li>
                    </ul>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    variant="secondary" 
                    className="w-full bg-white text-orange-600 hover:bg-orange-50"
                    onClick={() => window.open('https://www.tableau.com/', '_blank', 'noopener,noreferrer')}
                  >
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Go to Tableau
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          </motion.div>

          {/* Feature Widgets section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="mt-8"
          >
            <Card className="border border-gray-200 dark:border-gray-800 shadow-md mb-8">
              <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/50 dark:to-purple-950/50 border-b border-gray-200 dark:border-gray-800">
                <CardTitle className="text-xl flex items-center gap-2">
                  <SparkleIcon className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                  Dashboard Capabilities
                </CardTitle>
                <CardDescription>
                  Powerful features available in modern dashboard tools
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6 pb-2">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {dashboardWidgets.map((widget) => (
                    <motion.div 
                      key={widget.id}
                      whileHover={{ 
                        y: -5, 
                        transition: { duration: 0.2 } 
                      }}
                      className="h-full"
                    >
                      <Card className="h-full border bg-white dark:bg-gray-800 shadow-md hover:shadow-lg transition-all duration-300">
                        <CardHeader className="pb-2">
                          <div className="flex items-center justify-between">
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center bg-gradient-to-r ${widget.color} text-white`}>
                              <widget.icon className="h-5 w-5" />
                            </div>
                            <Badge variant="outline" className="bg-gray-100 dark:bg-gray-700">
                              {widget.features.length} features
                            </Badge>
                          </div>
                          <CardTitle className="text-md mt-2">{widget.title}</CardTitle>
                          <CardDescription className="text-xs">
                            {widget.description}
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="pt-2 pb-2">
                          <ul className="text-xs space-y-1 text-gray-600 dark:text-gray-300">
                            {widget.features.map((feature, idx) => (
                              <li key={idx} className="flex items-center">
                                <CheckCircle className="h-3 w-3 text-green-500 mr-2" />
                                {feature}
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Dashboard templates section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <Card className="overflow-hidden border-none shadow-lg bg-gradient-to-br from-purple-500/10 to-indigo-500/10 backdrop-blur-sm mb-8">
              <CardHeader className="pb-2 border-b border-gray-200 dark:border-gray-700">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Lightbulb className="h-5 w-5 text-amber-500" />
                  Recommended Templates
                </CardTitle>
                <CardDescription>
                  Ready-to-use dashboard templates for common analytics scenarios
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300 transform hover:scale-105 cursor-pointer">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                        <DollarSign className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                      </div>
                      <h3 className="font-medium text-sm">Sales Analytics</h3>
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                      Track revenue, sales conversion, and customer metrics
                    </p>
                    <div className="flex justify-between items-center mt-2">
                      <Badge variant="secondary" className="text-xs">Popular</Badge>
                      <Button variant="ghost" size="sm" className="p-0 h-6 w-6">
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300 transform hover:scale-105 cursor-pointer">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                        <Users2 className="h-4 w-4 text-green-600 dark:text-green-400" />
                      </div>
                      <h3 className="font-medium text-sm">Marketing Dashboard</h3>
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                      Campaign performance, leads, and conversion rates
                    </p>
                    <div className="flex justify-between items-center mt-2">
                      <Badge variant="secondary" className="text-xs">Recommended</Badge>
                      <Button variant="ghost" size="sm" className="p-0 h-6 w-6">
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300 transform hover:scale-105 cursor-pointer">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
                        <TrendingUp className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                      </div>
                      <h3 className="font-medium text-sm">Financial Analysis</h3>
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                      Profit margins, costs, and revenue forecasting
                    </p>
                    <div className="flex justify-between items-center mt-2">
                      <Badge variant="secondary" className="text-xs">Premium</Badge>
                      <Button variant="ghost" size="sm" className="p-0 h-6 w-6">
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Save dashboard section */}
          <motion.div variants={item} className="mb-8">
            <Card className="backdrop-blur-sm border border-indigo-200 dark:border-indigo-800 shadow-md bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-950/30 dark:to-blue-950/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <SparkleIcon className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                  <span>Save Your Dashboard</span>
                </CardTitle>
                <CardDescription>
                  Store the URL of your published dashboard for quick access
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {animationComplete && (
                  <Alert className="bg-green-50 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800 mb-4">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    <AlertDescription>Dashboard saved successfully! Check the Saved Dashboards tab.</AlertDescription>
                  </Alert>
                )}
                
                {isAnimating && (
                  <div className="mb-4">
                    <p className="text-sm mb-2 text-indigo-600 dark:text-indigo-400">Saving dashboard...</p>
                    <Progress value={progress} className="h-2" />
                  </div>
                )}
                
                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="dashboardName" className="text-gray-700 dark:text-gray-300">Dashboard Name</Label>
                    <Input
                      id="dashboardName"
                      placeholder="My Sales Dashboard"
                      value={dashboardName}
                      onChange={(e) => setDashboardName(e.target.value)}
                      className="border-indigo-200 dark:border-indigo-800 focus:ring-indigo-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dashboardUrl" className="text-gray-700 dark:text-gray-300">Dashboard URL</Label>
                    <Input
                      id="dashboardUrl"
                      placeholder="https://app.powerbi.com/view?..."
                      value={dashboardUrl}
                      onChange={(e) => setDashboardUrl(e.target.value)}
                      className="border-indigo-200 dark:border-indigo-800 focus:ring-indigo-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dashboardType" className="text-gray-700 dark:text-gray-300">Dashboard Type</Label>
                    <div className="grid grid-cols-2 gap-3">
                      <Button
                        type="button"
                        variant={dashboardType === 'Power BI' ? 'default' : 'outline'}
                        className={`flex items-center gap-2 ${dashboardType === 'Power BI' ? 'bg-blue-600' : ''} transition-all duration-300 transform hover:scale-105`}
                        onClick={() => setDashboardType('Power BI')}
                      >
                        <BarChart3 className="h-4 w-4" />
                        <span>Power BI</span>
                      </Button>
                      <Button
                        type="button"
                        variant={dashboardType === 'Tableau' ? 'default' : 'outline'}
                        className={`flex items-center gap-2 ${dashboardType === 'Tableau' ? 'bg-orange-600' : ''} transition-all duration-300 transform hover:scale-105`}
                        onClick={() => setDashboardType('Tableau')}
                      >
                        <PieChart className="h-4 w-4" />
                        <span>Tableau</span>
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white transition-all duration-300 transform hover:scale-105"
                  onClick={() => handleSaveDashboard(false)}
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save Dashboard
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        </TabsContent>

        <TabsContent value="process" className="space-y-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="bg-white dark:bg-gray-900 rounded-xl overflow-hidden shadow-lg border border-indigo-100 dark:border-indigo-900"
          >
            <div className="p-6 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
              <h3 className="text-2xl font-bold mb-2">Dashboard Creation Process</h3>
              <p className="opacity-90">Follow these steps to create professional interactive dashboards</p>
            </div>
            
            <div className="p-6">
              <ol className="relative border-l border-indigo-300 dark:border-indigo-700 ml-3 space-y-8">
                <motion.li 
                  className="mb-6 ml-6"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <span className="absolute flex items-center justify-center w-8 h-8 bg-indigo-100 rounded-full -left-4 ring-4 ring-white dark:ring-gray-900 dark:bg-indigo-900">
                    <Database className="w-4 h-4 text-indigo-600 dark:text-indigo-300" />
                  </span>
                  <h3 className="flex items-center mb-1 text-lg font-semibold text-gray-900 dark:text-white">
                    Process Your Data
                    <Badge variant="secondary" className="ml-3 text-xs font-medium mr-2 px-2.5 py-0.5 rounded bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300">
                      Step 1
                    </Badge>
                  </h3>
                  <p className="mb-4 text-base font-normal text-gray-600 dark:text-gray-400">
                    Use Analyzer_Maaz to clean, transform, and prepare your data for visualization.
                  </p>
                  <Button 
                    variant="outline" 
                    onClick={downloadCsvData}
                    className="inline-flex items-center px-4 py-2 text-sm font-medium border border-gray-200 dark:border-gray-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/30"
                  >
                    <Download className="mr-2 w-4 h-4" />
                    Download Cleaned CSV Data
                  </Button>
                </motion.li>
                
                <motion.li 
                  className="mb-6 ml-6"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <span className="absolute flex items-center justify-center w-8 h-8 bg-indigo-100 rounded-full -left-4 ring-4 ring-white dark:ring-gray-900 dark:bg-indigo-900">
                    <FileSpreadsheet className="w-4 h-4 text-indigo-600 dark:text-indigo-300" />
                  </span>
                  <h3 className="flex items-center mb-1 text-lg font-semibold text-gray-900 dark:text-white">
                    Upload to Dashboard Tool
                    <Badge variant="secondary" className="ml-3 text-xs font-medium mr-2 px-2.5 py-0.5 rounded bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300">
                      Step 2
                    </Badge>
                  </h3>
                  <p className="mb-4 text-base font-normal text-gray-600 dark:text-gray-400">
                    Upload the cleaned CSV data to your preferred dashboard tool (Power BI or Tableau).
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Button 
                      variant="outline"
                      className="inline-flex items-center px-4 py-2 text-sm font-medium border border-blue-200 text-blue-700 bg-blue-50 hover:bg-blue-100 dark:border-blue-800 dark:text-blue-400 dark:bg-blue-950/30 dark:hover:bg-blue-900/30"
                      onClick={() => window.open('https://docs.microsoft.com/en-us/power-bi/connect-data/service-comma-separated-value-files', '_blank')}
                    >
                      <PanelRight className="mr-2 w-4 h-4" />
                      Power BI CSV Guide
                    </Button>
                    <Button 
                      variant="outline"
                      className="inline-flex items-center px-4 py-2 text-sm font-medium border border-orange-200 text-orange-700 bg-orange-50 hover:bg-orange-100 dark:border-orange-800 dark:text-orange-400 dark:bg-orange-950/30 dark:hover:bg-orange-900/30"
                      onClick={() => window.open('https://help.tableau.com/current/pro/desktop/en-us/connect_csv.htm', '_blank')}
                    >
                      <PanelRight className="mr-2 w-4 h-4" />
                      Tableau CSV Guide
                    </Button>
                  </div>
                </motion.li>
                
                <motion.li 
                  className="mb-6 ml-6"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <span className="absolute flex items-center justify-center w-8 h-8 bg-indigo-100 rounded-full -left-4 ring-4 ring-white dark:ring-gray-900 dark:bg-indigo-900">
                    <Edit3 className="w-4 h-4 text-indigo-600 dark:text-indigo-300" />
                  </span>
                  <h3 className="flex items-center mb-1 text-lg font-semibold text-gray-900 dark:text-white">
                    Create Interactive Dashboard
                    <Badge variant="secondary" className="ml-3 text-xs font-medium mr-2 px-2.5 py-0.5 rounded bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300">
                      Step 3
                    </Badge>
                  </h3>
                  <p className="mb-4 text-base font-normal text-gray-600 dark:text-gray-400">
                    Design visualizations, add filters, and create interactive elements using the dashboard tool.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Button 
                      variant="outline"
                      className="inline-flex items-center px-4 py-2 text-sm font-medium border border-purple-200 text-purple-700 bg-purple-50 hover:bg-purple-100 dark:border-purple-800 dark:text-purple-400 dark:bg-purple-950/30 dark:hover:bg-purple-900/30"
                      onClick={() => window.open('https://learn.microsoft.com/en-us/power-bi/create-reports/service-dashboards', '_blank')}
                    >
                      <BarChart3 className="mr-2 w-4 h-4" />
                      Power BI Dashboard Tutorial
                    </Button>
                    <Button 
                      variant="outline"
                      className="inline-flex items-center px-4 py-2 text-sm font-medium border border-green-200 text-green-700 bg-green-50 hover:bg-green-100 dark:border-green-800 dark:text-green-400 dark:bg-green-950/30 dark:hover:bg-green-900/30"
                      onClick={() => window.open('https://help.tableau.com/current/pro/desktop/en-us/dashboards.htm', '_blank')}
                    >
                      <PieChart className="mr-2 w-4 h-4" />
                      Tableau Dashboard Tutorial
                    </Button>
                  </div>
                </motion.li>
                
                <motion.li 
                  className="mb-6 ml-6"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <span className="absolute flex items-center justify-center w-8 h-8 bg-indigo-100 rounded-full -left-4 ring-4 ring-white dark:ring-gray-900 dark:bg-indigo-900">
                    <Globe className="w-4 h-4 text-indigo-600 dark:text-indigo-300" />
                  </span>
                  <h3 className="flex items-center mb-1 text-lg font-semibold text-gray-900 dark:text-white">
                    Publish Dashboard
                    <Badge variant="secondary" className="ml-3 text-xs font-medium mr-2 px-2.5 py-0.5 rounded bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300">
                      Step 4
                    </Badge>
                  </h3>
                  <p className="mb-4 text-base font-normal text-gray-600 dark:text-gray-400">
                    Publish your dashboard online and get a shareable URL for easy access.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Button 
                      variant="outline"
                      className="inline-flex items-center px-4 py-2 text-sm font-medium border border-blue-200 text-blue-700 bg-blue-50 hover:bg-blue-100 dark:border-blue-800 dark:text-blue-400 dark:bg-blue-950/30 dark:hover:bg-blue-900/30"
                      onClick={() => window.open('https://learn.microsoft.com/en-us/power-bi/create-reports/service-publish-to-web', '_blank')}
                    >
                      <ExternalLink className="mr-2 w-4 h-4" />
                      Power BI Publishing Guide
                    </Button>
                    <Button 
                      variant="outline"
                      className="inline-flex items-center px-4 py-2 text-sm font-medium border border-orange-200 text-orange-700 bg-orange-50 hover:bg-orange-100 dark:border-orange-800 dark:text-orange-400 dark:bg-orange-950/30 dark:hover:bg-orange-900/30"
                      onClick={() => window.open('https://help.tableau.com/current/pro/desktop/en-us/publish_workbooks_share.htm', '_blank')}
                    >
                      <ExternalLink className="mr-2 w-4 h-4" />
                      Tableau Publishing Guide
                    </Button>
                  </div>
                </motion.li>
                
                <motion.li 
                  className="ml-6"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <span className="absolute flex items-center justify-center w-8 h-8 bg-green-100 rounded-full -left-4 ring-4 ring-white dark:ring-gray-900 dark:bg-green-900">
                    <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-300" />
                  </span>
                  <h3 className="flex items-center mb-1 text-lg font-semibold text-gray-900 dark:text-white">
                    Save Dashboard URL
                    <Badge variant="secondary" className="ml-3 text-xs font-medium mr-2 px-2.5 py-0.5 rounded bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                      Final Step
                    </Badge>
                  </h3>
                  <p className="mb-4 text-base font-normal text-gray-600 dark:text-gray-400">
                    Save your dashboard URL in the Analyzer_Maaz app for quick access anytime.
                  </p>
                  <Button 
                    variant="outline"
                    className="inline-flex items-center px-4 py-2 text-sm font-medium border border-green-200 text-green-700 bg-green-50 hover:bg-green-100 dark:border-green-800 dark:text-green-400 dark:bg-green-950/30 dark:hover:bg-green-900/30"
                    onClick={() => setActiveTab('tools')}
                  >
                    <Save className="mr-2 w-4 h-4" />
                    Go to Save Dashboard
                  </Button>
                </motion.li>
              </ol>
            </div>
          </motion.div>
        </TabsContent>

        <TabsContent value="saved" className="space-y-6">
          {/* Direct URL save form for Saved Dashboard tab */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-6"
          >
            <Card className="border border-blue-200 dark:border-blue-900 shadow-md bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2">
                  <Link2 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  <span>Quick Save Dashboard</span>
                </CardTitle>
                <CardDescription>
                  Directly save a dashboard URL for easy access
                </CardDescription>
              </CardHeader>
              {!showQuickSaveForm ? (
                <CardContent className="pt-4 pb-4 text-center">
                  <Button 
                    onClick={() => setShowQuickSaveForm(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white transition-all duration-300"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add New Dashboard
                  </Button>
                </CardContent>
              ) : (
                <>
                  <CardContent className="space-y-4">
                    {isAnimating && (
                      <div className="mb-2">
                        <p className="text-sm mb-2 text-blue-600 dark:text-blue-400">Saving dashboard...</p>
                        <Progress value={progress} className="h-2" />
                      </div>
                    )}
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="space-y-4"
                    >
                      <div className="space-y-2">
                        <Label htmlFor="quickSaveName">Dashboard Name</Label>
                        <Input
                          id="quickSaveName"
                          placeholder="My Dashboard"
                          value={quickSaveName}
                          onChange={(e) => setQuickSaveName(e.target.value)}
                          className="border-blue-200 dark:border-blue-800"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="quickSaveUrl">Dashboard URL</Label>
                        <Input
                          id="quickSaveUrl"
                          placeholder="https://app.powerbi.com/view?..."
                          value={quickSaveUrl}
                          onChange={(e) => setQuickSaveUrl(e.target.value)}
                          className="border-blue-200 dark:border-blue-800"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Dashboard Type</Label>
                        <div className="flex gap-3">
                          <Button
                            type="button"
                            size="sm"
                            variant={quickSaveType === 'Power BI' ? 'default' : 'outline'}
                            className={quickSaveType === 'Power BI' ? 'bg-blue-600 text-white' : ''}
                            onClick={() => setQuickSaveType('Power BI')}
                          >
                            <BarChart3 className="mr-1 h-4 w-4" />
                            Power BI
                          </Button>
                          <Button
                            type="button"
                            size="sm"
                            variant={quickSaveType === 'Tableau' ? 'default' : 'outline'}
                            className={quickSaveType === 'Tableau' ? 'bg-orange-600 text-white' : ''}
                            onClick={() => setQuickSaveType('Tableau')}
                          >
                            <PieChart className="mr-1 h-4 w-4" />
                            Tableau
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button
                      variant="outline"
                      onClick={() => setShowQuickSaveForm(false)}
                      className="border-blue-200 dark:border-blue-800"
                    >
                      Cancel
                    </Button>
                    <Button
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                      onClick={() => handleSaveDashboard(true)}
                      disabled={isSaving}
                    >
                      {isSaving ? (
                        <>
                          <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="mr-2 h-4 w-4" />
                          Save
                        </>
                      )}
                    </Button>
                  </CardFooter>
                </>
              )}
            </Card>
          </motion.div>

          {savedDashboards.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center justify-center h-64 p-6 bg-gray-50 dark:bg-gray-900 rounded-xl border border-dashed border-gray-300 dark:border-gray-700"
            >
              <FileText className="w-16 h-16 text-gray-300 dark:text-gray-700 mb-4" />
              <h3 className="text-xl font-semibold text-gray-500 dark:text-gray-400 mb-2">No Saved Dashboards</h3>
              <p className="text-gray-500 dark:text-gray-500 text-center mb-4 max-w-md">
                You haven't saved any dashboard URLs yet. Create a dashboard and save its URL for quick access.
              </p>
              <div className="flex gap-3">
                <Button 
                  variant="outline" 
                  onClick={() => setActiveTab('tools')}
                  className="bg-white dark:bg-gray-800"
                >
                  <PanelRightOpen className="mr-2 h-4 w-4" />
                  Go to Dashboard Tools
                </Button>
                <Button 
                  onClick={() => setShowQuickSaveForm(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Dashboard
                </Button>
              </div>
            </motion.div>
          ) : (
            <ScrollArea className="h-[500px]">
              <motion.div 
                variants={container}
                initial="hidden"
                animate="show"
                className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6"
              >
                {savedDashboards.map((dashboard: any) => (
                  <motion.div 
                    key={dashboard.id} 
                    variants={item} 
                    whileHover={{ 
                      y: -5,
                      transition: { duration: 0.2 }
                    }}
                  >
                    <Card className={`overflow-hidden border shadow-lg hover:shadow-xl transition-all duration-300 ${
                      dashboard.type === 'Power BI' 
                      ? 'border-blue-200 dark:border-blue-900' 
                      : 'border-orange-200 dark:border-orange-900'
                    }`}>
                      <CardHeader className={`pb-2 ${
                        dashboard.type === 'Power BI'
                        ? 'bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30'
                        : 'bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-900/30 dark:to-amber-900/30'
                      }`}>
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            {dashboard.type === 'Power BI' ? (
                              <BarChart3 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                            ) : (
                              <PieChart className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                            )}
                            <CardTitle className="text-lg">{dashboard.name}</CardTitle>
                          </div>
                          <Badge variant="outline" className={dashboard.type === 'Power BI' 
                            ? 'border-blue-200 text-blue-700 bg-blue-50 dark:border-blue-800 dark:text-blue-400 dark:bg-blue-900/20' 
                            : 'border-orange-200 text-orange-700 bg-orange-50 dark:border-orange-800 dark:text-orange-400 dark:bg-orange-900/20'
                          }>
                            {dashboard.type}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-4">
                        <div className="space-y-3">
                          <div className="flex items-center gap-2">
                            <Link2 className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                            <p className="text-sm text-gray-500 dark:text-gray-400 truncate" title={dashboard.url}>
                              {dashboard.url}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <RefreshCw className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              Created: {new Date(dashboard.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="pt-0 flex justify-between">
                        <Button
                          variant="outline"
                          className="text-red-600 border-red-200 hover:bg-red-50 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-950/30"
                          size="sm"
                          onClick={() => deleteSavedDashboard(dashboard.id)}
                        >
                          Remove
                        </Button>
                        <motion.div
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Button
                            variant="default"
                            size="sm"
                            className={dashboard.type === 'Power BI' 
                              ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700'
                              : 'bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700'
                            }
                            onClick={() => openDashboard(dashboard.url)}
                          >
                            <Play className="mr-2 h-3 w-3" />
                            Access Dashboard
                          </Button>
                        </motion.div>
                      </CardFooter>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
            </ScrollArea>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CustomDashboard;
