import React, { useState } from 'react';
import { 
  BookOpen, 
  Brain, 
  Clock, 
  Target, 
  TrendingUp, 
  Plus,
  Calendar,
  Award,
  BarChart3
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useClasses } from '../hooks/useClasses';
import { useStudyMaterials } from '../hooks/useStudyMaterials';
import ClassManager from './ClassManager';
import StudyMaterialsView from './StudyMaterialsView';
import FlashcardSystem from './FlashcardSystem';
import NoteSummarizer from './NoteSummarizer';
import StudyScheduler from './StudyScheduler';

type DashboardView = 'overview' | 'classes' | 'materials' | 'flashcards' | 'summarizer' | 'scheduler';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { classes } = useClasses();
  const { materials } = useStudyMaterials();
  const [currentView, setCurrentView] = useState<DashboardView>('overview');

  const stats = {
    totalClasses: classes.length,
    totalMaterials: materials.length,
    studyStreak: 7, // Mock data
    completedGoals: 12 // Mock data
  };

  const renderView = () => {
    switch (currentView) {
      case 'classes':
        return <ClassManager />;
      case 'materials':
        return <StudyMaterialsView />;
      case 'flashcards':
        return <FlashcardSystem />;
      case 'summarizer':
        return <NoteSummarizer />;
      case 'scheduler':
        return <StudyScheduler />;
      default:
        return renderOverview();
    }
  };

  const renderOverview = () => (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-brand-green to-brand-slate rounded-2xl p-8 text-white">
        <h1 className="text-3xl font-header font-bold mb-2">
          Welcome back, {user?.username}!
        </h1>
        <p className="text-white/90 text-lg font-body">
          Ready to continue your learning journey? Let's make today count.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-brand-sage/20 rounded-xl flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-brand-green" />
            </div>
            <span className="text-2xl font-header font-bold text-brand-navy">
              {stats.totalClasses}
            </span>
          </div>
          <h3 className="font-body font-semibold text-brand-navy mb-1">Active Classes</h3>
          <p className="text-brand-slate/70 text-sm font-body">Subjects you're studying</p>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-brand-sage/20 rounded-xl flex items-center justify-center">
              <Brain className="w-6 h-6 text-brand-green" />
            </div>
            <span className="text-2xl font-header font-bold text-brand-navy">
              {stats.totalMaterials}
            </span>
          </div>
          <h3 className="font-body font-semibold text-brand-navy mb-1">Study Materials</h3>
          <p className="text-brand-slate/70 text-sm font-body">Notes, flashcards & more</p>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-brand-sage/20 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-brand-green" />
            </div>
            <span className="text-2xl font-header font-bold text-brand-navy">
              {stats.studyStreak}
            </span>
          </div>
          <h3 className="font-body font-semibold text-brand-navy mb-1">Day Streak</h3>
          <p className="text-brand-slate/70 text-sm font-body">Consecutive study days</p>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-brand-sage/20 rounded-xl flex items-center justify-center">
              <Award className="w-6 h-6 text-brand-green" />
            </div>
            <span className="text-2xl font-header font-bold text-brand-navy">
              {stats.completedGoals}
            </span>
          </div>
          <h3 className="font-body font-semibold text-brand-navy mb-1">Goals Achieved</h3>
          <p className="text-brand-slate/70 text-sm font-body">This semester</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card p-8">
        <h2 className="text-2xl font-header font-bold text-brand-navy mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <button
            onClick={() => setCurrentView('classes')}
            className="p-6 border-2 border-brand-sage/30 rounded-xl hover:border-brand-green hover:bg-brand-light/50 transition-all duration-200 text-left group"
          >
            <div className="w-12 h-12 bg-brand-sage/20 rounded-xl flex items-center justify-center mb-4 group-hover:bg-brand-green/20">
              <Plus className="w-6 h-6 text-brand-green" />
            </div>
            <h3 className="font-body font-semibold text-brand-navy mb-2">Add New Class</h3>
            <p className="text-brand-slate/70 text-sm font-body">Organize your subjects</p>
          </button>

          <button
            onClick={() => setCurrentView('summarizer')}
            className="p-6 border-2 border-brand-sage/30 rounded-xl hover:border-brand-green hover:bg-brand-light/50 transition-all duration-200 text-left group"
          >
            <div className="w-12 h-12 bg-brand-sage/20 rounded-xl flex items-center justify-center mb-4 group-hover:bg-brand-green/20">
              <Brain className="w-6 h-6 text-brand-green" />
            </div>
            <h3 className="font-body font-semibold text-brand-navy mb-2">Summarize Notes</h3>
            <p className="text-brand-slate/70 text-sm font-body">AI-powered summaries</p>
          </button>

          <button
            onClick={() => setCurrentView('flashcards')}
            className="p-6 border-2 border-brand-sage/30 rounded-xl hover:border-brand-green hover:bg-brand-light/50 transition-all duration-200 text-left group"
          >
            <div className="w-12 h-12 bg-brand-sage/20 rounded-xl flex items-center justify-center mb-4 group-hover:bg-brand-green/20">
              <Target className="w-6 h-6 text-brand-green" />
            </div>
            <h3 className="font-body font-semibold text-brand-navy mb-2">Practice Flashcards</h3>
            <p className="text-brand-slate/70 text-sm font-body">Spaced repetition</p>
          </button>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="card p-8">
        <h2 className="text-2xl font-header font-bold text-brand-navy mb-6">Recent Activity</h2>
        <div className="space-y-4">
          <div className="flex items-center space-x-4 p-4 bg-brand-light/50 rounded-lg">
            <div className="w-10 h-10 bg-brand-green/20 rounded-full flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-brand-green" />
            </div>
            <div className="flex-1">
              <p className="font-body font-medium text-brand-navy">Reviewed Biology flashcards</p>
              <p className="text-brand-slate/70 text-sm font-body">2 hours ago</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4 p-4 bg-brand-light/50 rounded-lg">
            <div className="w-10 h-10 bg-brand-green/20 rounded-full flex items-center justify-center">
              <Brain className="w-5 h-5 text-brand-green" />
            </div>
            <div className="flex-1">
              <p className="font-body font-medium text-brand-navy">Created summary for Chemistry notes</p>
              <p className="text-brand-slate/70 text-sm font-body">Yesterday</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4 p-4 bg-brand-light/50 rounded-lg">
            <div className="w-10 h-10 bg-brand-green/20 rounded-full flex items-center justify-center">
              <Calendar className="w-5 h-5 text-brand-green" />
            </div>
            <div className="flex-1">
              <p className="font-body font-medium text-brand-navy">Completed study session for Math</p>
              <p className="text-brand-slate/70 text-sm font-body">2 days ago</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-brand-light">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:w-64 flex-shrink-0">
            <div className="card p-6 sticky top-8">
              <nav className="space-y-2">
                <button
                  onClick={() => setCurrentView('overview')}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors font-body ${
                    currentView === 'overview'
                      ? 'bg-brand-green text-white'
                      : 'text-brand-slate hover:bg-brand-light/50'
                  }`}
                >
                  <BarChart3 className="w-5 h-5" />
                  <span>Overview</span>
                </button>

                <button
                  onClick={() => setCurrentView('classes')}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors font-body ${
                    currentView === 'classes'
                      ? 'bg-brand-green text-white'
                      : 'text-brand-slate hover:bg-brand-light/50'
                  }`}
                >
                  <BookOpen className="w-5 h-5" />
                  <span>My Classes</span>
                </button>

                <button
                  onClick={() => setCurrentView('materials')}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors font-body ${
                    currentView === 'materials'
                      ? 'bg-brand-green text-white'
                      : 'text-brand-slate hover:bg-brand-light/50'
                  }`}
                >
                  <Brain className="w-5 h-5" />
                  <span>Study Materials</span>
                </button>

                <button
                  onClick={() => setCurrentView('flashcards')}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors font-body ${
                    currentView === 'flashcards'
                      ? 'bg-brand-green text-white'
                      : 'text-brand-slate hover:bg-brand-light/50'
                  }`}
                >
                  <Target className="w-5 h-5" />
                  <span>Flashcards</span>
                </button>

                <button
                  onClick={() => setCurrentView('summarizer')}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors font-body ${
                    currentView === 'summarizer'
                      ? 'bg-brand-green text-white'
                      : 'text-brand-slate hover:bg-brand-light/50'
                  }`}
                >
                  <Brain className="w-5 h-5" />
                  <span>Note Summarizer</span>
                </button>

                <button
                  onClick={() => setCurrentView('scheduler')}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors font-body ${
                    currentView === 'scheduler'
                      ? 'bg-brand-green text-white'
                      : 'text-brand-slate hover:bg-brand-light/50'
                  }`}
                >
                  <Calendar className="w-5 h-5" />
                  <span>Study Scheduler</span>
                </button>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {renderView()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;