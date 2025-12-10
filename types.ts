export interface DreamAnalysis {
  title: string;
  summary: string;
  interpretation: string;
  mood: string;
  emotions: { name: string; value: number }[]; // For chart
  keywords: string[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}

export interface DreamEntry {
  id: string;
  date: string; // ISO string
  originalText: string;
  analysis: DreamAnalysis | null;
  imageUrl: string | null;
  isLoading: boolean;
  chatHistory: ChatMessage[];
}

export enum ViewState {
  HOME = 'HOME',
  HISTORY = 'HISTORY',
}
