import React, { useState } from 'react';
import { X, Plus, BookOpen, Clock } from 'lucide-react';
import { StudyMethod, Subject, StudyMaterial, StudySession } from '../types';
import { STUDY_METHODS } from '../utils/studyMethods';
import SQ3RMethod from './studyMethods/SQ3RMethod';
import FlashcardMethod from './studyMethods/FlashcardMethod';
import FeynmanMethod from './studyMethods/FeynmanMethod';
import QuizMethod from './studyMethods/QuizMethod';
import SpacedPracticeMethod from './studyMethods/SpacedPracticeMethod';
import SleepReviewMethod from './studyMethods/SleepReviewMethod';

interface StudySessionModalProps {
  method: StudyMethod;
  subjects: Subject[];
  materials: StudyMaterial[];
  onClose: () => void;
  onComplete: (session: Omit<StudySession, 'id' | 'startTime' | 'duration'>) => void;
}

const StudySessionModal: React.FC<StudySessionModalProps> = ({
  method,
  subjects,
  materials,
  onClose,
  onComplete
}) => {
  const [selectedSubject, setSelectedSubject] = useState<string>('');
  const [selectedMaterial, setSelectedMaterial] = useState<string>('');
  const [sessionStartTime, setSessionStartTime] = useState<Date | null>(null);
  const [sessionNotes, setSessionNotes] = useState('');
  const [sessionScore, setSessionScore] = useState<number | null>(null);
  const [showStudyMethod, setShowStudyMethod] = useState(false);

  const methodConfig = STUDY_METHODS.find(m => m.method === method);
  const selectedSubjectData = subjects.find(s => s.id === selectedSubject);
  const selectedMaterialData = materials.find(m => m.id === selectedMaterial);
  const subjectMaterials = materials.filter(m => m.subjectId === selectedSubject);

  const handleStartSession = () => {
    if (selectedSubject && selectedMaterial) {
      setSessionStartTime(new Date());
      setShowStudyMethod(true);
    }
  };

  const handleMethodComplete = (score: number) => {
    setSessionScore(score);
    setShowStudyMethod(false);
  };

  const handleFinishSession = () => {
    if (sessionStartTime && selectedSubject && selectedMaterial) {
      const duration = Math.round((new Date().getTime() - sessionStartTime.getTime()) / 1000 / 60);
      onComplete({
        subjectId: selectedSubject,
        materialId: selectedMaterial,
        method,
        endTime: new Date(),
        duration,
        score: sessionScore || 0,
        notes: sessionNotes
      });
    }
  };

  const renderStudyMethod = () => {
    if (!selectedMaterialData) return null;

    const commonProps = {
      material: selectedMaterialData,
      onComplete: handleMethodComplete,
      onBack: () => setShowStudyMethod(false)
    };

    switch (method) {
      case 'sq3r':
        return <SQ3RMethod {...commonProps} />;
      case 'flashcards':
        return <FlashcardMethod {...commonProps} />;
      case 'feynman':
        return <FeynmanMethod {...commonProps} />;
      case 'quiz':
        return <QuizMethod {...commonProps} />;
      case 'spaced-practice':
        return <SpacedPracticeMethod {...commonProps} />;
      case 'sleep-review':
        return <SleepReviewMethod {...commonProps} />;
      default:
        return null;
    }
  };

  if (showStudyMethod && selectedMaterialData) {
    return (
      <div className="fixed inset-0 bg-white z-50 overflow-y-auto">
        {renderStudyMethod()}
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-brand-sage/20">
          <div className="flex items-center space-x-3">
            <div className="text-2xl">{methodConfig?.icon}</div>
            <div>
              <h2 className="text-xl font-header font-bold text-brand-navy">
                {methodConfig?.name}
              </h2>
              <p className="text-sm text-brand-slate font-body">
                {methodConfig?.description}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-brand-slate hover:text-brand-navy transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Method Info */}
          <div className="p-4 bg-brand-sage/10 rounded-lg">
            <div className="flex items-center space-x-4">
              <Clock className="w-5 h-5 text-brand-green" />
              <div>
                <h3 className="font-medium text-brand-navy font-body">Estimated Duration</h3>
                <p className="text-sm text-brand-slate font-body">
                  {methodConfig?.estimatedDuration} minutes
                </p>
              </div>
            </div>
          </div>

          {/* Subject Selection */}
          <div>
            <label className="block text-sm font-medium text-brand-navy mb-2 font-body">
              Select Subject
            </label>
            <select
              value={selectedSubject}
              onChange={(e) => {
                setSelectedSubject(e.target.value);
                setSelectedMaterial('');
              }}
              className="w-full px-3 py-2 border border-brand-sage/50 rounded-lg focus:ring-2 focus:ring-brand-green focus:border-transparent font-body"
            >
              <option value="">Choose a subject...</option>
              {subjects.map(subject => (
                <option key={subject.id} value={subject.id}>
                  {subject.icon} {subject.name}
                </option>
              ))}
            </select>
          </div>

          {/* Material Selection */}
          {selectedSubject && (
            <div>
              <label className="block text-sm font-medium text-brand-navy mb-2 font-body">
                Select Study Material
              </label>
              {subjectMaterials.length === 0 ? (
                <div className="p-4 border-2 border-dashed border-brand-sage/30 rounded-lg text-center">
                  <BookOpen className="w-8 h-8 text-brand-slate/50 mx-auto mb-2" />
                  <p className="text-brand-slate font-body mb-3">
                    No materials found for this subject
                  </p>
                  <button className="btn-secondary flex items-center mx-auto">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Material
                  </button>
                </div>
              ) : (
                <select
                  value={selectedMaterial}
                  onChange={(e) => setSelectedMaterial(e.target.value)}
                  className="w-full px-3 py-2 border border-brand-sage/50 rounded-lg focus:ring-2 focus:ring-brand-green focus:border-transparent font-body"
                >
                  <option value="">Choose material...</option>
                  {subjectMaterials.map(material => (
                    <option key={material.id} value={material.id}>
                      {material.title} ({material.type})
                    </option>
                  ))}
                </select>
              )}
            </div>
          )}

          {/* Selected Material Preview */}
          {selectedMaterialData && (
            <div className="p-4 bg-brand-light/50 rounded-lg">
              <h3 className="font-medium text-brand-navy mb-2 font-body">Selected Material:</h3>
              <div className="space-y-2">
                <h4 className="font-medium text-brand-slate font-body">
                  {selectedMaterialData.title}
                </h4>
                <p className="text-sm text-brand-slate/70 font-body">
                  {selectedMaterialData.content.substring(0, 200)}...
                </p>
                <div className="flex items-center space-x-4 text-xs text-brand-slate/70 font-body">
                  <span>Type: {selectedMaterialData.type}</span>
                  <span>Difficulty: {selectedMaterialData.difficulty}</span>
                  <span>Tags: {selectedMaterialData.tags.join(', ')}</span>
                </div>
              </div>
            </div>
          )}

          {/* Session Notes */}
          {sessionScore !== null && (
            <div>
              <label className="block text-sm font-medium text-brand-navy mb-2 font-body">
                Session Notes
              </label>
              <textarea
                value={sessionNotes}
                onChange={(e) => setSessionNotes(e.target.value)}
                className="w-full h-24 p-3 border border-brand-sage/50 rounded-lg focus:ring-2 focus:ring-brand-green focus:border-transparent resize-none font-body"
                placeholder="Add any additional notes about your study session..."
              />
            </div>
          )}

          {/* Actions */}
          <div className="flex space-x-3 pt-4">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-brand-sage/50 text-brand-slate rounded-lg hover:bg-brand-light/50 transition-colors font-body font-medium"
            >
              Cancel
            </button>
            
            {sessionScore === null ? (
              <button
                onClick={handleStartSession}
                disabled={!selectedSubject || !selectedMaterial}
                className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Start Study Session
              </button>
            ) : (
              <button
                onClick={handleFinishSession}
                className="flex-1 btn-primary"
              >
                Complete Session ({sessionScore}%)
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudySessionModal;
