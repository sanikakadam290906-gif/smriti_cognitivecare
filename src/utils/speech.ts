import { Language } from '../types';

let cachedVoices: SpeechSynthesisVoice[] = [];

// Initialize voices and listen for async loading in browsers
if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  const loadVoices = () => {
    try {
      cachedVoices = window.speechSynthesis.getVoices();
    } catch {
      cachedVoices = [];
    }
  };

  loadVoices();
  if (window.speechSynthesis.onvoiceschanged !== undefined) {
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }
}

/**
 * Returns currently loaded voices.
 */
export function getAvailableVoices(): SpeechSynthesisVoice[] {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    return [];
  }
  if (cachedVoices.length === 0) {
    cachedVoices = window.speechSynthesis.getVoices();
  }
  return cachedVoices;
}

/**
 * Finds the closest native voice matching the requested language code.
 * Returns null if no appropriate voice exists for regional languages.
 */
export function getClosestVoice(language: Language): SpeechSynthesisVoice | null {
  const voices = getAvailableVoices();
  if (!voices || voices.length === 0) return null;

  if (language === 'en') {
    // English priority: Indian English -> British / US English -> Any English
    const enIn = voices.find(
      (v) => v.lang.toLowerCase() === 'en-in' || v.name.toLowerCase().includes('india')
    );
    if (enIn) return enIn;

    const anyEn = voices.find((v) => v.lang.toLowerCase().startsWith('en'));
    return anyEn || voices[0] || null;
  }

  if (language === 'as') {
    // Strict match for Assamese: never use English voice as substitute
    const assamese = voices.find((v) => {
      const code = v.lang.toLowerCase();
      const name = v.name.toLowerCase();
      return (
        code.startsWith('as') ||
        code === 'as-in' ||
        name.includes('assamese') ||
        name.includes('as-in')
      );
    });
    return assamese || null;
  }

  if (language === 'lus') {
    // Strict match for Mizo (lus / mzo): never use English voice as substitute
    const mizo = voices.find((v) => {
      const code = v.lang.toLowerCase();
      const name = v.name.toLowerCase();
      return (
        code.startsWith('lus') ||
        code.startsWith('mzo') ||
        name.includes('mizo') ||
        name.includes('lushai')
      );
    });
    return mizo || null;
  }

  return null;
}

/**
 * Checks whether the browser has a native speech synthesis voice for this language.
 */
export function isLanguageVoiceSupported(language: Language): boolean {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    return false;
  }

  // English is supported on all standard speech engines
  if (language === 'en') return true;

  return getClosestVoice(language) !== null;
}

/**
 * Stops any ongoing browser speech.
 */
export function stopSpeech(): void {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    try {
      window.speechSynthesis.cancel();
    } catch (err) {
      console.warn('Speech cancellation error:', err);
    }
  }
}

export interface SpeakOptions {
  onStart?: () => void;
  onEnd?: () => void;
  onError?: (err: any) => void;
  onVoiceUnavailable?: () => void;
}

/**
 * Speaks an instruction text using the active language voice.
 * If regional voice is not supported, does not speak with an English voice;
 * instead informs caller via onVoiceUnavailable and returns false.
 */
export function speakInstruction(
  text: string,
  language: Language = 'en',
  options?: SpeakOptions
): boolean {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    options?.onVoiceUnavailable?.();
    return false;
  }

  try {
    // Stop ongoing audio first to prevent overlapping voices
    stopSpeech();

    const voice = getClosestVoice(language);

    // If language is Assamese or Mizo and no regional voice is installed:
    // DO NOT speak with an English voice!
    if ((language === 'as' || language === 'lus') && !voice) {
      options?.onVoiceUnavailable?.();
      return false;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.85; // Calm, respectful pace for elderly users
    utterance.pitch = 1.0;

    if (voice) {
      utterance.voice = voice;
      utterance.lang = voice.lang;
    } else if (language === 'en') {
      utterance.lang = 'en-IN';
    }

    utterance.onstart = () => {
      options?.onStart?.();
    };

    utterance.onend = () => {
      options?.onEnd?.();
    };

    utterance.onerror = (err) => {
      console.warn('Utterance playback error:', err);
      options?.onError?.(err);
    };

    window.speechSynthesis.speak(utterance);
    return true;
  } catch (err) {
    console.error('Speech synthesis execution failed:', err);
    options?.onError?.(err);
    return false;
  }
}
