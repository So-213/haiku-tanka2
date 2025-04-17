import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
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
    const updatePromises = subscriptionsToUpdate.map(subscription =>
      prisma.subscription.update({
        where: { id: subscription.id },
        data: { status: 'canceling' },
      })
    );

    const updatedSubscriptions = await Promise.all(updatePromises);

    console.log('Updated subscriptions:', updatedSubscriptions.map(sub => ({
      id: sub.id,
      user_id: sub.user_id,
      status: sub.status
    })));

    return NextResponse.json({
      message: `Updated ${updatedSubscriptions.length} subscriptions`,
      updatedSubscriptions
    });
  } catch (error) {
    console.error('Error updating subscription statuses:', error);
    return NextResponse.json(
      { error: 'Failed to update subscription statuses' },
      { status: 500 }
    );
  }
} 