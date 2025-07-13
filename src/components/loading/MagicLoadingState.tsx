
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Database, BarChart3, TrendingUp, Brain, Zap, Activity } from 'lucide-react';

interface MagicLoadingStateProps {
  isVisible: boolean;
  onComplete: () => void;
}

const MagicLoadingState = ({ isVisible, onComplete }: MagicLoadingStateProps) => {
  const [currentMessage, setCurrentMessage] = useState(0);
  
  const loadingMessages = [
    "🔍 Analyzing your data structure...",
    "📊 Generating visualizations...", 
    "🧠 Processing insights...",
    "✨ Preparing your dashboard...",
    "🚀 Almost ready!"
  ];

  const dataIcons = [Database, BarChart3, TrendingUp, Brain, Zap, Activity];

  useEffect(() => {
    if (!isVisible) return;

    const messageInterval = setInterval(() => {
      setCurrentMessage(prev => (prev + 1) % loadingMessages.length);
    }, 900);

    const completeTimer = setTimeout(() => {
      onComplete();
    }, 4500);

    return () => {
      clearInterval(messageInterval);
      clearTimeout(completeTimer);
    };
  }, [isVisible, onComplete]);

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, rgba(147, 51, 234, 0.15) 0%, rgba(79, 70, 229, 0.15) 25%, rgba(59, 130, 246, 0.15) 50%, rgba(16, 185, 129, 0.15) 75%, rgba(245, 158, 11, 0.15) 100%)',
          backdropFilter: 'blur(20px)',
        }}
      >
        {/* Subtle floating particles */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(15)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 rounded-full"
              style={{
                background: 'rgba(255, 255, 255, 0.3)',
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`
              }}
              animate={{
                y: [0, -50, 0],
                opacity: [0.3, 0.8, 0.3],
                scale: [0.5, 1, 0.5]
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: i * 0.3,
                ease: "easeInOut"
              }}
            />
          ))}
        </div>

        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="text-center space-y-8 z-10 max-w-md mx-auto px-6"
        >
          {/* Fixed Logo with glass effect */}
          <motion.div 
            className="relative mx-auto w-20 h-20"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <div 
              className="absolute inset-0 rounded-full"
              style={{
                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.25) 0%, rgba(255, 255, 255, 0.1) 100%)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.2)'
              }}
            />
            <img
              src="/lovable-uploads/b0078076-6a7e-4146-92e2-e132f369019e.png"
              alt="InsightX Logo"
              className="w-20 h-20 object-contain relative z-10 p-2"
            />
            
            {/* Subtle pulse ring */}
            <motion.div
              className="absolute inset-0 rounded-full border border-white/20"
              animate={{ 
                scale: [1, 1.2, 1],
                opacity: [0.5, 0.2, 0.5]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          </motion.div>

          {/* Floating data icons */}
          <div className="relative h-12 overflow-hidden">
            {dataIcons.map((Icon, index) => (
              <motion.div
                key={index}
                className="absolute left-1/2"
                animate={{
                  x: [-60, 60],
                  y: [0, -10, 0],
                  opacity: [0, 1, 0]
                }}
                transition={{
                  duration: 2.5,
                  repeat: Infinity,
                  delay: index * 0.4,
                  ease: "easeInOut"
                }}
                style={{
                  top: `${Math.random() * 40}px`
                }}
              >
                <Icon 
                  className="w-6 h-6 text-white/60" 
                />
              </motion.div>
            ))}
          </div>

          {/* Loading content */}
          <motion.div className="space-y-6">
            <motion.h2 
              className="text-2xl font-semibold text-white"
              animate={{ opacity: [0.8, 1, 0.8] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              Please wait...
            </motion.h2>
            
            <AnimatePresence mode="wait">
              <motion.p 
                key={currentMessage}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="text-lg text-white/90"
              >
                {loadingMessages[currentMessage]}
              </motion.p>
            </AnimatePresence>
            
            <motion.p 
              className="text-sm text-white/70 flex items-center justify-center gap-2"
              animate={{ opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              This might take a moment 
              <motion.span
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                ✨
              </motion.span>
            </motion.p>
          </motion.div>

          {/* Glass progress bar */}
          <motion.div 
            className="w-80 h-2 mx-auto rounded-full overflow-hidden"
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}
          >
            <motion.div
              className="h-full rounded-full relative overflow-hidden"
              style={{
                background: 'linear-gradient(90deg, rgba(147, 51, 234, 0.8) 0%, rgba(79, 70, 229, 0.8) 25%, rgba(59, 130, 246, 0.8) 50%, rgba(16, 185, 129, 0.8) 75%, rgba(245, 158, 11, 0.8) 100%)'
              }}
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 4.5, ease: "easeInOut" }}
            >
              {/* Shimmer effect */}
              <motion.div
                className="absolute inset-0 bg-white/20"
                animate={{ x: [-100, 320] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                style={{
                  background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
                  width: '80px'
                }}
              />
            </motion.div>
          </motion.div>

          {/* Brand text */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.5 }}
            className="text-white/60 text-xs font-medium"
          >
            Powered by InsightX Team
          </motion.div>
        </motion.div>

        {/* Subtle background decoration */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full"
              style={{
                background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
                width: `${100 + i * 50}px`,
                height: `${100 + i * 50}px`,
                left: `${20 + (i * 15)}%`,
                top: `${30 + Math.sin(i) * 20}%`
              }}
              animate={{
                scale: [1, 1.1, 1],
                opacity: [0.1, 0.2, 0.1]
              }}
              transition={{
                duration: 4 + i,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          ))}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default MagicLoadingState;
