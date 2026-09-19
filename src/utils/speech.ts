export function speakInstruction(text: string, language: string = 'en') {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    console.warn('Speech synthesis not supported in this browser.');
    return;
  }

  try {
    window.speechSynthesis.cancel(); // Stop any previous speech
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.85; // Slightly slower, calm pace for elderly users
    utterance.pitch = 1.0;

    // Best-effort language tag
    if (language === 'as') {
      utterance.lang = 'as-IN';
    } else if (language === 'lus') {
      utterance.lang = 'en-IN'; // Mizo fallback if TTS engine lacks Mizo voice
    } else {
      utterance.lang = 'en-IN';
    }

    window.speechSynthesis.speak(utterance);
  } catch (err) {
    console.error('Speech synthesis error:', err);
  }
}
