export type AgeGroupId = '0-3' | '3-6' | '6-12' | '12-24';

export interface SentenceItem {
  id: string;
  english: string;
  turkish: string;
  phonetic: string;
  tenseTag?: string; // e.g. "Şimdiki Zaman", "Geçmiş Zaman"
  dialogueSpeaker?: string; // e.g. "A:", "B:"
  howToApply?: string; // Ebeveyn için pratik ipucu
  icon?: string;
}

export type SectionType = 
  | 'vocabulary' 
  | 'dialogue' 
  | 'routine' 
  | 'grammar_tenses' 
  | 'emotions' 
  | 'affirmation' 
  | 'action_guide' 
  | 'review';

export interface PlanSection {
  id: string;
  type: SectionType;
  title: string;
  subtitle?: string;
  icon?: string;
  badge?: string;
  howToApplyList?: string[];
  items: SentenceItem[];
}

export interface FlashcardItem {
  id: string;
  title: string;
  turkishTitle: string;
  emoji: string;
  contrastType: 'high-contrast' | 'colorful';
  description?: string;
  audioPrompt?: string;
  sentences?: string[];
  bgGradient?: string;
}

export interface DailyPlan {
  id: string;
  ageGroupId: AgeGroupId;
  dayNumber: number;
  title: string;
  subtitle: string;
  focus: string;
  principle?: string; // e.g. "TEKRAR - SABIR - SEVGİ = ÖĞRENME"
  affirmation: {
    english: string;
    turkish: string;
    phonetic: string;
  };
  sections: PlanSection[];
  flashcards: FlashcardItem[];
}

export interface AgeGroupMeta {
  id: AgeGroupId;
  name: string;
  rangeText: string;
  badgeText: string;
  colorTheme: {
    bg: string;
    text: string;
    border: string;
    gradient: string;
    badgeBg: string;
    activeTab: string;
  };
  iconName: string;
  description: string;
}

export interface AppProgress {
  completedPlans: string[]; // array of dailyPlan ids
  streak: number;
  lastActiveDate: string | null;
  savedFavorites: string[]; // sentence ids
}
