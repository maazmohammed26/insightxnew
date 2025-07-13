
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { motion } from 'framer-motion';
import { RocketIcon } from 'lucide-react';

interface WelcomeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const WelcomeDialog = ({ open, onOpenChange }: WelcomeDialogProps) => {
  // Get user profile to personalize welcome message
  const getUserProfile = () => {
    try {
      const profile = localStorage.getItem('userProfile');
      return profile ? JSON.parse(profile) : null;
    } catch {
      return null;
    }
  };

  const userProfile = getUserProfile();
  const userName = userProfile?.name || 'there';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-gradient-to-br from-white to-purple-50 dark:from-gray-900 dark:to-purple-900/20">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Welcome to InsightX v3.0
          </DialogTitle>
          <DialogDescription className="text-gray-600 dark:text-gray-300">
            <div className="space-y-4 mt-4">
              <p>
                👋 Hi {userName}! Welcome to InsightX, presented by the InsightX team. We're excited to help you analyze your data!
              </p>
              <p>
                🚀 This advanced CSV analysis tool is designed to make data analysis easier and more intuitive, with powerful features like:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Advanced data visualization</li>
                <li>Machine learning insights</li>
                <li>Business analytics</li>
                <li>Custom dashboards</li>
                <li>Performance optimization</li>
                <li>Intelligent data processing with TITAN AI</li>
              </ul>
              <p className="text-sm text-purple-600 dark:text-purple-400 font-medium mt-4">
                Let's transform your data into actionable insights together!
              </p>
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default WelcomeDialog;
