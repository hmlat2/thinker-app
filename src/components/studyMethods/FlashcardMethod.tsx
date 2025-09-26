import React, { useState, useEffect } from 'react';
import { RotateCcw, CheckCircle, XCircle, ArrowRight, ArrowLeft, Shuffle } from 'lucide-react';
import { StudyMaterial, Flashcard } from '../../types';
import { calculateNextReviewDate } from '../../utils/studyMethods';

interface FlashcardMethodProps {
  material: StudyMaterial;
  onComplete: (score: number) => void;
  onBack: () => void;
}

const FlashcardMethod: React.FC<FlashcardMethodProps> = ({ material, onComplete, onBack }) => {
  const [cards, setCards] = useState<Flashcard[]>([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [sessionScore, setSessionScore] = useState(0);
  const [completedCards, setCompletedCards] = useState(0);
  const [isShuffled, setIsShuffled] = useState(false);

  // Generate flashcards from material content
  useEffect(() => {
    const generatedCards = generateFlashcards(material);
    setCards(generatedCards);
  }, [material]);

  const generateFlashcards = (material: StudyMaterial): Flashcard[] => {
    // Simple algorithm to extract key concepts and create flashcards
    const sentences = material.content.split(/[.!?]+/).filter(s => s.trim().length > 10);
    const cards: Flashcard[] = [];

    // Create concept-based flashcards
    const concepts = extractConcepts(material.content);
    concepts.forEach((concept, index) => {
      cards.push({
        id: `card-${index}`,
        materialId: material.id,
        front: concept.question,
        back: concept.answer,
        difficulty: 'medium',
        reviewCount: 0,
        correctCount: 0,
        easeFactor: 2.5,
        interval: 1
      });
    });

    return cards;
  };

  const extractConcepts = (content: string) => {
    // Simple concept extraction - in a real app, this would use AI
    const concepts = [
      {
        question: "What is the main topic of this material?",
        answer: content.substring(0, 200) + "..."
      },
      {
        question: "What are the key points discussed?",
        answer: "The material covers several important concepts including definitions, examples, and applications."
      },
      {
        question: "How can this information be applied?",
        answer: "This knowledge can be applied in practical situations to solve problems and make informed decisions."
      }
    ];
    return concepts;
  };

  const handleAnswer = (performance: 'again' | 'hard' | 'good' | 'easy') => {
    if (cards.length === 0) return;

    const currentCard = cards[currentCardIndex];
    const newCards = [...cards];
    const cardIndex = newCards.findIndex(card => card.id === currentCard.id);
    
    // Update card statistics
    newCards[cardIndex] = {
      ...currentCard,
      reviewCount: currentCard.reviewCount + 1,
      correctCount: performance !== 'again' ? currentCard.correctCount + 1 : currentCard.correctCount,
      lastReviewed: new Date(),
      nextReview: calculateNextReviewDate(
        new Date(),
        currentCard.interval,
        currentCard.easeFactor,
        performance
      ),
      interval: performance === 'again' ? 1 : Math.max(1, Math.round(currentCard.interval * currentCard.easeFactor)),
      easeFactor: performance === 'again' ? Math.max(1.3, currentCard.easeFactor - 0.2) : 
                  performance === 'hard' ? Math.max(1.3, currentCard.easeFactor - 0.15) :
                  performance === 'easy' ? currentCard.easeFactor + 0.15 : currentCard.easeFactor
    };

    setCards(newCards);
    setCompletedCards(completedCards + 1);
    
    // Update session score
    const scorePoints = performance === 'again' ? 0 : performance === 'hard' ? 1 : performance === 'good' ? 2 : 3;
    setSessionScore(sessionScore + scorePoints);

    // Move to next card or finish
    if (currentCardIndex < cards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
      setShowAnswer(false);
    } else {
      // Session complete
      const finalScore = Math.round((sessionScore / (cards.length * 3)) * 100);
      onComplete(finalScore);
    }
  };

  const shuffleCards = () => {
    const shuffled = [...cards].sort(() => Math.random() - 0.5);
    setCards(shuffled);
    setCurrentCardIndex(0);
    setIsShuffled(true);
  };

  const resetSession = () => {
    setCurrentCardIndex(0);
    setShowAnswer(false);
    setSessionScore(0);
    setCompletedCards(0);
  };

  if (cards.length === 0) {
    return (
      <div className="max-w-2xl mx-auto p-6 text-center">
        <div className="card p-8">
          <h2 className="text-2xl font-header font-bold text-brand-navy mb-4">
            Generating Flashcards...
          </h2>
          <p className="text-brand-slate font-body">
            Creating flashcards from your study material
          </p>
        </div>
      </div>
    );
  }

  const currentCard = cards[currentCardIndex];
  const progress = ((currentCardIndex + 1) / cards.length) * 100;

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-header font-bold text-brand-navy mb-2">
          Flashcard Study Session
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
          <span>Card {currentCardIndex + 1} of {cards.length}</span>
          <span>Score: {sessionScore} points</span>
        </div>

        {/* Controls */}
        <div className="flex justify-center space-x-4 mt-4">
          <button
            onClick={shuffleCards}
            className="btn-secondary flex items-center"
          >
            <Shuffle className="w-4 h-4 mr-2" />
            Shuffle
          </button>
          <button
            onClick={resetSession}
            className="btn-secondary flex items-center"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset
          </button>
        </div>
      </div>

      {/* Flashcard */}
      <div className="card p-8 mb-6">
        <div className="min-h-[300px] flex flex-col justify-center">
          {!showAnswer ? (
            <div className="text-center">
              <h2 className="text-2xl font-header font-bold text-brand-navy mb-6">
                {currentCard.front}
              </h2>
              <button
                onClick={() => setShowAnswer(true)}
                className="btn-primary text-lg px-8 py-4"
              >
                Show Answer
              </button>
            </div>
          ) : (
            <div className="text-center">
              <h2 className="text-2xl font-header font-bold text-brand-navy mb-6">
                {currentCard.back}
              </h2>
              <p className="text-brand-slate font-body mb-8">
                How well did you know this?
              </p>
              
              {/* Answer Buttons */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <button
                  onClick={() => handleAnswer('again')}
                  className="p-4 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors font-body font-medium"
                >
                  <XCircle className="w-6 h-6 mx-auto mb-2" />
                  Again
                  <div className="text-xs mt-1">0 points</div>
                </button>
                
                <button
                  onClick={() => handleAnswer('hard')}
                  className="p-4 bg-orange-100 text-orange-700 rounded-lg hover:bg-orange-200 transition-colors font-body font-medium"
                >
                  <XCircle className="w-6 h-6 mx-auto mb-2" />
                  Hard
                  <div className="text-xs mt-1">1 point</div>
                </button>
                
                <button
                  onClick={() => handleAnswer('good')}
                  className="p-4 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors font-body font-medium"
                >
                  <CheckCircle className="w-6 h-6 mx-auto mb-2" />
                  Good
                  <div className="text-xs mt-1">2 points</div>
                </button>
                
                <button
                  onClick={() => handleAnswer('easy')}
                  className="p-4 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors font-body font-medium"
                >
                  <CheckCircle className="w-6 h-6 mx-auto mb-2" />
                  Easy
                  <div className="text-xs mt-1">3 points</div>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Session Stats */}
      <div className="grid grid-cols-3 gap-4 text-center">
        <div className="card p-4">
          <div className="text-2xl font-header font-bold text-brand-green">
            {completedCards}
          </div>
          <div className="text-sm text-brand-slate font-body">Completed</div>
        </div>
        
        <div className="card p-4">
          <div className="text-2xl font-header font-bold text-brand-navy">
            {cards.length - currentCardIndex - 1}
          </div>
          <div className="text-sm text-brand-slate font-body">Remaining</div>
        </div>
        
        <div className="card p-4">
          <div className="text-2xl font-header font-bold text-brand-slate">
            {Math.round((sessionScore / (cards.length * 3)) * 100)}%
          </div>
          <div className="text-sm text-brand-slate font-body">Accuracy</div>
        </div>
      </div>
    </div>
  );
};

export default FlashcardMethod;
