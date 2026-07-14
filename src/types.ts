export interface Project {
  id: string;
  title: string;
  description: string;
  updatedText: string;
  tags: string[];
  iconName: 'gavel' | 'link' | 'memory' | 'cpu' | 'database';
  githubUrl?: string;
  liveUrl?: string;
  architectureDetails?: string;
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  readTime: string;
  category: string;
}

export interface SkillItem {
  name: string;
  level: number; // 0-100
  category: string;
  description: string;
}

export interface GuestbookMessage {
  id: string;
  name: string;
  message: string;
  timestamp: number;
}
