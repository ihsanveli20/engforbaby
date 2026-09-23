import { PrismaClient } from '@prisma/client';
import { INITIAL_PLANS } from '../lib/default-data';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding engforbaby curriculum into PostgreSQL...');

  for (const plan of INITIAL_PLANS) {
    // Delete existing if any to avoid duplication
    await prisma.dailyPlan.deleteMany({
      where: {
        ageGroupId: plan.ageGroupId,
        dayNumber: plan.dayNumber,
      },
    });

    await prisma.dailyPlan.create({
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
    console.log(`✅ Seeded: [${plan.ageGroupId}] Day ${plan.dayNumber} - ${plan.title}`);
  }

  console.log('🎉 Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
