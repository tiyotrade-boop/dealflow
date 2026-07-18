import { NextResponse } from 'next/server';
import Stripe from 'stripe';

export async function POST(request: Request) {
  try {
    const { userId, userEmail } = await request.json();
    
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: '2026-06-24.dahlia',
    });

    // Check if customer exists with this email
    const existingCustomers = await stripe.customers.list({
      email: userEmail,
      limit: 1,
    });

    let customer;
    if (existingCustomers.data.length > 0) {
      customer = existingCustomers.data[0];
      // Update metadata with Firebase UID
      await stripe.customers.update(customer.id, {
        metadata: {
          firebaseUid: userId,
        },
      });
    } else {
      customer = await stripe.customers.create({
        email: userEmail,
        metadata: {
          firebaseUid: userId,
        },
      });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      customer: customer.id,
      line_items: [
        {
          price: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID!,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: 'https://dealflowapp.app/success',
      cancel_url: 'https://dealflowapp.app/cancel',
      client_reference_id: userId,
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error('Stripe error:', error.message);
    return NextResponse.json(
      { error: error.message || 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}