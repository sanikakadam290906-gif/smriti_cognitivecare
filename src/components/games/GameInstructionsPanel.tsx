import React, { useState } from 'react';
import { useTranslation } from '../../i18n/LanguageContext';
import { VoiceButton } from '../ui/VoiceButton';
import { HelpCircle, ChevronDown, ChevronUp, Target, ListOrdered, CheckCircle } from 'lucide-react';

export type GameType = 'memory' | 'find-object' | 'pattern' | 'routine';

interface GameInstructionsPanelProps {
  gameType: GameType;
  className?: string;
  isMobileOnly?: boolean;
  isDesktopOnly?: boolean;
}

export const GameInstructionsPanel: React.FC<GameInstructionsPanelProps> = ({
  gameType,
  className = '',
  isMobileOnly = false,
  isDesktopOnly = false,
}) => {
  const { t } = useTranslation();
  // On mobile, start expanded; allow toggling to collapse/expand
  const [isExpanded, setIsExpanded] = useState(true);

  // Extract keys based on gameType
  let goalKey = '';
  let stepsKeys: string[] = [];
  let tapKey = '';
  let feedbackKey = '';
  let voiceScriptKey = '';

  if (gameType === 'memory') {
    goalKey = 'memoryGoal';
    stepsKeys = ['memoryStep1', 'memoryStep2', 'memoryStep3', 'memoryStep4', 'memoryStep5'];
    tapKey = 'memoryTap';
    feedbackKey = 'memoryFeedback';
    voiceScriptKey = 'memoryVoiceScript';
  } else if (gameType === 'find-object') {
    goalKey = 'findGoal';
    stepsKeys = ['findStep1', 'findStep2', 'findStep3', 'findStep4'];
    tapKey = 'findTap';
    feedbackKey = 'findFeedback';
    voiceScriptKey = 'findVoiceScript';
  } else if (gameType === 'pattern') {
    goalKey = 'patternGoal';
    stepsKeys = ['patternStep1', 'patternStep2', 'patternStep3', 'patternStep4'];
    tapKey = 'patternTap';
    feedbackKey = 'patternFeedback';
    voiceScriptKey = 'patternVoiceScript';
  } else {
    // routine
    goalKey = 'routineGoal';
    stepsKeys = ['routineStep1', 'routineStep2', 'routineStep3'];
    tapKey = 'routineTap';
    feedbackKey = 'routineFeedback';
    voiceScriptKey = 'routineVoiceScript';
  }

  const voiceScriptText = t(voiceScriptKey);

  const visibilityClasses = isMobileOnly
    ? 'block lg:hidden'
    : isDesktopOnly
    ? 'hidden lg:block'
    : 'block';

  return (
    <section
      aria-label={t('howToPlay')}
      className={`bg-cream-50/95 border-2 border-sage-300 rounded-3xl p-5 shadow-card transition-all ${visibilityClasses} ${className}`}
    >
      {/* Header bar with Icon, Title, and Mobile Toggle */}
      <div className="flex items-center justify-between gap-3 border-b border-sage-200/80 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-sage-200 text-sage-800 flex items-center justify-center shrink-0">
            <HelpCircle className="w-5 h-5" />
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-ink-900 tracking-tight">
            {t('howToPlay')}
          </h2>
        </div>

        {/* Mobile Collapse/Expand Button */}
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="lg:hidden p-2 rounded-xl text-ink-700 bg-white border border-borderBase hover:bg-cream-100 flex items-center gap-1.5 text-xs font-bold"
          aria-expanded={isExpanded}
        >
          <span>{isExpanded ? t('hideInstructions') : t('showInstructions')}</span>
          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {/* Main Content Area */}
      {isExpanded && (
        <div className="mt-4 space-y-4 animate-in fade-in duration-150">
          {/* Audio Instruction Button */}
          <div className="bg-white/80 p-3 rounded-2xl border border-sage-200/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
            <span className="text-sm font-bold text-ink-800 leading-snug">
              {t('hearInstructions')}
            </span>
            <VoiceButton textToSpeak={voiceScriptText} />
          </div>

          {/* Goal Section */}
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-bold text-sage-800 uppercase tracking-wider">
              <Target className="w-4 h-4 text-sage-700" />
              <span>{t('gameGoal')}</span>
            </div>
            <p className="text-base sm:text-lg font-bold text-ink-900 leading-snug pl-1">
              {t(goalKey)}
            </p>
          </div>

          {/* Step by Step list */}
          <div className="space-y-2 pt-1 border-t border-borderBase/60">
            <div className="flex items-center gap-1.5 text-xs font-bold text-sage-800 uppercase tracking-wider">
              <ListOrdered className="w-4 h-4 text-sage-700" />
              <span>{t('stepsToPlay')}</span>
            </div>
            <ol className="space-y-2 text-sm sm:text-base font-semibold text-ink-800 pl-1">
              {stepsKeys.map((k) => (
                <li key={k} className="flex items-start gap-2 leading-snug">
                  <span className="w-2 h-2 rounded-full bg-sage-500 mt-2 shrink-0" />
                  <span>{t(k)}</span>
                </li>
              ))}
            </ol>
          </div>

          {/* What to tap and Feedback */}
          <div className="grid grid-cols-1 gap-2.5 pt-2 border-t border-borderBase/60">
            {/* What to tap */}
            <div className="bg-white/90 p-3 rounded-2xl border border-borderBase/70 space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-bold text-ink-600 uppercase tracking-wider">
                <span className="w-2 h-2 rounded-full bg-amber-500 inline-block" />
                <span>{t('whatToTap')}</span>
              </div>
              <p className="text-xs sm:text-sm font-bold text-ink-900 leading-snug">
                {t(tapKey)}
              </p>
            </div>

            {/* Answer Feedback */}
            <div className="bg-white/90 p-3 rounded-2xl border border-borderBase/70 space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-bold text-ink-600 uppercase tracking-wider">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                <span>{t('resultFeedback')}</span>
              </div>
              <p className="text-xs sm:text-sm font-bold text-ink-900 leading-snug">
                {t(feedbackKey)}
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
