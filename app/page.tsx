'use client';

import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/Navbar';
import { DailyPlanView } from '@/components/DailyPlanView';
import { BabyFlashcardModal } from '@/components/BabyFlashcardModal';
import { RoutineQuickAccess } from '@/components/RoutineQuickAccess';
import { AddPlanModal } from '@/components/AddPlanModal';
import { AGE_GROUPS, INITIAL_PLANS } from '@/lib/default-data';
import { AgeGroupId, DailyPlan } from '@/lib/types';
import { Sparkles, Heart, Baby, BookOpen, Volume2 } from 'lucide-react';

export default function Home() {
  const [selectedAgeGroup, setSelectedAgeGroup] = useState<AgeGroupId>('0-3');
  const [plans, setPlans] = useState<DailyPlan[]>(INITIAL_PLANS);
  const [selectedPlanId, setSelectedPlanId] = useState<string>('0-3-day-1');

  // Modals state
  const [isFlashcardOpen, setIsFlashcardOpen] = useState(false);
  const [isRoutinesOpen, setIsRoutinesOpen] = useState(false);
  const [isAddPlanOpen, setIsAddPlanOpen] = useState(false);

  // Progress & Streak state
  const [completedPlans, setCompletedPlans] = useState<string[]>([]);
  const [streak, setStreak] = useState<number>(3);
  const [showCelebration, setShowCelebration] = useState(false);

  // Load plans & local progress on mount
  useEffect(() => {
    // Load from localStorage for instant offline access
    try {
      const savedCompleted = localStorage.getItem('engforbaby_completed');
      if (savedCompleted) {
        setCompletedPlans(JSON.parse(savedCompleted));
      }
      const savedStreak = localStorage.getItem('engforbaby_streak');
      if (savedStreak) {
        setStreak(Number(savedStreak));
      }
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }

    // Try fetching from API (PostgreSQL or runtime cache)
    fetch('/api/plans')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.plans && data.plans.length > 0) {
          setPlans(data.plans);
        }
      })
      .catch((err) => console.warn('Could not fetch remote plans:', err));
  }, []);

  // Filter plans for the selected age group
  const ageGroupPlans = plans.filter((p) => p.ageGroupId === selectedAgeGroup);
  const currentAgeGroupMeta = AGE_GROUPS.find((g) => g.id === selectedAgeGroup) || AGE_GROUPS[0];

  // Whenever age group changes, update selected plan id if needed
  useEffect(() => {
    const available = plans.filter((p) => p.ageGroupId === selectedAgeGroup);
    if (available.length > 0) {
      // Pick first plan of this age group if current selectedPlanId doesn't belong
      if (!available.some((p) => p.id === selectedPlanId)) {
        setSelectedPlanId(available[0].id);
      }
    }
  }, [selectedAgeGroup, plans, selectedPlanId]);

  // Current active plan
  const activePlan = plans.find((p) => p.id === selectedPlanId) || ageGroupPlans[0] || plans[0];

  const handleTogglePlanCompleted = async (planId: string) => {
    const isNowDone = !completedPlans.includes(planId);
    let updated: string[];

    if (isNowDone) {
      updated = [...completedPlans, planId];
      const newStreak = streak + 1;
      setStreak(newStreak);
      setShowCelebration(true);
      setTimeout(() => setShowCelebration(false), 4000);
      try {
        localStorage.setItem('engforbaby_streak', String(newStreak));
      } catch (e) {}
    } else {
      updated = completedPlans.filter((id) => id !== planId);
    }

    setCompletedPlans(updated);
    try {
      localStorage.setItem('engforbaby_completed', JSON.stringify(updated));
    } catch (e) {}

    // Async sync with API / DB
    try {
      await fetch('/api/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dailyPlanId: planId, completed: isNowDone }),
      });
    } catch (err) {
      console.warn('API progress sync skipped:', err);
    }
  };

  const handlePlanAdded = (newPlan: DailyPlan) => {
    setPlans((prev) => [...prev, newPlan]);
    setSelectedAgeGroup(newPlan.ageGroupId);
    setSelectedPlanId(newPlan.id);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FFFBF8] selection:bg-rose-200">
      {/* Top Navbar */}
      <Navbar
        selectedAgeGroup={selectedAgeGroup}
        onSelectAgeGroup={(id) => setSelectedAgeGroup(id)}
        streak={streak}
        onOpenFlashcards={() => setIsFlashcardOpen(true)}
        onOpenRoutines={() => setIsRoutinesOpen(true)}
        onOpenAddPlan={() => setIsAddPlanOpen(true)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 pt-5">
        {/* Quick welcome quote for spouse */}
        <div className="mb-4 flex items-center justify-between text-xs text-slate-500 bg-white/60 border border-rose-100/60 rounded-2xl px-4 py-2.5">
          <div className="flex items-center gap-2">
            <span className="text-base">🌸</span>
            <span>
              <strong>Her gün 5-10 dakika:</strong> Bebeğinizle sevgiyle konuşun, dinletin ve tekrar edin.
            </span>
          </div>
          <button
            onClick={() => setIsRoutinesOpen(true)}
            className="text-rose-600 hover:text-rose-700 font-bold shrink-0 underline ml-2"
          >
            Rutin Cümleleri 🍼
          </button>
        </div>

        {/* Daily Plan View */}
        <DailyPlanView
          plans={ageGroupPlans}
          selectedPlanId={selectedPlanId}
          onSelectPlanId={(id) => setSelectedPlanId(id)}
          ageGroup={currentAgeGroupMeta}
          completedPlans={completedPlans}
          onTogglePlanCompleted={handleTogglePlanCompleted}
          onOpenFlashcards={() => setIsFlashcardOpen(true)}
        />
      </main>

      {/* Celebration Popup Toast */}
      {showCelebration && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 animate-bounce bg-white px-6 py-4 rounded-3xl shadow-2xl border-2 border-emerald-300 flex items-center gap-3">
          <span className="text-3xl">🎉</span>
          <div>
            <h4 className="font-extrabold text-sm text-slate-900">Harikasınız! Bugün Tamamlandı!</h4>
            <p className="text-xs text-emerald-700 font-semibold">
              Seriniz {streak} güne yükseldi! Bebeğinizle sevgi dolu bir gün daha.
            </p>
          </div>
        </div>
      )}

      {/* Baby Flashcard Fullscreen Modal */}
      <BabyFlashcardModal
        isOpen={isFlashcardOpen}
        onClose={() => setIsFlashcardOpen(false)}
        flashcards={activePlan?.flashcards || []}
        ageGroupName={currentAgeGroupMeta.name}
      />

      {/* Routine Quick Access Modal */}
      <RoutineQuickAccess
        isOpen={isRoutinesOpen}
        onClose={() => setIsRoutinesOpen(false)}
      />

      {/* Add New Plan Modal */}
      <AddPlanModal
        isOpen={isAddPlanOpen}
        onClose={() => setIsAddPlanOpen(false)}
        onPlanAdded={handlePlanAdded}
        initialAgeGroup={selectedAgeGroup}
      />
    </div>
  );
}
