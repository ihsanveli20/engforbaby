'use client';

import React, { useState } from 'react';
import {
  Sparkles,
  Volume2,
  CheckCircle2,
  Award,
  Layers,
  Heart,
  ChevronRight,
  BookOpen,
  Info,
  Calendar,
} from 'lucide-react';
import { DailyPlan, AgeGroupMeta } from '@/lib/types';
import { SentenceCard } from './SentenceCard';
import { speakEnglish } from '@/lib/speech';

interface DailyPlanViewProps {
  plans: DailyPlan[];
  selectedPlanId: string;
  onSelectPlanId: (id: string) => void;
  ageGroup: AgeGroupMeta;
  completedPlans: string[];
  onTogglePlanCompleted: (planId: string) => void;
  onOpenFlashcards: () => void;
}

export const DailyPlanView: React.FC<DailyPlanViewProps> = ({
  plans,
  selectedPlanId,
  onSelectPlanId,
  ageGroup,
  completedPlans,
  onTogglePlanCompleted,
  onOpenFlashcards,
}) => {
  const currentPlan = plans.find((p) => p.id === selectedPlanId) || plans[0];
  const [completedItems, setCompletedItems] = useState<Record<string, boolean>>({});
  const [isAffirmationPlaying, setIsAffirmationPlaying] = useState(false);

  if (!currentPlan) {
    return (
      <div className="py-16 text-center text-slate-500">
        <p className="text-base font-semibold">Bu yaş grubu için henüz plan bulunmuyor.</p>
        <p className="text-xs mt-1">Yukarıdaki "+ Yeni Gün" butonundan yeni bir plan ekleyebilirsiniz.</p>
      </div>
    );
  }

  const isPlanCompleted = completedPlans.includes(currentPlan.id);

  const toggleItemComplete = (itemId: string) => {
    setCompletedItems((prev) => ({
      ...prev,
      [itemId]: !prev[itemId],
    }));
  };

  const handlePlayAffirmation = () => {
    setIsAffirmationPlaying(true);
    speakEnglish(currentPlan.affirmation.english, 0.85, () => {
      setIsAffirmationPlaying(false);
    });
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Day Selector Pills */}
      <div className="flex items-center gap-2 overflow-x-auto scrollbar-none py-1">
        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400 pl-1 pr-2 uppercase tracking-wider shrink-0 select-none">
          <Calendar className="w-3.5 h-3.5" />
          <span>GÜNLER:</span>
        </div>
        {plans.map((p) => {
          const isSelected = p.id === currentPlan.id;
          const isDone = completedPlans.includes(p.id);
          return (
            <button
              key={p.id}
              onClick={() => onSelectPlanId(p.id)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-2xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all duration-200 active:scale-95 ${
                isSelected
                  ? 'bg-slate-900 text-white shadow-md'
                  : isDone
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-300'
                  : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200/80'
              }`}
            >
              {isDone && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />}
              <span>{p.dayNumber}. Gün</span>
              <span className="text-[11px] opacity-75 hidden sm:inline truncate max-w-[120px]">
                • {p.focus.split('&')[0]}
              </span>
            </button>
          );
        })}
      </div>

      {/* Hero Banner for Selected Day */}
      <div
        className={`relative overflow-hidden rounded-3xl p-5 sm:p-7 border ${ageGroup.colorTheme.border} ${ageGroup.colorTheme.bg} backdrop-blur-sm shadow-xs`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wide ${ageGroup.colorTheme.badgeBg}`}
              >
                {ageGroup.name} • {currentPlan.dayNumber}. GÜN
              </span>
              {currentPlan.principle && (
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/80 text-slate-700 border border-slate-200/60">
                  ✨ {currentPlan.principle}
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
              {currentPlan.title}
            </h1>
            <p className="text-sm sm:text-base font-medium text-slate-600 max-w-2xl leading-relaxed">
              {currentPlan.subtitle}
            </p>
          </div>

          {/* Quick launch flashcards button */}
          {currentPlan.flashcards && currentPlan.flashcards.length > 0 && (
            <button
              onClick={onOpenFlashcards}
              className="shrink-0 flex items-center gap-2 px-4 py-3 rounded-2xl bg-white/95 hover:bg-white text-slate-800 font-bold text-xs sm:text-sm shadow-sm hover:shadow border border-slate-200/80 transition-all active:scale-95"
            >
              <Layers className="w-4 h-4 text-indigo-500" />
              <span>Görsel Kartlar ({currentPlan.flashcards.length})</span>
            </button>
          )}
        </div>

        {/* Affirmation Card */}
        {currentPlan.affirmation && (
          <div className="mt-5 p-4 rounded-2xl bg-white/90 border border-rose-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-rose-100 flex items-center justify-center text-rose-600 shrink-0 text-lg">
                💖
              </div>
              <div>
                <span className="text-[11px] font-bold text-rose-500 uppercase tracking-wider block">
                  Günün Sevgi Dolu Olumlaması
                </span>
                <p className="text-base sm:text-lg font-extrabold text-slate-900">
                  &ldquo;{currentPlan.affirmation.english}&rdquo;
                </p>
                <p className="text-xs sm:text-sm text-slate-600 font-medium">
                  {currentPlan.affirmation.turkish}
                </p>
              </div>
            </div>

            <button
              onClick={handlePlayAffirmation}
              className={`shrink-0 px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all active:scale-95 ${
                isAffirmationPlaying
                  ? 'bg-rose-500 text-white shadow-sm'
                  : 'bg-rose-50 hover:bg-rose-100 text-rose-700'
              }`}
            >
              <Volume2 className="w-4 h-4" />
              <span>{isAffirmationPlaying ? 'Söyleniyor...' : 'Dinle'}</span>
            </button>
          </div>
        )}
      </div>

      {/* Sections & Sentences */}
      <div className="space-y-6">
        {currentPlan.sections.map((section, sIdx) => (
          <div
            key={section.id || sIdx}
            className="rounded-3xl border border-slate-200/80 bg-white/70 p-4 sm:p-6 space-y-4 shadow-xs"
          >
            {/* Section Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg sm:text-xl font-extrabold text-slate-900">
                    {section.title}
                  </h3>
                  {section.badge && (
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200">
                      {section.badge}
                    </span>
                  )}
                </div>
                {section.subtitle && (
                  <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
                    {section.subtitle}
                  </p>
                )}
              </div>
            </div>

            {/* How to Apply / Parent Guidance */}
            {section.howToApplyList && section.howToApplyList.length > 0 && (
              <div className="rounded-2xl bg-amber-50/70 border border-amber-200/70 p-3.5 sm:p-4">
                <span className="text-xs font-bold text-amber-900 flex items-center gap-1.5 mb-2">
                  <Info className="w-4 h-4 text-amber-600 shrink-0" />
                  NASIL UYGULANIR? (Ebeveyn İpuçları)
                </span>
                <ul className="space-y-1.5">
                  {section.howToApplyList.map((tip, tIdx) => (
                    <li
                      key={tIdx}
                      className="text-xs sm:text-sm text-amber-800 flex items-start gap-2"
                    >
                      <span className="text-amber-500 font-bold">•</span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Sentences Cards Grid */}
            <div className="grid grid-cols-1 gap-3">
              {section.items.map((item) => (
                <SentenceCard
                  key={item.id}
                  item={item}
                  themeColor="rose"
                  isCompleted={completedItems[item.id]}
                  onToggleComplete={() => toggleItemComplete(item.id)}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Completion Card */}
      <div className="sticky bottom-4 z-30 max-w-xl mx-auto">
        <div className="bg-white/95 backdrop-blur-md rounded-3xl p-4 sm:p-5 border border-slate-200 shadow-xl flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div
              className={`w-11 h-11 rounded-2xl flex items-center justify-center text-xl transition-all ${
                isPlanCompleted ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-400'
              }`}
            >
              {isPlanCompleted ? '🎉' : '⭐'}
            </div>
            <div>
              <h4 className="font-extrabold text-sm sm:text-base text-slate-900">
                {isPlanCompleted ? 'Bugün Tamamlandı!' : 'Günün Görevini Bitir'}
              </h4>
              <p className="text-xs text-slate-500">
                {isPlanCompleted
                  ? 'Tebrikler, bebeğinizle harika bir gün geçirdiniz!'
                  : 'Tüm kelimeleri tekrar edip serinizi artırın'}
              </p>
            </div>
          </div>

          <button
            onClick={() => onTogglePlanCompleted(currentPlan.id)}
            className={`px-5 py-3 rounded-2xl font-bold text-xs sm:text-sm transition-all duration-200 active:scale-95 flex items-center gap-2 shadow-md ${
              isPlanCompleted
                ? 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-emerald-200'
                : 'bg-rose-500 hover:bg-rose-600 text-white shadow-rose-200'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{isPlanCompleted ? 'Tamamlandı ✅' : 'Günü Tamamla'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
