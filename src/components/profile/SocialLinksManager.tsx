import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Github, Linkedin, Twitter, Link2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface SocialLinksManagerProps {
  socialLinks: {
    github?: string;
    linkedin?: string;
    twitter?: string;
    website?: string;
  };
  setSocialLinks: (links: any) => void;
}

const SocialLinksManager = ({ socialLinks, setSocialLinks }: SocialLinksManagerProps) => {
  const handleLinkChange = (platform: string, value: string) => {
    setSocialLinks((prev: any) => ({
      ...prev,
      [platform]: value
    }));
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      <h3 className="text-lg font-semibold text-foreground">Social Links</h3>
      
      <div className="space-y-4">
        <div className="relative">
          <Label htmlFor="github" className="flex items-center gap-2">
            <Github className="h-4 w-4 text-purple-600" />
            GitHub
          </Label>
          <Input
            id="github"
            placeholder="Your GitHub username"
            value={socialLinks.github || ''}
            onChange={(e) => handleLinkChange('github', e.target.value)}
            className="pl-10 bg-white/50 dark:bg-gray-800/50"
          />
        </div>

        <div className="relative">
          <Label htmlFor="linkedin" className="flex items-center gap-2">
            <Linkedin className="h-4 w-4 text-purple-600" />
            LinkedIn
          </Label>
          <Input
            id="linkedin"
            placeholder="Your LinkedIn username"
            value={socialLinks.linkedin || ''}
            onChange={(e) => handleLinkChange('linkedin', e.target.value)}
            className="pl-10 bg-white/50 dark:bg-gray-800/50"
          />
        </div>

        <div className="relative">
          <Label htmlFor="twitter" className="flex items-center gap-2">
            <Twitter className="h-4 w-4 text-purple-600" />
            Twitter
          </Label>
          <Input
            id="twitter"
            placeholder="Your Twitter username"
            value={socialLinks.twitter || ''}
            onChange={(e) => handleLinkChange('twitter', e.target.value)}
            className="pl-10 bg-white/50 dark:bg-gray-800/50"
          />
        </div>

        <div className="relative">
          <Label htmlFor="website" className="flex items-center gap-2">
            <Link2 className="h-4 w-4 text-purple-600" />
            Website
          </Label>
          <Input
            id="website"
            placeholder="Your website URL"
            value={socialLinks.website || ''}
            onChange={(e) => handleLinkChange('website', e.target.value)}
            className="pl-10 bg-white/50 dark:bg-gray-800/50"
          />
        </div>
      </div>
    </motion.div>
  );
};

export default SocialLinksManager;