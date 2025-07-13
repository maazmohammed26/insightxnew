export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
}

export interface AIResponseInsight {
  type: 'info' | 'warning' | 'success';
  title: string;
  description: string;
}

export interface AIServiceOptions {
  model: 'gemini-2.0-flash' | 'gemini-2.0-pro' | 'gemini-2.0-ultra';
  temperature: number;
  maxTokens: number;
}
