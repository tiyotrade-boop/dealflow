import { NextResponse } from 'next/server';
import Stripe from 'stripe';

export async function POST(request: Request) {
  try {
    const { userId, userEmail } = await request.json();
    
    console.log('📞 Creating checkout for user:', userId);

    if (!process.env.STRIPE_SECRET_KEY) {
      console.error('❌ STRIPE_SECRET_KEY is missing');
      return NextResponse.json(
        { error: 'Stripe secret key is not configured' },
        { status: 500 }
      );
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
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
      success_url: `https://dealflowapp.app/success?session_id={CHECKOUT_SESSION_ID}&user_id=${userId}`,
      cancel_url: 'https://dealflowapp.app/cancel',
      client_reference_id: userId,
      customer_email: userEmail,
    });

    console.log('✅ Checkout session created:', session.id);
    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error('❌ Stripe error:', error.message);
    return NextResponse.json(
      { error: error.message || 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}