export interface Message {
  id: string;
  role: 'user' | 'ai';
  content: string;
  createdAt: string;
}

export interface Achievement {
  id: string;
  description: string;
  metric?: string;
}

export interface CareerDNA {
  builder: number;
  creator: number;
  analyst: number;
  operator: number;
  leader: number;
  strategist: number;
}

export interface Profile {
  summary: string;
  achievements: Achievement[];
  impacts: string[];
  skills: string[];
  strengths: string[];
  careerDna: CareerDNA;
  recommendedRoles: string[];
  progress: Record<string, boolean>; // e.g., { careerContext: true, achievement: true }
}