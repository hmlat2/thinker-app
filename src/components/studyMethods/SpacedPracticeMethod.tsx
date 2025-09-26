import React, { useState, useEffect } from 'react';
import { Clock, CheckCircle, ArrowRight, ArrowLeft, Calendar, Target } from 'lucide-react';
import { StudyMaterial } from '../../types';
import { calculateNextReviewDate } from '../../utils/studyMethods';

interface SpacedPracticeMethodProps {
  material: StudyMaterial;
  onComplete: (score: number) => void;
  onBack: () => void;
}

interface ReviewSession {
  id: string;
  materialId: string;
  scheduledDate: Date;
  completedDate?: Date;
  score?: number;
  interval: number; // days
  easeFactor: number;
}

const SpacedPracticeMethod: React.FC<SpacedPracticeMethodProps> = ({ material, onComplete, onBack }) => {
  const [reviewSessions, setReviewSessions] = useState<ReviewSession[]>([]);
  const [currentSession, setCurrentSession] = useState<ReviewSession | null>(null);
  const [sessionStartTime, setSessionStartTime] = useState<Date | null>(null);
  const [sessionNotes, setSessionNotes] = useState('');
  const [showSchedule, setShowSchedule] = useState(false);

  // Initialize review sessions based on spaced repetition algorithm
  useEffect(() => {
    const sessions = generateReviewSchedule(material);
    setReviewSessions(sessions);
    setCurrentSession(sessions[0]);
    setSessionStartTime(new Date());
  }, [material]);

  const generateReviewSchedule = (material: StudyMaterial): ReviewSession[] => {
    const now = new Date();
    const sessions: ReviewSession[] = [];
    
    // Initial review (today)
    sessions.push({
      id: 'session-1',
      materialId: material.id,
      scheduledDate: now,
      interval: 1,
      easeFactor: 2.5
    });

    // Future reviews based on spaced repetition intervals
    const intervals = [1, 3, 7, 14, 30, 60, 120]; // days
    intervals.forEach((interval, index) => {
      if (index > 0) {
        const scheduledDate = new Date(now);
        scheduledDate.setDate(scheduledDate.getDate() + interval);
        
        sessions.push({
          id: `session-${index + 1}`,
          materialId: material.id,
          scheduledDate,
          interval,
          easeFactor: 2.5
        });
      }
    });

    return sessions;
  };

  const handleSessionComplete = (performance: 'again' | 'hard' | 'good' | 'easy') => {
    if (!currentSession || !sessionStartTime) return;

    const sessionDuration = Math.round((new Date().getTime() - sessionStartTime.getTime()) / 1000 / 60);
    const score = performance === 'again' ? 0 : performance === 'hard' ? 25 : performance === 'good' ? 75 : 100;

    // Update current session
    const updatedSessions = reviewSessions.map(session => {
      if (session.id === currentSession.id) {
        return {
          ...session,
          completedDate: new Date(),
          score,
          easeFactor: performance === 'again' ? Math.max(1.3, session.easeFactor - 0.2) :
                      performance === 'hard' ? Math.max(1.3, session.easeFactor - 0.15) :
                      performance === 'easy' ? session.easeFactor + 0.15 : session.easeFactor
        };
      }
      return session;
    });

    // Adjust future sessions based on performance
    const nextSessionIndex = reviewSessions.findIndex(s => s.id === currentSession.id) + 1;
    if (nextSessionIndex < reviewSessions.length) {
      const nextSession = reviewSessions[nextSessionIndex];
      const newInterval = performance === 'again' ? 1 : 
                         performance === 'hard' ? Math.max(1, Math.round(nextSession.interval * 0.8)) :
                         performance === 'good' ? nextSession.interval :
                         Math.round(nextSession.interval * 1.3);

      updatedSessions[nextSessionIndex] = {
        ...nextSession,
        interval: newInterval,
        scheduledDate: calculateNextReviewDate(
          new Date(),
          newInterval,
          currentSession.easeFactor,
          performance
        )
      };
    }

    setReviewSessions(updatedSessions);
    onComplete(score);
  };

  const getNextReviewDate = (session: ReviewSession): string => {
    return session.scheduledDate.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getSessionStatus = (session: ReviewSession): 'completed' | 'current' | 'upcoming' => {
    if (session.completedDate) return 'completed';
    if (session.id === currentSession?.id) return 'current';
    return 'upcoming';
  };

  const getPerformanceColor = (score?: number): string => {
    if (!score) return 'text-brand-slate';
    if (score >= 75) return 'text-green-600';
    if (score >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-header font-bold text-brand-navy mb-2">
          Spaced Practice
        </h1>
        <p className="text-brand-slate font-body mb-4">
          Review at optimal intervals for long-term retention
        </p>
        <p className="text-sm text-brand-slate/70 font-body">
          {material.title}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Current Session */}
        <div className="lg:col-span-2">
          <div className="card p-8">
            <div className="flex items-center space-x-3 mb-6">
              <Clock className="w-6 h-6 text-brand-green" />
              <div>
                <h2 className="text-xl font-header font-bold text-brand-navy">
                  Current Review Session
                </h2>
                <p className="text-brand-slate font-body">
                  Session {reviewSessions.findIndex(s => s.id === currentSession?.id) + 1} of {reviewSessions.length}
                </p>
              </div>
            </div>

            {currentSession && (
              <div className="space-y-6">
                <div className="p-4 bg-brand-sage/10 rounded-lg">
                  <h3 className="font-medium text-brand-navy mb-2 font-body">Review Instructions:</h3>
                  <ul className="list-disc list-inside space-y-1 text-brand-slate font-body">
                    <li>Read through the material carefully</li>
                    <li>Try to recall key concepts from memory</li>
                    <li>Focus on areas you found difficult before</li>
                    <li>Take notes on what you've learned or forgotten</li>
                  </ul>
                </div>

                <div className="p-4 bg-brand-light/50 rounded-lg">
                  <h4 className="font-medium text-brand-navy mb-2 font-body">Study Material:</h4>
                  <div className="prose max-w-none text-brand-slate font-body">
                    {material.content}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-brand-navy mb-2 font-body">
                    Session Notes:
                  </label>
                  <textarea
                    value={sessionNotes}
                    onChange={(e) => setSessionNotes(e.target.value)}
                    className="w-full h-32 p-3 border border-brand-sage/50 rounded-lg focus:ring-2 focus:ring-brand-green focus:border-transparent resize-none font-body"
                    placeholder="What did you learn? What was difficult? What connections did you make?"
                  />
                </div>

                <div className="flex justify-between">
                  <button
                    onClick={onBack}
                    className="btn-secondary flex items-center"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back
                  </button>

                  <div className="space-x-2">
                    <button
                      onClick={() => handleSessionComplete('again')}
                      className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors font-body font-medium"
                    >
                      Again (0%)
                    </button>
                    <button
                      onClick={() => handleSessionComplete('hard')}
                      className="px-4 py-2 bg-orange-100 text-orange-700 rounded-lg hover:bg-orange-200 transition-colors font-body font-medium"
                    >
                      Hard (25%)
                    </button>
                    <button
                      onClick={() => handleSessionComplete('good')}
                      className="px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors font-body font-medium"
                    >
                      Good (75%)
                    </button>
                    <button
                      onClick={() => handleSessionComplete('easy')}
                      className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors font-body font-medium"
                    >
                      Easy (100%)
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Review Schedule */}
        <div>
          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-header font-bold text-brand-navy flex items-center">
                <Calendar className="w-5 h-5 mr-2 text-brand-green" />
                Review Schedule
              </h3>
              <button
                onClick={() => setShowSchedule(!showSchedule)}
                className="text-brand-slate hover:text-brand-green transition-colors"
              >
                {showSchedule ? 'Hide' : 'Show'}
              </button>
            </div>

            {showSchedule && (
              <div className="space-y-3">
                {reviewSessions.map((session, index) => {
                  const status = getSessionStatus(session);
                  return (
                    <div
                      key={session.id}
                      className={`p-3 rounded-lg border ${
                        status === 'completed'
                          ? 'bg-green-50 border-green-200'
                          : status === 'current'
                          ? 'bg-brand-sage/20 border-brand-green'
                          : 'bg-brand-light/50 border-brand-sage/20'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium text-brand-navy font-body">
                            Session {index + 1}
                          </div>
                          <div className="text-sm text-brand-slate font-body">
                            {getNextReviewDate(session)}
                          </div>
                        </div>
                        <div className="text-right">
                          {status === 'completed' && session.score !== undefined && (
                            <div className={`text-sm font-medium ${getPerformanceColor(session.score)}`}>
                              {session.score}%
                            </div>
                          )}
                          {status === 'current' && (
                            <div className="w-3 h-3 bg-brand-green rounded-full"></div>
                          )}
                          {status === 'upcoming' && (
                            <div className="w-3 h-3 bg-brand-slate/30 rounded-full"></div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            <div className="mt-6 p-4 bg-brand-sage/10 rounded-lg">
              <h4 className="font-medium text-brand-navy mb-2 font-body">Spaced Repetition Benefits:</h4>
              <ul className="text-sm text-brand-slate space-y-1 font-body">
                <li>• Strengthens memory over time</li>
                <li>• Prevents forgetting</li>
                <li>• Optimizes study efficiency</li>
                <li>• Builds long-term retention</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpacedPracticeMethod;
