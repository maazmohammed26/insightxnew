interface UserProfile {
  name: string;
  email: string;
  id: string;
  friends: Friend[];
  socialLinks?: {
    github?: string;
    linkedin?: string;
    twitter?: string;
  };
}

interface Friend {
  id: string;
  name: string;
}

interface SharedAnalysis {
  id: string;
  sharedBy: string;
  sharedWith: string;
  timestamp: number;
}

export const saveUserProfile = (profile: UserProfile) => {
  localStorage.setItem('userProfile', JSON.stringify(profile));
};

export const getUserProfile = (): UserProfile | null => {
  const profile = localStorage.getItem('userProfile');
  return profile ? JSON.parse(profile) : null;
};

export const addFriend = (friendId: string, friendName: string) => {
  const profile = getUserProfile();
  if (profile) {
    if (!profile.friends.some(f => f.id === friendId)) {
      profile.friends.push({ id: friendId, name: friendName });
      saveUserProfile(profile);
    }
  }
};

export const removeFriend = (friendId: string) => {
  const profile = getUserProfile();
  if (profile) {
    profile.friends = profile.friends.filter(f => f.id !== friendId);
    saveUserProfile(profile);
  }
};

export const shareAnalysisWith = (friendId: string, analysisId: string) => {
  const profile = getUserProfile();
  if (!profile) return false;

  const friend = profile.friends.find(f => f.id === friendId);
  if (!friend) return false;

  const sharedAnalyses = JSON.parse(localStorage.getItem('sharedAnalyses') || '[]');
  sharedAnalyses.push({
    id: analysisId,
    sharedBy: profile.id,
    sharedWith: friendId,
    timestamp: Date.now(),
  });
  localStorage.setItem('sharedAnalyses', JSON.stringify(sharedAnalyses));
  return true;
};

export const canAccessAnalysis = (analysisId: string): boolean => {
  const profile = getUserProfile();
  if (!profile) return false;

  const sharedAnalyses = JSON.parse(localStorage.getItem('sharedAnalyses') || '[]');
  return sharedAnalyses.some((analysis: SharedAnalysis) => 
    analysis.id === analysisId && 
    (analysis.sharedBy === profile.id || analysis.sharedWith === profile.id)
  );
};