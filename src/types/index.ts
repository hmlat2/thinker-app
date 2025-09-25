export interface User {
  id: string;
  email: string;
  username: string;
  created_at: string;
}

export interface StudyClass {
  id: string;
  user_id: string;
  name: string;
  color: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface StudyMaterial {
  id: string;
  user_id: string;
  class_id: string;
  title: string;
  content: string;
  type: 'note' | 'flashcard' | 'summary' | 'quiz';
  tags: string[];
  created_at: string;
  updated_at: string;
}

export interface FlashcardSet {
  id: string;
  user_id: string;
  class_id: string;
  title: string;
  description?: string;
  cards: Flashcard[];
  created_at: string;
  updated_at: string;
}

export interface Flashcard {
  id: string;
  front: string;
  back: string;
  difficulty: 'easy' | 'medium' | 'hard';
  next_review: string;
  review_count: number;
  success_rate: number;
}

export interface StudySession {
  id: string;
  user_id: string;
  class_id?: string;
  material_id?: string;
  duration: number;
  score?: number;
  type: 'review' | 'practice' | 'quiz';
  created_at: string;
}

export interface StudyGoal {
  id: string;
  user_id: string;
  title: string;
  description: string;
  target_date: string;
  progress: number;
  completed: boolean;
  created_at: string;
}