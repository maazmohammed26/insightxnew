import React, { useState, lazy, Suspense, useEffect, useRef } from 'react';
import { toast } from 'sonner';
import LoadingState from './loading/LoadingState';
import MagicLoadingState from './loading/MagicLoadingState';
import * as LZString from 'lz-string';

// Lazy load components
const FileUploadSection = lazy(() => import('./main/FileUploadSection'));
const DataAnalysisSection = lazy(() => import('./main/DataAnalysisSection'));

const MainContent = () => {
  const [data, setData] = useState<any[]>([]);
  const [columns, setColumns] = useState<string[]>([]);
  const [fileName, setFileName] = useState<string>('');
  const [showUpload, setShowUpload] = useState(true);
  const [showHistory, setShowHistory] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showMagicLoading, setShowMagicLoading] = useState(false);

  // Load saved data on component mount
  useEffect(() => {
    const loadSavedData = () => {
      try {
        const compressedData = localStorage.getItem('csvData');
        const compressedColumns = localStorage.getItem('csvColumns');
        const savedFileName = localStorage.getItem('csvFileName');

        if (compressedData && compressedColumns && savedFileName) {
          console.log('Restoring saved session data');
          const decompressedData = JSON.parse(LZString.decompress(compressedData) || '[]');
          const decompressedColumns = JSON.parse(LZString.decompress(compressedColumns) || '[]');
          setData(decompressedData);
          setColumns(decompressedColumns);
          setFileName(savedFileName);
          setShowUpload(false);
        }
      } catch (error) {
        console.error('Error loading saved data:', error);
        toast.error('Error loading saved data');
      }
    };

    loadSavedData();

    // Add event listener for online/offline status
    const handleOnline = () => {
      console.log('Connection restored');
      loadSavedData();
    };

    window.addEventListener('online', handleOnline);
    return () => window.removeEventListener('online', handleOnline);
  }, []);

  const handleFileUpload = async (file: File) => {
    setIsProcessing(true);
    
    try {
      // Create a worker for parsing
      const worker = new Worker(new URL('../workers/csvParser.js', import.meta.url));
      
      const workerPromise = new Promise((resolve, reject) => {
        worker.onmessage = (e) => {
          if (e.data.error) {
            reject(new Error(e.data.error));
            return;
          }
          resolve(e.data);
        };
        
        worker.onerror = () => {
          reject(new Error('Error parsing CSV file'));
        };
      });

      // Start reading the file
      const reader = new FileReader();
      reader.onload = async (e) => {
        worker.postMessage({ csv: e.target?.result });
      };
      reader.readAsText(file);

      // Wait for worker to complete
      const { data: parsedData, columns: parsedColumns } = await workerPromise as { 
        data: any[]; 
        columns: string[]; 
      };

      // Validate parsed data - ensure we have actual data
      if (!Array.isArray(parsedData) || parsedData.length === 0) {
        throw new Error('Invalid CSV data format');
      }
      
      console.log(`Loaded ${parsedData.length} rows of data with ${parsedColumns.length} columns`);

      // Show magic loading animation
      setIsProcessing(false);
      setShowMagicLoading(true);

      // Store data temporarily
      const tempData = { parsedData, parsedColumns, fileName: file.name };
      
      // Wait for magic loading to complete, then save and set data
      setTimeout(() => {
        try {
          // Compress data before storage
          const compressedData = LZString.compress(JSON.stringify(tempData.parsedData));
          const compressedColumns = LZString.compress(JSON.stringify(tempData.parsedColumns));
          
          // Check compressed size before attempting to save
          const totalSize = (compressedData.length + compressedColumns.length) * 2;
          if (totalSize > 4.5 * 1024 * 1024) {
            throw new Error('Dataset too large for browser storage');
          }

          localStorage.setItem('csvData', compressedData);
          localStorage.setItem('csvColumns', compressedColumns);
          localStorage.setItem('csvFileName', tempData.fileName);
          
          setData(tempData.parsedData);
          setColumns(tempData.parsedColumns);
          setFileName(tempData.fileName);
          setShowUpload(false);
          toast.success('CSV file loaded successfully');
        } catch (storageError) {
          console.error('Storage error:', storageError);
          // Still set the data in memory even if storage fails
          setData(tempData.parsedData);
          setColumns(tempData.parsedColumns);
          setFileName(tempData.fileName);
          setShowUpload(false);
          toast.warning('File loaded but too large to save for later use');
        }
      }, 100);
      
    } catch (error) {
      console.error('Error processing file:', error);
      toast.error(error instanceof Error ? error.message : 'Error processing CSV file');
      setIsProcessing(false);
    }
  };

  const handleMagicLoadingComplete = () => {
    setShowMagicLoading(false);
  };

  const handleNewUpload = () => {
    try {
      localStorage.removeItem('csvData');
      localStorage.removeItem('csvColumns');
      localStorage.removeItem('csvFileName');
      
      setShowUpload(true);
      setData([]);
      setColumns([]);
      setFileName('');
      setShowHistory(false);
      toast.success('Returned to upload screen');
    } catch (error) {
      console.error('Error clearing saved data:', error);
      toast.error('Error clearing saved data');
    }
  };

  return (
    <>
      <div className="container mx-auto py-2 sm:py-8 space-y-4 sm:space-y-8 px-2 sm:px-6 lg:px-8 smooth-scroll main-content overflow-x-hidden">
        <Suspense fallback={<LoadingState isProcessing={true} />}>
          {isProcessing ? (
            <LoadingState isProcessing={true} />
          ) : showUpload ? (
            <FileUploadSection
              showHistory={showHistory}
              setShowHistory={setShowHistory}
              handleFileUpload={handleFileUpload}
            />
          ) : (
            <DataAnalysisSection
              fileName={fileName}
              onNewUpload={handleNewUpload}
              data={data}
              columns={columns}
              isLoading={isProcessing}
            />
          )}
        </Suspense>
      </div>
      
      <MagicLoadingState 
        isVisible={showMagicLoading} 
        onComplete={handleMagicLoadingComplete} 
      />
    </>
  );
};

export default MainContent;
