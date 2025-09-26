import { StudyMethod, StudyMethodConfig, Subject, StudyMaterial, ProgressData } from '../types';

export const STUDY_METHODS: StudyMethodConfig[] = [
  {
    method: 'sq3r',
    name: 'SQ3R Method',
    description: 'Survey, Question, Read, Recite, Review - systematic reading comprehension',
    icon: '📖',
    color: 'blue',
    estimatedDuration: 30
  },
  {
    method: 'flashcards',
    name: 'Flashcards',
    description: 'Spaced repetition flashcards for active recall',
    icon: '🃏',
    color: 'green',
    estimatedDuration: 15
  },
  {
    method: 'spaced-practice',
    name: 'Spaced Practice',
    description: 'Review material at increasing intervals for long-term retention',
    icon: '⏰',
    color: 'purple',
    estimatedDuration: 20
  },
  {
    method: 'feynman',
    name: 'Feynman Technique',
    description: 'Explain concepts in simple terms to identify knowledge gaps',
    icon: '🎯',
    color: 'orange',
    estimatedDuration: 25
  },
  {
    method: 'quiz',
    name: 'Practice Quiz',
    description: 'Test your knowledge with generated questions',
    icon: '❓',
    color: 'red',
    estimatedDuration: 20
  },
  {
    method: 'sleep-review',
    name: 'Sleep Review',
    description: '15-20min review before sleep for better memory consolidation',
    icon: '🌙',
    color: 'indigo',
    estimatedDuration: 20
  }
];

export const calculateNextReviewDate = (
  lastReview: Date,
  interval: number,
  easeFactor: number,
  performance: 'again' | 'hard' | 'good' | 'easy'
): Date => {
  const now = new Date();
  let newInterval = interval;
  let newEaseFactor = easeFactor;

  switch (performance) {
    case 'again':
      newInterval = 1;
      newEaseFactor = Math.max(1.3, easeFactor - 0.2);
      break;
    case 'hard':
      newInterval = Math.max(1, Math.round(interval * 1.2));
      newEaseFactor = Math.max(1.3, easeFactor - 0.15);
      break;
    case 'good':
      newInterval = Math.round(interval * easeFactor);
      break;
    case 'easy':
      newInterval = Math.round(interval * easeFactor * 1.3);
      newEaseFactor = easeFactor + 0.15;
      break;
  }

  const nextReview = new Date(now);
  nextReview.setDate(nextReview.getDate() + newInterval);
  
  return nextReview;
};

export const calculateMasteryLevel = (progress: ProgressData): number => {
  const { totalStudyTime, sessionsCompleted, averageScore, streakDays } = progress;
  
  // Weighted calculation based on multiple factors
  const timeScore = Math.min(100, (totalStudyTime / 1000) * 10); // 1000 minutes = 100%
  const sessionScore = Math.min(100, (sessionsCompleted / 50) * 100); // 50 sessions = 100%
  const performanceScore = averageScore;
  const consistencyScore = Math.min(100, (streakDays / 30) * 100); // 30 days = 100%
  
  return Math.round((timeScore * 0.2 + sessionScore * 0.2 + performanceScore * 0.4 + consistencyScore * 0.2));
};

export const generateStudyPlan = (
  subjects: Subject[],
  materials: StudyMaterial[],
  userPreferences: { dailyGoal: number; preferredMethods: StudyMethod[] }
): StudyMaterial[] => {
  // Simple algorithm to prioritize materials for study
  const now = new Date();
  const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  
  return materials
    .filter(material => {
      const subject = subjects.find(s => s.id === material.subjectId);
      return subject && subject.masteryLevel < 80; // Focus on materials that need improvement
    })
    .sort((a, b) => {
      // Prioritize by last review date (older first) and difficulty
      const aLastReview = a.lastReviewed || new Date(0);
      const bLastReview = b.lastReviewed || new Date(0);
      
      if (aLastReview.getTime() !== bLastReview.getTime()) {
        return aLastReview.getTime() - bLastReview.getTime();
      }
      
      // Then by difficulty (harder first)
      const difficultyOrder = { hard: 3, medium: 2, easy: 1 };
      return difficultyOrder[b.difficulty] - difficultyOrder[a.difficulty];
    })
    .slice(0, Math.ceil(userPreferences.dailyGoal / 20)); // Estimate 20 min per material
};

export const getOptimalStudyTime = (): { start: string; end: string } => {
  // Research shows optimal study times are typically mid-morning and early evening
  return {
    start: '09:00',
    end: '21:00'
  };
};

export const shouldShowReminder = (lastStudy: Date, reminderTime: string): boolean => {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const lastStudyDate = new Date(lastStudy.getFullYear(), lastStudy.getMonth(), lastStudy.getDate());
  
  // Show reminder if last study was not today and it's past the reminder time
  if (lastStudyDate.getTime() < today.getTime()) {
    const [hours, minutes] = reminderTime.split(':').map(Number);
    const reminderDateTime = new Date(today);
    reminderDateTime.setHours(hours, minutes, 0, 0);
    
    return now >= reminderDateTime;
  }
  
  return false;
};
