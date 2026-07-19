import { NextResponse } from 'next/server';
import Stripe from 'stripe';

export async function POST(request: Request) {
  try {
    const { userId, userEmail } = await request.json();
    
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: '2026-06-24.dahlia',
    });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID!,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `https://dealflowapp.app/success?user_id=${userId}`,
      cancel_url: 'https://dealflowapp.app/cancel',
      client_reference_id: userId,
      customer_email: userEmail,
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error('❌ Stripe error:', error.message);
    return NextResponse.json(
      { error: error.message || 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}