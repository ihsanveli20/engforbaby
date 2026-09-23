'use client';

import React, { useState } from 'react';
import { Heart, Moon, Baby, Droplets, Sparkles, X, Volume2 } from 'lucide-react';
import { SentenceCard } from './SentenceCard';
import { SentenceItem } from '@/lib/types';

interface RoutineQuickAccessProps {
  isOpen: boolean;
  onClose: () => void;
}

const ROUTINE_CATEGORIES = [
  {
    id: 'feeding',
    title: 'Emzirme & Beslenme',
    icon: '🍼',
    description: 'Süt, biberon ve emzirme anlarında söylenecek sevgi dolu cümleler',
    items: [
      {
        id: 'r-feed-1',
        english: "It's time for milk, my little one.",
        turkish: 'Süt zamanı, küçüğüm.',
        phonetic: 'İts taym for miılk, may litıl van.',
        icon: '🍼',
        howToApply: 'Beslenmeye başlarken göz teması kurup söyleyin.',
      },
      {
        id: 'r-feed-2',
        english: "Come, let's have some milk together.",
        turkish: 'Gel, birlikte biraz süt içelim.',
        phonetic: 'Kam, lets hev sam miılk tıgedır.',
        icon: '🥛',
      },
      {
        id: 'r-feed-3',
        english: 'Drink slowly, my love, and enjoy your milk.',
        turkish: 'Yavaşça iç aşkım, sütünün tadını çıkar.',
        phonetic: 'Drink slovli, may lav, end incoy yor miılk.',
        icon: '❤️',
      },
      {
        id: 'r-feed-4',
        english: "You're doing great, sweetheart.",
        turkish: 'Harika yapıyorsun, canım.',
        phonetic: 'Yur duing greyt, sviithart.',
        icon: '⭐',
      },
      {
        id: 'r-feed-5',
        english: 'Close your eyes and relax while you nurse.',
        turkish: 'Gözlerini kapat ve emerken rahatla.',
        phonetic: 'Kloz yor ayz end rileks vayl yu nörs.',
        icon: '🌙',
      },
      {
        id: 'r-feed-6',
        english: 'Milk! Milk! Milk! (Bebek Süt İşareti)',
        turkish: 'Süt! Süt! Süt! (Yumruğunu açıp kapatarak)',
        phonetic: 'Miılk! Miılk! Miılk!',
        icon: '✊✋',
        howToApply: 'Bebeğe sütü uzatırken elinizi yumruk yapıp açın (Baby sign).',
      },
    ],
  },
  {
    id: 'bedtime',
    title: 'Uyku & Beşik Rutini',
    icon: '🛏️',
    description: 'Beşiğe yatırırken, ninni ve sallama anlarında güven veren cümleler',
    items: [
      {
        id: 'r-bed-1',
        english: 'Babies sleep in the crib.',
        turkish: 'Bebekler beşikte uyur.',
        phonetic: 'Beybiz sliip in dı krib.',
        icon: '🛏️',
      },
      {
        id: 'r-bed-2',
        english: "I'm rocking you now.",
        turkish: 'Seni sallıyorum şimdi.',
        phonetic: 'Aym raking yu nav.',
        icon: '🎶',
        howToApply: 'Kollarınızda veya beşikte hafifçe sallarken melodik fısıldayın.',
      },
      {
        id: 'r-bed-3',
        english: 'Shall I put you in your crib?',
        turkish: 'Seni beşiğine koyayım mı?',
        phonetic: 'Şel ay put yu in yor krib?',
        icon: '🌙',
      },
      {
        id: 'r-bed-4',
        english: 'Babies love sleeping in the crib, dear.',
        turkish: 'Bebekler beşikte uyumayı sever canım.',
        phonetic: 'Beybiz lav sliiping in dı krib diır.',
        icon: '💤',
      },
      {
        id: 'r-bed-5',
        english: 'Sweet dreams, my angel. Sleep tight.',
        turkish: 'Tatlı rüyalar meleğim. Mışıl mışıl uyu.',
        phonetic: 'Sviit driimz, may eyncıl. Sliip tayt.',
        icon: '✨',
      },
    ],
  },
  {
    id: 'dressing',
    title: 'Giydirme & Pijama',
    icon: '👕',
    description: 'Zıbın, pijama ve çorap giydirirken vücut farkındalığı cümleleri',
    items: [
      {
        id: 'r-dress-1',
        english: "Let's put on your soft pajamas, my little angel.",
        turkish: 'Haydi yumuşak pijamalarını giyelim, küçük meleğim.',
        phonetic: 'Lets put on yor soft picamaz, may litıl eyincıl.',
        icon: '🧸',
      },
      {
        id: 'r-dress-2',
        english: 'Time to slip your tiny arms into this cute onesie.',
        turkish: 'Minik kollarını bu tatlı zıbına sokma zamanı.',
        phonetic: 'Taym tu slip yor tayni armz intu dis kyuut vanzi.',
        icon: '👕',
        howToApply: 'Kolunu tutarken ten teması kurup neşeyle söyleyin.',
      },
      {
        id: 'r-dress-3',
        english: 'Lift your legs gently, sweetheart, so we can put on your cozy socks.',
        turkish: 'Bacaklarını nazikçe kaldır canım, sıcak çoraplarını giyebiliriz.',
        phonetic: 'Lift yor legz centli, sviithart...',
        icon: '🧦',
      },
      {
        id: 'r-dress-4',
        english: 'Look how adorable you are in your little outfit!',
        turkish: 'Küçük kıyafetinde ne kadar sevimlisin!',
        phonetic: 'Luk hav edorıbıl yu ar in yor litıl avtfit!',
        icon: '🥰',
      },
    ],
  },
  {
    id: 'affirmations',
    title: 'Sevgi & Olumlamalar',
    icon: '💖',
    description: 'Bebeğinizin bilinçaltına sevgi ve güven aşılayan şefkat sözleri',
    items: [
      {
        id: 'r-aff-1',
        english: 'You are deeply loved, my sweet baby.',
        turkish: 'Sen derinden seviliyorsun, tatlı bebeğim.',
        phonetic: 'Yu ar dipli lavd, may sviit beybi.',
        icon: '🥰',
      },
      {
        id: 'r-aff-2',
        english: 'Mommy loves you very much!',
        turkish: 'Anneciğin seni çok seviyor!',
        phonetic: 'Mami lavs yu veri maç!',
        icon: '👩‍🍼',
      },
      {
        id: 'r-aff-3',
        english: "Daddy's here to give you hugs and kisses!",
        turkish: 'Babacığın seni kucaklamak ve öpmek için burada!',
        phonetic: 'Dedi iz hir tu giv yu hags end kisiz!',
        icon: '👨‍🍼',
      },
      {
        id: 'r-aff-4',
        english: 'You make me smile every day!',
        turkish: 'Her gün beni güldürüyorsun!',
        phonetic: 'Yu meyk mi smayl evri dey!',
        icon: '🌟',
      },
      {
        id: 'r-aff-5',
        english: 'When you laugh, it fills my heart with joy!',
        turkish: 'Güldüğünde, kalbim sevinçle doluyor.',
        phonetic: 'Ven yu laf, it filz may hart vit coy!',
        icon: '❤️',
      },
      {
        id: 'r-aff-6',
        english: "Even when you cry, I'll always be here to comfort you.",
        turkish: 'Ağladığında bile seni rahatlatmak için buradayım.',
        phonetic: 'İvın ven yu kray, ayl olveys bi hir tu kamfırt yu.',
        icon: '🤗',
      },
    ],
  },
];

