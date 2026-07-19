import { NextResponse } from 'next/server';
import Stripe from 'stripe';

export async function POST(request: Request) {
  try {
    const { customerId } = await request.json();
    
    console.log('🔍 Checking subscription for user:', customerId);

    if (!customerId) {
      console.log('❌ No customer ID provided');
      return NextResponse.json({ subscribed: false });
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: '2026-06-24.dahlia',
    });

    // Get all customers
    const customers = await stripe.customers.list({
      limit: 100,
    });

    console.log(`📋 Found ${customers.data.length} customers in Stripe`);

    // Find customer with matching Firebase UID in metadata
    const stripeCustomer = customers.data.find(
      c => c.metadata?.firebaseUid === customerId
    );

    if (!stripeCustomer) {
      console.log('❌ No Stripe customer found for user:', customerId);
      return NextResponse.json({ subscribed: false });
    }

    console.log('✅ Found Stripe customer:', stripeCustomer.id);

    const subscriptions = await stripe.subscriptions.list({
      customer: stripeCustomer.id,
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
    return NextResponse.json({ subscribed: false });
  }
}