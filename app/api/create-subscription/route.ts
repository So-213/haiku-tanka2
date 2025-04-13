import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { prisma } from '@/lib/prisma'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16' as Stripe.LatestApiVersion,
})

export async function POST(request: Request) {
  try {
    const { customerId, userId } = await request.json()
    console.log('Creating subscription for user:', userId, 'with customer ID:', customerId);

    if (!customerId || !userId) {
      console.error('Missing required fields:', { customerId, userId });
      return NextResponse.json(
        { error: 'Customer ID and User ID are required' },
        { status: 400 }
      )
    }

    // 1. Stripeのサブスクリプションを作成
    let stripeSubscription: any;
    try {
      stripeSubscription = await stripe.subscriptions.create({
        customer: customerId,
        items: [
          {
            price: process.env.STRIPE_PRICE_ID,
          },
        ],
        payment_behavior: 'default_incomplete',
        payment_settings: { save_default_payment_method: 'on_subscription' },
        expand: ['latest_invoice.payment_intent'],
      })
      console.log('Stripe subscription created:', stripeSubscription.id);
    } catch (stripeError) {
      console.error('Stripe subscription creation failed:', stripeError);
      return NextResponse.json(
        { error: 'Failed to create Stripe subscription' },
        { status: 500 }
      )
    }

    // 2. データベースにサブスクリプション情報を保存
    try {
      const subscription = await prisma.subscription.create({
        data: {
          user_id: userId,
          stripe_subscription_id: stripeSubscription.id,
          status: stripeSubscription.status,
          current_period_start: new Date(stripeSubscription.current_period_start * 1000),
          current_period_end: new Date(stripeSubscription.current_period_end * 1000),
          cancel_at_period_end: stripeSubscription.cancel_at_period_end,
        },
      });
      console.log('Database subscription created:', subscription);
    } catch (dbError) {
      console.error('Database error creating subscription:', dbError);
      // Stripeのサブスクリプションをキャンセル
      try {
        await stripe.subscriptions.cancel(stripeSubscription.id);
        console.log('Rolled back Stripe subscription:', stripeSubscription.id);
      } catch (rollbackError) {
        console.error('Failed to rollback Stripe subscription:', rollbackError);
      }
      throw dbError;
    }

    const invoice = stripeSubscription.latest_invoice as any;
    const paymentIntent = invoice.payment_intent;
    return NextResponse.json({
      subscriptionId: stripeSubscription.id,
      clientSecret: paymentIntent.client_secret,
    })
  } catch (error) {
    console.error('Error in subscription creation process:', error)
    return NextResponse.json(
      { error: 'Failed to create subscription' },
      { status: 500 }
    )
  }
} 