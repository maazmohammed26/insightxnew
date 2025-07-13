
import React, { useRef, useEffect } from 'react';
import { Bot } from 'lucide-react';
import { Loader2 } from 'lucide-react';
import ChatMessage from './ChatMessage';
import { Message } from './types';
import { motion } from 'framer-motion';

interface MessageListProps {
  messages: Message[];
  isLoading: boolean;
  onCopyToClipboard: (content: string) => void;
}

const MessageList: React.FC<MessageListProps> = ({ 
  messages, 
  isLoading, 
  onCopyToClipboard 
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const messageVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.3
      }
    }
  };

  return (
    <motion.div 
      className="space-y-4 mb-4 w-full overflow-y-auto invisible-scrollbar max-h-[70vh]"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {messages.map((message) => (
        <motion.div key={message.id} variants={messageVariants}>
          <ChatMessage 
            message={message} 
            onCopy={onCopyToClipboard} 
          />
        </motion.div>
      ))}
      
      {isLoading && (
        <motion.div 
          className="flex items-start gap-3"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white">
            <Bot className="h-4 w-4" />
          </div>
          <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg">
            <div className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>TITAN is thinking<span className="dot-typing"></span></span>
            </div>
          </div>
        </motion.div>
      )}
      
      <div ref={messagesEndRef} />
    </motion.div>
  );
};

export default MessageList;
