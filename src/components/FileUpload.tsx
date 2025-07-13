
import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, ArrowUpCircle, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';

interface FileUploadProps {
  onFileUpload: (file: File) => void;
}

const FileUpload = ({ onFileUpload }: FileUploadProps) => {
  const [isLoading, setIsLoading] = useState(false);
  
  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20MB
    
    if (file && file.type === 'text/csv') {
      if (file.size > MAX_FILE_SIZE) {
        toast.error('File size exceeds 20MB limit');
        return;
      }
      setIsLoading(true);
      setTimeout(() => {
        onFileUpload(file);
        setIsLoading(false);
      }, 1000);
    } else {
      toast.error('Please upload a valid CSV file');
    }
  }, [onFileUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
    },
    multiple: false,
    maxSize: 20 * 1024 * 1024, // 20MB
  });

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-4"
    >
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <Alert variant="default" className="mb-6 border-yellow-500 bg-yellow-50/50 dark:bg-yellow-900/20">
          <AlertTriangle className="h-4 w-4 text-yellow-600 dark:text-yellow-500" />
          <AlertDescription className="text-sm text-yellow-700 dark:text-yellow-400">
            This page is under development and some features are still not working due to development. Thank you!
          </AlertDescription>
        </Alert>
      </motion.div>

      <div
        {...getRootProps()}
        className={cn(
          "border-3 border-dashed rounded-xl p-12 transition-all duration-300 cursor-pointer relative overflow-hidden",
          "bg-gradient-to-br from-purple-50/50 via-indigo-50/50 to-blue-50/50 dark:from-purple-900/30 dark:via-indigo-900/30 dark:to-blue-900/30",
          "hover:shadow-xl hover:scale-[1.01]",
          isDragActive ? (
            "border-purple-500 bg-purple-50/80 dark:bg-purple-900/50"
          ) : (
            "border-gray-300 hover:border-purple-400"
          )
        )}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={isLoading ? 'loading' : 'upload'}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.2 }}
          >
            <input {...getInputProps()} />
            <div className="flex flex-col items-center space-y-6">
              {isLoading ? (
                <div className="text-center space-y-4">
                  <motion.div
                    animate={{ 
                      scale: [1, 1.1, 1],
                      rotate: [0, 180, 360]
                    }}
                    transition={{ 
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    <Sparkles className="w-16 h-16 text-purple-500" />
                  </motion.div>
                  <div className="space-y-2">
                    <p className="text-purple-600 dark:text-purple-400 font-medium text-lg animate-pulse">
                      Please wait...
                    </p>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      InsightX team is extracting insights from your data
                    </p>
                    <div className="flex items-center justify-center gap-2 text-purple-500 dark:text-purple-300 text-xs">
                      <span className="animate-pulse">This might take a moment</span>
                      <motion.span
                        animate={{ 
                          rotate: [0, 360],
                          scale: [1, 1.2, 1]
                        }}
                        transition={{ 
                          duration: 1.5,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                      >
                        ✨
                      </motion.span>
                    </div>
                  </div>
                </div>
              ) : isDragActive ? (
                <>
                  <motion.div
                    animate={{ 
                      y: [0, -10, 0],
                      scale: [1, 1.1, 1]
                    }}
                    transition={{ 
                      duration: 1.5,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    <ArrowUpCircle className="w-16 h-16 text-purple-500" />
                  </motion.div>
                  <p className="text-purple-600 dark:text-purple-400 font-medium text-lg">
                    Drop your CSV file here
                  </p>
                </>
              ) : (
                <>
                  <motion.div
                    animate={{ 
                      y: [0, -5, 0],
                      rotate: [0, 5, 0]
                    }}
                    transition={{ 
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    <Upload className="w-16 h-16 text-gray-400 group-hover:text-purple-500 transition-colors" />
                  </motion.div>
                  <div className="space-y-2 text-center">
                    <p className="text-gray-500 dark:text-gray-400">
                      Click to browse or drag and drop your CSV file
                    </p>
                    <p className="text-sm text-gray-400 dark:text-gray-500">
                      Supported format: CSV (up to 20MB)
                    </p>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="absolute inset-0 -z-10 overflow-hidden">
          <motion.div
            className="absolute w-[500px] h-[500px] bg-purple-200/30 dark:bg-purple-800/30 rounded-full blur-3xl"
            animate={{
              x: [0, 100, 0],
              y: [0, 50, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute right-0 bottom-0 w-[500px] h-[500px] bg-blue-200/30 dark:bg-blue-800/30 rounded-full blur-3xl"
            animate={{
              x: [0, -100, 0],
              y: [0, -50, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.5,
            }}
          />
        </div>
      </div>
    </motion.div>
  );
};

export default FileUpload;
