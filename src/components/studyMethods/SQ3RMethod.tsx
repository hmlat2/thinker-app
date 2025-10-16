import React, { useState } from 'react';
import { CheckCircle, ArrowRight, ArrowLeft, BookOpen, HelpCircle, Eye, MessageSquare, RotateCcw, FileText, Lightbulb } from 'lucide-react';
import { StudyMaterial } from '../../types';

interface SQ3RMethodProps {
  material: StudyMaterial;
  onComplete: (score: number) => void;
  onBack: () => void;
}

type SQ3RStepType = 'survey' | 'question' | 'read' | 'recite' | 'review';

interface SQ3RStepData {
  step: SQ3RStepType;
  title: string;
  description: string;
  completed: boolean;
  content: string;
  notes: string;
}

const SQ3RMethod: React.FC<SQ3RMethodProps> = ({ material, onComplete, onBack }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [steps, setSteps] = useState<SQ3RStepData[]>([
    {
      step: 'survey',
      title: 'Survey',
      description: 'Quickly scan the material to get an overview',
      completed: false,
      content: '',
      notes: ''
    },
    {
      step: 'question',
      title: 'Question',
      description: 'Generate questions based on headings and key points',
      completed: false,
      content: '',
      notes: ''
    },
    {
      step: 'read',
      title: 'Read',
      description: 'Read actively, looking for answers to your questions',
      completed: false,
      content: '',
      notes: ''
    },
    {
      step: 'recite',
      title: 'Recite',
      description: 'Explain what you learned in your own words',
      completed: false,
      content: '',
      notes: ''
    },
    {
      step: 'review',
      title: 'Review',
      description: 'Go back and review key points and your notes',
      completed: false,
      content: '',
      notes: ''
    }
  ]);

  const stepIcons = {
    survey: <Eye className="w-6 h-6" />,
    question: <HelpCircle className="w-6 h-6" />,
    read: <BookOpen className="w-6 h-6" />,
    recite: <MessageSquare className="w-6 h-6" />,
    review: <RotateCcw className="w-6 h-6" />
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
      // Calculate score based on completion
      const completedSteps = steps.filter(step => step.completed).length;
      const score = Math.round((completedSteps / steps.length) * 100);
      onComplete(score);
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
          SQ3R Study Method
        </h1>
        <p className="text-brand-slate font-body">
          {material.title}
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
          {currentStepData.step === 'survey' && (
            <div>
              <h3 className="text-lg font-header font-semibold text-brand-navy mb-3">
                Quick Survey Instructions:
              </h3>
              <ul className="list-disc list-inside space-y-2 text-brand-slate font-body">
                <li>Read the title and headings</li>
                <li>Look at any pictures, charts, or diagrams</li>
                <li>Read the first and last paragraphs</li>
                <li>Scan for bold or italicized text</li>
                <li>Get a general sense of what the material covers</li>
              </ul>
              <div className="mt-4 p-4 bg-brand-sage/10 rounded-lg">
                <h4 className="font-medium text-brand-navy mb-2 font-body">Material Preview:</h4>
                <p className="text-brand-slate font-body">{material.content.substring(0, 500)}...</p>
              </div>
            </div>
          )}

          {currentStepData.step === 'question' && (
            <div>
              <h3 className="text-lg font-header font-semibold text-brand-navy mb-3">
                Generate Questions:
              </h3>
              <p className="text-brand-slate font-body mb-4">
                Turn headings and key points into questions. This helps you read with purpose.
              </p>
              <div className="space-y-3">
                <div className="p-4 bg-brand-light/50 rounded-lg">
                  <h4 className="font-medium text-brand-navy mb-2 font-body">Example Questions:</h4>
                  <ul className="list-disc list-inside space-y-1 text-brand-slate font-body">
                    <li>What is the main concept being discussed?</li>
                    <li>How does this relate to what I already know?</li>
                    <li>What are the key points or arguments?</li>
                    <li>What examples or evidence are provided?</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {currentStepData.step === 'read' && (
            <div>
              <h3 className="text-lg font-header font-semibold text-brand-navy mb-3">
                Active Reading:
              </h3>
              <p className="text-brand-slate font-body mb-4">
                Read the material carefully, looking for answers to your questions.
              </p>
              <div className="p-4 bg-brand-sage/10 rounded-lg">
                <h4 className="font-medium text-brand-navy mb-2 font-body">Full Material:</h4>
                <div className="prose max-w-none text-brand-slate font-body">
                  {material.content}
                </div>
              </div>
            </div>
          )}

          {currentStepData.step === 'recite' && (
            <div>
              <h3 className="text-lg font-header font-semibold text-brand-navy mb-3">
                Recite What You Learned:
              </h3>
              <p className="text-brand-slate font-body mb-4">
                Explain the key concepts in your own words without looking at the material.
              </p>
            </div>
          )}

          {currentStepData.step === 'review' && (
            <div>
              <h3 className="text-lg font-header font-semibold text-brand-navy mb-3">
                Review and Consolidate:
              </h3>
              <p className="text-brand-slate font-body mb-4">
                Go back through your notes and the material to reinforce your understanding.
              </p>
            </div>
          )}

          {/* Notes Section */}
          <div>
            <label className="block text-sm font-medium text-brand-navy mb-2 font-body">
              Your Notes for this Step:
            </label>
            <textarea
              value={currentStepData.notes}
              onChange={(e) => {
                const newSteps = [...steps];
                newSteps[currentStep].notes = e.target.value;
                setSteps(newSteps);
              }}
              className="w-full h-32 p-3 border border-brand-sage/50 rounded-lg focus:ring-2 focus:ring-brand-green focus:border-transparent resize-none font-body"
              placeholder={`Write your ${currentStepData.step} notes here...`}
            />
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

export default SQ3RMethod;
