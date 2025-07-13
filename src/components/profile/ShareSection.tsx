import React from 'react';
import { Button } from '@/components/ui/button';
import { Copy, Check, Lock } from 'lucide-react';
import { motion } from 'framer-motion';

interface ShareSectionProps {
  profileId: string;
  name: string;
  copied: boolean;
  handleCopyId: () => void;
}

const ShareSection = ({ profileId, name, copied, handleCopyId }: ShareSectionProps) => {
  const shareId = `${profileId}|${name}`;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg space-y-2"
    >
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">Your ID:</span>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleCopyId}
          className="gap-2"
        >
          {copied ? (
            <Check className="h-4 w-4 text-green-500" />
          ) : (
            <Copy className="h-4 w-4" />
          )}
          {copied ? 'Copied!' : 'Copy ID'}
        </Button>
      </div>
      <div className="flex items-center gap-2 mt-2">
        <Lock className="h-4 w-4 text-purple-500" />
        <span className="text-sm text-purple-600">
          Only friends can access shared analysis
        </span>
      </div>
    </motion.div>
  );
};

export default ShareSection;