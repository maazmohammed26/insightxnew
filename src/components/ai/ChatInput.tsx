
import React, { useRef, useEffect } from 'react';
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Send, Loader2, Sparkles } from 'lucide-react';

interface ChatInputProps {
  input: string;
  setInput: (value: string) => void;
  handleSend: () => void;
  handleKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  isLoading: boolean;
  modelName: string;
}

const ChatInput: React.FC<ChatInputProps> = ({
  input,
  setInput,
  handleSend,
  handleKeyDown,
  isLoading,
  modelName,
}) => {
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <div className="p-4 border-t bg-gradient-to-r from-purple-50/50 to-indigo-50/50 dark:from-purple-900/30 dark:to-indigo-900/30">
      <div className="flex gap-2">
        <Textarea
          ref={inputRef}
          placeholder="Ask something about your data..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className="min-h-[60px] resize-none rounded-xl border-purple-200 dark:border-purple-800/50 focus:border-purple-400 dark:focus:border-purple-600"
        />
        <Button
          type="submit"
          size="icon"
          disabled={isLoading || !input.trim()}
          onClick={handleSend}
          className={`self-end rounded-xl bg-purple-600 hover:bg-purple-700 ${isLoading ? 'opacity-50' : ''}`}
        >
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
        </Button>
      </div>
      
      <div className="mt-2 text-xs text-muted-foreground flex items-center gap-1">
        <div className="flex items-center gap-1">
          <Sparkles className="h-3 w-3 text-purple-500" />
          <span>
            Powered by {modelName || "Gemini 2.0 Flash"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ChatInput;
