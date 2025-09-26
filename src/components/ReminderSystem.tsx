import React, { useState, useEffect } from 'react';
import { Bell, Clock, X, CheckCircle, Moon } from 'lucide-react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { ReminderSettings, StudyMethod } from '../types';
import { shouldShowReminder } from '../utils/studyMethods';

const ReminderSystem: React.FC = () => {
  const [reminderSettings, setReminderSettings] = useLocalStorage<ReminderSettings>('reminderSettings', {
    enabled: true,
    time: '20:00',
    beforeSleep: true,
    methods: ['sleep-review', 'flashcards'],
    subjects: []
  });

  const [showReminder, setShowReminder] = useState(false);
  const [lastStudyDate, setLastStudyDate] = useState<Date | null>(null);

  // Check for reminders
  useEffect(() => {
    if (!reminderSettings.enabled) return;

    const checkReminder = () => {
      if (lastStudyDate && shouldShowReminder(lastStudyDate, reminderSettings.time)) {
        setShowReminder(true);
      }
    };

    // Check immediately
    checkReminder();

    // Check every minute
    const interval = setInterval(checkReminder, 60000);

    return () => clearInterval(interval);
  }, [reminderSettings, lastStudyDate]);

  const handleDismissReminder = () => {
    setShowReminder(false);
    // Set last study date to now to prevent immediate re-showing
    setLastStudyDate(new Date());
  };

  const handleStartStudy = () => {
    // This would typically navigate to the study dashboard
    window.location.reload(); // Simple refresh for demo
  };

  if (!showReminder) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                <Moon className="w-5 h-5 text-indigo-600" />
              </div>
              <div>
                <h2 className="text-lg font-header font-bold text-brand-navy">
                  Study Reminder
                </h2>
                <p className="text-sm text-brand-slate font-body">
                  Time for your evening review
                </p>
              </div>
            </div>
            <button
              onClick={handleDismissReminder}
              className="text-brand-slate hover:text-brand-navy transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-4">
            <div className="p-4 bg-indigo-50 rounded-lg">
              <h3 className="font-medium text-indigo-800 mb-2 font-body">Why study before sleep?</h3>
              <ul className="text-sm text-indigo-700 space-y-1 font-body">
                <li>• Memory consolidation happens during sleep</li>
                <li>• 15-20 minutes is the optimal duration</li>
                <li>• Helps transfer information to long-term memory</li>
                <li>• Reduces interference from new information</li>
              </ul>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={handleDismissReminder}
                className="flex-1 px-4 py-2 border border-brand-sage/50 text-brand-slate rounded-lg hover:bg-brand-light/50 transition-colors font-body font-medium"
              >
                Maybe Later
              </button>
              <button
                onClick={handleStartStudy}
                className="flex-1 btn-primary flex items-center justify-center"
              >
                <Clock className="w-4 h-4 mr-2" />
                Start Review
              </button>
            </div>

            <div className="text-center">
              <button
                onClick={() => {
                  setReminderSettings(prev => ({ ...prev, enabled: false }));
                  setShowReminder(false);
                }}
                className="text-xs text-brand-slate/70 hover:text-brand-slate transition-colors font-body"
              >
                Disable reminders
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReminderSystem;
