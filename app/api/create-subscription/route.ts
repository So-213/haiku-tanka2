import { NextResponse } from 'next/server'
// Stripe関連のインポートを一時的にコメントアウト
// import Stripe from 'stripe'
import { prisma } from '@/lib/prisma'

// Stripeインスタンスの初期化をコメントアウト
// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
//   apiVersion: '2023-10-16' as Stripe.LatestApiVersion,
// })

export async function POST(request: Request) {
  try {
    const { customerId, userId } = await request.json()
    console.log('Creating subscription for user:', userId);

    if (!userId) {
      console.error('Missing required field: userId');
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    // Stripe処理をコメントアウト
    // 1. Stripeのサブスクリプションを作成
    // let stripeSubscription: any;
    // try {
    //   stripeSubscription = await stripe.subscriptions.create({
    //     customer: customerId,
    //     items: [
    //       {
    //         price: process.env.STRIPE_PRICE_ID,
    //       },
    //     ],
    //     payment_behavior: 'default_incomplete',
    //     payment_settings: { save_default_payment_method: 'on_subscription' },
    //     expand: ['latest_invoice.payment_intent'],
    //   })
    //   console.log('Stripe subscription created:', stripeSubscription.id);
    // } catch (stripeError) {
    //   console.error('Stripe subscription creation failed:', stripeError);
    //   return NextResponse.json(
    //     { error: 'Failed to create Stripe subscription' },
    //     { status: 500 }
    //   )
    // }

    // 2. データベースにサブスクリプション情報を保存
    // 代替実装：Stripe無しでDB登録のみ実行
    try {
      // ユーザーが存在するか確認
      const user = await prisma.user.findUnique({
        where: { id: userId }
      });
      
      if (!user) {
        return NextResponse.json(
          { error: 'User not found' },
          { status: 404 }
        );
      }
      
      // 既存のサブスクリプションを確認
      const existingSubscription = await prisma.subscription.findFirst({
        where: { user_id: userId }
      });
      
      if (existingSubscription) {
        return NextResponse.json(existingSubscription);
      }

      // 仮のサブスクリプション情報を作成
      const subscription = await prisma.subscription.create({
        data: {
          user_id: userId,
          stripe_subscription_id: `mock_sub_${Date.now()}`, // 仮のID
          status: 'active',
          current_period_start: new Date(),
          current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30日後
          cancel_at_period_end: false,
        },
      });
      console.log('Mock subscription created:', subscription);
      
      return NextResponse.json(subscription);
    } catch (error) {
      console.error('Error creating mock subscription:', error)
      return NextResponse.json(
        { error: 'Failed to create subscription' },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('Error in subscription creation process:', error)
    return NextResponse.json(
      { error: 'Failed to create subscription' },
      { status: 500 }
    )
  }
} 