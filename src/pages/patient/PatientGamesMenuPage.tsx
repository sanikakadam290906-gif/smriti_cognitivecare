import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from '../../i18n/LanguageContext';
import { VoiceButton } from '../../components/ui/VoiceButton';
import { Brain, Search, Puzzle, CalendarCheck } from 'lucide-react';
import { DifficultyLevel } from '../../types';

interface PatientGamesMenuPageProps {
  difficulty: DifficultyLevel;
}

export const PatientGamesMenuPage: React.FC<PatientGamesMenuPageProps> = ({ difficulty }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const games = [
    {
      to: '/patient/games/memory',
      title: t('memoryMatch'),
      icon: Brain,
      bg: 'bg-sage-100',
      border: 'border-sage-200',
      color: 'text-sage-800',
    },
    {
      to: '/patient/games/find-object',
      title: t('findTheObject'),
      icon: Search,
      bg: 'bg-sky-100',
      border: 'border-sky-200',
      color: 'text-sky-700',
    },
    {
      to: '/patient/games/pattern',
      title: t('completeThePattern'),
      icon: Puzzle,
      bg: 'bg-peach-100',
      border: 'border-peach-200',
      color: 'text-peach-700',
    },
    {
      to: '/patient/games/routine',
      title: t('routineRecall'),
      icon: CalendarCheck,
      bg: 'bg-lavender-100',
      border: 'border-lavender-200',
      color: 'text-lavender-700',
    },
  ];

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 pb-28 space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-ink-900 tracking-tight">
            {t('todaysActivities')}
          </h1>
          <span className="text-sm font-semibold text-ink-500">
            Level: {difficulty}
          </span>
        </div>
        <VoiceButton textToSpeak="Choose an activity to play. Tap any card to begin." />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {games.map((g) => {
          const Icon = g.icon;
          return (
            <button
              key={g.to}
              type="button"
              onClick={() => navigate(g.to)}
              className="p-6 bg-white hover:bg-cream-200 active:bg-cream-300 border-2 border-borderBase rounded-3xl flex flex-col items-center justify-center gap-4 transition-all touch-target-lg shadow-card text-center select-none"
            >
              <div
                className={`w-20 h-20 rounded-2xl ${g.bg} border ${g.border} ${g.color} flex items-center justify-center`}
              >
                <Icon className="w-10 h-10" />
              </div>
              <span className="text-lg sm:text-xl font-extrabold text-ink-900 leading-tight">
                {g.title}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
