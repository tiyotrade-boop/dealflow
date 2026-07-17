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

    // Get the user's email from Firebase to find their Stripe customer
    // Since we use email as the customer identifier, we need to find the customer
    // by email. The customerId is actually the Firebase UID.
    
    // First, get all customers with the metadata firebaseUid
    const customers = await stripe.customers.list({
      limit: 100,
    });

    // Find customer with matching firebaseUid
    let customer = customers.data.find(
      c => c.metadata?.firebaseUid === customerId
    );

    if (!customer) {
      console.log('❌ No Stripe customer found for Firebase UID:', customerId);
      return NextResponse.json({ subscribed: false });
    }

    console.log('✅ Found Stripe customer:', customer.id);

    const subscriptions = await stripe.subscriptions.list({
      customer: customer.id,
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
      { subscribed: false, error: error.message },
      { status: 500 }
    );
  }
}