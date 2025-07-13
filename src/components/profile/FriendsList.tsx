import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { UserCircle, UserMinus, Share2, Lock, UserPlus, Eye, EyeOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { Card } from '@/components/ui/card';

interface Friend {
  id: string;
  name: string;
}

interface FriendsListProps {
  friends: Friend[];
  newFriendId: string;
  setNewFriendId: (id: string) => void;
  handleAddFriend: () => void;
  handleRemoveFriend: (id: string) => void;
  handleShareWithFriend: (friendId: string) => void;
}

const FriendsList = ({
  friends,
  newFriendId,
  setNewFriendId,
  handleAddFriend,
  handleRemoveFriend,
  handleShareWithFriend,
}: FriendsListProps) => {
  const [showIds, setShowIds] = useState(false);
  const [selectedFriend, setSelectedFriend] = useState<string | null>(null);

  const toggleIdVisibility = () => {
    setShowIds(!showIds);
    toast.success(showIds ? 'Friend IDs hidden' : 'Friend IDs visible');
  };

  const handleFriendSelect = (friendId: string) => {
    setSelectedFriend(friendId === selectedFriend ? null : friendId);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-medium flex items-center gap-2">
          <UserCircle className="h-5 w-5 text-purple-500" />
          Friends ({friends.length})
        </h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleIdVisibility}
          className="text-muted-foreground"
        >
          {showIds ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </Button>
      </div>
      
      <Card className="p-4 bg-white/50 dark:bg-gray-800/50">
        <Label htmlFor="friendId">Add New Friend</Label>
        <div className="flex gap-2 mt-2">
          <Input
            id="friendId"
            value={newFriendId}
            onChange={(e) => setNewFriendId(e.target.value)}
            placeholder="Paste friend's ID here"
            className="bg-white/50"
          />
          <Button onClick={handleAddFriend} variant="secondary">
            <UserPlus className="h-4 w-4 mr-2" />
            Add
          </Button>
        </div>
        <p className="text-sm text-muted-foreground mt-2">
          Ask your friend to share their ID from their profile
        </p>
      </Card>

      <AnimatePresence>
        {friends.map((friend, index) => (
          <motion.div
            key={friend.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ delay: index * 0.1 }}
            className="relative"
          >
            <Card
              className={`p-4 transition-all duration-200 ${
                selectedFriend === friend.id
                  ? 'ring-2 ring-purple-500 dark:ring-purple-400'
                  : ''
              }`}
              onClick={() => handleFriendSelect(friend.id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <UserCircle className="h-6 w-6 text-purple-500" />
                  <div className="space-y-1">
                    <h4 className="font-medium">{friend.name}</h4>
                    {showIds && (
                      <p className="text-xs text-muted-foreground font-mono">
                        ID: {friend.id}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleShareWithFriend(friend.id)}
                    className="text-blue-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                  >
                    <Share2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveFriend(friend.id)}
                    className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                  >
                    <UserMinus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              {selectedFriend === friend.id && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-4 pt-4 border-t"
                >
                  <div className="space-y-2">
                    <h5 className="text-sm font-medium">Quick Actions</h5>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleShareWithFriend(friend.id)}
                        className="w-full"
                      >
                        <Share2 className="h-4 w-4 mr-2" />
                        Share Analysis
                      </Button>
                    </div>
                  </div>
                </motion.div>
              )}
            </Card>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default FriendsList;