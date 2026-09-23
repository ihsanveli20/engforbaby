// Web Speech API helper for crystal-clear English pronunciation

let activeUtterance: SpeechSynthesisUtterance | null = null;

export const speakEnglish = (
  text: string,
  rate: number = 0.88, // slightly relaxed for baby and parent clarity
  onEnd?: () => void
): boolean => {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    console.warn('Speech synthesis not supported on this browser');
    return false;
  }

  // Cancel any running utterance
  window.speechSynthesis.cancel();

  // Clean text from emojis, bracketed notes, etc.
  const cleanText = text
    .replace(/\([^)]*\)/g, '') // remove (brackets)
    .replace(/[🐝💧🍼🛏️👃🔴👀🤲🧺🧸👕🧦🥰✨❤️⭐🌙🚰💖💦🗓️☀️😊👩‍🍼👨‍🍼🌟🤗🎉🪽🍯👋🐞🍃🧷🌈⏰🥣💤🎶✊✋❓]/gu, '')
    .trim();

  if (!cleanText) return false;

  const utterance = new SpeechSynthesisUtterance(cleanText);
  utterance.lang = 'en-US';
  utterance.rate = rate;
  utterance.pitch = 1.05; // slightly warm pitch suitable for baby communication

  // Try to pick a natural English voice if available
  const voices = window.speechSynthesis.getVoices();
  const englishVoice = voices.find(
    (v) =>
      (v.lang.startsWith('en-US') || v.lang.startsWith('en-GB') || v.lang.startsWith('en')) &&
      (v.name.includes('Natural') ||
        v.name.includes('Samantha') ||
        v.name.includes('Google') ||
        v.name.includes('Daniel') ||
        v.name.includes('Serena'))
  ) || voices.find((v) => v.lang.startsWith('en'));

  if (englishVoice) {
    utterance.voice = englishVoice;
  }

  utterance.onend = () => {
    activeUtterance = null;
    if (onEnd) onEnd();
  };

  utterance.onerror = (e) => {
    console.warn('Speech synthesis error:', e);
    activeUtterance = null;
    if (onEnd) onEnd();
  };

  activeUtterance = utterance;
  window.speechSynthesis.speak(utterance);
  return true;
};

export const stopSpeech = () => {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    activeUtterance = null;
  }
};
