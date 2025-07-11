// app/api/stripe/subscription/route.ts

import { NextResponse } from 'next/server'
import Stripe from 'stripe'



const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-03-31.basil',
})

export async function POST(request: Request) {
  try {
    const { customerId, priceId } = await request.json()
    console.log('Creating Stripe checkout session for customer:', customerId);

    if (!customerId || !priceId) {
      console.error('Missing required fields');
      return NextResponse.json(
        { error: 'Customer ID and Price ID are required' },
        { status: 400 }
      )
    }

    // 1. StripeのCheckout Sessionを作成
    // 環境変数からbaseUrlを取得、設定されていない場合はlocalhostを使用
    let baseUrl = process.env.NEXTAUTH_URL;
    if (!baseUrl) {
      // 開発環境ではlocalhost、本番環境ではhttpsを使用
      const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
      const host = request.headers.get('host') || 'localhost:3000';
      baseUrl = `${protocol}://${host}`;
    }
    
    console.log('Using base URL for checkout session:', baseUrl);
    
    //ここでsessionIdが作成される
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${baseUrl}/account?success=true`,
      cancel_url: `${baseUrl}/account?canceled=true`,
      allow_promotion_codes: true,
    })

    console.log('Stripe checkout session created:', session.id);

    // 型安全な形でレスポンスを構築
    const response = {
      sessionId: session.id,
      status: 'pending',
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Error creating Stripe checkout session:', error)
    return NextResponse.json(
      { error: 'Failed to create Stripe checkout session' },
      { status: 500 }
    )
  }
} 