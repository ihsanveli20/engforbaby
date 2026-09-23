'use client';

import React, { useState } from 'react';
import { Volume2, Snail, Check, Sparkles } from 'lucide-react';
import { SentenceItem } from '@/lib/types';
import { speakEnglish } from '@/lib/speech';

interface SentenceCardProps {
  item: SentenceItem;
  themeColor?: string;
  isCompleted?: boolean;
  onToggleComplete?: () => void;
}

export const SentenceCard: React.FC<SentenceCardProps> = ({
  item,
  themeColor = 'rose',
  isCompleted = false,
  onToggleComplete,
}) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playingSpeed, setPlayingSpeed] = useState<'normal' | 'slow' | null>(null);

  const handlePlay = (speed: 'normal' | 'slow') => {
    setIsPlaying(true);
    setPlayingSpeed(speed);
    const rate = speed === 'slow' ? 0.7 : 0.88;

    speakEnglish(item.english, rate, () => {
      setIsPlaying(false);
      setPlayingSpeed(null);
    });
  };

  return (
    <div
      className={`group relative overflow-hidden rounded-2xl border transition-all duration-200 bg-white/95 backdrop-blur-sm p-4 sm:p-5 shadow-sm hover:shadow-md ${
        isCompleted
          ? 'border-emerald-200 bg-emerald-50/20'
          : 'border-slate-200/90 hover:border-rose-200'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        {/* Left side: content */}
        <div className="flex-1 space-y-2">
          {/* Header tags: speaker, tense, icon */}
          <div className="flex flex-wrap items-center gap-2">
            {item.icon && (
              <span className="text-xl sm:text-2xl select-none" role="img" aria-label="icon">
                {item.icon}
              </span>
            )}
            {item.dialogueSpeaker && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200/60">
                {item.dialogueSpeaker}
              </span>
            )}
            {item.tenseTag && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200/60">
                ⏳ {item.tenseTag}
              </span>
            )}
          </div>

          {/* English phrase */}
          <div className="flex items-center gap-2">
            <h4 className="text-lg sm:text-xl font-bold tracking-tight text-slate-900 group-hover:text-rose-600 transition-colors">
              {item.english}
            </h4>
            {isPlaying && (
              <span className="flex h-2.5 w-2.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500"></span>
              </span>
            )}
          </div>

          {/* Turkish Meaning */}
          <p className="text-sm sm:text-base font-medium text-slate-700">
            {item.turkish}
          </p>

          {/* Pronunciation guide */}
          {item.phonetic && (
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100/90 text-xs sm:text-sm font-mono text-slate-600">
              <span className="text-slate-400 select-none">Okunuşu:</span>
              <span className="font-semibold text-slate-800">{item.phonetic}</span>
            </div>
          )}

          {/* Parent tip / how to apply */}
          {item.howToApply && (
            <p className="text-xs text-amber-700/90 bg-amber-50/60 border border-amber-100/80 rounded-lg p-2 flex items-start gap-1.5 mt-2">
              <Sparkles className="w-3.5 h-3.5 mt-0.5 text-amber-600 shrink-0" />
              <span>{item.howToApply}</span>
            </p>
          )}
        </div>

        {/* Right side: Audio & Complete actions */}
        <div className="flex flex-col items-end gap-2 shrink-0">
          <div className="flex items-center gap-1.5 bg-slate-50 p-1 rounded-xl border border-slate-200/80">
            {/* Normal Speed Audio */}
            <button
              onClick={() => handlePlay('normal')}
              aria-label="Dinle"
              title="Normal Hızda Dinle"
              className={`p-2 sm:px-3 sm:py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all active:scale-95 ${
                isPlaying && playingSpeed === 'normal'
                  ? 'bg-rose-500 text-white shadow-sm shadow-rose-200'
                  : 'text-slate-700 hover:bg-white hover:text-rose-600'
              }`}
            >
              <Volume2 className="w-4 h-4" />
              <span className="hidden sm:inline">Dinle</span>
            </button>

            {/* Slow Speed Audio */}
            <button
              onClick={() => handlePlay('slow')}
              aria-label="Yavaş Dinle"
              title="Yavaş Telaffuz"
              className={`p-2 sm:px-2.5 sm:py-2 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all active:scale-95 ${
                isPlaying && playingSpeed === 'slow'
                  ? 'bg-amber-500 text-white shadow-sm shadow-amber-200'
                  : 'text-slate-500 hover:bg-white hover:text-amber-600'
              }`}
            >
              <Snail className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Yavaş</span>
            </button>
          </div>

          {onToggleComplete && (
            <button
              onClick={onToggleComplete}
              title={isCompleted ? 'Tekrar edilmedi olarak işaretle' : 'Tekrar ettim'}
              className={`p-2 rounded-xl border transition-all active:scale-95 ${
                isCompleted
                  ? 'bg-emerald-500 text-white border-emerald-500 shadow-sm'
                  : 'text-slate-400 hover:text-emerald-600 hover:bg-emerald-50/50 border-transparent'
              }`}
            >
              <Check className="w-4 h-4 stroke-[2.5]" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
