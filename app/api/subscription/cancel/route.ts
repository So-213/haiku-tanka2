import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const { userId } = await request.json();
    console.log('Cancelling subscription for user ID:', userId);

    if (!userId) {
      console.log('No userId provided');
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // ユーザーのサブスクリプションを検索
    const subscription = await prisma.subscription.findFirst({
      where: {
        user_id: userId,
      },
    });

    if (!subscription) {
      console.log(`No subscription found for user ${userId}`);
      return NextResponse.json(
        { error: 'Subscription not found' },
        { status: 404 }
      );
    }

    // サブスクリプションを更新（解約予定に設定）
    const updatedSubscription = await prisma.subscription.update({
      where: {
        id: subscription.id,
      },
      data: {
        cancel_at_period_end: true,
      },
    });

    console.log('Subscription cancellation scheduled:', {
      id: updatedSubscription.id,
      user_id: updatedSubscription.user_id,
      current_period_end: updatedSubscription.current_period_end
    });

    return NextResponse.json(updatedSubscription);
  } catch (error) {
    console.error('Error cancelling subscription:', error);
    return NextResponse.json(
      { error: 'Failed to cancel subscription' },
      { status: 500 }
    );
  }
} 