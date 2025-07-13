
import React from 'react';
import { X, Save, Trash2, Settings } from 'lucide-react';
import { Button } from "@/components/ui/button";

interface ChatHeaderProps {
  onSaveConversation: () => void;
  onClearConversation: () => void;
  onToggleOptions: () => void;
  modelName: string;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({
  onSaveConversation,
  onClearConversation,
  onToggleOptions,
  modelName
}) => {
  return (
    <div className="flex items-center justify-between border-b p-3">
      <div className="flex items-center gap-2">
        <span className="font-semibold text-lg">TITAN Assistant</span>
        <span className="px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-xs rounded-full">
          {modelName}
        </span>
      </div>
      <div className="flex items-center space-x-2">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onToggleOptions}
          className="h-8 w-8"
        >
          <Settings className="h-4 w-4" />
        </Button>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onSaveConversation}
          className="h-8 w-8"
        >
          <Save className="h-4 w-4" />
        </Button>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onClearConversation}
          className="h-8 w-8"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default ChatHeader;
