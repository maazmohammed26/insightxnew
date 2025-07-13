import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { 
  FileText, FileSpreadsheet, Lock, Upload, Download, 
  FileCheck, FileWarning, Filter, Share2, Settings,
  Database, DatabaseBackup
} from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { generateDataInsights, importSharedAnalysis, exportSharedAnalysis } from '@/utils/exportUtils';

interface ExportButtonsProps {
  data: any[];
  columns: string[];
  fileName: string;
}

const ExportButtons = ({ data, columns, fileName }: ExportButtonsProps) => {
  const [isExporting, setIsExporting] = useState(false);
  const [exportType, setExportType] = useState<'public' | 'protected'>('public');
  const [exportFormat, setExportFormat] = useState<'json' | 'csv'>('json');
  const [pin, setPin] = useState('');
  const [showPinDialog, setShowPinDialog] = useState(false);
  const [importPin, setImportPin] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [includeMetadata, setIncludeMetadata] = useState(true);
  const [compressExport, setCompressExport] = useState(false);

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log('Starting file import process');
    const file = event.target.files?.[0];
    if (!file) return;
    setSelectedFile(file);

    try {
      const fileContent = await file.text();
      const { isProtected } = JSON.parse(fileContent);
      
      if (isProtected) {
        console.log('Protected file detected, showing PIN dialog');
        setShowPinDialog(true);
      } else {
        console.log('Importing unprotected file');
        const analysis = await importSharedAnalysis(file);
        toast.success('Analysis imported successfully');
      }
    } catch (error) {
      console.error('Import error:', error);
      toast.error('Failed to read file');
    }
  };

  const handlePinSubmit = async () => {
    if (!selectedFile) return;
    console.log('Attempting to import protected file with PIN');

    try {
      const analysis = await importSharedAnalysis(selectedFile, importPin);
      toast.success('Protected analysis imported successfully');
      setShowPinDialog(false);
      setImportPin('');
      setSelectedFile(null);
    } catch (error) {
      console.error('PIN submission error:', error);
      toast.error('Invalid PIN or corrupted file');
    }
  };

  const handleExport = async () => {
    console.log('Starting export process');
    setIsExporting(true);
    
    try {
      const insights = generateDataInsights(data, columns);
      
      const analysis = {
        id: `${Date.now()}-${Math.random().toString(36).substring(7)}`,
        data,
        insights,
        metadata: includeMetadata ? {
          exportDate: new Date().toISOString(),
          columnCount: columns.length,
          rowCount: data.length,
          fileName
        } : undefined,
        timestamp: Date.now(),
        sharedBy: 'anonymous',
        sharedWith: 'public'
      };

      if (exportType === 'protected') {
        if (pin.length !== 4) {
          toast.error('Please enter a 4-digit PIN');
          return;
        }
        console.log('Exporting protected analysis');
        exportSharedAnalysis(analysis, pin);
        toast.success('Protected analysis exported successfully');
      } else {
        console.log('Exporting public analysis');
        exportSharedAnalysis(analysis);
        toast.success('Analysis exported successfully');
      }
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Error exporting analysis');
    } finally {
      setIsExporting(false);
      setPin('');
    }
  };

  return (
    <ScrollArea className="w-full">
      <div className="space-y-4 min-w-[300px]">
        <div className="flex flex-col gap-4 p-4 bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 rounded-lg border border-purple-100 dark:border-purple-800">
          <h3 className="text-sm font-medium flex items-center gap-2">
            <Settings className="w-4 h-4 text-purple-500" />
            Export Settings
          </h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select 
              value={exportType} 
              onValueChange={(value: 'public' | 'protected') => setExportType(value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select export type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="public">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-blue-500" />
                    <span>Public Export</span>
                  </div>
                </SelectItem>
                <SelectItem value="protected">
                  <div className="flex items-center gap-2">
                    <Lock className="w-4 h-4 text-purple-500" />
                    <span>PIN Protected</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>

            <Select 
              value={exportFormat} 
              onValueChange={(value: 'json' | 'csv') => setExportFormat(value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select format" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="json">
                  <div className="flex items-center gap-2">
                    <Database className="w-4 h-4 text-orange-500" />
                    <span>JSON Format</span>
                  </div>
                </SelectItem>
                <SelectItem value="csv">
                  <div className="flex items-center gap-2">
                    <FileSpreadsheet className="w-4 h-4 text-green-500" />
                    <span>CSV Format</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>

            {exportType === 'protected' && (
              <Input
                type="number"
                placeholder="4-digit PIN"
                value={pin}
                onChange={(e) => setPin(e.target.value.slice(0, 4))}
                className="w-full"
                maxLength={4}
              />
            )}
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <label className="text-sm flex items-center gap-2">
                <DatabaseBackup className="w-4 h-4 text-indigo-500" />
                Include Metadata
              </label>
              <Switch
                checked={includeMetadata}
                onCheckedChange={setIncludeMetadata}
              />
            </div>
            <div className="flex items-center justify-between">
              <label className="text-sm flex items-center gap-2">
                <Filter className="w-4 h-4 text-indigo-500" />
                Compress Export
              </label>
              <Switch
                checked={compressExport}
                onCheckedChange={setCompressExport}
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              onClick={handleExport}
              disabled={isExporting || (exportType === 'protected' && pin.length !== 4)}
              className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white"
            >
              <Download className="mr-2 h-4 w-4" />
              {isExporting ? 'Exporting...' : 'Export Analysis'}
            </Button>
          </motion.div>

          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <div className="relative">
              <input
                type="file"
                accept=".json,.csv"
                onChange={handleImport}
                className="hidden"
                id="import-analysis"
              />
              <Button
                onClick={() => document.getElementById('import-analysis')?.click()}
                className="w-full bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white"
              >
                <Upload className="mr-2 h-4 w-4" />
                Import Analysis
              </Button>
            </div>
          </motion.div>

          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              onClick={() => {
                const csvContent = [
                  columns.join(','),
                  ...data.map(row => columns.map(col => row[col]).join(','))
                ].join('\n');
                
                const blob = new Blob([csvContent], { type: 'text/csv' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `${fileName.replace(/\.[^/.]+$/, '')}_raw.csv`;
                a.click();
                URL.revokeObjectURL(url);
                
                toast.success('Raw data exported successfully');
              }}
              variant="outline"
              className="w-full border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20"
            >
              <FileSpreadsheet className="mr-2 h-4 w-4" />
              Export Raw CSV
            </Button>
          </motion.div>
        </div>

        <Dialog open={showPinDialog} onOpenChange={setShowPinDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Enter PIN</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 p-4">
              <Input
                type="number"
                placeholder="Enter 4-digit PIN"
                value={importPin}
                onChange={(e) => setImportPin(e.target.value.slice(0, 4))}
                maxLength={4}
              />
              <Button onClick={handlePinSubmit} className="w-full">
                Import Protected File
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </ScrollArea>
  );
};

export default ExportButtons;