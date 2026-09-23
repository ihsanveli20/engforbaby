'use client';

import React, { useState } from 'react';
import { X, Plus, Trash2, Sparkles, BookOpen } from 'lucide-react';
import { AgeGroupId, DailyPlan } from '@/lib/types';
import { AGE_GROUPS } from '@/lib/default-data';

interface AddPlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPlanAdded: (newPlan: DailyPlan) => void;
  initialAgeGroup?: AgeGroupId;
}

export const AddPlanModal: React.FC<AddPlanModalProps> = ({
  isOpen,
  onClose,
  onPlanAdded,
  initialAgeGroup = '0-3',
}) => {
  const [ageGroupId, setAgeGroupId] = useState<AgeGroupId>(initialAgeGroup);
  const [dayNumber, setDayNumber] = useState<number>(2);
  const [title, setTitle] = useState<string>('');
  const [subtitle, setSubtitle] = useState<string>('');
  const [focus, setFocus] = useState<string>('');
  const [principle, setPrinciple] = useState<string>('Göz teması ve sevgi dolu ses tonuyla tekrar edin.');
  const [affirmationEng, setAffirmationEng] = useState<string>('You are deeply loved, my sweet baby.');
  const [affirmationTr, setAffirmationTr] = useState<string>('Sen derinden seviliyorsun, tatlı bebeğim.');

  const [sectionTitle, setSectionTitle] = useState<string>('Günün Kelimeleri & Cümleleri');
  const [sentences, setSentences] = useState<
    Array<{ english: string; turkish: string; phonetic: string; icon: string }>
  >([
    { english: 'Hello baby!', turkish: 'Merhaba bebek!', phonetic: 'Helo beybi!', icon: '👋' },
  ]);

  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleAddSentence = () => {
    setSentences((prev) => [
      ...prev,
      { english: '', turkish: '', phonetic: '', icon: '✨' },
    ]);
  };

  const handleRemoveSentence = (index: number) => {
    if (sentences.length <= 1) return;
    setSentences((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSentenceChange = (
    index: number,
    field: 'english' | 'turkish' | 'phonetic' | 'icon',
    value: string
  ) => {
    setSentences((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      alert('Lütfen bir gün başlığı girin.');
      return;
    }

    setIsSubmitting(true);

    const newPlan: DailyPlan = {
      id: `${ageGroupId}-day-${dayNumber}-${Date.now()}`,
      ageGroupId,
      dayNumber: Number(dayNumber),
      title: title.trim(),
      subtitle: subtitle.trim() || `${ageGroupId} Ay Programı`,
      focus: focus.trim() || title.trim(),
      principle: principle.trim(),
      affirmation: {
        english: affirmationEng.trim(),
        turkish: affirmationTr.trim(),
        phonetic: '',
      },
      sections: [
        {
          id: `sec-${Date.now()}`,
          type: 'vocabulary',
          title: sectionTitle.trim() || 'Günün Cümleleri',
          items: sentences
            .filter((s) => s.english.trim())
            .map((s, idx) => ({
              id: `item-${Date.now()}-${idx}`,
              english: s.english.trim(),
              turkish: s.turkish.trim(),
              phonetic: s.phonetic.trim(),
              icon: s.icon.trim() || '✨',
            })),
        },
      ],
      flashcards: [
        {
          id: `fc-${Date.now()}`,
          title: focus.trim() || title.trim(),
          turkishTitle: title.trim(),
          emoji: sentences[0]?.icon || '🌟',
          contrastType: ageGroupId === '0-3' ? 'high-contrast' : 'colorful',
          description: affirmationTr.trim(),
          audioPrompt: sentences[0]?.english || 'You are doing great!',
        },
      ],
    };

    try {
      const res = await fetch('/api/plans', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPlan),
      });
      const data = await res.json();
      if (data.success && data.plan) {
        onPlanAdded(data.plan);
      } else {
        onPlanAdded(newPlan);
      }
      onClose();
    } catch (err) {
      console.warn('API error, using local state:', err);
      onPlanAdded(newPlan);
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-rose-100 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-slate-100 bg-rose-50/40">
          <div className="flex items-center gap-2">
            <span className="text-2xl">📝</span>
            <div>
              <h2 className="text-xl font-extrabold text-slate-900">Yeni Günlük Plan Ekle</h2>
              <p className="text-xs text-slate-500">PDF veya notlarınızdan yeni bir gün ve kelimeler oluşturun</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-white hover:bg-slate-100 text-slate-500 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 text-sm">
          {/* Age Group & Day Number */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Yaş Grubu</label>
              <select
                value={ageGroupId}
                onChange={(e) => setAgeGroupId(e.target.value as AgeGroupId)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 font-semibold focus:outline-rose-500"
              >
                {AGE_GROUPS.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.name} ({g.rangeText})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Gün Numarası</label>
              <input
                type="number"
                min={1}
                max={365}
                value={dayNumber}
                onChange={(e) => setDayNumber(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 font-semibold focus:outline-rose-500"
                required
              />
            </div>
          </div>

          {/* Title & Subtitle */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Plan Başlığı</label>
            <input
              type="text"
              placeholder="Örn: 2. Gün: Banyo Zamanı & Su Damlaları"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 focus:outline-rose-500"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Odak Konusu (Focus)</label>
              <input
                type="text"
                placeholder="Örn: Bath Time & Duck 🦆"
                value={focus}
                onChange={(e) => setFocus(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 focus:outline-rose-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Alt Başlık</label>
              <input
                type="text"
                placeholder="Örn: Suyla temas ederken konuşma cümleleri"
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 focus:outline-rose-500"
              />
            </div>
          </div>

          {/* Affirmation */}
          <div className="p-3.5 rounded-2xl bg-rose-50/50 border border-rose-100 space-y-2">
            <span className="text-xs font-bold text-rose-800 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              Günün Sevgi Dolu Olumlaması
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <input
                type="text"
                placeholder="İngilizce (You are deeply loved...)"
                value={affirmationEng}
                onChange={(e) => setAffirmationEng(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-rose-200 bg-white text-xs font-medium text-slate-800"
              />
              <input
                type="text"
                placeholder="Türkçe (Sen derinden seviliyorsun...)"
                value={affirmationTr}
                onChange={(e) => setAffirmationTr(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-rose-200 bg-white text-xs font-medium text-slate-800"
              />
            </div>
          </div>

          {/* Sentences List */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-rose-500" />
                Cümleler & Kelimeler ({sentences.length})
              </label>
              <button
                type="button"
                onClick={handleAddSentence}
                className="text-xs font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1 px-2.5 py-1 rounded-lg bg-rose-50 hover:bg-rose-100"
              >
                <Plus className="w-3.5 h-3.5" />
                Cümle Ekle
              </button>
            </div>

            {sentences.map((sentence, index) => (
              <div
                key={index}
                className="p-3 rounded-2xl border border-slate-200 bg-slate-50/70 space-y-2 relative"
              >
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span className="font-bold">#{index + 1}. Cümle</span>
                  {sentences.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveSentence(index)}
                      className="text-red-500 hover:text-red-700 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                  <div className="sm:col-span-1">
                    <input
                      type="text"
                      placeholder="İkon (örn: 🦆)"
                      value={sentence.icon}
                      onChange={(e) => handleSentenceChange(index, 'icon', e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-xs"
                    />
                  </div>
                  <div className="sm:col-span-3">
                    <input
                      type="text"
                      placeholder="İngilizce cümle (e.g. Look at the water)"
                      value={sentence.english}
                      onChange={(e) => handleSentenceChange(index, 'english', e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-semibold"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="Türkçe karşılığı (örn: Suya bak)"
                    value={sentence.turkish}
                    onChange={(e) => handleSentenceChange(index, 'turkish', e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-xs"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Okunuşu (örn: Luk et dı votır)"
                    value={sentence.phonetic}
                    onChange={(e) => handleSentenceChange(index, 'phonetic', e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-mono"
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Submit */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold"
            >
              Vazgeç
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-600 active:scale-95 text-white font-bold shadow-md shadow-rose-200 transition-all flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>{isSubmitting ? 'Kaydediliyor...' : 'Planı Kaydet'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
