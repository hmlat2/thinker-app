import React, { useState } from 'react';
import { CheckCircle, ArrowRight, ArrowLeft, Lightbulb, Target, BookOpen, MessageSquare } from 'lucide-react';
import { StudyMaterial } from '../../types';

interface FeynmanMethodProps {
  material: StudyMaterial;
  onComplete: (score: number) => void;
  onBack: () => void;
}

type FeynmanStepType = 'concept' | 'explain' | 'identify-gaps' | 'simplify';

interface FeynmanStepData {
  step: FeynmanStepType;
  title: string;
  description: string;
  completed: boolean;
  content: string;
  notes: string;
}

const FeynmanMethod: React.FC<FeynmanMethodProps> = ({ material, onComplete, onBack }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [steps, setSteps] = useState<FeynmanStepData[]>([
    {
      step: 'concept',
      title: 'Choose a Concept',
      description: 'Select the concept you want to understand deeply',
      completed: false,
      content: '',
      notes: ''
    },
    {
      step: 'explain',
      title: 'Explain Simply',
      description: 'Explain the concept as if teaching a child',
      completed: false,
      content: '',
      notes: ''
    },
    {
      step: 'identify-gaps',
      title: 'Identify Gaps',
      description: 'Find areas where your explanation breaks down',
      completed: false,
      content: '',
      notes: ''
    },
    {
      step: 'simplify',
      title: 'Simplify & Use Analogies',
      description: 'Create simple analogies and explanations',
      completed: false,
      content: '',
      notes: ''
    }
  ]);

  const stepIcons = {
    concept: <Target className="w-6 h-6" />,
    explain: <MessageSquare className="w-6 h-6" />,
    'identify-gaps': <Lightbulb className="w-6 h-6" />,
    simplify: <BookOpen className="w-6 h-6" />
  };

  const handleStepComplete = (stepIndex: number, notes: string) => {
    const newSteps = [...steps];
    newSteps[stepIndex] = {
      ...newSteps[stepIndex],
      completed: true,
      notes
    };
    setSteps(newSteps);
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Calculate score based on completion and quality
      const completedSteps = steps.filter(step => step.completed).length;
      const hasDetailedNotes = steps.every(step => step.notes && step.notes.length > 20);
      const score = Math.round((completedSteps / steps.length) * 100) + (hasDetailedNotes ? 10 : 0);
      onComplete(Math.min(100, score));
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const currentStepData = steps[currentStep];

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-header font-bold text-brand-navy mb-2">
          Feynman Technique
        </h1>
        <p className="text-brand-slate font-body mb-4">
          Learn by teaching - explain concepts in simple terms
        </p>
        <div className="mt-4 flex justify-center space-x-2">
          {steps.map((step, index) => (
            <div
              key={index}
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step.completed
                  ? 'bg-brand-green text-white'
                  : index === currentStep
                  ? 'bg-brand-sage text-brand-navy'
                  : 'bg-brand-sage/20 text-brand-slate'
              }`}
            >
              {step.completed ? <CheckCircle className="w-4 h-4" /> : index + 1}
            </div>
          ))}
        </div>
      </div>

      {/* Current Step */}
      <div className="card p-8 mb-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="text-brand-green">
            {stepIcons[currentStepData.step]}
          </div>
          <div>
            <h2 className="text-2xl font-header font-bold text-brand-navy">
              {currentStepData.title}
            </h2>
            <p className="text-brand-slate font-body">
              {currentStepData.description}
            </p>
          </div>
        </div>

        {/* Step Content */}
        <div className="space-y-6">
          {currentStepData.step === 'concept' && (
            <div>
              <h3 className="text-lg font-header font-semibold text-brand-navy mb-3">
                Select a Concept to Master:
              </h3>
              <div className="p-4 bg-brand-sage/10 rounded-lg mb-4">
                <h4 className="font-medium text-brand-navy mb-2 font-body">Study Material:</h4>
                <p className="text-brand-slate font-body">{material.title}</p>
                <p className="text-sm text-brand-slate/70 font-body mt-2">
                  {material.content.substring(0, 300)}...
                </p>
              </div>
              <div className="p-4 bg-brand-light/50 rounded-lg">
                <h4 className="font-medium text-brand-navy mb-2 font-body">Instructions:</h4>
                <ul className="list-disc list-inside space-y-1 text-brand-slate font-body">
                  <li>Choose one specific concept from the material</li>
                  <li>It should be something you want to understand deeply</li>
                  <li>Write it down clearly in your notes</li>
                </ul>
              </div>
            </div>
          )}

          {currentStepData.step === 'explain' && (
            <div>
              <h3 className="text-lg font-header font-semibold text-brand-navy mb-3">
                Explain Like You're Teaching a Child:
              </h3>
              <div className="p-4 bg-brand-sage/10 rounded-lg mb-4">
                <h4 className="font-medium text-brand-navy mb-2 font-body">Tips for Simple Explanation:</h4>
                <ul className="list-disc list-inside space-y-1 text-brand-slate font-body">
                  <li>Use simple, everyday language</li>
                  <li>Avoid jargon and technical terms</li>
                  <li>Imagine explaining to a 12-year-old</li>
                  <li>Use analogies and examples</li>
                  <li>Focus on the "why" and "how"</li>
                </ul>
              </div>
              <div className="p-4 bg-brand-light/50 rounded-lg">
                <h4 className="font-medium text-brand-navy mb-2 font-body">Example:</h4>
                <p className="text-brand-slate font-body italic">
                  "Photosynthesis is like a factory where plants take sunlight, water, and air, 
                  and turn them into food and oxygen. It's like how a chef takes ingredients 
                  and makes a meal, but the plant uses sunlight as its 'cooking energy'."
                </p>
              </div>
            </div>
          )}

          {currentStepData.step === 'identify-gaps' && (
            <div>
              <h3 className="text-lg font-header font-semibold text-brand-navy mb-3">
                Identify Knowledge Gaps:
              </h3>
              <div className="p-4 bg-brand-sage/10 rounded-lg mb-4">
                <h4 className="font-medium text-brand-navy mb-2 font-body">Questions to Ask Yourself:</h4>
                <ul className="list-disc list-inside space-y-1 text-brand-slate font-body">
                  <li>Where did I get stuck in my explanation?</li>
                  <li>What parts felt unclear or confusing?</li>
                  <li>What questions would a child ask that I can't answer?</li>
                  <li>Where did I use jargon instead of simple terms?</li>
                  <li>What connections am I missing?</li>
                </ul>
              </div>
              <div className="p-4 bg-brand-light/50 rounded-lg">
                <h4 className="font-medium text-brand-navy mb-2 font-body">Common Gap Areas:</h4>
                <ul className="list-disc list-inside space-y-1 text-brand-slate font-body">
                  <li>Fundamental definitions</li>
                  <li>Cause and effect relationships</li>
                  <li>Step-by-step processes</li>
                  <li>Real-world applications</li>
                  <li>Connections to other concepts</li>
                </ul>
              </div>
            </div>
          )}

          {currentStepData.step === 'simplify' && (
            <div>
              <h3 className="text-lg font-header font-semibold text-brand-navy mb-3">
                Create Simple Analogies and Explanations:
              </h3>
              <div className="p-4 bg-brand-sage/10 rounded-lg mb-4">
                <h4 className="font-medium text-brand-navy mb-2 font-body">Analogies to Try:</h4>
                <ul className="list-disc list-inside space-y-1 text-brand-slate font-body">
                  <li>Compare to everyday objects or activities</li>
                  <li>Use cooking, sports, or building metaphors</li>
                  <li>Think of it like a story with characters</li>
                  <li>Relate to something you already understand well</li>
                </ul>
              </div>
              <div className="p-4 bg-brand-light/50 rounded-lg">
                <h4 className="font-medium text-brand-navy mb-2 font-body">Example Analogies:</h4>
                <div className="space-y-2 text-brand-slate font-body">
                  <p><strong>DNA:</strong> "Like a recipe book that tells your body how to make you"</p>
                  <p><strong>Gravity:</strong> "Like an invisible rubber band pulling things toward Earth"</p>
                  <p><strong>Photosynthesis:</strong> "Like a solar-powered food factory in plants"</p>
                </div>
              </div>
            </div>
          )}

          {/* Notes Section */}
          <div>
            <label className="block text-sm font-medium text-brand-navy mb-2 font-body">
              Your {currentStepData.title} Notes:
            </label>
            <textarea
              value={currentStepData.notes}
              onChange={(e) => {
                const newSteps = [...steps];
                newSteps[currentStep].notes = e.target.value;
                setSteps(newSteps);
              }}
              className="w-full h-40 p-3 border border-brand-sage/50 rounded-lg focus:ring-2 focus:ring-brand-green focus:border-transparent resize-none font-body"
              placeholder={`Write your ${currentStepData.step} notes here...`}
            />
            <p className="text-xs text-brand-slate/70 mt-1 font-body">
              Be detailed and specific. The more you write, the better you'll understand.
            </p>
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
          onClick={() => handleStepComplete(currentStep, currentStepData.notes)}
          className="btn-secondary flex items-center"
        >
          <CheckCircle className="w-4 h-4 mr-2" />
          Complete Step
        </button>

        <button
          onClick={handleNext}
          className="btn-primary flex items-center"
        >
          {currentStep === steps.length - 1 ? 'Finish' : 'Next'}
          <ArrowRight className="w-4 h-4 ml-2" />
        </button>
      </div>
    </div>
  );
};

export default FeynmanMethod;
