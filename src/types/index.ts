// Core data types for the study platform

export interface StudyClass {
  id: string;
  name: string;
  description?: string;
  color: string;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export interface StudyMaterial {
  id: string;
  title: string;
  content: string;
  type: 'note' | 'summary' | 'flashcard' | 'quiz';
  class_id: string;
  user_id: string;
  tags?: string[];
  created_at: string;
  updated_at: string;
}

export interface StudySession {
  id: string;
  title: string;
  classId: string;
  date: string;
  time: string;
  duration: number;
  type: 'review' | 'practice' | 'reading' | 'assignment';
  priority: 'low' | 'medium' | 'high';
  completed: boolean;
  created_at: string;
}

export interface StudyGoal {
  id: string;
  title: string;
  description: string;
  targetDate: string;
  progress: number;
  completed: boolean;
  created_at: string;
}

export interface Subject {
  id: string;
  name: string;
  color: string;
  icon: string;
  createdAt: Date;
  lastStudied?: Date;
  totalStudyTime: number; // in minutes
  masteryLevel: number; // 0-100
}

export interface StudyMaterial {
  id: string;
  subjectId: string;
  title: string;
  content: string;
  type: 'text' | 'pdf' | 'video' | 'image';
  createdAt: Date;
  lastReviewed?: Date;
  difficulty: 'easy' | 'medium' | 'hard';
  tags: string[];
}

export interface StudySession {
  id: string;
  subjectId: string;
  materialId?: string;
  method: StudyMethod;
  startTime: Date;
  endTime?: Date;
  duration: number; // in minutes
  score?: number; // 0-100
  notes?: string;
}

export type StudyMethod = 
  | 'sq3r' 
  | 'flashcards' 
  | 'spaced-practice' 
  | 'feynman' 
  | 'quiz' 
  | 'sleep-review';

export interface StudyMethodConfig {
  method: StudyMethod;
  name: string;
  description: string;
  icon: string;
  color: string;
  estimatedDuration: number; // in minutes
}

export interface Flashcard {
  id: string;
  materialId: string;
  front: string;
  back: string;
  difficulty: 'easy' | 'medium' | 'hard';
  lastReviewed?: Date;
  nextReview?: Date;
  reviewCount: number;
  correctCount: number;
  easeFactor: number; // for spaced repetition
  interval: number; // days until next review
}

export interface SQ3RStep {
  step: 'survey' | 'question' | 'read' | 'recite' | 'review';
  title: string;
  description: string;
  completed: boolean;
  content?: string;
  notes?: string;
}

export interface FeynmanStep {
  step: 'concept' | 'explain' | 'identify-gaps' | 'simplify';
  title: string;
  description: string;
  completed: boolean;
  content?: string;
  notes?: string;
}

export interface ProgressData {
  subjectId: string;
  totalStudyTime: number;
  sessionsCompleted: number;
  averageScore: number;
  streakDays: number;
  lastStudyDate: Date;
  masteryLevel: number;
  studyMethodStats: {
    [method in StudyMethod]: {
      sessionsCompleted: number;
      averageScore: number;
      totalTime: number;
    };
  };
}

export interface ReminderSettings {
  enabled: boolean;
  time: string; // HH:MM format
  beforeSleep: boolean;
  methods: StudyMethod[];
  subjects: string[];
}

export interface UserSettings {
  reminders: ReminderSettings;
  preferredMethods: StudyMethod[];
  dailyGoal: number; // minutes
  theme: 'light' | 'dark';
  notifications: boolean;
}
