import React, { useState } from 'react';
import { Brain, BookOpen, FileText, Calendar, Target, BarChart3, Settings, LogOut, Moon, HelpCircle, Lightbulb, BookMarked } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useClasses } from '../hooks/useClasses';
import { useStudyMaterials } from '../hooks/useStudyMaterials';
import ClassManager from './ClassManager';
import StudyMaterialsView from './StudyMaterialsView';
import NoteSummarizer from './NoteSummarizer';
import FlashcardSystem from './FlashcardSystem';
import StudyScheduler from './StudyScheduler';
import StudyMethodLauncher from './StudyMethodLauncher';
import UserMenu from './UserMenu';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [currentView, setCurrentView] = useState<'dashboard' | 'classes' | 'materials' | 'summarizer' | 'flashcards' | 'scheduler' | 'sq3r' | 'quiz' | 'feynman' | 'sleep-review'>('dashboard');

  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'classes', label: 'My Classes', icon: BookOpen },
    { id: 'materials', label: 'Study Materials', icon: FileText },
    { id: 'summarizer', label: 'Note Summarizer', icon: Brain },
    { id: 'flashcards', label: 'Flashcards', icon: Target },
    { id: 'scheduler', label: 'Study Planner', icon: Calendar },
  ];

  const studyMethodItems = [
    { id: 'sq3r', label: 'SQ3R Method', icon: BookMarked },
    { id: 'quiz', label: 'Practice Quiz', icon: HelpCircle },
    { id: 'feynman', label: 'Feynman Technique', icon: Lightbulb },
    { id: 'sleep-review', label: 'Sleep Review', icon: Moon },
  ];

  const renderCurrentView = () => {
    switch (currentView) {
      case 'classes':
        return <ClassManager />;
      case 'materials':
        return <StudyMaterialsView />;
      case 'summarizer':
        return <NoteSummarizer />;
      case 'flashcards':
        return <FlashcardSystem />;
      case 'scheduler':
        return <StudyScheduler />;
      case 'sq3r':
      case 'quiz':
      case 'feynman':
      case 'sleep-review':
        return <StudyMethodLauncher method={currentView} onBack={() => setCurrentView('dashboard')} />;
      default:
        return <DashboardHome />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-light via-white to-brand-sage/20 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-brand-sage/20 flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-brand-sage/20">
          <div className="flex items-center space-x-3">
            <img 
              src="/thinker-logo.png" 
              alt="Thinker Logo" 
              className="h-10 w-auto"
            />
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 overflow-y-auto">
          <div className="space-y-6">
            <div>
              <h3 className="text-xs font-semibold text-brand-slate/60 uppercase tracking-wider mb-2 px-4 font-body">
                Main
              </h3>
              <div className="space-y-1">
                {navigationItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setCurrentView(item.id as any)}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors font-body ${
                        currentView === item.id
                          ? 'bg-brand-green text-white'
                          : 'text-brand-slate hover:bg-brand-light/50 hover:text-brand-navy'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <h3 className="text-xs font-semibold text-brand-slate/60 uppercase tracking-wider mb-2 px-4 font-body">
                Study Methods
              </h3>
              <div className="space-y-1">
                {studyMethodItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setCurrentView(item.id as any)}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors font-body ${
                        currentView === item.id
                          ? 'bg-brand-green text-white'
                          : 'text-brand-slate hover:bg-brand-light/50 hover:text-brand-navy'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="text-sm">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </nav>

        {/* User Menu */}
        <div className="p-4 border-t border-brand-sage/20">
          <UserMenu />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          {renderCurrentView()}
        </div>
      </div>
    </div>
  );
};

// Dashboard Home Component
const DashboardHome: React.FC = () => {
  const { user } = useAuth();
  const { classes } = useClasses();
  const { materials } = useStudyMaterials();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-header font-bold text-brand-navy mb-2">
          Welcome back, {user?.user_metadata?.username || 'Student'}!
        </h1>
        <p className="text-xl text-brand-slate font-body">
          Ready to continue your learning journey? Let's make today productive.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-brand-slate text-sm font-body">Classes</p>
              <p className="text-2xl font-header font-bold text-brand-navy">{classes.length}</p>
            </div>
            <BookOpen className="w-8 h-8 text-brand-green" />
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-brand-slate text-sm font-body">Study Materials</p>
              <p className="text-2xl font-header font-bold text-brand-navy">{materials.length}</p>
            </div>
            <FileText className="w-8 h-8 text-brand-green" />
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-brand-slate text-sm font-body">Flashcard Sets</p>
              <p className="text-2xl font-header font-bold text-brand-navy">0</p>
            </div>
            <Target className="w-8 h-8 text-brand-green" />
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-brand-slate text-sm font-body">Study Streak</p>
              <p className="text-2xl font-header font-bold text-brand-navy">0 days</p>
            </div>
            <Calendar className="w-8 h-8 text-brand-green" />
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card p-8">
        <h2 className="text-2xl font-header font-bold text-brand-navy mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-brand-sage/10 rounded-xl hover:bg-brand-sage/20 transition-colors cursor-pointer">
            <div className="w-12 h-12 bg-brand-green/20 rounded-xl flex items-center justify-center mb-4">
              <Brain className="w-6 h-6 text-brand-green" />
            </div>
            <h3 className="text-lg font-header font-semibold text-brand-navy mb-2">
              Summarize Notes
            </h3>
            <p className="text-brand-slate font-body text-sm">
              Paste your notes and get AI-powered summaries for better retention
            </p>
          </div>

          <div className="p-6 bg-brand-sage/10 rounded-xl hover:bg-brand-sage/20 transition-colors cursor-pointer">
            <div className="w-12 h-12 bg-brand-green/20 rounded-xl flex items-center justify-center mb-4">
              <Target className="w-6 h-6 text-brand-green" />
            </div>
            <h3 className="text-lg font-header font-semibold text-brand-navy mb-2">
              Study Flashcards
            </h3>
            <p className="text-brand-slate font-body text-sm">
              Practice with spaced repetition flashcards for long-term memory
            </p>
          </div>

          <div className="p-6 bg-brand-sage/10 rounded-xl hover:bg-brand-sage/20 transition-colors cursor-pointer">
            <div className="w-12 h-12 bg-brand-green/20 rounded-xl flex items-center justify-center mb-4">
              <Calendar className="w-6 h-6 text-brand-green" />
            </div>
            <h3 className="text-lg font-header font-semibold text-brand-navy mb-2">
              Plan Study Session
            </h3>
            <p className="text-brand-slate font-body text-sm">
              Schedule focused study sessions and track your goals
            </p>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      {(classes.length > 0 || materials.length > 0) && (
        <div className="card p-8">
          <h2 className="text-2xl font-header font-bold text-brand-navy mb-6">Recent Activity</h2>
          <div className="space-y-4">
            {classes.slice(0, 3).map((classItem) => (
              <div key={classItem.id} className="flex items-center space-x-4 p-4 bg-brand-light/50 rounded-lg">
                <div className="w-10 h-10 bg-brand-green/20 rounded-full flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-brand-green" />
                </div>
                <div className="flex-1">
                  <p className="font-body font-medium text-brand-navy">
                    Created class: {classItem.name}
                  </p>
                  <p className="text-brand-slate/70 text-sm font-body">
                    {new Date(classItem.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
            {materials.slice(0, 3).map((material) => (
              <div key={material.id} className="flex items-center space-x-4 p-4 bg-brand-light/50 rounded-lg">
                <div className="w-10 h-10 bg-brand-green/20 rounded-full flex items-center justify-center">
                  <FileText className="w-5 h-5 text-brand-green" />
                </div>
                <div className="flex-1">
                  <p className="font-body font-medium text-brand-navy">
                    Added material: {material.title}
                  </p>
                  <p className="text-brand-slate/70 text-sm font-body">
                    {new Date(material.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Study Tips */}
      <div className="card p-8 bg-gradient-to-r from-brand-sage/10 to-brand-green/10">
        <h2 className="text-2xl font-header font-bold text-brand-navy mb-4">
          💡 Today's Study Tip
        </h2>
        <p className="text-brand-slate font-body leading-relaxed">
          <strong>Spaced Repetition:</strong> Review material at increasing intervals (1 day, 3 days, 1 week, 2 weeks) 
          to move information from short-term to long-term memory. This technique can improve retention by up to 200%!
        </p>
      </div>
    </div>
  );
};

export default Dashboard;
