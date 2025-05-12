// app/api/stripe/subscription/route.ts

import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { prisma } from '@/lib/prisma'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-03-31.basil',
})

export async function POST(request: Request) {
  try {
    const { customerId, priceId } = await request.json()
    console.log('Creating Stripe subscription for customer:', customerId);

    if (!customerId || !priceId) {
      console.error('Missing required fields');
      return NextResponse.json(
        { error: 'Customer ID and Price ID are required' },
        { status: 400 }
      )
    }

    // 1. Stripeのサブスクリプションを作成
    const subscription = await stripe.subscriptions.create({
      customer: customerId,
      items: [
        {
          price: priceId,
        },
      ],
      payment_behavior: 'default_incomplete',
      payment_settings: {
        payment_method_types: ['card'],
        save_default_payment_method: 'on_subscription',
      },
      expand: ['latest_invoice'],
    })

    console.log('Stripe subscription created:', subscription.id);

    // 型安全な形でレスポンスを構築
    const response = {
      subscriptionId: subscription.id,
      status: subscription.status,
      currentPeriodStart: subscription.current_period_start,
      currentPeriodEnd: subscription.current_period_end,
      clientSecret: subscription.latest_invoice?.payment_intent?.client_secret,
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Error creating Stripe subscription:', error)
    return NextResponse.json(
      { error: 'Failed to create Stripe subscription' },
      { status: 500 }
    )
  }
} 