import React, { useState, useEffect } from 'react';
import { Moon, Clock, CheckCircle, ArrowRight, ArrowLeft, Sunrise, Zap } from 'lucide-react';
import { StudyMaterial } from '../../types';

interface SleepReviewMethodProps {
  material: StudyMaterial;
  onComplete: (score: number) => void;
  onBack: () => void;
}

const SleepReviewMethod: React.FC<SleepReviewMethodProps> = ({ material, onComplete, onBack }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [sessionStartTime, setSessionStartTime] = useState<Date | null>(null);
  const [reviewNotes, setReviewNotes] = useState('');
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());

  const steps = [
    {
      title: 'Quick Overview',
      description: 'Scan the material to refresh your memory',
      duration: '3-5 minutes',
      icon: <Zap className="w-6 h-6" />,
      instructions: [
        'Read the title and main headings',
        'Look at any diagrams or charts',
        'Scan the first sentence of each paragraph',
        'Note any key terms or concepts'
      ]
    },
    {
      title: 'Key Points Recall',
      description: 'Try to remember the main points without looking',
      duration: '5-7 minutes',
      icon: <CheckCircle className="w-6 h-6" />,
      instructions: [
        'Close your eyes and try to recall main points',
        'Write down what you remember',
        'Don\'t worry if you forget some things',
        'Focus on the most important concepts'
      ]
    },
    {
      title: 'Quick Review',
      description: 'Check your recall against the material',
      duration: '5-7 minutes',
      icon: <Sunrise className="w-6 h-6" />,
      instructions: [
        'Compare your notes with the actual material',
        'Identify what you remembered correctly',
        'Note what you forgot or got wrong',
        'Don\'t try to learn new information'
      ]
    }
  ];

  useEffect(() => {
    setSessionStartTime(new Date());
  }, []);

  const handleStepComplete = (stepIndex: number) => {
    setCompletedSteps(new Set([...completedSteps, stepIndex]));
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Calculate score based on completion and time
      const completionScore = (completedSteps.size / steps.length) * 100;
      const timeScore = sessionStartTime ? 
        Math.max(0, 100 - Math.round((new Date().getTime() - sessionStartTime.getTime()) / 1000 / 60)) : 100;
      const finalScore = Math.round((completionScore + timeScore) / 2);
      onComplete(finalScore);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const currentStepData = steps[currentStep];
  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center space-x-3 mb-4">
          <Moon className="w-8 h-8 text-indigo-600" />
          <h1 className="text-3xl font-header font-bold text-brand-navy">
            Sleep Review Session
          </h1>
        </div>
        <p className="text-brand-slate font-body mb-4">
          Quick 15-20 minute review before sleep for better memory consolidation
        </p>
        <p className="text-sm text-brand-slate/70 font-body">
          {material.title}
        </p>
        
        {/* Progress Bar */}
        <div className="w-full bg-brand-sage/20 rounded-full h-2 mb-4 mt-6">
          <div
            className="bg-gradient-to-r from-indigo-500 to-purple-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        
        <div className="flex justify-center space-x-2 mt-4">
          {steps.map((_, index) => (
            <div
              key={index}
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                completedSteps.has(index)
                  ? 'bg-indigo-600 text-white'
                  : index === currentStep
                  ? 'bg-indigo-100 text-indigo-600'
                  : 'bg-brand-sage/20 text-brand-slate'
              }`}
            >
              {completedSteps.has(index) ? <CheckCircle className="w-4 h-4" /> : index + 1}
            </div>
          ))}
        </div>
      </div>

      {/* Current Step */}
      <div className="card p-8 mb-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="text-indigo-600">
            {currentStepData.icon}
          </div>
          <div>
            <h2 className="text-2xl font-header font-bold text-brand-navy">
              {currentStepData.title}
            </h2>
            <p className="text-brand-slate font-body">
              {currentStepData.description}
            </p>
            <p className="text-sm text-indigo-600 font-body font-medium">
              Duration: {currentStepData.duration}
            </p>
          </div>
        </div>

        {/* Step Instructions */}
        <div className="space-y-6">
          <div className="p-4 bg-indigo-50 rounded-lg">
            <h3 className="font-medium text-indigo-800 mb-3 font-body">Instructions:</h3>
            <ul className="list-disc list-inside space-y-2 text-indigo-700 font-body">
              {currentStepData.instructions.map((instruction, index) => (
                <li key={index}>{instruction}</li>
              ))}
            </ul>
          </div>

          {/* Material Display */}
          <div className="p-4 bg-brand-light/50 rounded-lg">
            <h4 className="font-medium text-brand-navy mb-2 font-body">Study Material:</h4>
            <div className="prose max-w-none text-brand-slate font-body">
              {material.content}
            </div>
          </div>

          {/* Notes Section */}
          <div>
            <label className="block text-sm font-medium text-brand-navy mb-2 font-body">
              Your Review Notes:
            </label>
            <textarea
              value={reviewNotes}
              onChange={(e) => setReviewNotes(e.target.value)}
              className="w-full h-32 p-3 border border-brand-sage/50 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none font-body"
              placeholder={`What did you recall? What was clear? What needs more attention?`}
            />
            <p className="text-xs text-brand-slate/70 mt-1 font-body">
              Focus on what you remember, not what you're learning for the first time.
            </p>
          </div>
        </div>
      </div>

      {/* Sleep Benefits Info */}
      <div className="card p-6 mb-6 bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200">
        <h3 className="text-lg font-header font-semibold text-indigo-800 mb-3 flex items-center">
          <Moon className="w-5 h-5 mr-2" />
          Why Sleep Review Works
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-indigo-700 font-body">
          <div>
            <h4 className="font-medium mb-2">Memory Consolidation:</h4>
            <p>Reviewing before sleep helps transfer information from short-term to long-term memory.</p>
          </div>
          <div>
            <h4 className="font-medium mb-2">Better Retention:</h4>
            <p>Sleep strengthens neural connections formed during learning.</p>
          </div>
          <div>
            <h4 className="font-medium mb-2">Optimal Timing:</h4>
            <p>15-20 minutes is the sweet spot - enough to reinforce, not enough to overstimulate.</p>
          </div>
          <div>
            <h4 className="font-medium mb-2">Reduced Interference:</h4>
            <p>No new information competes with what you're trying to remember.</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between">
        <button
          onClick={handlePrevious}
          disabled={currentStep === 0}
          className="btn-secondary flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Previous
        </button>

        <button
          onClick={() => handleStepComplete(currentStep)}
          className="btn-secondary flex items-center"
        >
          <CheckCircle className="w-4 h-4 mr-2" />
          Complete Step
        </button>

        <button
          onClick={handleNext}
          className="btn-primary flex items-center bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
        >
          {currentStep === steps.length - 1 ? 'Finish Review' : 'Next Step'}
          <ArrowRight className="w-4 h-4 ml-2" />
        </button>
      </div>

      {/* Timer */}
      {sessionStartTime && (
        <div className="text-center mt-6">
          <div className="inline-flex items-center space-x-2 text-brand-slate font-body">
            <Clock className="w-4 h-4" />
            <span>
              Session time: {Math.round((new Date().getTime() - sessionStartTime.getTime()) / 1000 / 60)} minutes
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default SleepReviewMethod;
