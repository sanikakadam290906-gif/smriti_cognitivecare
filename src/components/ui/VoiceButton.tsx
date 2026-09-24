import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, AlertCircle } from 'lucide-react';
import { speakInstruction, stopSpeech } from '../../utils/speech';
import { useTranslation } from '../../i18n/LanguageContext';

interface VoiceButtonProps {
  textToSpeak: string;
  className?: string;
  label?: string;
  showInlineFeedback?: boolean;
}

export const VoiceButton: React.FC<VoiceButtonProps> = ({
  textToSpeak,
  className = '',
  label,
  showInlineFeedback = true,
}) => {
  const { language, t } = useTranslation();
  const [isPlaying, setIsPlaying] = useState(false);
  const [showFallbackAlert, setShowFallbackAlert] = useState(false);

  // Stop speech whenever language changes or unmounts
  useEffect(() => {
    stopSpeech();
    setIsPlaying(false);
    setShowFallbackAlert(false);

    return () => {
      stopSpeech();
    };
  }, [language]);

  const handleSpeak = (e: React.MouseEvent) => {
    e.stopPropagation();

    // If already playing, stop
    if (isPlaying) {
      stopSpeech();
      setIsPlaying(false);
      return;
    }

    setShowFallbackAlert(false);

    const started = speakInstruction(textToSpeak, language, {
      onStart: () => {
        setIsPlaying(true);
      },
      onEnd: () => {
        setIsPlaying(false);
      },
      onError: () => {
        setIsPlaying(false);
      },
      onVoiceUnavailable: () => {
        setIsPlaying(false);
        setShowFallbackAlert(true);
        // Automatically hide alert banner after 6 seconds
        setTimeout(() => {
          setShowFallbackAlert(false);
        }, 6000);
      },
    });

    if (!started && (language === 'as' || language === 'lus')) {
      setShowFallbackAlert(true);
      setTimeout(() => {
        setShowFallbackAlert(false);
      }, 6000);
    }
  };

  return (
    <div className="relative inline-flex flex-col items-start">
      <button
        type="button"
        onClick={handleSpeak}
        className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 border-sage-500 bg-sage-50 text-sage-800 font-semibold text-base hover:bg-sage-100 active:bg-sage-200 transition-colors focus-visible:outline-3 focus-visible:outline-sage-600 touch-target cursor-pointer select-none ${
          isPlaying ? 'ring-2 ring-sage-600 bg-sage-100' : ''
        } ${className}`}
        aria-label={label || t('hearInstructions')}
        title={isPlaying ? 'Stop voice' : label || t('hearInstructions')}
      >
        {isPlaying ? (
          <Volume2 className="w-5 h-5 animate-pulse text-sage-800" />
        ) : (
          <Volume2 className="w-5 h-5 text-sage-700" />
        )}
        <span className="leading-none">{isPlaying ? t('voicePlaying') : label || t('hearInstructions')}</span>
      </button>

      {/* Fallback message for elderly users when regional voice is not installed on their browser */}
      {showInlineFeedback && showFallbackAlert && (
        <div
          role="alert"
          className="mt-2 p-3 bg-amber-50 border-2 border-amber-400 rounded-xl text-amber-900 text-xs sm:text-sm font-semibold max-w-sm flex items-start gap-2 shadow-card animate-in fade-in"
        >
          <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <p className="leading-snug">{t('voiceUnavailable')}</p>
          </div>
        </div>
      )}
    </div>
  );
};
