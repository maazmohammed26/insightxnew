import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import SocialLinksManager from './SocialLinksManager';

interface ProfileFormProps {
  name: string;
  email: string;
  socialLinks: {
    github?: string;
    linkedin?: string;
    twitter?: string;
    website?: string;
  };
  setName: (name: string) => void;
  setEmail: (email: string) => void;
  setSocialLinks: (links: any) => void;
  handleSaveProfile: () => void;
}

const ProfileForm = ({ 
  name, 
  email, 
  socialLinks,
  setName, 
  setEmail,
  setSocialLinks,
  handleSaveProfile 
}: ProfileFormProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
            className="bg-white/50 dark:bg-gray-800/50"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="bg-white/50 dark:bg-gray-800/50"
          />
        </div>
      </div>

      <SocialLinksManager 
        socialLinks={socialLinks}
        setSocialLinks={setSocialLinks}
      />

      <Button onClick={handleSaveProfile} className="w-full bg-purple-600 hover:bg-purple-700">
        Save Profile
      </Button>
    </motion.div>
  );
};

export default ProfileForm;