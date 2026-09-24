import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from '../../i18n/LanguageContext';
import { DifficultyLevel } from '../../types';
import { GeneratedRoutineQuestion, generateRoutineQuestions } from './routineGameEngine';
import { GameHeader } from '../../components/games/GameHeader';
import { GameResultModal } from '../../components/games/GameResultModal';
import { GameInstructionsPanel } from '../../components/games/GameInstructionsPanel';
import { dataService } from '../../services/supabase/dataService';
import { Check, X, CalendarCheck } from 'lucide-react';

interface RoutineRecallGameProps {
  patientId: string;
  difficulty: DifficultyLevel;
}

export const RoutineRecallGame: React.FC<RoutineRecallGameProps> = ({ patientId, difficulty }) => {
  const { language, t } = useTranslation();
  const navigate = useNavigate();

  const [questions, setQuestions] = useState<GeneratedRoutineQuestion[]>([]);
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [correctCount, setCorrectCount] = useState<number>(0);
  const [incorrectCount, setIncorrectCount] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [accuracy, setAccuracy] = useState<number>(100);
  const [duration, setDuration] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const startTimeRef = useRef<number>(Date.now());
  const roundStartTimeRef = useRef<number>(Date.now());
  const responseTimesRef = useRef<number[]>([]);

  useEffect(() => {
    loadRoutineAndGenerate();
  }, [patientId, difficulty, language]);

  const loadRoutineAndGenerate = async () => {
    setIsLoading(true);
    const routines = await dataService.getRoutines(patientId);
    const generated = generateRoutineQuestions(routines, difficulty, language);
    setQuestions(generated);
    setCurrentIdx(0);
    setCorrectCount(0);
    setIncorrectCount(0);
    setSelectedOption(null);
    setIsGameOver(false);
    setIsLoading(false);
    startTimeRef.current = Date.now();
    roundStartTimeRef.current = Date.now();
    responseTimesRef.current = [];
  };

  const currentQ = questions[currentIdx];

  const handleSelectOption = (optionText: string) => {
    if (selectedOption || !currentQ) return;

    setSelectedOption(optionText);
    const roundDuration = (Date.now() - roundStartTimeRef.current) / 1000;
    responseTimesRef.current.push(roundDuration);

    const isCorrect = optionText === currentQ.correctAnswer;

    if (isCorrect) {
      setCorrectCount((prev) => prev + 1);
    } else {
      setIncorrectCount((prev) => prev + 1);
    }

    setTimeout(() => {
      setSelectedOption(null);
      if (currentIdx + 1 < questions.length) {
        setCurrentIdx((prev) => prev + 1);
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
        : 3.8;

    setAccuracy(finalAccuracy);
    setDuration(totalElapsed);
    setIsGameOver(true);

    dataService.saveGameSession({
      patientId,
      gameType: 'routine',
      difficulty,
      startTime: new Date(startTimeRef.current).toISOString(),
      endTime: new Date().toISOString(),
      rounds: questions.length,
      correctAnswers: totalCorrect,
      incorrectAnswers: totalIncorrect,
      accuracy: finalAccuracy,
      averageResponseTime: avgResponse,
      attempts: 1,
    });
  };

  if (isLoading) {
    return <div className="p-8 text-center text-ink-700">{t('loading')}</div>;
  }

  if (!currentQ) {
    return (
      <div className="p-8 text-center text-ink-700 max-w-md mx-auto">
        <p className="mb-4">{t('noRoutinesScheduled')}</p>
        <button
          onClick={() => navigate('/patient/games')}
          className="px-4 py-2 bg-sage-600 text-white rounded-xl font-bold"
        >
          {t('backToGames')}
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-3 sm:px-4 py-4 sm:py-6 pb-32 w-full min-h-[calc(100vh-120px)]">
      <GameHeader
        title={t('routineRecall')}
        currentRound={currentIdx + 1}
        totalRounds={questions.length}
        difficulty={difficulty}
        instructionText={currentQ.prompt}
      />

      <div className="flex flex-col lg:flex-row gap-6 items-start">
        {/* Mobile Instructions Panel (above game on mobile / tablet) */}
        <div className="w-full lg:hidden">
          <GameInstructionsPanel gameType="routine" isMobileOnly />
        </div>

        {/* Main Board & Options Area */}
        <div className="flex-1 w-full min-w-0">
          {/* Routine Prompt Card */}
          <div className="bg-cream-50 border-2 border-borderBase rounded-3xl p-5 sm:p-7 mb-6 shadow-subtle flex items-start gap-3.5 sm:gap-4">
            <div className="p-2.5 sm:p-3 bg-white border border-borderBase rounded-2xl shrink-0 shadow-xs">
              <CalendarCheck className="w-7 h-7 sm:w-8 sm:h-8 text-sage-600" />
            </div>
            <div>
              <span className="block text-xs sm:text-sm font-bold text-ink-500 uppercase tracking-wide mb-1">
                {t('personalRoutineQuestion')}
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-ink-900 leading-snug">
                {currentQ.prompt}
              </h2>
            </div>
          </div>

          {/* Answer Options */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 max-w-2xl mx-auto">
            {currentQ.options.map((opt) => {
              const isSelected = selectedOption === opt;
              const isCorrect = opt === currentQ.correctAnswer;

              return (
                <button
                  key={opt}
                  type="button"
                  onClick={() => handleSelectOption(opt)}
                  disabled={Boolean(selectedOption)}
                  className={`p-4 sm:p-5 rounded-2xl border-2 text-left font-extrabold text-base sm:text-lg md:text-xl transition-all touch-target touch-manipulation flex items-center justify-between select-none ${
                    isSelected && isCorrect
                      ? 'bg-emerald-50 border-emerald-600 text-emerald-900 ring-2 ring-emerald-500 shadow-md'
                      : isSelected && !isCorrect
                      ? 'bg-rose-50 border-rose-600 text-rose-900 ring-2 ring-rose-500 shadow-md'
                      : 'bg-white hover:bg-cream-200 border-borderBase text-ink-900 shadow-card active:scale-98'
                  }`}
                >
                  <span className="leading-snug">{opt}</span>
                  {isSelected && (
                    <span className="shrink-0 ml-2">
                      {isCorrect ? (
                        <Check className="w-6 h-6 text-emerald-600 stroke-[3]" />
                      ) : (
                        <X className="w-6 h-6 text-rose-600 stroke-[3]" />
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
          <GameInstructionsPanel gameType="routine" isDesktopOnly />
        </aside>
      </div>

      <GameResultModal
        isOpen={isGameOver}
        accuracy={accuracy}
        correctAnswers={correctCount}
        totalRounds={questions.length}
        durationSeconds={duration}
        difficulty={difficulty}
        onDone={() => navigate('/patient/games')}
      />
    </div>
  );
};
