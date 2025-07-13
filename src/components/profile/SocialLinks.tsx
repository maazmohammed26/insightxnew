import React from 'react';
import { Github, Linkedin, Twitter, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

interface SocialLinksProps {
  links: {
    github?: string;
    linkedin?: string;
    twitter?: string;
  };
}

const SocialLinks = ({ links }: SocialLinksProps) => {
  const openLink = (url: string) => {
    if (!url.startsWith('http')) {
      url = `https://${url}`;
    }
    window.open(url, '_blank');
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4"
    >
      {links.github && (
        <Button
          variant="outline"
          className="flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-800"
          onClick={() => openLink(`github.com/${links.github}`)}
        >
          <Github className="w-4 h-4" />
          GitHub
          <ExternalLink className="w-3 h-3 ml-auto" />
        </Button>
      )}
      {links.linkedin && (
        <Button
          variant="outline"
          className="flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-800"
          onClick={() => openLink(`linkedin.com/in/${links.linkedin}`)}
        >
          <Linkedin className="w-4 h-4" />
          LinkedIn
          <ExternalLink className="w-3 h-3 ml-auto" />
        </Button>
      )}
      {links.twitter && (
        <Button
          variant="outline"
          className="flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-800"
          onClick={() => openLink(`twitter.com/${links.twitter}`)}
        >
          <Twitter className="w-4 h-4" />
          Twitter
          <ExternalLink className="w-3 h-3 ml-auto" />
        </Button>
      )}
    </motion.div>
  );
};

export default SocialLinks;