import { NextRequest, NextResponse } from 'next/server';
import { getDailyPlans, addCustomDailyPlan } from '@/lib/db-service';
import { AgeGroupId } from '@/lib/types';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const ageGroup = searchParams.get('ageGroup') as AgeGroupId | null;

    const plans = await getDailyPlans(ageGroup || undefined);
    return NextResponse.json({ success: true, plans });
  } catch (error: any) {
    console.error('Error fetching plans:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch plans' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    if (!body.title || !body.ageGroupId || !body.dayNumber) {
      return NextResponse.json(
        { success: false, error: 'Missing required plan fields' },
        { status: 400 }
      );
    }

    const created = await addCustomDailyPlan(body);
    return NextResponse.json({ success: true, plan: created });
  } catch (error: any) {
    console.error('Error creating plan:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create plan' },
      { status: 500 }
    );
  }
}
