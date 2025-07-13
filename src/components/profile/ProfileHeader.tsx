import React from 'react';
import { UserCircle } from 'lucide-react';
import { DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface ProfileHeaderProps {
  name: string;
}

const ProfileHeader = ({ name }: ProfileHeaderProps) => {
  return (
    <DialogHeader>
      <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent flex items-center gap-2">
        <UserCircle className="h-6 w-6" />
        {name ? `${name}'s Profile` : 'Create Profile'}
      </DialogTitle>
    </DialogHeader>
  );
};

export default ProfileHeader;