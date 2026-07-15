import { NextResponse } from 'next/server';
import Stripe from 'stripe';

export async function POST(request: Request) {
  try {
    const { customerId } = await request.json();
    
    console.log('🔍 Checking subscription for customer:', customerId);

    if (!customerId) {
      return NextResponse.json({ subscribed: false });
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: '2026-06-24.dahlia',
    });

    const subscriptions = await stripe.subscriptions.list({
      customer: customerId,
      status: 'active',
      limit: 1,
    });

    return NextResponse.json({
      subscribed: subscriptions.data.length > 0,
    });
  } catch (error: any) {
    console.error('❌ Error checking subscription:', error.message);
    return NextResponse.json(
      { subscribed: false, error: error.message },
      { status: 500 }
    );
  }
}