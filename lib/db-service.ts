import { prisma } from './prisma';
import { INITIAL_PLANS } from './default-data';
import { DailyPlan, AgeGroupId } from './types';

// In-memory runtime cache for custom added plans in case PostgreSQL is not yet connected
let memoryPlans: DailyPlan[] = [...INITIAL_PLANS];

export async function getDailyPlans(ageGroupId?: AgeGroupId): Promise<DailyPlan[]> {
  if (process.env.DATABASE_URL) {
    try {
      const dbPlans = await prisma.dailyPlan.findMany({
        where: ageGroupId ? { ageGroupId } : undefined,
        include: {
          sections: {
            include: {
              items: {
                orderBy: { order: 'asc' },
              },
            },
            orderBy: { order: 'asc' },
          },
          flashcards: {
            orderBy: { order: 'asc' },
          },
        },
        orderBy: { dayNumber: 'asc' },
      });

      if (dbPlans && dbPlans.length > 0) {
        return dbPlans.map((p) => ({
          id: p.id,
          ageGroupId: p.ageGroupId as AgeGroupId,
          dayNumber: p.dayNumber,
          title: p.title,
          subtitle: p.subtitle,
          focus: p.focus,
          principle: p.principle || undefined,
          affirmation: {
            english: p.affirmationAffEng,
            turkish: p.affirmationAffTr,
            phonetic: p.affirmationPhonetic || '',
          },
          sections: p.sections.map((s) => ({
            id: s.id,
            type: s.type as any,
            title: s.title,
            subtitle: s.subtitle || undefined,
            badge: s.badge || undefined,
            icon: s.icon || undefined,
            howToApplyList: s.howToApplyList,
            items: s.items.map((i) => ({
              id: i.id,
              english: i.english,
              turkish: i.turkish,
              phonetic: i.phonetic,
              tenseTag: i.tenseTag || undefined,
              dialogueSpeaker: i.dialogueSpeaker || undefined,
              howToApply: i.howToApply || undefined,
              icon: i.icon || undefined,
            })),
          })),
          flashcards: p.flashcards.map((f) => ({
            id: f.id,
            title: f.title,
            turkishTitle: f.turkishTitle,
            emoji: f.emoji,
            contrastType: f.contrastType as any,
            description: f.description || undefined,
            audioPrompt: f.audioPrompt || undefined,
          })),
        }));
      }
    } catch (error) {
      console.warn('PostgreSQL query failed, falling back to local memory dataset:', error);
    }
  }

  // Fallback to memory plans
  if (ageGroupId) {
    return memoryPlans.filter((p) => p.ageGroupId === ageGroupId);
  }
  return memoryPlans;
}

export async function getDailyPlanById(id: string): Promise<DailyPlan | null> {
  const allPlans = await getDailyPlans();
  return allPlans.find((p) => p.id === id) || null;
}

export async function addCustomDailyPlan(plan: DailyPlan): Promise<DailyPlan> {
  if (process.env.DATABASE_URL) {
    try {
      const created = await prisma.dailyPlan.create({
        data: {
          ageGroupId: plan.ageGroupId,
          dayNumber: plan.dayNumber,
          title: plan.title,
          subtitle: plan.subtitle,
          focus: plan.focus,
          principle: plan.principle,
          affirmationAffEng: plan.affirmation.english,
          affirmationAffTr: plan.affirmation.turkish,
          affirmationPhonetic: plan.affirmation.phonetic,
          sections: {
            create: plan.sections.map((sec, sIdx) => ({
              type: sec.type,
              title: sec.title,
              subtitle: sec.subtitle,
              badge: sec.badge,
              icon: sec.icon,
              order: sIdx,
              howToApplyList: sec.howToApplyList || [],
              items: {
                create: sec.items.map((item, iIdx) => ({
                  english: item.english,
                  turkish: item.turkish,
                  phonetic: item.phonetic,
                  tenseTag: item.tenseTag,
                  dialogueSpeaker: item.dialogueSpeaker,
                  howToApply: item.howToApply,
                  icon: item.icon,
                  order: iIdx,
                })),
              },
            })),
          },
          flashcards: {
            create: plan.flashcards.map((fc, fIdx) => ({
              title: fc.title,
              turkishTitle: fc.turkishTitle,
              emoji: fc.emoji,
              contrastType: fc.contrastType,
              description: fc.description,
              audioPrompt: fc.audioPrompt,
              order: fIdx,
            })),
          },
        },
      });
      return { ...plan, id: created.id };
    } catch (error) {
      console.warn('PostgreSQL write failed, storing in memory:', error);
    }
  }

  memoryPlans.push(plan);
  return plan;
}
