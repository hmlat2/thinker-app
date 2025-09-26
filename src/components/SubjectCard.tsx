import React from 'react';
import { Clock, BookOpen, TrendingUp, Target } from 'lucide-react';
import { Subject, StudyMaterial, StudySession } from '../types';

interface SubjectCardProps {
  subject: Subject;
  materials: StudyMaterial[];
  sessions: StudySession[];
  onSelect: () => void;
  isSelected: boolean;
}

const SubjectCard: React.FC<SubjectCardProps> = ({
  subject,
  materials,
  sessions,
  onSelect,
  isSelected
}) => {
  const totalStudyTime = sessions.reduce((acc, session) => acc + session.duration, 0);
  const recentSessions = sessions.filter(session => {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    return new Date(session.startTime) > oneWeekAgo;
  });

  const averageScore = sessions.length > 0 
    ? Math.round(sessions.reduce((acc, session) => acc + (session.score || 0), 0) / sessions.length)
    : 0;

  return (
    <div
      onClick={onSelect}
      className={`card p-6 cursor-pointer transition-all duration-200 hover:shadow-lg ${
        isSelected 
          ? 'ring-2 ring-brand-green bg-brand-sage/5' 
          : 'hover:border-brand-green'
      }`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div 
            className="w-12 h-12 rounded-xl flex items-center justify-center text-white text-xl font-bold"
            style={{ backgroundColor: subject.color }}
          >
            {subject.icon}
          </div>
          <div>
            <h3 className="text-lg font-header font-semibold text-brand-navy">
              {subject.name}
            </h3>
            <p className="text-sm text-brand-slate font-body">
              {materials.length} materials
            </p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-header font-bold text-brand-green">
            {subject.masteryLevel}%
          </div>
          <div className="text-xs text-brand-slate font-body">Mastery</div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="flex items-center space-x-2">
          <Clock className="w-4 h-4 text-brand-slate/70" />
          <div>
            <div className="text-sm font-medium text-brand-navy font-body">
              {Math.round(totalStudyTime / 60)}h {totalStudyTime % 60}m
            </div>
            <div className="text-xs text-brand-slate/70 font-body">Total time</div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Target className="w-4 h-4 text-brand-slate/70" />
          <div>
            <div className="text-sm font-medium text-brand-navy font-body">
              {sessions.length}
            </div>
            <div className="text-xs text-brand-slate/70 font-body">Sessions</div>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-brand-slate font-body">Progress</span>
          <span className="text-brand-slate font-body">{subject.masteryLevel}%</span>
        </div>
        <div className="w-full bg-brand-sage/20 rounded-full h-2">
          <div
            className="bg-gradient-to-r from-brand-green to-brand-slate h-2 rounded-full transition-all duration-300"
            style={{ width: `${subject.masteryLevel}%` }}
          />
        </div>
      </div>

      {recentSessions.length > 0 && (
        <div className="mt-4 pt-4 border-t border-brand-sage/20">
          <div className="flex items-center justify-between text-sm">
            <span className="text-brand-slate font-body">Recent activity</span>
            <span className="text-brand-green font-body font-medium">
              {recentSessions.length} sessions this week
            </span>
          </div>
        </div>
      )}

      {averageScore > 0 && (
        <div className="mt-2 flex items-center space-x-2">
          <TrendingUp className="w-4 h-4 text-brand-green" />
          <span className="text-sm text-brand-slate font-body">
            Avg score: {averageScore}%
          </span>
        </div>
      )}
    </div>
  );
};

export default SubjectCard;
