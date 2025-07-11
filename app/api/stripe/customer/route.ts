// app/api/stripe/customer/route.ts

import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { prisma, withPrismaConnection } from '@/lib/prisma'


//web上stripe内の顧客情報とDB上の顧客情報の紐付け
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-03-31.basil',
})

export async function POST(request: Request) {
  try {
    const { userId, email, name } = await request.json()
    console.log('Creating Stripe customer for user:', userId);

    if (!userId) {
      console.error('No userId provided');
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    // ユーザーが存在するか確認
    const user = await withPrismaConnection(async () => {
      return await prisma.user.findUnique({
        where: { id: userId },
      });
    });

    if (!user) {
      console.error('User not found:', userId);
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // 既にStripe顧客IDが存在する場合はそれを返す
    if (user.stripe_customer_id) {
      console.log('User already has a Stripe customer ID:', user.stripe_customer_id);
      return NextResponse.json({ customerId: user.stripe_customer_id });
    }

    // 1. Stripeの顧客を作成
    const customer = await stripe.customers.create({
      email,
      name,
      metadata: {
        userId,
      },
    })

    // 2. ユーザーのstripe_customer_idを更新
    try {
      await withPrismaConnection(async () => {
        await prisma.user.update({
          where: { id: userId },
          data: { stripe_customer_id: customer.id },
        });
      });
      console.log('Updated user with Stripe customer ID:', customer.id);
    } catch (updateError) {
      console.error('Error updating user with Stripe customer ID:', updateError);
      throw updateError;
    }

    return NextResponse.json({ customerId: customer.id })
  } catch (error) {
    console.error('Error creating Stripe customer:', error)
    return NextResponse.json(
      { error: 'Failed to create Stripe customer' },
      { status: 500 }
    )
  }
} 