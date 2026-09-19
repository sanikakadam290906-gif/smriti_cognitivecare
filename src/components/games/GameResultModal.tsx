import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Button } from '../ui/Button';
import { useTranslation } from '../../i18n/LanguageContext';
import { CheckCircle2 } from 'lucide-react';

interface GameResultModalProps {
  isOpen: boolean;
  accuracy: number;
  correctAnswers: number;
  totalRounds: number;
  durationSeconds: number;
  difficulty: string;
  onDone: () => void;
}

export const GameResultModal: React.FC<GameResultModalProps> = ({
  isOpen,
  accuracy,
  correctAnswers,
  totalRounds,
  durationSeconds,
  difficulty,
  onDone,
}) => {
  const { t } = useTranslation();

  useEffect(() => {
    if (isOpen) {
      // Gentle celebratory confetti
      try {
        confetti({
          particleCount: 40,
          spread: 60,
          origin: { y: 0.65 },
          colors: ['#527961', '#C87449', '#D4AF37'],
          disableForReducedMotion: true,
        });
      } catch {
        // Fallback
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const minutes = Math.floor(durationSeconds / 60);
  const remainingSecs = durationSeconds % 60;
  const timeFormatted =
    minutes > 0
      ? `${minutes} min ${remainingSecs} sec`
      : `${remainingSecs} sec`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink-900/40 backdrop-blur-xs">
      <div className="bg-cream-50 border-2 border-borderBase rounded-2xl p-6 sm:p-8 max-w-md w-full shadow-lg text-center animate-in fade-in zoom-in-95 duration-200">
        <div className="w-16 h-16 bg-sage-100 border border-sage-200 text-sage-700 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <h2 className="text-2xl sm:text-3xl font-bold text-ink-900 mb-6">
          {t('wellDone')}
        </h2>

        {/* Clean, calm result grid without dramatic clutter */}
        <div className="grid grid-cols-2 gap-3 mb-8 text-left">
          <div className="p-3.5 bg-white border border-borderBase rounded-xl">
            <span className="block text-xs font-semibold text-ink-500 uppercase tracking-wider mb-1">
              {t('accuracy')}
            </span>
            <span className="text-2xl font-bold text-sage-700">{accuracy}%</span>
          </div>

          <div className="p-3.5 bg-white border border-borderBase rounded-xl">
            <span className="block text-xs font-semibold text-ink-500 uppercase tracking-wider mb-1">
              {t('correct')}
            </span>
            <span className="text-2xl font-bold text-ink-900">
              {correctAnswers} / {totalRounds}
            </span>
          </div>

          <div className="p-3.5 bg-white border border-borderBase rounded-xl">
            <span className="block text-xs font-semibold text-ink-500 uppercase tracking-wider mb-1">
              {t('timeTaken')}
            </span>
            <span className="text-lg font-bold text-ink-900">{timeFormatted}</span>
          </div>

          <div className="p-3.5 bg-white border border-borderBase rounded-xl">
            <span className="block text-xs font-semibold text-ink-500 uppercase tracking-wider mb-1">
              {t('difficulty')}
            </span>
            <span className="text-lg font-bold text-ink-900">{difficulty}</span>
          </div>
        </div>

        <Button
          variant="primary"
          size="lg"
          onClick={onDone}
          className="w-full text-lg font-bold tracking-wide"
        >
          {t('done')}
        </Button>
      </div>
    </div>
  );
};
