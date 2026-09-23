import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  if (!process.env.DATABASE_URL) {
    return NextResponse.json({ success: true, completedPlanIds: [] });
  }

  try {
    const records = await prisma.planProgress.findMany({
      where: { userId: 'default_user' },
      select: { dailyPlanId: true },
    });
    return NextResponse.json({
      success: true,
      completedPlanIds: records.map((r) => r.dailyPlanId),
    });
  } catch (error) {
    return NextResponse.json({ success: true, completedPlanIds: [] });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { dailyPlanId, completed } = await request.json();
    if (!dailyPlanId) {
      return NextResponse.json({ success: false, error: 'dailyPlanId is required' }, { status: 400 });
    }

    if (process.env.DATABASE_URL) {
      try {
        if (completed) {
          await prisma.planProgress.upsert({
            where: {
              dailyPlanId_userId: {
                dailyPlanId,
                userId: 'default_user',
              },
            },
            create: { dailyPlanId, userId: 'default_user' },
            update: { completedAt: new Date() },
          });
        } else {
          await prisma.planProgress.deleteMany({
            where: { dailyPlanId, userId: 'default_user' },
          });
        }
      } catch (err) {
        console.warn('DB progress update skipped:', err);
      }
    }

    return NextResponse.json({ success: true, dailyPlanId, completed });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
