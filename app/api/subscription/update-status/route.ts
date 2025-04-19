import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    // 本日の日付を取得（時刻部分を00:00:00に設定）
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // 解約予定のサブスクリプションを検索
    const subscriptionsToUpdate = await prisma.subscription.findMany({
      where: {
        cancel_at_period_end: true,
        current_period_end: {
          lte: today, // 本日以前に期間が終了するもの
        },
        status: 'active', // 現在アクティブなもののみ
      },
    });

    console.log(`Found ${subscriptionsToUpdate.length} subscriptions to update`);

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
    });

    await Promise.all(updatePromises);

    return NextResponse.json({
      message: `Updated ${subscriptionsToUpdate.length} subscriptions`,
      updatedSubscriptions: subscriptionsToUpdate
    });
  } catch (error) {
    console.error('Error updating subscription statuses:', error);
    return NextResponse.json(
      { error: 'Failed to update subscription statuses' },
      { status: 500 }
    );
  }
} 