import React, { useState } from 'react';
import { Calendar, Plus, Clock, Target, CheckCircle, TrendingUp, BookOpen, FileText, Users, AlertCircle } from 'lucide-react';
import { useClasses } from '../hooks/useClasses';

interface StudySession {
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

interface StudyGoal {
  id: string;
  title: string;
  description: string;
  targetDate: string;
  progress: number;
  completed: boolean;
  created_at: string;
}

const StudyScheduler: React.FC = () => {
  const { classes } = useClasses();
  const [currentView, setCurrentView] = useState<'schedule' | 'goals'>('schedule');
  const [sessions, setSessions] = useState<StudySession[]>([]);
  const [goals, setGoals] = useState<StudyGoal[]>([]);
  const [showSessionForm, setShowSessionForm] = useState(false);
  const [showGoalForm, setShowGoalForm] = useState(false);
  
  const [sessionForm, setSessionForm] = useState({
    title: '',
    classId: '',
    date: new Date().toISOString().split('T')[0],
    time: '09:00',
    duration: 60,
    type: 'review' as StudySession['type'],
    priority: 'medium' as StudySession['priority']
  });

  const [goalForm, setGoalForm] = useState({
    title: '',
    description: '',
    targetDate: ''
  });

  const handleCreateSession = (e: React.FormEvent) => {
    e.preventDefault();
    const newSession: StudySession = {
      id: Date.now().toString(),
      ...sessionForm,
      completed: false,
      created_at: new Date().toISOString()
    };
    setSessions([...sessions, newSession]);
    setSessionForm({
      title: '',
      classId: '',
      date: new Date().toISOString().split('T')[0],
      time: '09:00',
      duration: 60,
      type: 'review',
      priority: 'medium'
    });
    setShowSessionForm(false);
  };

  const handleCreateGoal = (e: React.FormEvent) => {
    e.preventDefault();
    const newGoal: StudyGoal = {
      id: Date.now().toString(),
      ...goalForm,
      progress: 0,
      completed: false,
      created_at: new Date().toISOString()
    };
    setGoals([...goals, newGoal]);
    setGoalForm({
      title: '',
      description: '',
      targetDate: ''
    });
    setShowGoalForm(false);
  };

  const toggleSessionComplete = (sessionId: string) => {
    setSessions(sessions.map(session => 
      session.id === sessionId 
        ? { ...session, completed: !session.completed }
        : session
    ));
  };

  const todaySessions = sessions.filter(session => 
    session.date === new Date().toISOString().split('T')[0]
  );

  const upcomingSessions = sessions.filter(session => 
    new Date(session.date) > new Date() && 
    session.date !== new Date().toISOString().split('T')[0]
  ).slice(0, 5);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-red-400 bg-red-50';
      case 'medium': return 'border-yellow-400 bg-yellow-50';
      case 'low': return 'border-green-400 bg-green-50';
      default: return 'border-brand-sage bg-brand-light/50';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'review': return <BookOpen className="w-4 h-4" />;
      case 'practice': return <Target className="w-4 h-4" />;
      case 'reading': return <FileText className="w-4 h-4" />;
      case 'assignment': return <Users className="w-4 h-4" />;
      default: return <BookOpen className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-header font-bold text-brand-navy mb-2">Study Planner</h1>
          <p className="text-brand-slate font-body">
            Schedule your study sessions and track your academic goals
          </p>
        </div>
        <div className="flex space-x-3 mt-4 sm:mt-0">
          <button
            onClick={() => setCurrentView('schedule')}
            className={`px-4 py-2 rounded-lg font-body transition-colors ${
              currentView === 'schedule'
                ? 'bg-brand-green text-white'
                : 'bg-brand-sage/20 text-brand-slate hover:bg-brand-sage/30'
            }`}
          >
            Schedule
          </button>
          <button
            onClick={() => setCurrentView('goals')}
            className={`px-4 py-2 rounded-lg font-body transition-colors ${
              currentView === 'goals'
                ? 'bg-brand-green text-white'
                : 'bg-brand-sage/20 text-brand-slate hover:bg-brand-sage/30'
            }`}
          >
            Goals
          </button>
        </div>
      </div>

      {currentView === 'schedule' ? (
        /* Schedule View */
        <div className="space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="card p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-brand-sage/20 rounded-xl flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-brand-green" />
                </div>
                <span className="text-2xl font-header font-bold text-brand-navy">
                  {todaySessions.length}
                </span>
              </div>
              <h3 className="font-body font-semibold text-brand-navy mb-1">Today</h3>
              <p className="text-brand-slate/70 text-sm font-body">Scheduled sessions</p>
            </div>

            <div className="card p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-brand-sage/20 rounded-xl flex items-center justify-center">
                  <Clock className="w-6 h-6 text-brand-green" />
                </div>
                <span className="text-2xl font-header font-bold text-brand-navy">
                  {sessions.reduce((acc, session) => acc + session.duration, 0)}
                </span>
              </div>
              <h3 className="font-body font-semibold text-brand-navy mb-1">Total Minutes</h3>
              <p className="text-brand-slate/70 text-sm font-body">This week</p>
            </div>

            <div className="card p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-brand-sage/20 rounded-xl flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-brand-green" />
                </div>
                <span className="text-2xl font-header font-bold text-brand-navy">
                  {sessions.filter(s => s.completed).length}
                </span>
              </div>
              <h3 className="font-body font-semibold text-brand-navy mb-1">Completed</h3>
              <p className="text-brand-slate/70 text-sm font-body">This week</p>
            </div>

            <div className="card p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-brand-sage/20 rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-brand-green" />
                </div>
                <span className="text-2xl font-header font-bold text-brand-navy">
                  {Math.round((sessions.filter(s => s.completed).length / sessions.length) * 100) || 0}%
                </span>
              </div>
              <h3 className="font-body font-semibold text-brand-navy mb-1">Completion Rate</h3>
              <p className="text-brand-slate/70 text-sm font-body">Overall progress</p>
            </div>
          </div>

          {/* Today's Schedule */}
          <div className="card p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-header font-bold text-brand-navy">Today's Schedule</h2>
              <button
                onClick={() => setShowSessionForm(true)}
                className="btn-primary"
              >
                <Plus className="w-5 h-5 mr-2" />
                Add Session
              </button>
            </div>

            {todaySessions.length === 0 ? (
              <div className="text-center py-8">
                <Calendar className="w-12 h-12 text-brand-sage mx-auto mb-4" />
                <p className="text-brand-slate font-body">No sessions scheduled for today</p>
              </div>
            ) : (
              <div className="space-y-4">
                {todaySessions.map((session) => {
                  const classInfo = classes.find(c => c.id === session.classId);
                  return (
                    <div
                      key={session.id}
                      className={`p-4 rounded-lg border-l-4 ${getPriorityColor(session.priority)} ${
                        session.completed ? 'opacity-60' : ''
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <button
                            onClick={() => toggleSessionComplete(session.id)}
                            className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                              session.completed
                                ? 'bg-brand-green border-brand-green text-white'
                                : 'border-brand-sage hover:border-brand-green'
                            }`}
                          >
                            {session.completed && <CheckCircle className="w-4 h-4" />}
                          </button>
                          
                          <div>
                            <h3 className={`font-body font-semibold ${
                              session.completed ? 'line-through text-brand-slate/60' : 'text-brand-navy'
                            }`}>
                              {session.title}
                            </h3>
                            <div className="flex items-center space-x-4 text-sm text-brand-slate/70 font-body">
                              <span>{classInfo?.name || 'Unknown Class'}</span>
                              <span>{session.time}</span>
                              <span>{session.duration} min</span>
                              <div className="flex items-center space-x-1">
                                {getTypeIcon(session.type)}
                                <span className="capitalize">{session.type}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <span className={`px-2 py-1 rounded-full text-xs font-body capitalize ${
                          session.priority === 'high' ? 'bg-red-100 text-red-700' :
                          session.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-green-100 text-green-700'
                        }`}>
                          {session.priority}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Create Session Form */}
          {showSessionForm && (
            <div className="card p-8">
              <h2 className="text-xl font-header font-bold text-brand-navy mb-6">Schedule New Session</h2>
              
              <form onSubmit={handleCreateSession} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-brand-navy mb-2 font-body">
                      Session Title *
                    </label>
                    <input
                      type="text"
                      value={sessionForm.title}
                      onChange={(e) => setSessionForm({ ...sessionForm, title: e.target.value })}
                      className="w-full px-4 py-3 border border-brand-sage/50 rounded-lg focus:ring-2 focus:ring-brand-green focus:border-transparent font-body"
                      placeholder="e.g., Review Chapter 5"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-brand-navy mb-2 font-body">
                      Class *
                    </label>
                    <select
                      value={sessionForm.classId}
                      onChange={(e) => setSessionForm({ ...sessionForm, classId: e.target.value })}
                      className="w-full px-4 py-3 border border-brand-sage/50 rounded-lg focus:ring-2 focus:ring-brand-green focus:border-transparent font-body"
                      required
                    >
                      <option value="">Select a class</option>
                      {classes.map((cls) => (
                        <option key={cls.id} value={cls.id}>{cls.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-brand-navy mb-2 font-body">
                      Date *
                    </label>
                    <input
                      type="date"
                      value={sessionForm.date}
                      onChange={(e) => setSessionForm({ ...sessionForm, date: e.target.value })}
                      className="w-full px-4 py-3 border border-brand-sage/50 rounded-lg focus:ring-2 focus:ring-brand-green focus:border-transparent font-body"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-brand-navy mb-2 font-body">
                      Time *
                    </label>
                    <input
                      type="time"
                      value={sessionForm.time}
                      onChange={(e) => setSessionForm({ ...sessionForm, time: e.target.value })}
                      className="w-full px-4 py-3 border border-brand-sage/50 rounded-lg focus:ring-2 focus:ring-brand-green focus:border-transparent font-body"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-brand-navy mb-2 font-body">
                      Duration (minutes) *
                    </label>
                    <input
                      type="number"
                      value={sessionForm.duration}
                      onChange={(e) => setSessionForm({ ...sessionForm, duration: parseInt(e.target.value) })}
                      className="w-full px-4 py-3 border border-brand-sage/50 rounded-lg focus:ring-2 focus:ring-brand-green focus:border-transparent font-body"
                      min="15"
                      max="480"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-brand-navy mb-2 font-body">
                      Session Type
                    </label>
                    <select
                      value={sessionForm.type}
                      onChange={(e) => setSessionForm({ ...sessionForm, type: e.target.value as StudySession['type'] })}
                      className="w-full px-4 py-3 border border-brand-sage/50 rounded-lg focus:ring-2 focus:ring-brand-green focus:border-transparent font-body"
                    >
                      <option value="review">Review</option>
                      <option value="practice">Practice</option>
                      <option value="reading">Reading</option>
                      <option value="assignment">Assignment</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-brand-navy mb-2 font-body">
                      Priority
                    </label>
                    <select
                      value={sessionForm.priority}
                      onChange={(e) => setSessionForm({ ...sessionForm, priority: e.target.value as StudySession['priority'] })}
                      className="w-full px-4 py-3 border border-brand-sage/50 rounded-lg focus:ring-2 focus:ring-brand-green focus:border-transparent font-body"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                </div>

                <div className="flex space-x-4">
                  <button type="submit" className="btn-primary">
                    Schedule Session
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowSessionForm(false)}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      ) : (
        /* Goals View */
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-header font-bold text-brand-navy">Study Goals</h2>
            <button
              onClick={() => setShowGoalForm(true)}
              className="btn-primary"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add Goal
            </button>
          </div>

          {goals.length === 0 ? (
            <div className="card p-12 text-center">
              <Target className="w-16 h-16 text-brand-sage mx-auto mb-4" />
              <h3 className="text-xl font-header font-semibold text-brand-navy mb-2">No goals set yet</h3>
              <p className="text-brand-slate font-body mb-6">
                Set academic goals to stay motivated and track your progress
              </p>
              <button
                onClick={() => setShowGoalForm(true)}
                className="btn-primary"
              >
                <Plus className="w-5 h-5 mr-2" />
                Set Your First Goal
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {goals.map((goal) => (
                <div key={goal.id} className="card p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 bg-brand-sage/20 rounded-xl flex items-center justify-center">
                      <Target className="w-6 h-6 text-brand-green" />
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-body ${
                      goal.completed ? 'bg-green-100 text-green-700' : 'bg-brand-sage/20 text-brand-slate'
                    }`}>
                      {goal.completed ? 'Completed' : 'In Progress'}
                    </span>
                  </div>
                  
                  <h3 className="text-lg font-header font-semibold text-brand-navy mb-2">
                    {goal.title}
                  </h3>
                  
                  <p className="text-brand-slate/70 text-sm font-body mb-4">
                    {goal.description}
                  </p>
                  
                  <div className="mb-4">
                    <div className="flex items-center justify-between text-sm font-body mb-2">
                      <span className="text-brand-slate">Progress</span>
                      <span className="text-brand-navy font-semibold">{goal.progress}%</span>
                    </div>
                    <div className="w-full bg-brand-sage/30 rounded-full h-2">
                      <div 
                        className="bg-brand-green h-2 rounded-full transition-all duration-300"
                        style={{ width: `${goal.progress}%` }}
                      />
                    </div>
                  </div>
                  
                  <div className="text-sm text-brand-slate/60 font-body">
                    Target: {new Date(goal.targetDate).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Create Goal Form */}
          {showGoalForm && (
            <div className="card p-8">
              <h2 className="text-xl font-header font-bold text-brand-navy mb-6">Set New Goal</h2>
              
              <form onSubmit={handleCreateGoal} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-brand-navy mb-2 font-body">
                    Goal Title *
                  </label>
                  <input
                    type="text"
                    value={goalForm.title}
                    onChange={(e) => setGoalForm({ ...goalForm, title: e.target.value })}
                    className="w-full px-4 py-3 border border-brand-sage/50 rounded-lg focus:ring-2 focus:ring-brand-green focus:border-transparent font-body"
                    placeholder="e.g., Master Organic Chemistry"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-brand-navy mb-2 font-body">
                    Description
                  </label>
                  <textarea
                    value={goalForm.description}
                    onChange={(e) => setGoalForm({ ...goalForm, description: e.target.value })}
                    className="w-full px-4 py-3 border border-brand-sage/50 rounded-lg focus:ring-2 focus:ring-brand-green focus:border-transparent font-body"
                    placeholder="Describe what you want to achieve"
                    rows={3}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-brand-navy mb-2 font-body">
                    Target Date *
                  </label>
                  <input
                    type="date"
                    value={goalForm.targetDate}
                    onChange={(e) => setGoalForm({ ...goalForm, targetDate: e.target.value })}
                    className="w-full px-4 py-3 border border-brand-sage/50 rounded-lg focus:ring-2 focus:ring-brand-green focus:border-transparent font-body"
                    required
                  />
                </div>

                <div className="flex space-x-4">
                  <button type="submit" className="btn-primary">
                    Create Goal
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowGoalForm(false)}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default StudyScheduler;