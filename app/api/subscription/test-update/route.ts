import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    console.log('Testing subscription update by setting past end date');

    // 現在のサブスクリプションを取得
    const subscriptions = await prisma.subscription.findMany();
    console.log(`Found ${subscriptions.length} subscriptions`);

    if (subscriptions.length === 0) {
      return NextResponse.json({ message: 'No subscriptions found' });
    }

    // 最初のサブスクリプションの期間を過去の日付に変更
    const subscription = subscriptions[0];
    const pastDate = new Date(Date.now() - 24 * 60 * 60 * 1000); // 1日前

    const updatedSubscription = await prisma.subscription.update({
      where: { id: subscription.id },
      data: {
        current_period_end: pastDate,
        cancel_at_period_end: true,
        status: 'active'
      }
    });

    console.log('Updated subscription with past end date:', {
      id: updatedSubscription.id,
      current_period_end: updatedSubscription.current_period_end,
      cancel_at_period_end: updatedSubscription.cancel_at_period_end
    });

    return NextResponse.json({
      message: 'Subscription updated with past end date',
      subscription: updatedSubscription
    });
  } catch (error) {
    console.error('Error updating subscription:', error);
    return NextResponse.json(
      { error: 'Failed to update subscription' },
      { status: 500 }
    );
  }
} 