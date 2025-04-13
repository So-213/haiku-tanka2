import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const { userId } = await request.json();

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // 既存のサブスクリプションをチェック
    const existingSubscription = await prisma.subscription.findFirst({
      where: {
        user_id: userId,
      },
    });

    if (existingSubscription) {
      return NextResponse.json(
        { error: 'Subscription already exists' },
        { status: 400 }
      );
    }

    // 新しいサブスクリプションを作成
    const subscription = await prisma.subscription.create({
      data: {
        user_id: userId,
        stripe_subscription_id: 'dummy_subscription_id', // 実際のStripe実装時には本物のIDを使用
        status: 'active',
        current_period_start: new Date(),
        current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30日後
        cancel_at_period_end: false,
      },
    });

    return NextResponse.json(subscription);
  } catch (error) {
    console.error('Error creating subscription:', error);
    return NextResponse.json(
      { error: 'Failed to create subscription' },
      { status: 500 }
    );
  }
} 