import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { prisma, withPrismaConnection } from '@/lib/prisma'
import { headers } from 'next/headers'



const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-03-31.basil',
})

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(request: Request) {
  try {
    const body = await request.text()
    const signature = headers().get('stripe-signature')!

    let event: Stripe.Event

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
    } catch (err) {
      console.error('Webhook signature verification failed:', err)
      return NextResponse.json(
        { error: 'Webhook signature verification failed' },
        { status: 400 }
      )
    }

    // 支払いが完了したイベントを処理
    if (event.type === 'invoice.payment_succeeded') {
      const invoice = event.data.object as Stripe.Invoice
      const subscriptionId = invoice.subscription

      if (typeof subscriptionId === 'string') {
        const subscription = await stripe.subscriptions.retrieve(subscriptionId)
        const customerId = subscription.customer

        if (typeof customerId === 'string') {
          // ユーザーを検索
          const user = await withPrismaConnection(async () => {
            return await prisma.user.findFirst({
              where: { stripe_customer_id: customerId }
            })
          })

          if (user) {
            // 既存のサブスクリプションを確認
            const existingSubscription = await withPrismaConnection(async () => {
              return await prisma.subscription.findFirst({
                where: { user_id: user.id }
              })
            })

            if (existingSubscription) {
              // 既存のサブスクリプションを更新
              await withPrismaConnection(async () => {
                await prisma.subscription.update({
                  where: { id: existingSubscription.id },
                  data: {
                    status: subscription.status,
                    current_period_start: new Date(subscription.current_period_start * 1000),
                    current_period_end: new Date(subscription.current_period_end * 1000),
                  }
                })
              })
            } else {
              // 新しいサブスクリプションを作成
              await withPrismaConnection(async () => {
                await prisma.subscription.create({
                  data: {
                    user_id: user.id,
                    stripe_subscription_id: subscription.id,
                    status: subscription.status,
                    current_period_start: new Date(subscription.current_period_start * 1000),
                    current_period_end: new Date(subscription.current_period_end * 1000),
                    cancel_at_period_end: subscription.cancel_at_period_end,
                  }
                })
              })
            }
          }
        }
      }
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Error processing webhook:', error)
    return NextResponse.json(
      { error: 'Failed to process webhook' },
      { status: 500 }
    )
  }
} 