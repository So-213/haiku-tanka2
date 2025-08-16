// app/api/subscription/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    console.log('Fetching subscription for user ID:', userId);

    if (!userId) {
      console.log('No userId provided');
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    // まずユーザーが存在するか確認
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      console.log(`User with ID ${userId} not found in database`);
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    console.log(`Found user: ${user.id} (${user.name})`);

    // ユーザーIDに紐づくサブスクリプションを検索
    const subscription = await prisma.subscription.findFirst({
      where: {
        user_id: userId,
      },
    })
    
    console.log('Found subscription for user:', subscription ? 'Yes' : 'No');
    if (subscription) {
      console.log('Subscription details:', {
        id: subscription.id,
        status: subscription.status,
        user_id: subscription.user_id
      });
    }

    return NextResponse.json(subscription)
  } catch (error) {
    console.error('Error fetching subscription:', error || 'Unknown error')
    return NextResponse.json(
      { error: 'Failed to fetch subscription' },
      { status: 500 }
    )
  }
} 