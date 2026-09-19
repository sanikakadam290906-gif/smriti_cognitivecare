import React, { useState } from 'react';
import { Volume2 } from 'lucide-react';
import { speakInstruction } from '../../utils/speech';
import { useTranslation } from '../../i18n/LanguageContext';

interface VoiceButtonProps {
  textToSpeak: string;
  className?: string;
  label?: string;
}

export const VoiceButton: React.FC<VoiceButtonProps> = ({
  textToSpeak,
  className = '',
  label,
}) => {
  const { language, t } = useTranslation();
  const [isPlaying, setIsPlaying] = useState(false);

  const handleSpeak = () => {
    setIsPlaying(true);
    speakInstruction(textToSpeak, language);
    setTimeout(() => {
      setIsPlaying(false);
    }, 2500);
  };

  return (
    <button
      type="button"
      onClick={handleSpeak}
      className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 border-sage-500 bg-sage-50 text-sage-800 font-semibold text-base hover:bg-sage-100 active:bg-sage-200 transition-colors focus-visible:outline-3 focus-visible:outline-sage-600 ${
        isPlaying ? 'ring-2 ring-sage-600' : ''
      } ${className}`}
      aria-label={label || t('hearInstructions')}
    >
      <Volume2 className={`w-5 h-5 ${isPlaying ? 'animate-pulse text-sage-700' : 'text-sage-600'}`} />
      <span>{label || t('hearInstructions')}</span>
    </button>
  );
};
