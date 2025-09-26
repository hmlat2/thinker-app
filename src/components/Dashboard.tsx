import React, { useState } from 'react';
import { 
  Brain, 
  BookOpen, 
  Clock, 
  TrendingUp, 
  Plus, 
  FolderOpen,
  Target,
  Calendar,
  BarChart3,
  Settings
} from 'lucide-react';
import { Subject, StudyMaterial, StudySession, StudyMethod } from '../types';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { STUDY_METHODS, calculateMasteryLevel, generateStudyPlan } from '../utils/studyMethods';
import SubjectCard from './SubjectCard';
import StudyMethodSelector from './StudyMethodSelector';
import ProgressTracker from './ProgressTracker';
import StudySessionModal from './StudySessionModal';
import AddSubjectModal from './AddSubjectModal';

const Dashboard: React.FC = () => {
  const [subjects, setSubjects] = useLocalStorage<Subject[]>('subjects', []);
  const [materials, setMaterials] = useLocalStorage<StudyMaterial[]>('materials', []);
  const [sessions, setSessions] = useLocalStorage<StudySession[]>('sessions', []);
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [showAddSubject, setShowAddSubject] = useState(false);
  const [showStudySession, setShowStudySession] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<StudyMethod | null>(null);

  const totalStudyTime = sessions.reduce((acc, session) => acc + session.duration, 0);
  const totalSessions = sessions.length;
  const averageScore = sessions.length > 0 
    ? Math.round(sessions.reduce((acc, session) => acc + (session.score || 0), 0) / sessions.length)
    : 0;

  const todaySessions = sessions.filter(session => {
    const today = new Date();
    const sessionDate = new Date(session.startTime);
    return sessionDate.toDateString() === today.toDateString();
  });

  const handleStartStudy = (method: StudyMethod) => {
    setSelectedMethod(method);
    setShowStudySession(true);
  };

  const handleAddSubject = (subject: Omit<Subject, 'id' | 'createdAt' | 'totalStudyTime' | 'masteryLevel'>) => {
    const newSubject: Subject = {
      ...subject,
      id: Date.now().toString(),
      createdAt: new Date(),
      totalStudyTime: 0,
      masteryLevel: 0
    };
    setSubjects(prev => [...prev, newSubject]);
    setShowAddSubject(false);
  };

  const handleCompleteSession = (session: Omit<StudySession, 'id' | 'startTime' | 'duration'>) => {
    const newSession: StudySession = {
      ...session,
      id: Date.now().toString(),
      startTime: new Date(),
      duration: 0 // Will be calculated when session ends
    };
    setSessions(prev => [...prev, newSession]);
    setShowStudySession(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-light via-white to-brand-sage/20">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-brand-light sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <img 
                src="/thinker-logo.png" 
                alt="Thinker Logo" 
                className="h-16 w-auto"
              />
              <div>
                <h1 className="text-2xl font-header font-bold text-brand-navy">Study Dashboard</h1>
                <p className="text-brand-slate text-sm font-body">Science-backed learning for long-term retention</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button className="p-2 text-brand-slate hover:text-brand-green transition-colors">
                <Settings className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-brand-slate text-sm font-body">Total Study Time</p>
                <p className="text-2xl font-header font-bold text-brand-navy">
                  {Math.round(totalStudyTime / 60)}h {totalStudyTime % 60}m
                </p>
              </div>
              <Clock className="w-8 h-8 text-brand-green" />
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-brand-slate text-sm font-body">Sessions Completed</p>
                <p className="text-2xl font-header font-bold text-brand-navy">{totalSessions}</p>
              </div>
              <Target className="w-8 h-8 text-brand-green" />
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-brand-slate text-sm font-body">Average Score</p>
                <p className="text-2xl font-header font-bold text-brand-navy">{averageScore}%</p>
              </div>
              <TrendingUp className="w-8 h-8 text-brand-green" />
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-brand-slate text-sm font-body">Today's Sessions</p>
                <p className="text-2xl font-header font-bold text-brand-navy">{todaySessions.length}</p>
              </div>
              <Calendar className="w-8 h-8 text-brand-green" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Subjects Section */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-header font-bold text-brand-navy flex items-center">
                <FolderOpen className="w-6 h-6 mr-3 text-brand-green" />
                Your Subjects
              </h2>
              <button
                onClick={() => setShowAddSubject(true)}
                className="btn-primary flex items-center"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Subject
              </button>
            </div>

            {subjects.length === 0 ? (
              <div className="card p-12 text-center">
                <BookOpen className="w-16 h-16 text-brand-slate/50 mx-auto mb-4" />
                <h3 className="text-xl font-header font-semibold text-brand-navy mb-2">
                  No subjects yet
                </h3>
                <p className="text-brand-slate font-body mb-6">
                  Create your first subject to start organizing your study materials
                </p>
                <button
                  onClick={() => setShowAddSubject(true)}
                  className="btn-primary"
                >
                  Create First Subject
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {subjects.map(subject => (
                  <SubjectCard
                    key={subject.id}
                    subject={subject}
                    materials={materials.filter(m => m.subjectId === subject.id)}
                    sessions={sessions.filter(s => s.subjectId === subject.id)}
                    onSelect={() => setSelectedSubject(subject.id)}
                    isSelected={selectedSubject === subject.id}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Study Methods & Progress */}
          <div className="space-y-8">
            {/* Study Methods */}
            <div>
              <h2 className="text-xl font-header font-bold text-brand-navy mb-4 flex items-center">
                <Brain className="w-5 h-5 mr-2 text-brand-green" />
                Study Methods
              </h2>
              <div className="space-y-3">
                {STUDY_METHODS.map(method => (
                  <button
                    key={method.method}
                    onClick={() => handleStartStudy(method.method)}
                    className="w-full p-4 bg-white rounded-lg border border-brand-sage/20 hover:border-brand-green hover:shadow-md transition-all duration-200 text-left"
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{method.icon}</span>
                      <div className="flex-1">
                        <h3 className="font-header font-semibold text-brand-navy">{method.name}</h3>
                        <p className="text-sm text-brand-slate font-body">{method.description}</p>
                        <p className="text-xs text-brand-slate/70 font-body mt-1">
                          ~{method.estimatedDuration} min
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Progress Tracker */}
            <ProgressTracker subjects={subjects} sessions={sessions} />
          </div>
        </div>
      </div>

      {/* Modals */}
      {showAddSubject && (
        <AddSubjectModal
          onClose={() => setShowAddSubject(false)}
          onAdd={handleAddSubject}
        />
      )}

      {showStudySession && selectedMethod && (
        <StudySessionModal
          method={selectedMethod}
          subjects={subjects}
          materials={materials}
          onClose={() => {
            setShowStudySession(false);
            setSelectedMethod(null);
          }}
          onComplete={handleCompleteSession}
        />
      )}
    </div>
  );
};

export default Dashboard;
