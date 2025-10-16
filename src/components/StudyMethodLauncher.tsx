import React, { useState } from 'react';
import { ArrowLeft, BookOpen, AlertCircle } from 'lucide-react';
import { StudyMethod } from '../types';
import { useClasses } from '../hooks/useClasses';
import { useStudyMaterials } from '../hooks/useStudyMaterials';
import SQ3RMethod from './studyMethods/SQ3RMethod';
import QuizMethod from './studyMethods/QuizMethod';
import FeynmanMethod from './studyMethods/FeynmanMethod';
import SleepReviewMethod from './studyMethods/SleepReviewMethod';

interface StudyMethodLauncherProps {
  method: StudyMethod;
  onBack: () => void;
}

const StudyMethodLauncher: React.FC<StudyMethodLauncherProps> = ({ method, onBack }) => {
  const { classes } = useClasses();
  const { materials } = useStudyMaterials();
  const [selectedClassId, setSelectedClassId] = useState<string>('');
  const [selectedMaterialId, setSelectedMaterialId] = useState<string>('');
  const [showMethod, setShowMethod] = useState(false);
  const [sessionCompleted, setSessionCompleted] = useState(false);
  const [finalScore, setFinalScore] = useState<number>(0);

  const methodInfo = {
    'sq3r': {
      name: 'SQ3R Method',
      description: 'Survey, Question, Read, Recite, Review - systematic reading comprehension',
      icon: '📖',
      estimatedDuration: '30-40 minutes'
    },
    'quiz': {
      name: 'Practice Quiz',
      description: 'Test your knowledge with generated questions',
      icon: '❓',
      estimatedDuration: '15-20 minutes'
    },
    'feynman': {
      name: 'Feynman Technique',
      description: 'Explain concepts in simple terms to identify knowledge gaps',
      icon: '🎯',
      estimatedDuration: '25-35 minutes'
    },
    'sleep-review': {
      name: 'Sleep Review',
      description: '15-20min review before sleep for better memory consolidation',
      icon: '🌙',
      estimatedDuration: '15-20 minutes'
    }
  };

  const info = methodInfo[method as keyof typeof methodInfo];
  const selectedClass = classes.find(c => c.id === selectedClassId);
  const classMaterials = materials.filter(m => m.class_id === selectedClassId);
  const selectedMaterial = materials.find(m => m.id === selectedMaterialId);

  const handleStartMethod = () => {
    if (selectedClassId && selectedMaterialId) {
      setShowMethod(true);
    }
  };

  const handleMethodComplete = (score: number) => {
    setFinalScore(score);
    setSessionCompleted(true);
    setShowMethod(false);
  };

  const handleBackToSelection = () => {
    setShowMethod(false);
  };

  const handleFinish = () => {
    setSelectedClassId('');
    setSelectedMaterialId('');
    setSessionCompleted(false);
    setFinalScore(0);
  };

  const renderMethod = () => {
    if (!selectedMaterial) return null;

    const material = {
      id: selectedMaterial.id,
      title: selectedMaterial.title,
      content: selectedMaterial.content,
      type: selectedMaterial.type,
      difficulty: selectedMaterial.difficulty,
      tags: selectedMaterial.tags || [],
      subjectId: selectedMaterial.class_id,
      created_at: selectedMaterial.created_at
    };

    const commonProps = {
      material,
      onComplete: handleMethodComplete,
      onBack: handleBackToSelection
    };

    switch (method) {
      case 'sq3r':
        return <SQ3RMethod {...commonProps} />;
      case 'quiz':
        return <QuizMethod {...commonProps} />;
      case 'feynman':
        return <FeynmanMethod {...commonProps} />;
      case 'sleep-review':
        return <SleepReviewMethod {...commonProps} />;
      default:
        return null;
    }
  };

  if (showMethod) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-brand-light via-white to-brand-sage/20">
        {renderMethod()}
      </div>
    );
  }

  if (sessionCompleted) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="card p-8 text-center">
          <div className="text-6xl mb-4">{info.icon}</div>
          <h1 className="text-3xl font-header font-bold text-brand-navy mb-4">
            Session Complete!
          </h1>
          <p className="text-xl text-brand-slate font-body mb-6">
            You scored {finalScore}%
          </p>

          <div className="p-6 bg-brand-sage/10 rounded-lg mb-8">
            <h3 className="font-medium text-brand-navy mb-2 font-body">Session Summary</h3>
            <div className="space-y-2 text-brand-slate font-body">
              <p>Method: {info.name}</p>
              <p>Class: {selectedClass?.name}</p>
              <p>Material: {selectedMaterial?.title}</p>
            </div>
          </div>

          <div className="flex space-x-4 justify-center">
            <button
              onClick={handleFinish}
              className="btn-primary"
            >
              Start Another Session
            </button>
            <button
              onClick={onBack}
              className="btn-secondary"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <button
        onClick={onBack}
        className="mb-6 flex items-center text-brand-slate hover:text-brand-navy transition-colors font-body"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Dashboard
      </button>

      <div className="card p-8 mb-6">
        <div className="flex items-center space-x-4 mb-6">
          <div className="text-5xl">{info.icon}</div>
          <div>
            <h1 className="text-3xl font-header font-bold text-brand-navy">
              {info.name}
            </h1>
            <p className="text-brand-slate font-body">
              {info.description}
            </p>
          </div>
        </div>

        <div className="p-4 bg-brand-sage/10 rounded-lg mb-6">
          <div className="flex items-center space-x-2 text-brand-navy font-body">
            <BookOpen className="w-5 h-5 text-brand-green" />
            <span className="font-medium">Estimated Duration:</span>
            <span>{info.estimatedDuration}</span>
          </div>
        </div>

        {classes.length === 0 ? (
          <div className="p-8 text-center border-2 border-dashed border-brand-sage/30 rounded-lg">
            <AlertCircle className="w-12 h-12 text-brand-slate/50 mx-auto mb-4" />
            <h3 className="text-lg font-header font-semibold text-brand-navy mb-2">
              No Classes Yet
            </h3>
            <p className="text-brand-slate font-body">
              Create a class and add study materials to get started
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-brand-navy mb-2 font-body">
                Select Class
              </label>
              <select
                value={selectedClassId}
                onChange={(e) => {
                  setSelectedClassId(e.target.value);
                  setSelectedMaterialId('');
                }}
                className="w-full px-4 py-3 border border-brand-sage/50 rounded-lg focus:ring-2 focus:ring-brand-green focus:border-transparent font-body"
              >
                <option value="">Choose a class...</option>
                {classes.map((cls) => (
                  <option key={cls.id} value={cls.id}>
                    {cls.name}
                  </option>
                ))}
              </select>
            </div>

            {selectedClassId && (
              <div>
                <label className="block text-sm font-medium text-brand-navy mb-2 font-body">
                  Select Study Material
                </label>
                {classMaterials.length === 0 ? (
                  <div className="p-4 border-2 border-dashed border-brand-sage/30 rounded-lg text-center">
                    <BookOpen className="w-8 h-8 text-brand-slate/50 mx-auto mb-2" />
                    <p className="text-brand-slate font-body">
                      No materials found for this class
                    </p>
                  </div>
                ) : (
                  <select
                    value={selectedMaterialId}
                    onChange={(e) => setSelectedMaterialId(e.target.value)}
                    className="w-full px-4 py-3 border border-brand-sage/50 rounded-lg focus:ring-2 focus:ring-brand-green focus:border-transparent font-body"
                  >
                    <option value="">Choose material...</option>
                    {classMaterials.map((material) => (
                      <option key={material.id} value={material.id}>
                        {material.title} ({material.type})
                      </option>
                    ))}
                  </select>
                )}
              </div>
            )}

            {selectedMaterial && (
              <div className="p-4 bg-brand-light/50 rounded-lg">
                <h3 className="font-medium text-brand-navy mb-2 font-body">
                  Selected Material:
                </h3>
                <h4 className="font-medium text-brand-slate font-body mb-2">
                  {selectedMaterial.title}
                </h4>
                <p className="text-sm text-brand-slate/70 font-body mb-3">
                  {selectedMaterial.content.substring(0, 200)}...
                </p>
                <div className="flex items-center space-x-4 text-xs text-brand-slate/70 font-body">
                  <span>Type: {selectedMaterial.type}</span>
                  <span>Difficulty: {selectedMaterial.difficulty}</span>
                </div>
              </div>
            )}

            <button
              onClick={handleStartMethod}
              disabled={!selectedClassId || !selectedMaterialId}
              className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Start {info.name}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudyMethodLauncher;