export const RoutineQuickAccess: React.FC<RoutineQuickAccessProps> = ({ isOpen, onClose }) => {
  const [selectedCat, setSelectedCat] = useState<string>('feeding');

  if (!isOpen) return null;

  const currentCategory = ROUTINE_CATEGORIES.find((c) => c.id === selectedCat) || ROUTINE_CATEGORIES[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-rose-100 overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-slate-100 bg-rose-50/50">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">🍼</span>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                Günlük Rutinler & Cümle Rehberi
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Bebeğinizle günlük anlarda konuşabileceğiniz en sık kullanılan İngilizce kalıplar
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-white hover:bg-slate-100 text-slate-500 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 p-3 sm:p-4 border-b border-slate-100 overflow-x-auto scrollbar-none bg-slate-50/60">
          {ROUTINE_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCat(cat.id)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
                selectedCat === cat.id
                  ? 'bg-rose-500 text-white shadow-sm shadow-rose-200'
                  : 'bg-white text-slate-700 hover:bg-rose-50/60 border border-slate-200/80'
              }`}
            >
              <span>{cat.icon}</span>
              <span>{cat.title}</span>
            </button>
          ))}
        </div>

        {/* Sentences List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3.5">
          <div className="bg-rose-50/60 border border-rose-100 rounded-2xl p-3.5 mb-2">
            <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
              <span>{currentCategory.icon}</span>
              <span>{currentCategory.title}</span>
            </h3>
            <p className="text-xs text-slate-600 mt-0.5">{currentCategory.description}</p>
          </div>

          {currentCategory.items.map((item) => (
            <SentenceCard key={item.id} item={item} themeColor="rose" />
          ))}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between text-xs text-slate-500">
          <span>💡 Ses butonuna basarak doğru telaffuzu dinleyebilirsiniz.</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-900 text-white font-semibold hover:bg-slate-800"
          >
            Kapat
          </button>
        </div>
      </div>
    </div>
  );
};
