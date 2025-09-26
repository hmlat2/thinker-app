import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, ArrowRight, ArrowLeft, RotateCcw, Target } from 'lucide-react';
import { StudyMaterial } from '../../types';

interface QuizMethodProps {
  material: StudyMaterial;
  onComplete: (score: number) => void;
  onBack: () => void;
}

interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

const QuizMethod: React.FC<QuizMethodProps> = ({ material, onComplete, onBack }) => {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [answeredQuestions, setAnsweredQuestions] = useState<Set<number>>(new Set());

  // Generate quiz questions from material
  useEffect(() => {
    const generatedQuestions = generateQuizQuestions(material);
    setQuestions(generatedQuestions);
  }, [material]);

  const generateQuizQuestions = (material: StudyMaterial): QuizQuestion[] => {
    // Simple algorithm to generate questions - in a real app, this would use AI
    const questions: QuizQuestion[] = [
      {
        id: 'q1',
        question: 'What is the main topic of this material?',
        options: [
          material.title,
          'A general overview',
          'Multiple topics',
          'Unclear topic'
        ],
        correctAnswer: 0,
        explanation: 'The main topic is clearly stated in the title.',
        difficulty: 'easy'
      },
      {
        id: 'q2',
        question: 'What type of information is primarily presented?',
        options: [
          'Factual information',
          'Opinions and beliefs',
          'Personal experiences',
          'Fictional content'
        ],
        correctAnswer: 0,
        explanation: 'This material presents factual, educational content.',
        difficulty: 'easy'
      },
      {
        id: 'q3',
        question: 'How would you categorize the difficulty level of this material?',
        options: [
          'Beginner level',
          'Intermediate level',
          'Advanced level',
          'Expert level'
        ],
        correctAnswer: material.difficulty === 'easy' ? 0 : material.difficulty === 'medium' ? 1 : 2,
        explanation: `This material is at the ${material.difficulty} level.`,
        difficulty: 'medium'
      },
      {
        id: 'q4',
        question: 'What is the primary purpose of this material?',
        options: [
          'To inform and educate',
          'To entertain',
          'To persuade',
          'To tell a story'
        ],
        correctAnswer: 0,
        explanation: 'The material is designed to inform and educate readers.',
        difficulty: 'medium'
      },
      {
        id: 'q5',
        question: 'Which of the following best describes the content structure?',
        options: [
          'Well-organized with clear sections',
          'Stream of consciousness',
          'Random thoughts',
          'Incomplete information'
        ],
        correctAnswer: 0,
        explanation: 'The material appears to be well-structured and organized.',
        difficulty: 'hard'
      }
    ];

    return questions;
  };

  const handleAnswerSelect = (answerIndex: number) => {
    if (showResult) return;
    setSelectedAnswer(answerIndex);
  };

  const handleSubmitAnswer = () => {
    if (selectedAnswer === null) return;

    const currentQuestion = questions[currentQuestionIndex];
    const isCorrect = selectedAnswer === currentQuestion.correctAnswer;
    
    if (isCorrect) {
      setScore(score + 1);
    }

    setAnsweredQuestions(new Set([...answeredQuestions, currentQuestionIndex]));
    setShowResult(true);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      // Quiz complete
      const finalScore = Math.round((score / questions.length) * 100);
      onComplete(finalScore);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setSelectedAnswer(null);
      setShowResult(false);
    }
  };

  const resetQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setScore(0);
    setAnsweredQuestions(new Set());
  };

  if (questions.length === 0) {
    return (
      <div className="max-w-2xl mx-auto p-6 text-center">
        <div className="card p-8">
          <h2 className="text-2xl font-header font-bold text-brand-navy mb-4">
            Generating Quiz Questions...
          </h2>
          <p className="text-brand-slate font-body">
            Creating questions based on your study material
          </p>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
  const isCorrect = selectedAnswer === currentQuestion.correctAnswer;

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-header font-bold text-brand-navy mb-2">
          Practice Quiz
        </h1>
        <p className="text-brand-slate font-body mb-4">
          {material.title}
        </p>
        
        {/* Progress Bar */}
        <div className="w-full bg-brand-sage/20 rounded-full h-2 mb-4">
          <div
            className="bg-gradient-to-r from-brand-green to-brand-slate h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        
        <div className="flex justify-between text-sm text-brand-slate font-body">
          <span>Question {currentQuestionIndex + 1} of {questions.length}</span>
          <span>Score: {score}/{questions.length}</span>
        </div>

        {/* Controls */}
        <div className="flex justify-center space-x-4 mt-4">
          <button
            onClick={resetQuiz}
            className="btn-secondary flex items-center"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset Quiz
          </button>
        </div>
      </div>

      {/* Question */}
      <div className="card p-8 mb-6">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              currentQuestion.difficulty === 'easy' 
                ? 'bg-green-100 text-green-700' 
                : currentQuestion.difficulty === 'medium'
                ? 'bg-yellow-100 text-yellow-700'
                : 'bg-red-100 text-red-700'
            }`}>
              {currentQuestion.difficulty.toUpperCase()}
            </span>
            <span className="text-sm text-brand-slate font-body">
              {answeredQuestions.has(currentQuestionIndex) ? 'Answered' : 'Not answered'}
            </span>
          </div>
          
          <h2 className="text-xl font-header font-semibold text-brand-navy mb-6">
            {currentQuestion.question}
          </h2>
        </div>

        {/* Answer Options */}
        <div className="space-y-3 mb-6">
          {currentQuestion.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswerSelect(index)}
              disabled={showResult}
              className={`w-full p-4 text-left rounded-lg border-2 transition-all duration-200 font-body ${
                selectedAnswer === index
                  ? showResult
                    ? isCorrect
                      ? 'border-green-500 bg-green-50 text-green-700'
                      : 'border-red-500 bg-red-50 text-red-700'
                    : 'border-brand-green bg-brand-sage/10 text-brand-navy'
                  : showResult && index === currentQuestion.correctAnswer
                  ? 'border-green-500 bg-green-50 text-green-700'
                  : 'border-brand-sage/20 hover:border-brand-green hover:bg-brand-light/50 text-brand-slate'
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                  selectedAnswer === index
                    ? showResult
                      ? isCorrect
                        ? 'border-green-500 bg-green-500'
                        : 'border-red-500 bg-red-500'
                      : 'border-brand-green bg-brand-green'
                    : showResult && index === currentQuestion.correctAnswer
                    ? 'border-green-500 bg-green-500'
                    : 'border-brand-sage/50'
                }`}>
                  {selectedAnswer === index && (
                    <CheckCircle className="w-4 h-4 text-white" />
                  )}
                  {showResult && index === currentQuestion.correctAnswer && selectedAnswer !== index && (
                    <CheckCircle className="w-4 h-4 text-white" />
                  )}
                </div>
                <span>{option}</span>
              </div>
            </button>
          ))}
        </div>

        {/* Result */}
        {showResult && (
          <div className={`p-4 rounded-lg mb-6 ${
            isCorrect ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
          }`}>
            <div className="flex items-center space-x-2 mb-2">
              {isCorrect ? (
                <CheckCircle className="w-5 h-5 text-green-600" />
              ) : (
                <XCircle className="w-5 h-5 text-red-600" />
              )}
              <span className={`font-medium ${
                isCorrect ? 'text-green-800' : 'text-red-800'
              }`}>
                {isCorrect ? 'Correct!' : 'Incorrect'}
              </span>
            </div>
            <p className={`text-sm ${
              isCorrect ? 'text-green-700' : 'text-red-700'
            }`}>
              {currentQuestion.explanation}
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-between">
          <button
            onClick={handlePreviousQuestion}
            disabled={currentQuestionIndex === 0}
            className="btn-secondary flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Previous
          </button>

          {!showResult ? (
            <button
              onClick={handleSubmitAnswer}
              disabled={selectedAnswer === null}
              className="btn-primary flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Submit Answer
              <ArrowRight className="w-4 h-4 ml-2" />
            </button>
          ) : (
            <button
              onClick={handleNextQuestion}
              className="btn-primary flex items-center"
            >
              {currentQuestionIndex === questions.length - 1 ? 'Finish Quiz' : 'Next Question'}
              <ArrowRight className="w-4 h-4 ml-2" />
            </button>
          )}
        </div>
      </div>

      {/* Quiz Stats */}
      <div className="grid grid-cols-3 gap-4 text-center">
        <div className="card p-4">
          <div className="text-2xl font-header font-bold text-brand-green">
            {score}
          </div>
          <div className="text-sm text-brand-slate font-body">Correct</div>
        </div>
        
        <div className="card p-4">
          <div className="text-2xl font-header font-bold text-brand-slate">
            {questions.length - score}
          </div>
          <div className="text-sm text-brand-slate font-body">Incorrect</div>
        </div>
        
        <div className="card p-4">
          <div className="text-2xl font-header font-bold text-brand-navy">
            {Math.round((score / questions.length) * 100)}%
          </div>
          <div className="text-sm text-brand-slate font-body">Accuracy</div>
        </div>
      </div>
    </div>
  );
};

export default QuizMethod;
