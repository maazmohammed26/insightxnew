
import React from 'react';
import { Button } from '@/components/ui/button';
import { Share2, QrCode, Link2, Lock, Cloud, ServerCrash } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface ShareOptionsProps {
  shareUrl: string;
  shareType: 'public' | 'private';
  setShareType: (type: 'public' | 'private') => void;
  generateShareUrl: () => string;
}

const ShareOptions = ({ shareUrl, shareType, setShareType, generateShareUrl }: ShareOptionsProps) => {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };

  const generateQRCode = () => {
    const url = generateShareUrl();
    toast.success('QR Code generated! Feature coming soon.');
  };

  return (
    <div className="space-y-4">
      <Alert className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border border-blue-200 dark:border-blue-900/20">
        <Cloud className="h-5 w-5 text-blue-500" />
        <AlertDescription className="text-blue-700 dark:text-blue-300">
          We're enhancing our services! Coming soon: Cloud integration, advanced sharing features, and enterprise-grade security.
        </AlertDescription>
      </Alert>
      
      <div className="flex items-center gap-2 mb-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShareType('private')}
          className={shareType === 'private' ? 'bg-indigo-100 dark:bg-indigo-900' : ''}
        >
          <Lock className="h-4 w-4 mr-2" />
          Private Share
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShareType('public')}
          className={shareType === 'public' ? 'bg-indigo-100 dark:bg-indigo-900' : ''}
        >
          <Share2 className="h-4 w-4 mr-2" />
          Public Share
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Button
          onClick={() => {
            const url = generateShareUrl();
            copyToClipboard(url);
          }}
          className="w-full"
          variant="outline"
        >
          <Link2 className="h-4 w-4 mr-2" />
          Copy Share Link
        </Button>

        <Button
          onClick={generateQRCode}
          className="w-full"
          variant="outline"
        >
          <QrCode className="h-4 w-4 mr-2" />
          Generate QR Code
        </Button>
      </div>

      <Alert className="bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-950/30 dark:to-yellow-950/30 border border-amber-200 dark:border-amber-900/20">
        <ServerCrash className="h-5 w-5 text-amber-500" />
        <AlertDescription className="text-amber-700 dark:text-amber-300">
          Server infrastructure upgrades in progress. Expect improved performance and reliability soon!
        </AlertDescription>
      </Alert>

      {shareUrl && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg"
        >
          <p className="text-sm text-gray-600 dark:text-gray-300 break-all">{shareUrl}</p>
        </motion.div>
      )}
    </div>
  );
};

export default ShareOptions;
