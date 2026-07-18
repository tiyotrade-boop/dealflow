import { NextResponse } from 'next/server';
import Stripe from 'stripe';

export async function POST(request: Request) {
  try {
    const { customerId } = await request.json();
    
    if (!customerId) {
      return NextResponse.json({ subscribed: false });
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: '2026-06-24.dahlia',
    });

    // Get all customers and find by metadata
    const customers = await stripe.customers.list({
      limit: 100,
    });

    const stripeCustomer = customers.data.find(
      c => c.metadata?.firebaseUid === customerId
    );

    if (!stripeCustomer) {
      return NextResponse.json({ subscribed: false });
    }

    const subscriptions = await stripe.subscriptions.list({
      customer: stripeCustomer.id,
      status: 'active',
      limit: 1,
    });

    return NextResponse.json({
      subscribed: subscriptions.data.length > 0,
    });
  } catch (error: any) {
    console.error('Error checking subscription:', error.message);
    return NextResponse.json({ subscribed: false });
  }
}