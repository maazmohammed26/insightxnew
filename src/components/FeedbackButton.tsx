import React from 'react';
import { Button } from '@/components/ui/button';
import { MessageSquare } from 'lucide-react';

const FeedbackButton = () => {
  const handleFeedback = () => {
    window.location.href = 'mailto:maazmohammed112@gmail.com?subject=CSV Analyzer Feedback';
  };

  return (
    <Button
      onClick={handleFeedback}
      className="fixed bottom-4 right-4 bg-primary hover:bg-primary/90 text-white shadow-lg hover:shadow-xl transition-all duration-300 animate-fade-in"
    >
      <MessageSquare className="w-4 h-4 mr-2" />
      Send Feedback
    </Button>
  );
};

export default FeedbackButton;