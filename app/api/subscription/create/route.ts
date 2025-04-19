import { NextResponse } from 'next/server';
import { prisma, withPrismaConnection } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const { userId } = await request.json();
    console.log('Creating subscription for user ID:', userId);

    if (!userId) {
      console.log('No userId provided');
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // まずユーザーが存在するか確認
    const user = await withPrismaConnection(async () => {
      return await prisma.user.findUnique({
        where: { id: userId }
      });
    });

    if (!user) {
      console.log(`User with ID ${userId} not found in database`);
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    console.log(`Found user: ${user.id} (${user.name})`);

    // 既存のサブスクリプションをチェック
    const existingSubscription = await withPrismaConnection(async () => {
      return await prisma.subscription.findFirst({
        where: {
          user_id: userId,
        },
      });
    });

    if (existingSubscription) {
      console.log(`User ${userId} already has a subscription`);
      return NextResponse.json(existingSubscription);
    }

    // 新しいサブスクリプションを作成
    const subscription = await withPrismaConnection(async () => {
      return await prisma.subscription.create({
        data: {
          user_id: userId,
          stripe_subscription_id: `sub_${Date.now()}`, // 実際のStripe実装時には本物のIDを使用
          status: 'active',
          current_period_start: new Date(),
          current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30日後
          cancel_at_period_end: false,
        },
      });
    });

    console.log('Created subscription:', {
      id: subscription.id,
      user_id: subscription.user_id,
      status: subscription.status
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