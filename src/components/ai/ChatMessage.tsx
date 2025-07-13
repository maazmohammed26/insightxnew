
import React from 'react';
import { Button } from "@/components/ui/button";
import { Bot, User, Copy } from 'lucide-react';
import { motion } from 'framer-motion';
import { Message } from './types';

interface ChatMessageProps {
  message: Message;
  onCopy: (content: string) => void;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message, onCopy }) => {
  const renderMessageContent = (content: string) => {
    // Simple markdown-like rendering for code blocks
    const parts = content.split('```');
    if (parts.length > 1) {
      return (
        <>
          {parts.map((part, index) => {
            if (index % 2 === 0) {
              return <p key={index} className="whitespace-pre-wrap">{part}</p>;
            } else {
              return (
                <pre key={index} className="bg-gray-100 dark:bg-gray-800 p-3 rounded-md my-2 overflow-x-auto">
                  <code>{part}</code>
                </pre>
              );
            }
          })}
        </>
      );
    }
    
    return <p className="whitespace-pre-wrap">{content}</p>;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex items-start gap-3 ${
        message.role === 'user' ? 'justify-end' : 'justify-start'
      }`}
    >
      {message.role === 'assistant' && (
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white">
          <Bot className="h-4 w-4" />
        </div>
      )}
      
      <div
        className={`max-w-[80%] p-3 rounded-lg relative group ${
          message.role === 'user'
            ? 'bg-primary text-primary-foreground'
            : 'bg-gray-100 dark:bg-gray-800 text-foreground'
        }`}
      >
        {renderMessageContent(message.content)}
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={() => onCopy(message.content)}
          >
            <Copy className="h-3 w-3" />
          </Button>
        </div>
        <div className="text-xs text-muted-foreground mt-1">
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
      
      {message.role === 'user' && (
        <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
          <User className="h-4 w-4" />
        </div>
      )}
    </motion.div>
  );
};

export default ChatMessage;
