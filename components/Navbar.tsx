'use client';

import React from 'react';
import { Sparkles, Flame, Plus, Layers, Heart, BookOpen, Volume2 } from 'lucide-react';
import { AgeGroupId } from '@/lib/types';
import { AGE_GROUPS } from '@/lib/default-data';

interface NavbarProps {
  selectedAgeGroup: AgeGroupId;
  onSelectAgeGroup: (id: AgeGroupId) => void;
  streak: number;
  onOpenFlashcards: () => void;
  onOpenRoutines: () => void;
  onOpenAddPlan: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  selectedAgeGroup,
  onSelectAgeGroup,
  streak,
  onOpenFlashcards,
  onOpenRoutines,
  onOpenAddPlan,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-rose-100 shadow-xs">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* Top brand & quick tools row */}
        <div className="flex items-center justify-between py-3">
          {/* Logo & title */}
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-rose-400 to-pink-500 flex items-center justify-center text-xl shadow-md shadow-rose-200">
              🍼
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-xl sm:text-2xl tracking-tight text-slate-900">
                  eng<span className="text-rose-500">for</span>baby
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-700">
                  PRO
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-slate-500 font-medium">
                Bebekler İçin Günlük Sesli İngilizce Rehberi
              </p>
            </div>
          </div>

          {/* Right Action buttons */}
          <div className="flex items-center gap-2">
            {/* Daily Streak */}
            <div
              title={`${streak} gündür düzenli tekrar yapıyorsunuz!`}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-amber-50 border border-amber-200/80 text-amber-800 text-xs font-bold shadow-xs select-none"
            >
              <Flame className="w-4 h-4 text-orange-500 fill-orange-500" />
              <span>{streak} Gün</span>
            </div>

            {/* Rutinler Button */}
            <button
              onClick={onOpenRoutines}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold border border-rose-200/60 transition-all active:scale-95"
            >
              <Heart className="w-4 h-4 fill-rose-400 text-rose-500" />
              <span>Rutinler</span>
            </button>

            {/* Baby Flashcard Button */}
            <button
              onClick={onOpenFlashcards}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-2xl bg-indigo-500 hover:bg-indigo-600 text-white text-xs font-bold shadow-sm shadow-indigo-200 transition-all active:scale-95"
              title="Bebek Görsel Modu (Yüksek Kontrast & Flashcard)"
            >
              <Layers className="w-4 h-4" />
              <span className="hidden xs:inline">Bebek Modu</span>
            </button>

            {/* Add New Plan Button */}
            <button
              onClick={onOpenAddPlan}
              className="p-1.5 sm:px-3 sm:py-1.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all active:scale-95 flex items-center gap-1"
              title="Yeni Gün Planı Ekle"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden md:inline">Yeni Gün</span>
            </button>
          </div>
        </div>

        {/* Age Groups horizontal tabs */}
        <div className="flex items-center gap-2 pb-2.5 overflow-x-auto scrollbar-none pt-1">
          {AGE_GROUPS.map((group) => {
            const isActive = selectedAgeGroup === group.id;
            return (
              <button
                key={group.id}
                onClick={() => onSelectAgeGroup(group.id)}
                className={`relative px-4 py-2 rounded-2xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all duration-200 flex items-center gap-2 active:scale-95 ${
                  isActive
                    ? `${group.colorTheme.activeTab} shadow-md`
                    : 'bg-white/80 hover:bg-slate-100/90 text-slate-700 border border-slate-200/70'
                }`}
              >
                <span className="text-base">
                  {group.id === '0-3' ? '👶' : group.id === '3-6' ? '🧸' : group.id === '6-12' ? '🍼' : '🌟'}
                </span>
                <span>{group.name}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-md font-medium ${
                    isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  {group.badgeText}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
