import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { VoiceButton } from '../ui/VoiceButton';
import { useTranslation } from '../../i18n/LanguageContext';

interface GameHeaderProps {
  title: string;
  currentRound?: number;
  totalRounds?: number;
  difficulty: string;
  instructionText: string;
}

export const GameHeader: React.FC<GameHeaderProps> = ({
  title,
  currentRound,
  totalRounds,
  difficulty,
  instructionText,
}) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="mb-6 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-borderBase pb-4">
        <button
          type="button"
          onClick={() => navigate('/patient/games')}
          className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl border border-borderBase bg-white text-ink-900 font-bold hover:bg-cream-200 transition-colors touch-target"
        >
          <ArrowLeft className="w-5 h-5 text-ink-700" />
          <span>{t('backToGames')}</span>
        </button>

        <div className="flex items-center gap-3">
          <span className="px-3 py-1 bg-sage-100 border border-sage-200 text-sage-800 rounded-lg text-sm font-semibold">
            {difficulty}
          </span>
          {currentRound && totalRounds && (
            <span className="px-3 py-1 bg-cream-200 border border-borderBase text-ink-800 rounded-lg text-sm font-bold">
              {currentRound} / {totalRounds}
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-ink-900 tracking-tight">
          {title}
        </h1>
        <VoiceButton textToSpeak={instructionText} />
      </div>
    </div>
  );
};
