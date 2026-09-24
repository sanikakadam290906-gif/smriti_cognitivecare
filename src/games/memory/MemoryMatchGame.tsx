import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from '../../i18n/LanguageContext';
import { MemoryCard } from '../../types/games';
import { generateMemorySession } from './memoryEngine';
import { GameHeader } from '../../components/games/GameHeader';
import { GameResultModal } from '../../components/games/GameResultModal';
import { GameInstructionsPanel } from '../../components/games/GameInstructionsPanel';
import { CulturalIcon } from '../../components/ui/CulturalIcon';
import { dataService } from '../../services/supabase/dataService';
import { DifficultyLevel } from '../../types';

interface MemoryMatchGameProps {
  patientId: string;
  difficulty: DifficultyLevel;
}

export const MemoryMatchGame: React.FC<MemoryMatchGameProps> = ({ patientId, difficulty }) => {
  const { language, t } = useTranslation();
  const navigate = useNavigate();

  const [cards, setCards] = useState<MemoryCard[]>([]);
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [isChecking, setIsChecking] = useState<boolean>(false);
  const [attempts, setAttempts] = useState<number>(0);
  const [correctPairs, setCorrectPairs] = useState<number>(0);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [accuracy, setAccuracy] = useState<number>(100);
  const [duration, setDuration] = useState<number>(0);

  const startTimeRef = useRef<number>(Date.now());
  const totalPairs = difficulty === 'Easy' ? 3 : difficulty === 'Medium' ? 5 : 8;

  // Initialize fresh session on mount or when difficulty changes
  useEffect(() => {
    startNewSession();
  }, [difficulty, language]);

  const startNewSession = () => {
    const freshCards = generateMemorySession(difficulty, language);
    setCards(freshCards);
    setFlippedIndices([]);
    setIsChecking(false);
    setAttempts(0);
    setCorrectPairs(0);
    setIsGameOver(false);
    setAccuracy(100);
    setDuration(0);
    startTimeRef.current = Date.now();
  };

  const handleCardClick = (index: number) => {
    if (isChecking) return;
    if (cards[index].isMatched || cards[index].isFlipped) return;
    if (flippedIndices.length === 1 && flippedIndices[0] === index) return;

    // Flip card
    const updated = [...cards];
    updated[index].isFlipped = true;
    setCards(updated);

    const newFlipped = [...flippedIndices, index];
    setFlippedIndices(newFlipped);

    if (newFlipped.length === 2) {
      setIsChecking(true);
      setAttempts((prev) => prev + 1);

      const [firstIdx, secondIdx] = newFlipped;
      const firstCard = updated[firstIdx];
      const secondCard = updated[secondIdx];

      if (firstCard.itemId === secondCard.itemId) {
        // Matched!
        setTimeout(() => {
          updated[firstIdx].isMatched = true;
          updated[secondIdx].isMatched = true;
          setCards(updated);
          setFlippedIndices([]);
          setIsChecking(false);

          const newMatchedCount = correctPairs + 1;
          setCorrectPairs(newMatchedCount);

          if (newMatchedCount === totalPairs) {
            handleGameComplete(attempts + 1, totalPairs);
          }
        }, 500);
      } else {
        // No match: flip back
        setTimeout(() => {
          updated[firstIdx].isFlipped = false;
          updated[secondIdx].isFlipped = false;
          setCards(updated);
          setFlippedIndices([]);
          setIsChecking(false);
        }, 1100);
      }
    }
  };

  const handleGameComplete = (totalAttempts: number, pairsMatched: number) => {
    const elapsedSecs = Math.max(1, Math.round((Date.now() - startTimeRef.current) / 1000));
    setDuration(elapsedSecs);

    // Accuracy calculation: based on efficiency (optimal is totalPairs attempts)
    const calculatedAccuracy = Math.min(100, Math.max(30, Math.round((pairsMatched / totalAttempts) * 100)));
    setAccuracy(calculatedAccuracy);
    setIsGameOver(true);

    const avgResponse = Number((elapsedSecs / totalAttempts).toFixed(1));

    // Save session
    dataService.saveGameSession({
      patientId,
      gameType: 'memory',
      difficulty,
      startTime: new Date(startTimeRef.current).toISOString(),
      endTime: new Date().toISOString(),
      rounds: totalPairs,
      correctAnswers: pairsMatched,
      incorrectAnswers: Math.max(0, totalAttempts - pairsMatched),
      accuracy: calculatedAccuracy,
      averageResponseTime: avgResponse,
      attempts: totalAttempts,
    });
  };

  const gridColsClass =
    difficulty === 'Easy'
      ? 'grid-cols-2 sm:grid-cols-3 max-w-xl'
      : difficulty === 'Medium'
      ? 'grid-cols-2 sm:grid-cols-5 max-w-3xl'
      : 'grid-cols-4 max-w-3xl';

  return (
    <div className="w-full max-w-6xl mx-auto px-3 sm:px-4 py-4 sm:py-6 pb-36 sm:pb-40">
      <GameHeader
        title={t('memoryMatch')}
        difficulty={difficulty}
        instructionText={t('memoryVoiceScript')}
      />

      <div className="flex flex-col lg:flex-row gap-6 items-start">
        {/* Main Board Area (Left on desktop, below instructions on mobile) */}
        <div className="flex-1 w-full min-w-0 order-2 lg:order-1">
          <div className={`grid ${gridColsClass} gap-2.5 sm:gap-4 mx-auto`}>
            {cards.map((card, idx) => (
              <button
                key={card.cardId}
                type="button"
                onClick={() => handleCardClick(idx)}
                disabled={card.isMatched || card.isFlipped || isChecking}
                className={`aspect-square p-2 sm:p-3 rounded-2xl flex flex-col items-center justify-center text-center transition-all select-none border-2 touch-target touch-manipulation ${
                  card.isMatched
                    ? 'bg-sage-100 border-sage-500 opacity-90 cursor-default ring-2 ring-emerald-400'
                    : card.isFlipped
                    ? 'bg-white border-sage-600 shadow-card'
                    : 'bg-cream-200 hover:bg-cream-300 border-borderBase active:scale-98 shadow-xs'
                }`}
                aria-label={card.isFlipped || card.isMatched ? card.name : 'Hidden card'}
              >
                {card.isFlipped || card.isMatched ? (
                  <div className="flex flex-col items-center justify-center gap-1 animate-in zoom-in-90 duration-150 w-full">
                    <CulturalIcon
                      type={card.iconType}
                      size={44}
                      className="w-9 h-9 sm:w-12 sm:h-12 shrink-0"
                    />
                    <span className="text-[11px] sm:text-xs md:text-sm font-bold text-ink-900 line-clamp-1 px-0.5">
                      {card.name}
                    </span>
                  </div>
                ) : (
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-borderBase bg-cream-100 flex items-center justify-center text-ink-500 font-bold text-base sm:text-lg">
                    ?
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Instructions Panel Area (Right on desktop, above board on mobile) */}
        <aside className="w-full lg:w-80 xl:w-96 shrink-0 order-1 lg:order-2">
          <GameInstructionsPanel gameType="memory" />
        </aside>
      </div>

      <GameResultModal
        isOpen={isGameOver}
        accuracy={accuracy}
        correctAnswers={correctPairs}
        totalRounds={totalPairs}
        durationSeconds={duration}
        difficulty={difficulty}
        onDone={() => navigate('/patient/games')}
      />
    </div>
  );
};
