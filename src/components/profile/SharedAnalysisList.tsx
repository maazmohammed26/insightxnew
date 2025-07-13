import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Share2, Link, FileSpreadsheet } from 'lucide-react';
import { toast } from 'sonner';

interface SharedAnalysis {
  id: string;
  fileName: string;
  sharedWith: string;
  timestamp: number;
}

const SharedAnalysisList = () => {
  const [sharedAnalyses, setSharedAnalyses] = React.useState<SharedAnalysis[]>(() => {
    const saved = localStorage.getItem('sharedAnalyses');
    return saved ? JSON.parse(saved) : [];
  });

  const copyShareLink = (analysisId: string) => {
    const shareUrl = `${window.location.origin}/shared/${analysisId}`;
    navigator.clipboard.writeText(shareUrl);
    toast.success('Share link copied to clipboard!');
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-medium flex items-center gap-2">
          <Share2 className="h-5 w-5 text-purple-500" />
          Shared Analyses
        </h3>
      </div>

      {sharedAnalyses.length === 0 ? (
        <Card className="p-6 text-center text-muted-foreground">
          <FileSpreadsheet className="h-12 w-12 mx-auto mb-2 opacity-50" />
          <p>No shared analyses yet</p>
        </Card>
      ) : (
        sharedAnalyses.map((analysis) => (
          <Card key={analysis.id} className="p-4 animate-fade-in">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h4 className="font-medium">{analysis.fileName}</h4>
                <p className="text-sm text-muted-foreground">
                  Shared with: {analysis.sharedWith}
                </p>
                <p className="text-xs text-muted-foreground">
                  {new Date(analysis.timestamp).toLocaleString()}
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => copyShareLink(analysis.id)}
                className="text-blue-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20"
              >
                <Link className="h-4 w-4" />
              </Button>
            </div>
          </Card>
        ))
      )}
    </div>
  );
};

export default SharedAnalysisList;