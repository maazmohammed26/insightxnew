
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { MessageCircle, Copy, Share2, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { generateDataInsights, generateDiscordShareText, openDiscordShare } from '@/utils/exportUtils';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface DiscordShareDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data: any[];
  columns: string[];
  fileName: string;
}

const DiscordShareDialog = ({ open, onOpenChange, data, columns, fileName }: DiscordShareDialogProps) => {
  const [message, setMessage] = useState('');
  const [includeInsights, setIncludeInsights] = useState(true);
  const [includeSummary, setIncludeSummary] = useState(true);
  const [username, setUsername] = useState('');
  const [showCommunityTips, setShowCommunityTips] = useState(false);
  
  const discordLink = "https://discord.gg/FSb9cacK5B";
  
  const insights = generateDataInsights(data, columns);
  
  const generateShareText = () => {
    return generateDiscordShareText(
      fileName,
      data,
      columns,
      includeInsights ? insights : [],
      message,
      username
    );
  };
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(generateShareText());
    toast.success("Copied to clipboard! Now you can paste in Discord.");
  };
  
  const openDiscord = () => {
    window.open(discordLink, '_blank');
  };

  const shareToDiscord = () => {
    const result = openDiscordShare(generateShareText(), discordLink);
    if (result) {
      toast.success("Ready to share! Discord opened in a new tab.");
      onOpenChange(false);
    } else {
      toast.error("Could not open Discord. Please try again.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[650px] max-h-[90vh] p-0 overflow-hidden bg-white dark:bg-gray-950 rounded-xl border-2 shadow-2xl">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="border-b border-indigo-100 dark:border-indigo-900/30 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/40 dark:to-purple-950/40 p-6"
        >
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-center flex items-center justify-center gap-2">
              <MessageCircle className="h-6 w-6 text-indigo-500" />
              Share to InsightX Community
            </DialogTitle>
          </DialogHeader>

          <motion.div 
            className="flex justify-center mt-4"
            initial={{ scale: 0.9, y: 10 }}
            animate={{ scale: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.3 }}
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button 
                onClick={openDiscord}
                className="gap-2 bg-[#5865F2] hover:bg-[#4752c4] text-white shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <MessageCircle className="h-5 w-5" />
                Join Our Discord
                <ExternalLink className="h-4 w-4 ml-1" />
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>

        <ScrollArea className="flex-1 max-h-[60vh]">
          <div className="p-6 space-y-4">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-2"
            >
              <div className="flex items-center justify-between">
                <Label htmlFor="username" className="flex items-center gap-2 font-medium">
                  Your Discord Username
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0 hover:bg-indigo-100 dark:hover:bg-indigo-900/30">?</Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80">
                      <p className="text-sm">
                        Your Discord username will appear in the shared message, helping community members know who to reach out to for discussion.
                      </p>
                    </PopoverContent>
                  </Popover>
                </Label>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setShowCommunityTips(!showCommunityTips)}
                    className="text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30"
                  >
                    {showCommunityTips ? "Hide Tips" : "Show Tips"}
                  </Button>
                </motion.div>
              </div>
              <Input 
                id="username" 
                placeholder="YourName#1234 or YourName" 
                value={username} 
                onChange={(e) => setUsername(e.target.value)}
                className="border-indigo-200 dark:border-indigo-800/30 focus:border-indigo-300 dark:focus:border-indigo-700 focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-800/30 transition-all duration-300"
              />
            </motion.div>

            {showCommunityTips && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/50 dark:to-purple-950/50 p-4 rounded-lg border border-indigo-100 dark:border-indigo-900/30 shadow-sm"
              >
                <h3 className="font-semibold text-sm mb-3 text-indigo-700 dark:text-indigo-300">💡 Community Sharing Tips</h3>
                <ul className="text-xs text-slate-700 dark:text-slate-300 space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="text-indigo-500">•</span>
                    Be specific about what insights you'd like feedback on
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-indigo-500">•</span>
                    Consider mentioning your industry or use case
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-indigo-500">•</span>
                    Ask specific questions to prompt meaningful discussions
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-indigo-500">•</span>
                    Share context about your data (without revealing sensitive information)
                  </li>
                </ul>
              </motion.div>
            )}

            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="space-y-2"
            >
              <Label htmlFor="message" className="flex items-center gap-2 font-medium">
                Message to Community
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0 hover:bg-indigo-100 dark:hover:bg-indigo-900/30">?</Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80">
                    <p className="text-sm">
                      Include a brief introduction about your analysis and what you're hoping to learn from the community.
                    </p>
                  </PopoverContent>
                </Popover>
              </Label>
              <Textarea 
                id="message" 
                placeholder="Hi InsightX community! I'm analyzing data about... and would love your thoughts on..."
                className="min-h-[100px] border-indigo-200 dark:border-indigo-800/30 focus:border-indigo-300 dark:focus:border-indigo-700 focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-800/30 transition-all duration-300 resize-none"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </motion.div>

            <div className="space-y-4 pt-2">
              {[
                {
                  id: "include-insights",
                  label: "Include Key Insights",
                  description: "Share up to 3 key insights from your data analysis to provide context for the community.",
                  checked: includeInsights,
                  onChange: setIncludeInsights
                },
                {
                  id: "include-summary",
                  label: "Include Data Summary",
                  description: "Add basic information about your dataset (rows and columns) to help others understand the scope.",
                  checked: includeSummary,
                  onChange: setIncludeSummary
                }
              ].map((option, index) => (
                <motion.div
                  key={option.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                  className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-300"
                >
                  <Label htmlFor={option.id} className="flex items-center gap-2 font-medium cursor-pointer">
                    {option.label}
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-6 w-6 p-0 hover:bg-indigo-100 dark:hover:bg-indigo-900/30">?</Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-80">
                        <p className="text-sm">{option.description}</p>
                      </PopoverContent>
                    </Popover>
                  </Label>
                  <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                    <Switch 
                      id={option.id} 
                      checked={option.checked} 
                      onCheckedChange={option.onChange}
                      className="data-[state=checked]:bg-indigo-600"
                    />
                  </motion.div>
                </motion.div>
              ))}
            </div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-gradient-to-br from-slate-50 to-gray-100 dark:from-slate-900 dark:to-gray-900 p-4 rounded-lg border-2 border-slate-200 dark:border-slate-800 shadow-inner"
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                  <span>👀</span>
                  Preview
                </h3>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button variant="outline" size="sm" onClick={copyToClipboard} className="h-8 gap-2 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 border-indigo-200 dark:border-indigo-800">
                    <Copy className="h-3.5 w-3.5" />
                    Copy
                  </Button>
                </motion.div>
              </div>
              <ScrollArea className="max-h-[200px] min-h-[120px] border border-gray-200 dark:border-gray-700 rounded-md bg-white dark:bg-gray-950 p-3">
                <div className="text-xs text-slate-600 dark:text-slate-400 whitespace-pre-line font-mono leading-relaxed">
                  {generateShareText() || "Start typing your message to see the preview..."}
                </div>
              </ScrollArea>
            </motion.div>
          </div>
        </ScrollArea>

        <div className="flex justify-end gap-3 p-6 pt-4 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50">
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button variant="outline" onClick={() => onOpenChange(false)} className="hover:bg-gray-100 dark:hover:bg-gray-800">
              Cancel
            </Button>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button 
              onClick={shareToDiscord}
              className="gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Share2 className="h-4 w-4" />
              Share to Discord
            </Button>
          </motion.div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DiscordShareDialog;
