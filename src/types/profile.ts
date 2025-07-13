export interface SocialLinks {
  github?: string;
  linkedin?: string;
  twitter?: string;
  website?: string;
}

export interface Friend {
  id: string;
  name: string;
}

export interface SharedAnalysis {
  id: string;
  data: any[];
  insights: string[];
  timestamp: number;
  sharedBy: string;
  sharedWith: string;
}