
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Share2, Copy, QrCode, Cloud, Rocket, Users } from 'lucide-react';
import { toast } from 'sonner';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { motion } from 'framer-motion';

interface ShareDialogProps {
  onOpenChange?: (open: boolean) => void;
}

const ShareDialog: React.FC<ShareDialogProps> = ({ onOpenChange }) => {
  const handleShare = (method: string) => {
    const url = window.location.href;
    
    switch (method) {
      case 'copy':
        navigator.clipboard.writeText(url);
        toast.success('Link copied to clipboard!');
        break;
      case 'qr':
        toast.success('QR code feature coming soon!');
        break;
      case 'cloud':
        toast.success('Cloud sharing will be available soon!');
        break;
      default:
        toast.error('Feature coming soon!');
    }
  };

  return (
    <Dialog onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 sm:h-10 sm:w-10 hover:bg-gradient-to-r hover:from-purple-100 hover:to-indigo-100 dark:hover:from-purple-900/20 dark:hover:to-indigo-900/20 transition-all duration-300 rounded-full hover:scale-110"
            >
              <Share2 className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Share Analysis</TooltipContent>
        </Tooltip>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Share2 className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
            Share Your Analysis
          </DialogTitle>
        </DialogHeader>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <Alert className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border border-blue-200 dark:border-blue-900/20">
            <Rocket className="h-5 w-5 text-blue-500" />
            <AlertDescription className="text-blue-700 dark:text-blue-300">
              🚀 <strong>Coming Soon!</strong> Advanced sharing features including cloud integration, team collaboration, and enterprise security controls are under development.
            </AlertDescription>
          </Alert>
          
          <div className="grid gap-3">
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button 
                variant="outline" 
                className="w-full justify-start h-12"
                onClick={() => handleShare('copy')}
              >
                <Copy className="mr-3 h-5 w-5 text-green-600" />
                <div className="text-left">
                  <div className="font-medium">Copy Link</div>
                  <div className="text-xs text-gray-500">Share via URL (Available Now)</div>
                </div>
              </Button>
            </motion.div>
            
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button 
                variant="outline" 
                className="w-full justify-start h-12 opacity-70"
                onClick={() => handleShare('qr')}
                disabled
              >
                <QrCode className="mr-3 h-5 w-5 text-purple-600" />
                <div className="text-left">
                  <div className="font-medium">Generate QR Code</div>
                  <div className="text-xs text-gray-500">Quick mobile sharing (Coming Soon)</div>
                </div>
              </Button>
            </motion.div>
            
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button 
                variant="outline" 
                className="w-full justify-start h-12 opacity-70"
                onClick={() => handleShare('cloud')}
                disabled
              >
                <Cloud className="mr-3 h-5 w-5 text-indigo-600" />
                <div className="text-left">
                  <div className="font-medium">Cloud Share</div>
                  <div className="text-xs text-gray-500">Secure cloud hosting (Coming Soon)</div>
                </div>
              </Button>
            </motion.div>
            
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button 
                variant="outline" 
                className="w-full justify-start h-12 opacity-70"
                onClick={() => handleShare('team')}
                disabled
              >
                <Users className="mr-3 h-5 w-5 text-orange-600" />
                <div className="text-left">
                  <div className="font-medium">Team Collaboration</div>
                  <div className="text-xs text-gray-500">Share with team members (Coming Soon)</div>
                </div>
              </Button>
            </motion.div>
          </div>

          <Alert className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 border border-green-200 dark:border-green-900/20">
            <AlertDescription className="text-green-700 dark:text-green-300 text-sm">
              💡 <strong>Tip:</strong> For now, you can copy the link and share it manually. Advanced sharing features are being developed for future releases.
            </AlertDescription>
          </Alert>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
};

export default ShareDialog;
