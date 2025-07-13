
import { lazy, Suspense, useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";
import TopNav from "@/components/TopNav";
import LoadingState from "@/components/loading/LoadingState";
import WelcomeDialog from "@/components/dialogs/WelcomeDialog";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import AIChat from "@/components/ai/AIChat";
import { useIsMobile } from "@/hooks/use-mobile";

const MainContent = lazy(() => import("@/components/MainContent"));
const ProfileSetup = lazy(() => import("@/components/profile/ProfileSetup"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      gcTime: 1000 * 60 * 30,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const Index = () => {
  const [hasProfile, setHasProfile] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showWelcome, setShowWelcome] = useState(false);
  const [showAIChat, setShowAIChat] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    const profile = localStorage.getItem('userProfile');
    setHasProfile(!!profile);
    setIsLoading(false);

    if (!!profile) {
      const hasSeenWelcome = localStorage.getItem('hasSeenWelcome');
      setShowWelcome(!hasSeenWelcome);
      
      if (!hasSeenWelcome) {
        localStorage.setItem('hasSeenWelcome', 'true');
      }
    }
  }, []);

  const handleProfileComplete = () => {
    setHasProfile(true);
    setTimeout(() => {
      setShowWelcome(true);
    }, 500);
  };

  if (isLoading) {
    return <LoadingState isProcessing={true} />;
  }

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <div className="min-h-screen flex flex-col">
            <Suspense fallback={<LoadingState isProcessing={true} />}>
              {!hasProfile ? (
                <ProfileSetup onComplete={handleProfileComplete} />
              ) : (
                <>
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6 }}
                    className="flex-1 bg-gradient-to-br from-gray-50 via-purple-50/30 to-indigo-50/30 dark:from-gray-950 dark:via-purple-950/20 dark:to-indigo-950/20"
                  >
                    <TopNav />
                    {isMobile && (
                      <motion.div 
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-gradient-to-r from-red-100 to-orange-100 dark:from-red-900/30 dark:to-orange-900/30 border-l-4 border-red-400 dark:border-red-600 text-red-700 dark:text-red-400 p-4 m-4 rounded-lg text-center text-sm font-medium shadow-sm backdrop-blur-sm"
                      >
                        📱 For the best experience, please use a desktop or tablet device.
                      </motion.div>
                    )}
                    <MainContent />
                    <AIChat 
                      open={showAIChat} 
                      onOpenChange={setShowAIChat}
                      data={[]} 
                      columns={[]} 
                    />
                  </motion.div>
                  <Footer />
                  <Toaster />
                  <Sonner />
                </>
              )}
              <WelcomeDialog open={showWelcome} onOpenChange={setShowWelcome} />
            </Suspense>
          </div>
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
};

export default Index;
