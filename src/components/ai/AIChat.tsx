import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from 'sonner';
import ChatHeader from './ChatHeader';
import MessageList from './MessageList';
import ChatInput from './ChatInput';
import APISettings from './APISettings';
import ModelOptions from './ModelOptions';
import { AnimatePresence } from 'framer-motion';
import { callAIAPI, generateDataContext } from './utils';
import { Message, AIServiceOptions } from './types';
import { AlertCircle } from 'lucide-react';

interface AIChatProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data?: any[];
  columns?: string[];
}

const AIChat = ({ open, onOpenChange, data, columns }: AIChatProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '0',
      role: 'assistant',
      content: "Hello! I'm TITAN, your advanced data analysis assistant. How can I help you analyze your data today?",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [aiOptions, setAIOptions] = useState<AIServiceOptions>({
    model: 'gemini-2.0-flash',
    temperature: 0.7,
    maxTokens: 1000
  });
  const [showOptions, setShowOptions] = useState(false);
  const [isIntroScreen, setIsIntroScreen] = useState(false);
  const [savedResponses, setSavedResponses] = useState<Message[]>([]);

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    
    try {
      const dataContextText = generateDataContext(data, columns);
      
      const chatHistory = [...messages, userMessage];
      
      if (chatHistory.length <= 2) {
        chatHistory[1].content = `${dataContextText}\n\n${chatHistory[1].content}`;
      }
      
      const response = await callAIAPI(chatHistory, aiOptions);
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error getting AI response:', error);
      toast.error('Failed to get AI response. Please try again.');
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "I'm sorry, I encountered an error processing your request. Please try again.",
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOptionsChange = (newOptions: Partial<AIServiceOptions>) => {
    setAIOptions({...aiOptions, ...newOptions});
    if (newOptions.temperature) {
      toast.success(`Temperature updated to ${newOptions.temperature}`);
    }
    if (newOptions.model) {
      toast.success(`Model changed to ${newOptions.model}`);
    }
  };

  const handleStartUsingAI = () => {
    setIsIntroScreen(false);
    toast.success('AI assistant is ready to help with your data!');
  };

  const handleClearConversation = () => {
    setMessages([
      {
        id: '0',
        role: 'assistant',
        content: "Hello! I'm TITAN, your advanced data analysis assistant. How can I help you analyze your data today?",
        timestamp: new Date()
      }
    ]);
    toast.info('Conversation cleared');
  };

  const getModelName = () => {
    const modelNames: {[key: string]: string} = {
      'gemini-2.0-flash': 'Gemini 2.0 Flash',
      'gemini-2.0-pro': 'Gemini 2.0 Pro',
      'gemini-2.0-ultra': 'Gemini 2.0 Ultra',
    };
    return modelNames[aiOptions.model] || aiOptions.model;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] flex flex-col p-0 overflow-hidden rounded-xl">
        <ChatHeader 
          modelName={getModelName()}
          onSaveConversation={() => {
            setSavedResponses(messages);
            toast.success('Conversation saved');
          }}
          onClearConversation={handleClearConversation}
          onToggleOptions={() => setShowOptions(!showOptions)}
        />
        
        <div className="flex-1 p-4 overflow-hidden flex flex-col">
          <div className="flex items-center justify-between px-2 mb-4">
            <div className="text-sm text-muted-foreground">
              {data && columns ? `Analyzing ${data.length} rows × ${columns.length} columns` : 'No data loaded'}
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-xs"
              onClick={() => setShowOptions(!showOptions)}
            >
              {showOptions ? 'Hide Options' : 'Show Options'}
            </Button>
          </div>
          
          <AnimatePresence>
            {isIntroScreen && (
              <APISettings 
                onSaveSettings={handleStartUsingAI}
                onCancel={() => setIsIntroScreen(false)}
              />
            )}
          
            {showOptions && !isIntroScreen && (
              <ModelOptions 
                aiOptions={aiOptions}
                onOptionsChange={handleOptionsChange}
                onToggle={() => setShowOptions(!showOptions)}
                showOptions={showOptions}
              />
            )}
          </AnimatePresence>
          
          <div className="flex-1 overflow-y-auto mb-4 custom-scrollbar">
            <MessageList 
              messages={messages}
              isLoading={isLoading}
              onCopyToClipboard={(content) => {
                navigator.clipboard.writeText(content);
                toast.success('Copied to clipboard');
              }}
            />
          </div>
          
          <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 text-amber-800 dark:text-amber-200 rounded-lg px-4 py-2 text-xs flex items-start gap-2 mb-3">
            <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
            <span>This is a demo AI chat using Google's Gemini API. Results may vary and the API has usage limitations. Not for production use.</span>
          </div>
        </div>
        
        <ChatInput 
          input={input}
          setInput={setInput}
          handleSend={handleSend}
          handleKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          isLoading={isLoading}
          modelName={getModelName()}
        />
      </DialogContent>
    </Dialog>
  );
};

export default AIChat;
