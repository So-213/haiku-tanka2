//app/api/subscription/update-status/route.ts

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import Stripe from 'stripe';



const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-03-31.basil',
});

export async function GET(request: Request) {
  try {
    // デバッグ: 環境変数を確認
    console.log('DATABASE_URL:', process.env.DATABASE_URL?.substring(0, 50) + '...');
    console.log('DIRECT_URL:', process.env.DIRECT_URL?.substring(0, 50) + '...');

    // 現在時刻を取得
    const now = new Date();
    console.log('Current time (UTC):', now.toISOString());

    // 解約予定のサブスクリプションを検索
    const subscriptionsToUpdate = await prisma.subscription.findMany({
      where: {
        cancel_at_period_end: true,
        current_period_end: {
          lte: now, // 現在時刻以前に期間が終了するもの
        },
        status: 'active', // 現在アクティブなもののみ
      },
    });

    console.log(`Found ${subscriptionsToUpdate.length} subscriptions to update`);

    // デバッグ: すべてのサブスクリプションを確認
    const allSubscriptions = await prisma.subscription.findMany();
    console.log(`Total subscriptions in database: ${allSubscriptions.length}`);
    for (const sub of allSubscriptions) {
      console.log(`Subscription: ${sub.id}, cancel_at_period_end: ${sub.cancel_at_period_end}, current_period_end: ${sub.current_period_end.toISOString()}, status: ${sub.status}`);
    }

    // 各サブスクリプションのステータスを更新
    const updatePromises = subscriptionsToUpdate.map(async (subscription: {
      id: string;
      user_id: string;
      stripe_subscription_id: string;
      status: string;
      current_period_start: Date;
      current_period_end: Date;
      cancel_at_period_end: boolean;
    }) => {
      try {
        // Stripe側でサブスクリプションを実際に解約
        await stripe.subscriptions.cancel(subscription.stripe_subscription_id);
        console.log(`Cancelled Stripe subscription: ${subscription.stripe_subscription_id}`);

        // 期限切れのサブスクリプションをtrashテーブルに移動
        await prisma.subscriptionTrash.create({
          data: {
            user_id: subscription.user_id,
            stripe_subscription_id: subscription.stripe_subscription_id,
            status: subscription.status,
            current_period_start: subscription.current_period_start,
            current_period_end: subscription.current_period_end,
            cancel_at_period_end: subscription.cancel_at_period_end,
            original_subscription_id: subscription.id,
          },
        });

        // 元のサブスクリプションを削除
        return prisma.subscription.delete({
          where: { id: subscription.id },
        });
      } catch (error) {
        console.error(`Error processing subscription ${subscription.id}:`, error);
        throw error;
      }
    });

    await Promise.all(updatePromises);

    return NextResponse.json({
      message: `Updated ${subscriptionsToUpdate.length} subscriptions`,
      updatedSubscriptions: subscriptionsToUpdate
    });
  } catch (error) {
    console.error('Error updating subscriptions:', error);
    return NextResponse.json(
      { error: 'Failed to update subscriptions' },
      { status: 500 }
    );
  }
} 