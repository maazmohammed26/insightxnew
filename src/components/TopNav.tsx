import React, { useState, useEffect } from 'react';
import { ModeToggle } from '@/components/ModeToggle';
import { Button } from '@/components/ui/button';
import { MessageSquare, Share2, Menu, X, Bell, Mail } from 'lucide-react';
import SettingsDialog from './SettingsDialog';
import { toast } from 'sonner';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import ProfileDialog from './ProfileDialog';
import ShareDialog from './ShareDialog';
import { motion, AnimatePresence } from 'framer-motion';
import { useIsMobile } from "@/hooks/use-mobile";

const TopNav = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isMobile = useIsMobile();

  const handleFeedback = () => {
    toast.success('Opening feedback channel...', {
      description: 'You can reach us via email or our community Discord!'
    });
    setTimeout(() => {
      window.location.href = 'mailto:support@insightx.ai?subject=InsightX Feedback&body=Hi InsightX Team,%0D%0A%0D%0AI have some feedback about the platform:%0D%0A%0D%0A';
    }, 1000);
  };

  const handleNotifications = () => {
    toast.success('Notifications center coming soon!', {
      description: 'Get updates on new features and analysis insights.'
    });
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <motion.nav 
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="sticky top-0 z-50 w-full border-b border-purple-500/20 bg-white/70 dark:bg-black/40 backdrop-blur-md supports-[backdrop-filter]:bg-white/30 dark:supports-[backdrop-filter]:bg-black/30"
    >
      <div className="container flex h-16 sm:h-20 items-center justify-between px-4">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="flex items-center gap-3"
        >
          <motion.img
            src="/lovable-uploads/b0078076-6a7e-4146-92e2-e132f369019e.png"
            alt="InsightX"
            className="h-10 sm:h-14 w-auto"
            initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ 
              duration: 0.5,
              type: "spring",
              stiffness: 260,
              damping: 20 
            }}
            whileHover={{ 
              scale: 1.1,
              rotate: 5,
              transition: { duration: 0.2 }
            }}
          />
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="hidden sm:block"
          >
            <h2 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
              InsightX
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400">Advanced CSV Analysis</p>
          </motion.div>
        </motion.div>
        
        {/* Mobile menu button */}
        <div className="sm:hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleMobileMenu}
            className="h-10 w-10 rounded-full mobile-tap-target"
          >
            {isMobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>
        
        {/* Desktop navigation */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="hidden sm:flex items-center gap-1 sm:gap-3"
        >
          <ModeToggle />
          
          <ProfileDialog />
          
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleNotifications}
                className="h-8 w-8 sm:h-10 sm:w-10 hover:bg-gradient-to-r hover:from-yellow-100 hover:to-orange-100 dark:hover:from-yellow-900/20 dark:hover:to-orange-900/20 transition-all duration-300 rounded-full hover:scale-110 relative"
              >
                <Bell className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full animate-pulse" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Notifications (Coming Soon)</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleFeedback}
                className="h-8 w-8 sm:h-10 sm:w-10 hover:bg-gradient-to-r hover:from-green-100 hover:to-emerald-100 dark:hover:from-green-900/20 dark:hover:to-emerald-900/20 transition-all duration-300 rounded-full hover:scale-110"
              >
                <Mail className="h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Send Feedback</TooltipContent>
          </Tooltip>

          <ShareDialog />

          <SettingsDialog />
        </motion.div>
      </div>
      
      {/* Mobile navigation menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="sm:hidden overflow-hidden border-t border-purple-500/10 bg-white/90 dark:bg-black/90 backdrop-blur-md"
          >
            <div className="flex flex-col p-4 space-y-2">
              <div className="flex justify-between items-center py-2 px-4 rounded-lg bg-purple-50 dark:bg-purple-900/20">
                <span className="text-sm font-medium">Theme</span>
                <ModeToggle />
              </div>
              
              <Button 
                variant="ghost" 
                size="sm"
                className="justify-start py-2 px-4 rounded-lg hover:bg-purple-50 dark:hover:bg-purple-900/20 mobile-tap-target"
                onClick={() => {
                  const profileTrigger = document.querySelector('[data-profile-trigger]');
                  if (profileTrigger) {
                    profileTrigger.dispatchEvent(
                      new MouseEvent('click', { bubbles: true })
                    );
                  }
                  setIsMobileMenuOpen(false);
                }}
              >
                <span className="flex items-center gap-2 w-full">
                  <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                  <span className="relative before:absolute before:inset-0 before:w-12 before:h-12 before:-m-3 before:content-['']">Profile</span>
                </span>
              </Button>
              
              <Button 
                variant="ghost" 
                size="sm"
                className="justify-start py-2 px-4 rounded-lg hover:bg-purple-50 dark:hover:bg-purple-900/20 mobile-tap-target"
                onClick={() => {
                  handleFeedback();
                  setIsMobileMenuOpen(false);
                }}
              >
                <span className="flex items-center gap-2 w-full">
                  <MessageSquare className="h-4 w-4" />
                  <span className="relative before:absolute before:inset-0 before:w-12 before:h-12 before:-m-3 before:content-['']">Send Feedback</span>
                </span>
              </Button>
              
              <Button 
                variant="ghost" 
                size="sm"
                className="justify-start py-2 px-4 rounded-lg hover:bg-purple-50 dark:hover:bg-purple-900/20 mobile-tap-target"
                onClick={() => {
                  const shareTrigger = document.querySelector('[data-share-trigger]');
                  if (shareTrigger) {
                    shareTrigger.dispatchEvent(
                      new MouseEvent('click', { bubbles: true })
                    );
                  }
                  setIsMobileMenuOpen(false);
                }}
              >
                <span className="flex items-center gap-2 w-full">
                  <Share2 className="h-4 w-4" />
                  <span className="relative before:absolute before:inset-0 before:w-12 before:h-12 before:-m-3 before:content-['']">Share</span>
                </span>
              </Button>
              
              <Button 
                variant="ghost" 
                size="sm"
                className="justify-start py-2 px-4 rounded-lg hover:bg-purple-50 dark:hover:bg-purple-900/20 mobile-tap-target"
                onClick={() => {
                  const settingsTrigger = document.querySelector('[data-settings-trigger]');
                  if (settingsTrigger) {
                    settingsTrigger.dispatchEvent(
                      new MouseEvent('click', { bubbles: true })
                    );
                  }
                  setIsMobileMenuOpen(false);
                }}
              >
                <span className="flex items-center gap-2 w-full">
                  <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                  <span className="relative before:absolute before:inset-0 before:w-12 before:h-12 before:-m-3 before:content-['']">Settings</span>
                </span>
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default TopNav;
