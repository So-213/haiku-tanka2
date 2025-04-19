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
    const updatePromises = subscriptionsToUpdate.map((subscription: { id: string }) =>
      prisma.subscription.update({
        where: { id: subscription.id },
        data: {
          status: '', // 空の文字列を設定
          current_period_start: new Date(0), // 1970-01-01 00:00:00 UTC
          current_period_end: new Date(0), // 1970-01-01 00:00:00 UTC
          cancel_at_period_end: false, // falseを設定
          updated_at: new Date(),
        },
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