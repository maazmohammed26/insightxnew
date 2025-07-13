import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { UserCircle, Settings2, Download, Upload, Shield, Bell } from 'lucide-react';
import { toast } from 'sonner';
import { ScrollArea } from '@/components/ui/scroll-area';
import { getUserProfile, saveUserProfile, addFriend, removeFriend } from '@/utils/userStorage';
import { SocialLinks } from '@/types/profile';
import ProfileHeader from './ProfileHeader';
import ProfileForm from './ProfileForm';
import FriendsList from './FriendsList';
import ShareSection from './ShareSection';
import SharedAnalysisList from './SharedAnalysisList';
import SocialLinksComponent from './SocialLinks';

const ProfileDialog = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [socialLinks, setSocialLinks] = useState<SocialLinks>({});
  const [newFriendId, setNewFriendId] = useState('');
  const [profile, setProfile] = useState(getUserProfile());
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const savedProfile = getUserProfile();
    if (savedProfile) {
      setName(savedProfile.name);
      setEmail(savedProfile.email);
      setSocialLinks(savedProfile.socialLinks || {});
      setProfile(savedProfile);
    }
  }, []);

  const handleSaveProfile = () => {
    if (!name || !email) {
      toast.error('Please fill in all required fields');
      return;
    }

    const newProfile = {
      name,
      email,
      socialLinks,
      id: profile?.id || `${name.toLowerCase().replace(/\s+/g, '-')}-${Math.random().toString(36).substring(7)}`,
      friends: profile?.friends || []
    };

    saveUserProfile(newProfile);
    setProfile(newProfile);
    setIsEditing(false);
    toast.success('Profile updated successfully');
  };

  const handleAddFriend = () => {
    if (!newFriendId) {
      toast.error('Please enter a friend ID');
      return;
    }

    const [friendId, friendName] = newFriendId.split('|');
    if (!friendId || !friendName) {
      toast.error('Invalid friend ID format');
      return;
    }

    if (friendId === profile?.id) {
      toast.error("You can't add yourself as a friend");
      return;
    }

    addFriend(friendId, friendName);
    setNewFriendId('');
    setProfile(getUserProfile());
    toast.success('Friend added successfully');
  };

  const handleCopyId = () => {
    if (!profile) return;
    const shareId = `${profile.id}|${profile.name}`;
    navigator.clipboard.writeText(shareId);
    setCopied(true);
    toast.success('Your ID copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRemoveFriend = (friendId: string) => {
    removeFriend(friendId);
    setProfile(getUserProfile());
    toast.success('Friend removed successfully');
  };

  const handleShareWithFriend = (friendId: string) => {
    const friend = profile?.friends.find(f => f.id === friendId);
    if (friend) {
      toast.success(`Shared analysis with ${friend.name}`);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <UserCircle className="h-5 w-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] max-h-[90vh] overflow-hidden bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <ProfileHeader name={profile?.name || ''} />
        <ScrollArea className="max-h-[calc(90vh-120px)] pr-4">
          <div className="space-y-6 py-4">
            {isEditing ? (
              <ProfileForm
                name={name}
                email={email}
                socialLinks={socialLinks}
                setName={setName}
                setEmail={setEmail}
                setSocialLinks={setSocialLinks}
                handleSaveProfile={handleSaveProfile}
              />
            ) : (
              <div className="space-y-6 animate-fade-in">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium text-foreground">Profile Details</h3>
                    <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                      <Settings2 className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                  </div>
                  <ShareSection
                    profileId={profile?.id || ''}
                    name={profile?.name || ''}
                    copied={copied}
                    handleCopyId={handleCopyId}
                  />
                  {profile?.socialLinks && <SocialLinksComponent links={profile.socialLinks} />}
                </div>

                <div className="space-y-4 animate-fade-in">
                  <div className="flex items-center justify-between bg-muted/50 p-3 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4 text-primary" />
                      <span className="text-sm font-medium text-foreground">Privacy Mode</span>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => toast.success('Privacy mode toggled')}>
                      Enable
                    </Button>
                  </div>
                  <div className="flex items-center justify-between bg-muted/50 p-3 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Bell className="h-4 w-4 text-primary" />
                      <span className="text-sm font-medium text-foreground">Notifications</span>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => toast.success('Notifications enabled')}>
                      Enable
                    </Button>
                  </div>
                </div>

                <SharedAnalysisList />
                <FriendsList
                  friends={profile?.friends || []}
                  newFriendId={newFriendId}
                  setNewFriendId={setNewFriendId}
                  handleAddFriend={handleAddFriend}
                  handleRemoveFriend={handleRemoveFriend}
                  handleShareWithFriend={handleShareWithFriend}
                />
              </div>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default ProfileDialog;
