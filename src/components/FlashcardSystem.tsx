import React, { useState, useEffect } from 'react';
import { 
  Target, 
  Plus, 
  Play, 
  RotateCcw, 
  CheckCircle, 
  XCircle, 
  Brain,
  Clock,
  TrendingUp,
  BookOpen
} from 'lucide-react';
import { useClasses } from '../hooks/useClasses';

interface Flashcard {
  id: string;
  front: string;
  back: string;
  difficulty: 'easy' | 'medium' | 'hard';
  nextReview: Date;
  reviewCount: number;
  successRate: number;
}

interface FlashcardSet {
  id: string;
  title: string;
  classId: string;
  cards: Flashcard[];
  createdAt: Date;
}

const FlashcardSystem: React.FC = () => {
  const { classes } = useClasses();
  const [flashcardSets, setFlashcardSets] = useState<FlashcardSet[]>([]);
  const [currentSet, setCurrentSet] = useState<FlashcardSet | null>(null);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [studyMode, setStudyMode] = useState<'create' | 'study' | 'review'>('create');
  const [newSet, setNewSet] = useState({
    title: '',
    classId: '',
    cards: [{ front: '', back: '' }]
  });

  // Mock data for demonstration
  useEffect(() => {
    const mockSets: FlashcardSet[] = [
      {
        id: '1',
        title: 'Biology - Cell Structure',
        classId: classes[0]?.id || '',
        createdAt: new Date(),
        cards: [
          {
            id: '1',
            front: 'What is the powerhouse of the cell?',
            back: 'Mitochondria - responsible for producing ATP through cellular respiration',
            difficulty: 'easy',
            nextReview: new Date(),
            reviewCount: 3,
            successRate: 0.8
          },
          {
            id: '2',
            front: 'What is the function of ribosomes?',
            back: 'Ribosomes are responsible for protein synthesis by translating mRNA into proteins',
            difficulty: 'medium',
            nextReview: new Date(),
            reviewCount: 2,
            successRate: 0.6
          },
          {
            id: '3',
            front: 'Describe the structure and function of the endoplasmic reticulum',
            back: 'The ER is a network of membranes. Rough ER (with ribosomes) synthesizes proteins, while smooth ER synthesizes lipids and detoxifies substances',
            difficulty: 'hard',
            nextReview: new Date(),
            reviewCount: 1,
            successRate: 0.4
          }
        ]
      }
    ];
    setFlashcardSets(mockSets);
  }, [classes]);

  const addCard = () => {
    setNewSet({
      ...newSet,
      cards: [...newSet.cards, { front: '', back: '' }]
    });
  };

  const updateCard = (index: number, field: 'front' | 'back', value: string) => {
    const updatedCards = [...newSet.cards];
    updatedCards[index][field] = value;
    setNewSet({ ...newSet, cards: updatedCards });
  };

  const removeCard = (index: number) => {
    if (newSet.cards.length > 1) {
      const updatedCards = newSet.cards.filter((_, i) => i !== index);
      setNewSet({ ...newSet, cards: updatedCards });
    }
  };

  const createFlashcardSet = () => {
    if (!newSet.title || !newSet.classId || newSet.cards.some(card => !card.front || !card.back)) {
      alert('Please fill in all fields');
      return;
    }

    const flashcardSet: FlashcardSet = {
      id: Date.now().toString(),
      title: newSet.title,
      classId: newSet.classId,
      createdAt: new Date(),
      cards: newSet.cards.map((card, index) => ({
        id: `${Date.now()}-${index}`,
        front: card.front,
        back: card.back,
        difficulty: 'medium' as const,
        nextReview: new Date(),
        reviewCount: 0,
        successRate: 0
      }))
    };

    setFlashcardSets([flashcardSet, ...flashcardSets]);
    setNewSet({ title: '', classId: '', cards: [{ front: '', back: '' }] });
    setStudyMode('study');
  };

  const startStudySession = (set: FlashcardSet) => {
    setCurrentSet(set);
    setCurrentCardIndex(0);
    setShowAnswer(false);
    setStudyMode('review');
  };

  const handleCardResponse = (correct: boolean) => {
    if (!currentSet) return;

    // Update card statistics (mock implementation)
    const updatedSet = { ...currentSet };
    const card = updatedSet.cards[currentCardIndex];
    card.reviewCount += 1;
    card.successRate = correct 
      ? (card.successRate * (card.reviewCount - 1) + 1) / card.reviewCount
      : (card.successRate * (card.reviewCount - 1)) / card.reviewCount;

    // Move to next card or end session
    if (currentCardIndex < currentSet.cards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
      setShowAnswer(false);
    } else {
      // End of session
      setStudyMode('study');
      setCurrentSet(null);
      alert('Study session complete! Great job!');
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'hard': return 'text-red-600 bg-red-100';
      default: return 'text-brand-slate bg-brand-sage/20';
    }
  };

  if (studyMode === 'review' && currentSet) {
    const currentCard = currentSet.cards[currentCardIndex];
    
    return (
      <div className="max-w-2xl mx-auto space-y-8">
        {/* Study Header */}
        <div className="text-center">
          <h1 className="text-2xl font-header font-bold text-brand-navy mb-2">
            {currentSet.title}
          </h1>
          <p className="text-brand-slate font-body">
            Card {currentCardIndex + 1} of {currentSet.cards.length}
          </p>
          <div className="w-full bg-brand-sage/30 rounded-full h-2 mt-4">
            <div 
              className="bg-brand-green h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentCardIndex + 1) / currentSet.cards.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Flashcard */}
        <div className="card p-8 min-h-[300px] flex flex-col justify-center">
          <div className="text-center space-y-6">
            <div className={`inline-block px-3 py-1 rounded-full text-sm font-body ${getDifficultyColor(currentCard.difficulty)}`}>
              {currentCard.difficulty}
            </div>
            
            <div className="space-y-4">
              <h3 className="text-xl font-header font-semibold text-brand-navy">
                {showAnswer ? 'Answer:' : 'Question:'}
              </h3>
              <p className="text-lg text-brand-slate font-body leading-relaxed">
                {showAnswer ? currentCard.back : currentCard.front}
              </p>
            </div>

            {!showAnswer ? (
              <button
                onClick={() => setShowAnswer(true)}
                className="btn-primary"
              >
                <RotateCcw className="w-5 h-5 mr-2" />
                Show Answer
              </button>
            ) : (
              <div className="flex justify-center space-x-4">
                <button
                  onClick={() => handleCardResponse(false)}
                  className="flex items-center px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-body"
                >
                  <XCircle className="w-5 h-5 mr-2" />
                  Incorrect
                </button>
                <button
                  onClick={() => handleCardResponse(true)}
                  className="flex items-center px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-body"
                >
                  <CheckCircle className="w-5 h-5 mr-2" />
                  Correct
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Study Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="card p-4 text-center">
            <div className="text-2xl font-header font-bold text-brand-navy">
              {currentCard.reviewCount}
            </div>
            <p className="text-brand-slate text-sm font-body">Reviews</p>
          </div>
          <div className="card p-4 text-center">
            <div className="text-2xl font-header font-bold text-brand-navy">
              {Math.round(currentCard.successRate * 100)}%
            </div>
            <p className="text-brand-slate text-sm font-body">Success Rate</p>
          </div>
          <div className="card p-4 text-center">
            <div className="text-2xl font-header font-bold text-brand-navy">
              {currentSet.cards.length - currentCardIndex - 1}
            </div>
            <p className="text-brand-slate text-sm font-body">Remaining</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-header font-bold text-brand-navy mb-2">Flashcards</h1>
          <p className="text-brand-slate font-body">
            Master concepts through spaced repetition and active recall
          </p>
        </div>
        <div className="flex space-x-3 mt-4 sm:mt-0">
          <button
            onClick={() => setStudyMode('create')}
            className={`px-4 py-2 rounded-lg font-body transition-colors ${
              studyMode === 'create'
                ? 'bg-brand-green text-white'
                : 'bg-brand-sage/20 text-brand-slate hover:bg-brand-sage/30'
            }`}
          >
            Create Set
          </button>
          <button
            onClick={() => setStudyMode('study')}
            className={`px-4 py-2 rounded-lg font-body transition-colors ${
              studyMode === 'study'
                ? 'bg-brand-green text-white'
                : 'bg-brand-sage/20 text-brand-slate hover:bg-brand-sage/30'
            }`}
          >
            Study Sets
          </button>
        </div>
      </div>

      {studyMode === 'create' ? (
        /* Create Flashcard Set */
        <div className="card p-8">
          <h2 className="text-xl font-header font-bold text-brand-navy mb-6">Create New Flashcard Set</h2>
          
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-brand-navy mb-2 font-body">
                  Set Title *
                </label>
                <input
                  type="text"
                  value={newSet.title}
                  onChange={(e) => setNewSet({ ...newSet, title: e.target.value })}
                  className="w-full px-4 py-3 border border-brand-sage/50 rounded-lg focus:ring-2 focus:ring-brand-green focus:border-transparent font-body"
                  placeholder="e.g., Biology - Cell Structure"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-brand-navy mb-2 font-body">
                  Class *
                </label>
                <select
                  value={newSet.classId}
                  onChange={(e) => setNewSet({ ...newSet, classId: e.target.value })}
                  className="w-full px-4 py-3 border border-brand-sage/50 rounded-lg focus:ring-2 focus:ring-brand-green focus:border-transparent font-body"
                >
                  <option value="">Select a class</option>
                  {classes.map((cls) => (
                    <option key={cls.id} value={cls.id}>{cls.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-header font-semibold text-brand-navy">Flashcards</h3>
                <button
                  onClick={addCard}
                  className="btn-secondary"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Card
                </button>
              </div>

              <div className="space-y-4">
                {newSet.cards.map((card, index) => (
                  <div key={index} className="border border-brand-sage/30 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-sm font-medium text-brand-navy font-body">
                        Card {index + 1}
                      </span>
                      {newSet.cards.length > 1 && (
                        <button
                          onClick={() => removeCard(index)}
                          className="text-red-500 hover:text-red-700 text-sm font-body"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-brand-navy mb-2 font-body">
                          Front (Question)
                        </label>
                        <textarea
                          value={card.front}
                          onChange={(e) => updateCard(index, 'front', e.target.value)}
                          className="w-full px-3 py-2 border border-brand-sage/50 rounded-lg focus:ring-2 focus:ring-brand-green focus:border-transparent font-body"
                          rows={3}
                          placeholder="Enter the question or term"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-brand-navy mb-2 font-body">
                          Back (Answer)
                        </label>
                        <textarea
                          value={card.back}
                          onChange={(e) => updateCard(index, 'back', e.target.value)}
                          className="w-full px-3 py-2 border border-brand-sage/50 rounded-lg focus:ring-2 focus:ring-brand-green focus:border-transparent font-body"
                          rows={3}
                          placeholder="Enter the answer or definition"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={createFlashcardSet}
                className="btn-primary"
              >
                Create Flashcard Set
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Study Sets View */
        <div className="space-y-6">
          {flashcardSets.length === 0 ? (
            <div className="card p-12 text-center">
              <div className="w-16 h-16 bg-brand-sage/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="w-8 h-8 text-brand-green" />
              </div>
              <h3 className="text-xl font-header font-semibold text-brand-navy mb-2">No flashcard sets yet</h3>
              <p className="text-brand-slate font-body mb-6">
                Create your first flashcard set to start practicing with spaced repetition
              </p>
              <button
                onClick={() => setStudyMode('create')}
                className="btn-primary"
              >
                <Plus className="w-5 h-5 mr-2" />
                Create Your First Set
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {flashcardSets.map((set) => {
                const classInfo = classes.find(c => c.id === set.classId);
                const avgSuccessRate = set.cards.reduce((acc, card) => acc + card.successRate, 0) / set.cards.length;
                
                return (
                  <div key={set.id} className="card p-6 hover:shadow-lg transition-shadow">
                    <div className="flex items-start justify-between mb-4">
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center"
                        style={{ backgroundColor: `${classInfo?.color || '#729B79'}20` }}
                      >
                        <Target 
                          className="w-6 h-6" 
                          style={{ color: classInfo?.color || '#729B79' }}
                        />
                      </div>
                      <span className="text-xs text-brand-slate/60 font-body">
                        {set.cards.length} cards
                      </span>
                    </div>
                    
                    <h3 className="text-lg font-header font-semibold text-brand-navy mb-2">
                      {set.title}
                    </h3>
                    
                    <p className="text-brand-slate/70 text-sm font-body mb-4">
                      {classInfo?.name || 'Unknown Class'}
                    </p>
                    
                    <div className="flex items-center justify-between text-sm text-brand-slate/60 font-body mb-4">
                      <span>Success Rate: {Math.round(avgSuccessRate * 100)}%</span>
                      <span>Created {set.createdAt.toLocaleDateString()}</span>
                    </div>
                    
                    <button
                      onClick={() => startStudySession(set)}
                      className="w-full btn-primary"
                    >
                      <Play className="w-4 h-4 mr-2" />
                      Start Studying
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FlashcardSystem;