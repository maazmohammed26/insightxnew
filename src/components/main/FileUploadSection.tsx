import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Database, Brain, TrendingUp, Download, Upload, Lock, Share2 } from 'lucide-react';
import FileUpload from '../FileUpload';
import HeroSection from '../HeroSection';
import FeatureCards from '../FeatureCards';
import FAQSection from '../faq/FAQSection';
import HistorySection from '../HistorySection';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Input } from '../ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { toast } from 'sonner';
import { getUserProfile } from '@/utils/userStorage';
import { importSharedAnalysis } from '@/components/export/exportUtils';

interface FileUploadSectionProps {
  showHistory: boolean;
  setShowHistory: (show: boolean) => void;
  handleFileUpload: (file: File) => void;
}

const FileUploadSection = ({ showHistory, setShowHistory, handleFileUpload }: FileUploadSectionProps) => {
  const [password, setPassword] = useState('');
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isProtected, setIsProtected] = useState(false);
  const profile = getUserProfile();

  const handleImportFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        const fileContent = await file.text();
        const importedData = JSON.parse(fileContent);
        
        if (importedData.isProtected) {
          setSelectedFile(file);
          setIsProtected(true);
          setShowPasswordDialog(true);
        } else {
          const analysis = await importSharedAnalysis(file);
          handleFileUpload(file);
          toast.success('Analysis imported successfully');
        }
      } catch (error) {
        toast.error('Error reading file');
      }
    }
  };

  const handlePasswordSubmit = async () => {
    if (selectedFile) {
      try {
        const analysis = await importSharedAnalysis(selectedFile, password);
        handleFileUpload(selectedFile);
        toast.success('Protected analysis imported successfully');
        setShowPasswordDialog(false);
        setPassword('');
        setSelectedFile(null);
      } catch (error) {
        toast.error('Invalid PIN or corrupted file');
      }
    }
  };

  return (
    <div className="max-w-6xl mx-auto scroll-smooth">
      <div className="space-y-8 sm:space-y-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/80 dark:bg-gray-800/80 rounded-xl p-6 sm:p-8 shadow-lg backdrop-blur-sm border border-purple-200 dark:border-purple-800 relative overflow-hidden"
        >
          <div className="absolute -z-10 top-0 left-0 w-full h-full">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
          </div>
          
          <div className="relative">
            <div className="absolute -top-6 -right-6">
              <Sparkles className="w-12 h-12 text-purple-500/30 animate-spin-slow" />
            </div>
            <FileUpload onFileUpload={handleFileUpload} />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          <Card className="p-6 bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/50 dark:to-indigo-900/50 hover:shadow-lg transition-all duration-300">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-100 dark:bg-purple-900/50 rounded-lg">
                <Upload className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold">Import Analysis</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">Load any analysis file</p>
              </div>
            </div>
            <input
              type="file"
              accept=".json"
              onChange={handleImportFile}
              className="hidden"
              id="import-analysis"
            />
            <Button
              onClick={() => document.getElementById('import-analysis')?.click()}
              className="mt-4 w-full bg-purple-600 hover:bg-purple-700 text-white"
            >
              <Upload className="w-4 h-4 mr-2" />
              Import Analysis File
            </Button>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/50 dark:to-cyan-900/50 hover:shadow-lg transition-all duration-300">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/50 rounded-lg">
                <Share2 className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold">Share Analysis</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">Share with friends</p>
              </div>
            </div>
            <Button
              onClick={() => toast.info('Please upload a CSV file first')}
              className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Share2 className="w-4 h-4 mr-2" />
              Share Analysis
            </Button>
          </Card>
        </motion.div>

        {/* Password Dialog */}
        <Dialog open={showPasswordDialog} onOpenChange={setShowPasswordDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Enter PIN</DialogTitle>
              <DialogDescription>
                This analysis is protected. Please enter the 4-digit PIN to access it.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 p-4">
              <Input
                type="password"
                placeholder="Enter 4-digit PIN"
                value={password}
                onChange={(e) => setPassword(e.target.value.slice(0, 4))}
                maxLength={4}
                pattern="[0-9]*"
                inputMode="numeric"
              />
              <Button onClick={handlePasswordSubmit} className="w-full">
                Import Protected File
              </Button>
            </div>
          </DialogContent>
        </Dialog>
        
        {/* Keep existing sections */}
        <HeroSection />
        <FeatureCards />
        <FAQSection />
        
        {showHistory && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="animate-fade-in"
          >
            <HistorySection />
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default FileUploadSection;
