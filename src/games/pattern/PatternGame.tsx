import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from '../../i18n/LanguageContext';
import { DifficultyLevel } from '../../types';
import { PatternRound } from '../../types/games';
import { generatePatternSession } from './patternEngine';
import { GameHeader } from '../../components/games/GameHeader';
import { GameResultModal } from '../../components/games/GameResultModal';
import { GameInstructionsPanel } from '../../components/games/GameInstructionsPanel';
import { CulturalIcon } from '../../components/ui/CulturalIcon';
import { dataService } from '../../services/supabase/dataService';
import { Check, X } from 'lucide-react';

interface PatternGameProps {
  patientId: string;
  difficulty: DifficultyLevel;
}

export const PatternGame: React.FC<PatternGameProps> = ({ patientId, difficulty }) => {
  const { language, t } = useTranslation();
  const navigate = useNavigate();

  const [rounds, setRounds] = useState<PatternRound[]>([]);
  const [currentRoundIdx, setCurrentRoundIdx] = useState<number>(0);
  const [correctCount, setCorrectCount] = useState<number>(0);
  const [incorrectCount, setIncorrectCount] = useState<number>(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [accuracy, setAccuracy] = useState<number>(100);
  const [duration, setDuration] = useState<number>(0);

  const startTimeRef = useRef<number>(Date.now());
  const roundStartTimeRef = useRef<number>(Date.now());
  const responseTimesRef = useRef<number[]>([]);

  useEffect(() => {
    startNewSession();
  }, [difficulty]);

  const startNewSession = () => {
    const generated = generatePatternSession(difficulty);
    setRounds(generated);
    setCurrentRoundIdx(0);
    setCorrectCount(0);
    setIncorrectCount(0);
    setSelectedOptionId(null);
    setIsGameOver(false);
    startTimeRef.current = Date.now();
    roundStartTimeRef.current = Date.now();
    responseTimesRef.current = [];
  };

  const currentRound = rounds[currentRoundIdx];

  const handleOptionSelect = (optionId: string) => {
    if (selectedOptionId || !currentRound) return;

    setSelectedOptionId(optionId);
    const roundDuration = (Date.now() - roundStartTimeRef.current) / 1000;
    responseTimesRef.current.push(roundDuration);

    const isCorrect = optionId === currentRound.correctAnswer.id;

    if (isCorrect) {
      setCorrectCount((prev) => prev + 1);
    } else {
      setIncorrectCount((prev) => prev + 1);
    }

    setTimeout(() => {
      setSelectedOptionId(null);
      if (currentRoundIdx + 1 < rounds.length) {
        setCurrentRoundIdx((prev) => prev + 1);
        roundStartTimeRef.current = Date.now();
      } else {
        finishGame(
          isCorrect ? correctCount + 1 : correctCount,
          isCorrect ? incorrectCount : incorrectCount + 1
        );
      }
    }, 1100);
  };

  const finishGame = (totalCorrect: number, totalIncorrect: number) => {
    const total = totalCorrect + totalIncorrect;
    const finalAccuracy = total > 0 ? Math.round((totalCorrect / total) * 100) : 100;
    const totalElapsed = Math.max(1, Math.round((Date.now() - startTimeRef.current) / 1000));
    const avgResponse =
      responseTimesRef.current.length > 0
        ? Number((responseTimesRef.current.reduce((a, b) => a + b, 0) / responseTimesRef.current.length).toFixed(1))
        : 3.2;

    setAccuracy(finalAccuracy);
    setDuration(totalElapsed);
    setIsGameOver(true);

    dataService.saveGameSession({
      patientId,
      gameType: 'pattern',
      difficulty,
      startTime: new Date(startTimeRef.current).toISOString(),
      endTime: new Date().toISOString(),
      rounds: rounds.length,
      correctAnswers: totalCorrect,
      incorrectAnswers: totalIncorrect,
      accuracy: finalAccuracy,
      averageResponseTime: avgResponse,
      attempts: 1,
    });
  };

  if (!currentRound) {
    return <div className="p-6 text-center text-ink-700">{t('loading')}</div>;
  }

  return (
    <div className="w-full max-w-6xl mx-auto px-3 sm:px-4 py-4 sm:py-6 pb-36 sm:pb-40">
      <GameHeader
        title={t('completeThePattern')}
        currentRound={currentRoundIdx + 1}
        totalRounds={rounds.length}
        difficulty={difficulty}
        instructionText={t('patternVoiceScript')}
      />

      <div className="flex flex-col lg:flex-row gap-6 items-start">
        {/* Main Board & Options Area (Left on desktop, below instructions on mobile) */}
        <div className="flex-1 w-full min-w-0 order-2 lg:order-1">
          {/* Pattern Sequence Strip */}
          <div className="bg-cream-50 border-2 border-borderBase rounded-3xl p-4 sm:p-7 mb-6 sm:mb-8 shadow-subtle">
            <span className="block text-center text-xs sm:text-sm font-bold text-ink-500 uppercase tracking-wider mb-4 sm:mb-6">
              {t('sequencePattern')}
            </span>

            <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 md:gap-4">
              {currentRound.sequence.map((element, idx) => {
                const isMissingSlot = idx === currentRound.missingIndex;

                if (isMissingSlot) {
                  return (
                    <div
                      key={`missing-${idx}`}
                      className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-2xl border-3 border-dashed border-sage-500 bg-sage-50/70 flex items-center justify-center text-sage-800 font-extrabold text-xl sm:text-2xl md:text-3xl shadow-inner animate-pulse shrink-0"
                    >
                      ?
                    </div>
                  );
                }

                return (
                  <div
                    key={`element-${idx}`}
                    className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-2xl bg-white border-2 border-borderBase flex flex-col items-center justify-center p-1.5 sm:p-2 shadow-xs shrink-0"
                  >
                    <CulturalIcon
                      type={element!.iconType}
                      size={40}
                      color={element!.color}
                      className="w-8 h-8 sm:w-11 sm:h-11 md:w-13 md:h-13"
                    />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Answer Choices */}
          <div>
            <h3 className="text-center text-base sm:text-lg font-bold text-ink-800 mb-4">
              {t('chooseCorrectItem')}
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-4 max-w-2xl mx-auto">
              {currentRound.options.map((option) => {
                const isSelected = selectedOptionId === option.id;
                const isCorrect = option.id === currentRound.correctAnswer.id;

                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => handleOptionSelect(option.id)}
                    disabled={Boolean(selectedOptionId)}
                    className={`p-3 sm:p-4 rounded-2xl border-2 flex flex-col items-center justify-center gap-2 transition-all touch-target touch-manipulation select-none ${
                      isSelected && isCorrect
                        ? 'bg-emerald-50 border-emerald-600 scale-102 ring-2 ring-emerald-500'
                        : isSelected && !isCorrect
                        ? 'bg-rose-50 border-rose-600 scale-98 ring-2 ring-rose-500'
                        : 'bg-white hover:bg-cream-200 border-borderBase active:scale-98 shadow-card'
                    }`}
                    aria-label={option.label[language] || option.label.en}
                  >
                    <CulturalIcon
                      type={option.iconType}
                      size={48}
                      color={option.color}
                      className="w-10 h-10 sm:w-12 sm:h-12"
                    />
                    <span className="text-xs sm:text-sm font-bold text-ink-900 line-clamp-1">
                      {option.label[language] || option.label.en}
                    </span>

                    {isSelected && (
                      <div className="mt-1">
                        {isCorrect ? (
                          <span className="inline-flex items-center gap-1 text-emerald-700 text-xs font-bold">
                            <Check className="w-4 h-4" /> {t('correct')}
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-rose-700 text-xs font-bold">
                            <X className="w-4 h-4" /> {t('tryAgain')}
                          </span>
                        )}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Instructions Panel Area (Right on desktop, above board on mobile) */}
        <aside className="w-full lg:w-80 xl:w-96 shrink-0 order-1 lg:order-2">
          <GameInstructionsPanel gameType="pattern" />
        </aside>
      </div>

      <GameResultModal
        isOpen={isGameOver}
        accuracy={accuracy}
        correctAnswers={correctCount}
        totalRounds={rounds.length}
        durationSeconds={duration}
        difficulty={difficulty}
        onDone={() => navigate('/patient/games')}
      />
    </div>
  );
};
