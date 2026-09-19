import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from '../../i18n/LanguageContext';
import { DifficultyLevel } from '../../types';
import { GeneratedRoutineQuestion, generateRoutineQuestions } from './routineGameEngine';
import { GameHeader } from '../../components/games/GameHeader';
import { GameResultModal } from '../../components/games/GameResultModal';
import { dataService } from '../../services/supabase/dataService';
import { Check, X, CalendarCheck } from 'lucide-react';

interface RoutineRecallGameProps {
  patientId: string;
  difficulty: DifficultyLevel;
}

export const RoutineRecallGame: React.FC<RoutineRecallGameProps> = ({ patientId, difficulty }) => {
  const { t } = useTranslation();
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
  }, [patientId, difficulty]);

  const loadRoutineAndGenerate = async () => {
    setIsLoading(true);
    const routines = await dataService.getRoutines(patientId);
    const generated = generateRoutineQuestions(routines, difficulty);
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
    <div className="max-w-4xl mx-auto px-4 py-6">
      <GameHeader
        title={t('routineRecall')}
        currentRound={currentIdx + 1}
        totalRounds={questions.length}
        difficulty={difficulty}
        instructionText={currentQ.prompt}
      />

      {/* Routine Prompt Card */}
      <div className="bg-cream-50 border-2 border-borderBase rounded-2xl p-6 sm:p-8 mb-8 shadow-subtle flex items-start gap-4">
        <div className="p-3 bg-white border border-borderBase rounded-xl shrink-0">
          <CalendarCheck className="w-8 h-8 text-sage-600" />
        </div>
        <div>
          <span className="block text-xs sm:text-sm font-semibold text-ink-500 uppercase tracking-wide mb-1">
            Personal Routine Question
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-ink-900 leading-snug">
            {currentQ.prompt}
          </h2>
        </div>
      </div>

      {/* Answer Options */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
        {currentQ.options.map((opt) => {
          const isSelected = selectedOption === opt;
          const isCorrect = opt === currentQ.correctAnswer;

          return (
            <button
              key={opt}
              type="button"
              onClick={() => handleSelectOption(opt)}
              disabled={Boolean(selectedOption)}
              className={`p-5 rounded-2xl border-2 text-left font-bold text-lg sm:text-xl transition-all touch-target-lg flex items-center justify-between select-none ${
                isSelected && isCorrect
                  ? 'bg-emerald-50 border-emerald-600 text-emerald-900 ring-2 ring-emerald-500'
                  : isSelected && !isCorrect
                  ? 'bg-rose-50 border-rose-600 text-rose-900 ring-2 ring-rose-500'
                  : 'bg-white hover:bg-cream-200 border-borderBase text-ink-900 shadow-card active:scale-98'
              }`}
            >
              <span>{opt}</span>
              {isSelected && (
                <span>
                  {isCorrect ? (
                    <Check className="w-6 h-6 text-emerald-600" />
                  ) : (
                    <X className="w-6 h-6 text-rose-600" />
                  )}
                </span>
              )}
            </button>
          );
        })}
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
