import React from 'react';
import { BarChart3, TrendingUp, Calendar, Target } from 'lucide-react';
import { Subject, StudySession, StudyMethod } from '../types';

interface ProgressTrackerProps {
  subjects: Subject[];
  sessions: StudySession[];
}

const ProgressTracker: React.FC<ProgressTrackerProps> = ({ subjects, sessions }) => {
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - i);
    return date.toDateString();
  }).reverse();

  const dailyStudyTime = last7Days.map(date => {
    return sessions
      .filter(session => new Date(session.startTime).toDateString() === date)
      .reduce((acc, session) => acc + session.duration, 0);
  });

  const maxStudyTime = Math.max(...dailyStudyTime, 1);

  const studyMethodStats = sessions.reduce((acc, session) => {
    if (!acc[session.method]) {
      acc[session.method] = { count: 0, totalTime: 0, avgScore: 0 };
    }
    acc[session.method].count++;
    acc[session.method].totalTime += session.duration;
    acc[session.method].avgScore += session.score || 0;
    return acc;
  }, {} as Record<StudyMethod, { count: number; totalTime: number; avgScore: number }>);

  // Calculate average scores
  Object.keys(studyMethodStats).forEach(method => {
    const stats = studyMethodStats[method as StudyMethod];
    stats.avgScore = stats.count > 0 ? Math.round(stats.avgScore / stats.count) : 0;
  });

  const totalStudyTime = sessions.reduce((acc, session) => acc + session.duration, 0);
  const streakDays = calculateStreak(sessions);

  return (
    <div className="card p-6">
      <h2 className="text-xl font-header font-bold text-brand-navy mb-6 flex items-center">
        <BarChart3 className="w-5 h-5 mr-2 text-brand-green" />
        Progress Overview
      </h2>

      {/* Study Streak */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-brand-slate font-body">Study Streak</span>
          <span className="text-lg font-header font-bold text-brand-green">{streakDays} days</span>
        </div>
        <div className="w-full bg-brand-sage/20 rounded-full h-2">
          <div
            className="bg-gradient-to-r from-brand-green to-brand-slate h-2 rounded-full transition-all duration-300"
            style={{ width: `${Math.min(100, (streakDays / 30) * 100)}%` }}
          />
        </div>
      </div>

      {/* Weekly Study Time Chart */}
      <div className="mb-6">
        <h3 className="text-sm font-medium text-brand-slate mb-3 font-body">Last 7 Days</h3>
        <div className="flex items-end space-x-1 h-20">
          {dailyStudyTime.map((time, index) => (
            <div key={index} className="flex-1 flex flex-col items-center">
              <div
                className="w-full bg-gradient-to-t from-brand-green to-brand-slate rounded-t transition-all duration-300"
                style={{ 
                  height: `${(time / maxStudyTime) * 60}px`,
                  minHeight: time > 0 ? '4px' : '0px'
                }}
              />
              <div className="text-xs text-brand-slate/70 mt-1 font-body">
                {last7Days[index].split(' ')[0]}
              </div>
            </div>
          ))}
        </div>
        <div className="text-center mt-2">
          <span className="text-sm text-brand-slate font-body">
            Total: {Math.round(totalStudyTime / 60)}h {totalStudyTime % 60}m
          </span>
        </div>
      </div>

      {/* Study Methods Performance */}
      {Object.keys(studyMethodStats).length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-brand-slate mb-3 font-body">Method Performance</h3>
          <div className="space-y-2">
            {Object.entries(studyMethodStats).map(([method, stats]) => (
              <div key={method} className="flex items-center justify-between text-sm">
                <span className="text-brand-navy font-body capitalize">
                  {method.replace('-', ' ')}
                </span>
                <div className="flex items-center space-x-3">
                  <span className="text-brand-slate font-body">
                    {stats.count} sessions
                  </span>
                  <span className="text-brand-green font-body font-medium">
                    {stats.avgScore}% avg
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Stats */}
      <div className="mt-6 pt-4 border-t border-brand-sage/20">
        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <div className="text-lg font-header font-bold text-brand-navy">
              {subjects.length}
            </div>
            <div className="text-xs text-brand-slate font-body">Subjects</div>
          </div>
          <div>
            <div className="text-lg font-header font-bold text-brand-navy">
              {sessions.length}
            </div>
            <div className="text-xs text-brand-slate font-body">Sessions</div>
          </div>
        </div>
      </div>
    </div>
  );
};

const calculateStreak = (sessions: StudySession[]): number => {
  if (sessions.length === 0) return 0;

  const today = new Date();
  const studyDates = new Set(
    sessions.map(session => {
      const date = new Date(session.startTime);
      return date.toDateString();
    })
  );

  let streak = 0;
  let currentDate = new Date(today);

  while (true) {
    const dateString = currentDate.toDateString();
    if (studyDates.has(dateString)) {
      streak++;
      currentDate.setDate(currentDate.getDate() - 1);
    } else {
      break;
    }
  }

  return streak;
};

export default ProgressTracker;
