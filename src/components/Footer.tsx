
import React from 'react';
import { Github, Linkedin, Globe } from 'lucide-react';
import { motion } from 'framer-motion';

const Footer = () => {
  const handleLinkClick = (e: React.MouseEvent) => {
    e.preventDefault();
    // Links are dummy - no action taken
  };

  return (
    <footer className="w-full border-t border-gray-200 dark:border-gray-700 py-6 mt-auto bg-white/50 dark:bg-gray-950/50 backdrop-blur-sm">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-sm text-gray-600 dark:text-gray-300 flex items-center gap-3"
          >
            <div className="w-10 h-10 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-lg">IX</span>
            </div>
            <span>© 2025 InsightX. All rights reserved. Built by InsightX Team for Data Enthusiasts.</span>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center space-x-4"
          >
            {[
              { icon: Github, label: "GitHub", color: "hover:text-gray-900 dark:hover:text-gray-100" },
              { icon: Linkedin, label: "LinkedIn", color: "hover:text-blue-600 dark:hover:text-blue-400" },
              { icon: Globe, label: "Portfolio", color: "hover:text-indigo-600 dark:hover:text-indigo-400" }
            ].map(({ icon: Icon, label, color }, index) => (
              <motion.a
                key={label}
                href="#"
                onClick={handleLinkClick}
                aria-label={label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.2, y: -2 }}
                whileTap={{ scale: 0.9 }}
                className={`text-gray-600 dark:text-gray-400 ${color} transition-all duration-300 cursor-pointer p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800`}
              >
                <Icon className="h-5 w-5" />
              </motion.a>
            ))}
          </motion.div>
        </div>
        
      </div>
    </footer>
  );
};

export default Footer;
