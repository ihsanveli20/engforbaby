'use client';

import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, Volume2, Sparkles, Moon, Sun } from 'lucide-react';
import { FlashcardItem } from '@/lib/types';
import { speakEnglish } from '@/lib/speech';

interface BabyFlashcardModalProps {
  isOpen: boolean;
  onClose: () => void;
  flashcards: FlashcardItem[];
  ageGroupName: string;
}

export const BabyFlashcardModal: React.FC<BabyFlashcardModalProps> = ({
  isOpen,
  onClose,
  flashcards,
  ageGroupName,
}) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [highContrastDark, setHighContrastDark] = useState<boolean>(true);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  const activeCard = flashcards[currentIndex] || flashcards[0];

  useEffect(() => {
    setCurrentIndex(0);
  }, [flashcards]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'ArrowRight' || e.key === ' ') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentIndex, flashcards.length]);

  if (!isOpen || !activeCard) return null;

  const handleNext = () => {
    if (currentIndex < flashcards.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setCurrentIndex(0); // loop
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    } else {
      setCurrentIndex(flashcards.length - 1);
    }
  };

  const handleSpeak = () => {
    const textToSpeak = activeCard.audioPrompt || activeCard.title;
    setIsPlaying(true);
    speakEnglish(textToSpeak, 0.82, () => setIsPlaying(false));
  };

  const isHighContrast = activeCard.contrastType === 'high-contrast';

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-between bg-black/95 backdrop-blur-md select-none animate-fadeIn">
      {/* Top bar */}
      <div className="flex items-center justify-between p-4 sm:p-6 text-white">
        <div className="flex items-center gap-3">
          <span className="px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase bg-white/20">
            {ageGroupName} • Bebek Görsel Modu
          </span>
          <span className="text-xs text-white/60">
            {currentIndex + 1} / {flashcards.length}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {isHighContrast && (
            <button
              onClick={() => setHighContrastDark(!highContrastDark)}
              className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all"
              title="Kontrast Renklerini Değiştir (Siyah/Beyaz)"
            >
              {highContrastDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
          )}

          <button
            onClick={onClose}
            className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all active:scale-95"
            title="Kapat"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Main Flashcard Center Area */}
      <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-8 max-w-xl mx-auto w-full">
        <div
          onClick={handleSpeak}
          className={`w-full aspect-square max-h-[68vh] rounded-3xl p-8 flex flex-col items-center justify-center text-center shadow-2xl transition-all duration-300 cursor-pointer active:scale-98 relative overflow-hidden border-4 ${
            isHighContrast
              ? highContrastDark
                ? 'bg-black text-white border-white'
                : 'bg-white text-black border-black'
              : 'bg-gradient-to-b from-rose-50 to-amber-50 text-slate-900 border-white'
          }`}
        >
          {/* Audio Ripple effect when playing */}
          {isPlaying && (
            <div className="absolute inset-0 border-8 border-rose-400 rounded-3xl animate-ping opacity-25 pointer-events-none" />
          )}

          {/* Emoji / Illustration */}
          <div
            className={`text-8xl sm:text-9xl mb-6 transition-transform duration-300 hover:scale-110 drop-shadow-md select-none ${
              isHighContrast && highContrastDark ? 'contrast-200' : ''
            }`}
          >
            {activeCard.emoji}
          </div>

          {/* Title */}
          <h2
            className={`text-3xl sm:text-4xl font-extrabold tracking-tight mb-2 ${
              isHighContrast
                ? highContrastDark
                  ? 'text-white'
                  : 'text-black'
                : 'text-slate-900'
            }`}
          >
            {activeCard.title}
          </h2>

          {/* Turkish Subtitle */}
          <p
            className={`text-base sm:text-lg font-semibold mb-4 ${
              isHighContrast
                ? highContrastDark
                  ? 'text-slate-300'
                  : 'text-slate-700'
                : 'text-rose-600'
            }`}
          >
            {activeCard.turkishTitle}
          </p>

          {/* Description if present */}
          {activeCard.description && (
            <p
              className={`text-xs sm:text-sm max-w-sm px-4 leading-relaxed ${
                isHighContrast
                  ? highContrastDark
                    ? 'text-slate-400'
                    : 'text-slate-600'
                  : 'text-slate-600'
              }`}
            >
              {activeCard.description}
            </p>
          )}

          {/* Audio Tap Reminder */}
          <div
            className={`mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all ${
              isPlaying
                ? 'bg-rose-500 text-white'
                : isHighContrast
                ? highContrastDark
                  ? 'bg-white/20 text-white'
                  : 'bg-black/10 text-black'
                : 'bg-rose-100 text-rose-800'
            }`}
          >
            <Volume2 className={`w-4 h-4 ${isPlaying ? 'animate-bounce' : ''}`} />
            <span>{isPlaying ? 'Söyleniyor...' : 'Sesi Dinlet'}</span>
          </div>
        </div>
      </div>

      {/* Bottom Controls */}
      <div className="p-4 sm:p-6 pb-8 flex flex-col items-center gap-4 max-w-lg mx-auto w-full">
        {/* Navigation Buttons */}
        <div className="flex items-center justify-between w-full gap-4">
          <button
            onClick={handlePrev}
            className="flex-1 py-3.5 px-5 rounded-2xl bg-white/10 hover:bg-white/20 active:bg-white/30 text-white font-bold flex items-center justify-center gap-2 transition-all"
          >
            <ChevronLeft className="w-5 h-5" />
            <span>Önceki</span>
          </button>

          <button
            onClick={handleSpeak}
            className="p-4 rounded-2xl bg-rose-500 hover:bg-rose-600 active:scale-95 text-white font-bold shadow-lg shadow-rose-500/30 transition-all flex items-center justify-center"
            title="Sesi Oynat"
          >
            <Volume2 className="w-6 h-6" />
          </button>

          <button
            onClick={handleNext}
            className="flex-1 py-3.5 px-5 rounded-2xl bg-white/10 hover:bg-white/20 active:bg-white/30 text-white font-bold flex items-center justify-center gap-2 transition-all"
          >
            <span>Sonraki</span>
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-white/50 text-center flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Kartın üzerine dokunarak İngilizce telaffuzu bebeğe dinletebilirsiniz.</span>
        </p>
      </div>
    </div>
  );
};
