import React, { useEffect } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { History, FileDown, Trash2, Settings, Lock, Share2, Copy, CloudOff, Cloud } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import SettingsDialog from './SettingsDialog';
import { Switch } from '@/components/ui/switch';
import HistoryFilters from './history/HistoryFilters';

interface HistoryEntry {
  timestamp: number;
  fileName: string;
  rowCount: number;
  columnCount: number;
  isPrivate?: boolean;
  lastModified?: number;
  shareId?: string;
}

const HistorySection = () => {
  const [isEncrypted, setIsEncrypted] = React.useState(false);
  const [isCloudSync, setIsCloudSync] = React.useState(false);
  const [history, setHistory] = React.useState<HistoryEntry[]>([]);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [filteredHistory, setFilteredHistory] = React.useState<HistoryEntry[]>([]);

  useEffect(() => {
    const loadHistory = () => {
      const localHistory = localStorage.getItem('csvHistory');
      if (localHistory) {
        setHistory(JSON.parse(localHistory));
      }
    };

    loadHistory();
    window.addEventListener('storage', loadHistory);
    return () => window.removeEventListener('storage', loadHistory);
  }, []);

  useEffect(() => {
    const filtered = history.filter(entry =>
      entry.fileName.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredHistory(filtered);
  }, [searchTerm, history]);

  const clearHistory = () => {
    localStorage.removeItem('csvHistory');
    setHistory([]);
    toast.success('History cleared');
  };

  const togglePrivacy = (index: number) => {
    const updatedHistory = [...history];
    updatedHistory[index].isPrivate = !updatedHistory[index].isPrivate;
    localStorage.setItem('csvHistory', JSON.stringify(updatedHistory));
    setHistory(updatedHistory);
    toast.success('Privacy settings updated');
  };

  const toggleEncryption = () => {
    setIsEncrypted(!isEncrypted);
    toast.success(`Encryption ${!isEncrypted ? 'enabled' : 'disabled'}`);
  };

  const toggleCloudSync = () => {
    setIsCloudSync(!isCloudSync);
    toast.success(`Cloud sync ${!isCloudSync ? 'enabled' : 'disabled'}`);
  };

  const shareHistory = (entry: HistoryEntry) => {
    const shareId = Math.random().toString(36).substring(2, 15);
    const shareUrl = `${window.location.origin}/share/${shareId}`;
    
    navigator.clipboard.writeText(shareUrl).then(() => {
      const updatedHistory = history.map(h => 
        h.timestamp === entry.timestamp ? { ...h, shareId } : h
      );
      localStorage.setItem('csvHistory', JSON.stringify(updatedHistory));
      setHistory(updatedHistory);
      toast.success('Share link copied to clipboard!');
    }).catch(() => {
      toast.error('Failed to copy share link');
    });
  };

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex justify-between items-center bg-background/90 dark:bg-gray-800/90 p-4 rounded-lg shadow-md backdrop-blur-sm border border-border">
        <div className="flex items-center gap-2">
          <History className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-bold text-foreground">Analysis History</h2>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Lock className="h-4 w-4 text-foreground" />
            <Switch
              checked={isEncrypted}
              onCheckedChange={toggleEncryption}
              aria-label="Toggle encryption"
            />
          </div>
          <div className="flex items-center gap-2">
            {isCloudSync ? (
              <Cloud className="h-4 w-4 text-foreground" />
            ) : (
              <CloudOff className="h-4 w-4 text-foreground" />
            )}
            <Switch
              checked={isCloudSync}
              onCheckedChange={toggleCloudSync}
              aria-label="Toggle cloud sync"
            />
          </div>
          {history.length > 0 && (
            <Button variant="destructive" onClick={clearHistory} className="shadow-sm">
              <Trash2 className="mr-2 h-4 w-4" />
              Clear History
            </Button>
          )}
          <SettingsDialog />
        </div>
      </div>

      <HistoryFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onFilterClick={() => toast.info('Filters coming soon!')}
      />

      <ScrollArea className="h-[400px] rounded-lg">
        <div className="grid gap-4 p-4">
          {filteredHistory.length === 0 ? (
            <Card className="bg-background/90 dark:bg-gray-800/90 shadow-lg backdrop-blur-sm border border-border">
              <CardContent className="pt-6 text-center text-muted-foreground">
                <History className="mx-auto h-12 w-12 mb-2 opacity-50" />
                <p>{searchTerm ? 'No matching entries found' : 'No analysis history yet'}</p>
              </CardContent>
            </Card>
          ) : (
            filteredHistory.map((entry, index) => (
              <Card 
                key={index} 
                className={`bg-background/90 dark:bg-gray-800/90 hover:shadow-lg transition-all duration-300 animate-fade-in border border-border ${
                  entry.isPrivate ? 'ring-2 ring-primary' : ''
                }`}
              >
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex justify-between items-center">
                    <span className="font-medium text-primary">
                      {entry.fileName}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {new Date(entry.timestamp).toLocaleString()}
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="bg-muted/50 dark:bg-muted/20 p-2 rounded-md text-foreground">
                      Rows: {entry.rowCount}
                    </div>
                    <div className="bg-muted/50 dark:bg-muted/20 p-2 rounded-md text-foreground">
                      Columns: {entry.columnCount}
                    </div>
                  </div>
                  <div className="mt-4 flex gap-2">
                    <Button 
                      variant="outline" 
                      className="flex-1 hover:bg-muted/50 dark:hover:bg-muted/20"
                      onClick={() => togglePrivacy(index)}
                    >
                      <Lock className="mr-2 h-4 w-4" />
                      {entry.isPrivate ? 'Make Public' : 'Make Private'}
                    </Button>
                    <Button 
                      variant="outline" 
                      className="flex-1 hover:bg-muted/50 dark:hover:bg-muted/20"
                      onClick={() => shareHistory(entry)}
                    >
                      {entry.shareId ? (
                        <Copy className="mr-2 h-4 w-4" />
                      ) : (
                        <Share2 className="mr-2 h-4 w-4" />
                      )}
                      {entry.shareId ? 'Copy Link' : 'Share'}
                    </Button>
                    <Button 
                      variant="outline" 
                      className="flex-1 hover:bg-muted/50 dark:hover:bg-muted/20"
                    >
                      <FileDown className="mr-2 h-4 w-4" />
                      Export
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default HistorySection;
