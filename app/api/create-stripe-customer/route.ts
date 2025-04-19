import { NextResponse } from 'next/server'
// import Stripe from 'stripe'
import { prisma, withPrismaConnection } from '@/lib/prisma'



// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
//   apiVersion: '2023-10-16',
// })

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

    // 1. Stripeの顧客を作成
    // const customer = await stripe.customers.create({
    //   email,
    //   name,
    //   metadata: {
    //     userId,
    //   },
    // })

    // 2. ユーザーのstripe_customer_idを更新
    try {
      await withPrismaConnection(async () => {
        await prisma.user.update({
          where: { id: userId },
          data: { stripe_customer_id: 'dummy_customer_id' }, // 一時的なダミー値
        });
      });
      console.log('Updated user with Stripe customer ID:', userId);
    } catch (updateError) {
      console.error('Error updating user with Stripe customer ID:', updateError);
      throw updateError;
    }

    return NextResponse.json({ customerId: 'dummy_customer_id' }) // 一時的なダミー値
  } catch (error) {
    console.error('Error creating Stripe customer:', error)
    return NextResponse.json(
      { error: 'Failed to create Stripe customer' },
      { status: 500 }
    )
  }
} 