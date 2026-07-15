import { NextResponse } from 'next/server';
import Stripe from 'stripe';

export async function POST(request: Request) {
  try {
    const { customerId } = await request.json();
    
    console.log('🔍 Checking subscription for customer:', customerId);

    if (!customerId) {
      console.log('❌ No customer ID provided');
      return NextResponse.json({ subscribed: false });
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: '2026-06-24.dahlia',
    });

    console.log('📡 Fetching subscriptions from Stripe...');
    const subscriptions = await stripe.subscriptions.list({
      customer: customerId,
      status: 'active',
      limit: 1,
    });

    const isSubscribed = subscriptions.data.length > 0;
    console.log(`✅ Subscription status: ${isSubscribed ? 'ACTIVE' : 'INACTIVE'}`);

    return NextResponse.json({
      subscribed: isSubscribed,
    });
  } catch (error: any) {
    console.error('❌ Error checking subscription:', error.message);
    return NextResponse.json(
      { error: 'Failed to check subscription' },
      { status: 500 }
    );
  }
}