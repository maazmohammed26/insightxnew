
import React from 'react';
import { Button } from "@/components/ui/button";
import { Sparkles, ChevronDown, Brain } from 'lucide-react';
import { motion } from 'framer-motion';

interface AIFeatureButtonProps {
  onClick: () => void;
}

export const AIFeatureButton = ({ onClick }: AIFeatureButtonProps) => {
  return (
    <Button 
      variant="gradient" 
      className="gap-2 group" 
      onClick={onClick}
    >
      <Sparkles className="w-4 h-4 group-hover:animate-pulse" />
      <span>AI Assistant</span>
    </Button>
  );
};

interface AIFloatingButtonProps {
  onClick: () => void;
  isOpen: boolean;
}

export const AIFloatingButton = ({ onClick, isOpen }: AIFloatingButtonProps) => {
  return (
    <motion.div
      className="fixed bottom-6 right-6 z-50"
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        className="relative"
        whileHover={{ scale: 1.1 }}
        transition={{ type: "spring", stiffness: 400, damping: 10 }}
      >
        <Button
          variant="gradient-purple"
          size="lg"
          className="rounded-full w-14 h-14 shadow-lg hover:shadow-xl p-0 flex items-center justify-center overflow-hidden"
          onClick={onClick}
        >
          <motion.div
            initial={false}
            animate={isOpen ? { rotate: 180 } : { rotate: 0 }}
            transition={{ duration: 0.3 }}
          >
            {isOpen ? (
              <ChevronDown className="w-6 h-6" />
            ) : (
              <motion.div
                animate={{ 
                  rotate: [0, 10, -10, 10, 0],
                  scale: [1, 1.1, 1, 1.1, 1]
                }}
                transition={{ 
                  duration: 2, 
                  ease: "easeInOut", 
                  repeat: Infinity, 
                  repeatDelay: 4
                }}
              >
                <Brain className="w-6 h-6" />
              </motion.div>
            )}
          </motion.div>
        </Button>
        <motion.div
          className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"
          initial={{ scale: 0 }}
          animate={{ 
            scale: [0.8, 1.2, 0.8], 
            opacity: [0.7, 1, 0.7] 
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        />
      </motion.div>
    </motion.div>
  );
};
