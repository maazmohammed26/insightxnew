import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { HelpCircle } from 'lucide-react';

const FAQSection = () => {
  return (
    <div className="max-w-3xl mx-auto mt-12 p-6 bg-white/80 dark:bg-gray-800/80 rounded-xl shadow-lg backdrop-blur-sm animate-fade-in">
      <div className="flex items-center gap-2 mb-6">
        <HelpCircle className="h-6 w-6 text-purple-500" />
        <h2 className="text-2xl font-bold">Frequently Asked Questions</h2>
      </div>
      
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="item-1">
          <AccordionTrigger>How do I share my analysis with friends?</AccordionTrigger>
          <AccordionContent>
            After analyzing your CSV file, you can share it with specific friends by clicking the share button and selecting their names from your friends list. They'll receive a unique link to view your analysis.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-2">
          <AccordionTrigger>How do I manage my friends list?</AccordionTrigger>
          <AccordionContent>
            Access your profile section to view and manage your friends list. You can add new friends using their unique ID, remove existing friends, or share analyses with specific friends.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-3">
          <AccordionTrigger>What file formats are supported?</AccordionTrigger>
          <AccordionContent>
            Currently, we support CSV files. Make sure your file is properly formatted with headers and consistent data types for the best analysis results.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-4">
          <AccordionTrigger>How does the sharing system work?</AccordionTrigger>
          <AccordionContent>
            When you share an analysis, your friend receives a unique link. They can access the shared analysis through their profile section under "Shared with me". The link remains valid until you revoke access.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default FAQSection;