import { NextResponse } from 'next/server'
import { prisma, withPrismaConnection } from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    const { 
      userId, 
      stripeSubscriptionId, 
      status, 
      currentPeriodStart, 
      currentPeriodEnd 
    } = await request.json()

    console.log('Saving subscription to database for user:', userId);

    if (!userId || !stripeSubscriptionId || !status) {
      console.error('Missing required fields');
      return NextResponse.json(
        { error: 'User ID, Stripe Subscription ID, and status are required' },
        { status: 400 }
      )
    }

    // ユーザーが存在するか確認
    const user = await withPrismaConnection(async () => {
      return await prisma.user.findUnique({
        where: { id: userId }
      });
    });

    if (!user) {
      console.error('User not found:', userId);
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // 既存のサブスクリプションを確認
    const existingSubscription = await withPrismaConnection(async () => {
      return await prisma.subscription.findFirst({
        where: { user_id: userId }
      });
    });

    let subscription;
    if (existingSubscription) {
      // 既存のサブスクリプションを更新
      subscription = await withPrismaConnection(async () => {
        return await prisma.subscription.update({
          where: { id: existingSubscription.id },
          data: {
            stripe_subscription_id: stripeSubscriptionId,
            status,
            current_period_start: currentPeriodStart ? new Date(currentPeriodStart) : undefined,
            current_period_end: currentPeriodEnd ? new Date(currentPeriodEnd) : undefined,
          },
        });
      });
      console.log('Updated existing subscription:', subscription.id);
    } else {
      // 新しいサブスクリプションを作成
      subscription = await withPrismaConnection(async () => {
        return await prisma.subscription.create({
          data: {
            user_id: userId,
            stripe_subscription_id: stripeSubscriptionId,
            status,
            current_period_start: currentPeriodStart ? new Date(currentPeriodStart) : new Date(),
            current_period_end: currentPeriodEnd ? new Date(currentPeriodEnd) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // デフォルトで30日後
            cancel_at_period_end: false,
          },
        });
      });
      console.log('Created new subscription:', subscription.id);
    }

    return NextResponse.json(subscription)
  } catch (error) {
    console.error('Error saving subscription to database:', error)
    return NextResponse.json(
      { error: 'Failed to save subscription' },
      { status: 500 }
    )
  }
} 