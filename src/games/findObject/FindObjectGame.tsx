import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from '../../i18n/LanguageContext';
import { DifficultyLevel } from '../../types';
import { FindObjectRound, generateFindObjectSession } from './sceneEngine';
import { GameHeader } from '../../components/games/GameHeader';
import { GameResultModal } from '../../components/games/GameResultModal';
import { GameInstructionsPanel } from '../../components/games/GameInstructionsPanel';
import { CulturalIcon } from '../../components/ui/CulturalIcon';
import { dataService } from '../../services/supabase/dataService';
import { Check, X } from 'lucide-react';

interface FindObjectGameProps {
  patientId: string;
  difficulty: DifficultyLevel;
}

export const FindObjectGame: React.FC<FindObjectGameProps> = ({ patientId, difficulty }) => {
  const { language, t } = useTranslation();
  const navigate = useNavigate();

  const [rounds, setRounds] = useState<FindObjectRound[]>([]);
  const [currentRoundIdx, setCurrentRoundIdx] = useState<number>(0);
  const [correctCount, setCorrectCount] = useState<number>(0);
  const [incorrectCount, setIncorrectCount] = useState<number>(0);
  const [feedback, setFeedback] = useState<{ isCorrect: boolean; clickedId: string } | null>(null);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [duration, setDuration] = useState<number>(0);
  const [accuracy, setAccuracy] = useState<number>(100);

  const startTimeRef = useRef<number>(Date.now());
  const roundStartTimeRef = useRef<number>(Date.now());
  const responseTimesRef = useRef<number[]>([]);

  useEffect(() => {
    startNewSession();
  }, [difficulty, language]);

  const startNewSession = () => {
    const generated = generateFindObjectSession(difficulty, language);
    setRounds(generated);
    setCurrentRoundIdx(0);
    setCorrectCount(0);
    setIncorrectCount(0);
    setFeedback(null);
    setIsGameOver(false);
    startTimeRef.current = Date.now();
    roundStartTimeRef.current = Date.now();
    responseTimesRef.current = [];
  };

  const currentRound = rounds[currentRoundIdx];

  const handleObjectClick = (clickedObjId: string) => {
    if (feedback || !currentRound) return;

    const roundDuration = (Date.now() - roundStartTimeRef.current) / 1000;
    responseTimesRef.current.push(roundDuration);

    const isMatch = clickedObjId === currentRound.targetObject.id;

    if (isMatch) {
      setFeedback({ isCorrect: true, clickedId: clickedObjId });
      setCorrectCount((prev) => prev + 1);

      setTimeout(() => {
        setFeedback(null);
        if (currentRoundIdx + 1 < rounds.length) {
          setCurrentRoundIdx((prev) => prev + 1);
          roundStartTimeRef.current = Date.now();
        } else {
          finishGame(correctCount + 1, incorrectCount);
        }
      }, 900);
    } else {
      setFeedback({ isCorrect: false, clickedId: clickedObjId });
      setIncorrectCount((prev) => prev + 1);

      setTimeout(() => {
        setFeedback(null);
      }, 1000);
    }
  };

  const finishGame = (totalCorrect: number, totalIncorrect: number) => {
    const total = totalCorrect + totalIncorrect;
    const finalAccuracy = total > 0 ? Math.round((totalCorrect / total) * 100) : 100;
    const totalElapsed = Math.max(1, Math.round((Date.now() - startTimeRef.current) / 1000));
    const avgResponse =
      responseTimesRef.current.length > 0
        ? Number((responseTimesRef.current.reduce((a, b) => a + b, 0) / responseTimesRef.current.length).toFixed(1))
        : 3.5;

    setAccuracy(finalAccuracy);
    setDuration(totalElapsed);
    setIsGameOver(true);

    dataService.saveGameSession({
      patientId,
      gameType: 'find-object',
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

  const targetName = currentRound.targetObject.name[language] || currentRound.targetObject.name.en;

  return (
    <div className="max-w-6xl mx-auto px-3 sm:px-4 py-4 sm:py-6 pb-32 w-full min-h-[calc(100vh-120px)]">
      <GameHeader
        title={t('findTheObject')}
        currentRound={currentRoundIdx + 1}
        totalRounds={rounds.length}
        difficulty={difficulty}
        instructionText={currentRound.targetPrompt}
      />

      <div className="flex flex-col lg:flex-row gap-6 items-start">
        {/* Mobile Instructions Panel (above game on mobile / tablet) */}
        <div className="w-full lg:hidden">
          <GameInstructionsPanel gameType="find-object" isMobileOnly />
        </div>

        {/* Main Board & Canvas Area */}
        <div className="flex-1 w-full min-w-0">
          {/* Target prompt card */}
          <div className="bg-cream-50 border-2 border-borderBase rounded-3xl p-4 sm:p-5 mb-5 flex items-center justify-between shadow-subtle">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="p-2 sm:p-2.5 bg-white border border-borderBase rounded-2xl shadow-xs shrink-0">
                <CulturalIcon type={currentRound.targetObject.iconType} size={44} className="w-10 h-10 sm:w-12 sm:h-12" />
              </div>
              <div>
                <span className="block text-xs sm:text-sm font-bold text-ink-500 uppercase tracking-wide">
                  {t('findPromptPrefix')}
                </span>
                <span className="text-xl sm:text-2xl font-black text-ink-900 leading-tight">
                  {targetName}
                </span>
              </div>
            </div>

            <span className="text-xs sm:text-sm font-bold text-ink-600 bg-cream-200 border border-borderBase px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-xl shrink-0">
              {currentRound.scene.name[language] || currentRound.scene.name.en}
            </span>
          </div>

          {/* Interactive Visual Scene Canvas */}
          <div className="relative w-full aspect-[4/3] sm:aspect-[16/10] bg-cream-100 border-2 border-borderBase rounded-3xl overflow-hidden shadow-subtle select-none">
            {/* Decorative subtle scene silhouettes based on scene type */}
            <div className="absolute inset-0 pointer-events-none opacity-40">
              {currentRound.scene.bgSvgType === 'teaGarden' ? (
                <svg className="w-full h-full" viewBox="0 0 800 500" preserveAspectRatio="none">
                  <path d="M0 350 Q 200 300 400 340 T 800 320 V 500 H 0 Z" fill="#CBDCD0" />
                  <path d="M0 390 Q 250 360 500 380 T 800 360 V 500 H 0 Z" fill="#A7C4AF" />
                  <circle cx="680" cy="120" r="50" fill="#F9EDE3" />
                </svg>
              ) : currentRound.scene.bgSvgType === 'veranda' ? (
                <svg className="w-full h-full" viewBox="0 0 800 500" preserveAspectRatio="none">
                  <line x1="80" y1="0" x2="80" y2="500" stroke="#D7C4B0" strokeWidth="8" />
                  <line x1="720" y1="0" x2="720" y2="500" stroke="#D7C4B0" strokeWidth="8" />
                  <line x1="0" y1="80" x2="800" y2="80" stroke="#D7C4B0" strokeWidth="12" />
                  <rect x="0" y="380" width="800" height="120" fill="#EAE0D0" />
                </svg>
              ) : (
                <svg className="w-full h-full" viewBox="0 0 800 500" preserveAspectRatio="none">
                  <rect x="0" y="360" width="800" height="140" fill="#EFE8DC" />
                  <line x1="0" y1="360" x2="800" y2="360" stroke="#D2C7B8" strokeWidth="4" />
                </svg>
              )}
            </div>

            {/* Clickable Objects */}
            {currentRound.allObjects.map((obj) => {
              const isClicked = feedback?.clickedId === obj.id;

              return (
                <button
                  key={`${obj.id}-${obj.xPercent}-${obj.yPercent}`}
                  type="button"
                  onClick={() => handleObjectClick(obj.id)}
                  disabled={Boolean(feedback?.isCorrect)}
                  style={{
                    left: `${obj.xPercent}%`,
                    top: `${obj.yPercent}%`,
                    transform: 'translate(-50%, -50%)',
                  }}
                  className={`absolute p-1.5 sm:p-2.5 rounded-2xl transition-all duration-150 touch-target touch-manipulation focus-visible:outline-3 focus-visible:outline-sage-600 ${
                    isClicked && feedback.isCorrect
                      ? 'ring-4 ring-emerald-500 bg-emerald-50 scale-110 shadow-lg'
                      : isClicked && !feedback.isCorrect
                      ? 'ring-4 ring-rose-500 bg-rose-50 animate-shake shadow-lg'
                      : 'hover:scale-105 active:scale-95 bg-white/80 hover:bg-white border border-borderBase shadow-xs'
                  }`}
                  aria-label={obj.name[language] || obj.name.en}
                >
                  <CulturalIcon type={obj.iconType} size={obj.size} className="w-9 h-9 sm:w-13 sm:h-13" />

                  {isClicked && (
                    <span className="absolute -top-2.5 -right-2.5 w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center text-white shadow-xs">
                      {feedback.isCorrect ? (
                        <span className="bg-emerald-600 w-full h-full rounded-full flex items-center justify-center">
                          <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[3]" />
                        </span>
                      ) : (
                        <span className="bg-rose-600 w-full h-full rounded-full flex items-center justify-center">
                          <X className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[3]" />
                        </span>
                      )}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Desktop Sticky Side Instructions Panel (beside game on desktop) */}
        <aside className="hidden lg:block w-80 xl:w-96 shrink-0 sticky top-24">
          <GameInstructionsPanel gameType="find-object" isDesktopOnly />
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
