import { NextResponse } from 'next/server';
import Stripe from 'stripe';

export async function POST() {
  console.log('📞 Stripe API route called');

  try {
    console.log('🔑 Checking Stripe secret key...');
    if (!process.env.STRIPE_SECRET_KEY) {
      console.error('❌ STRIPE_SECRET_KEY is missing');
      return NextResponse.json(
        { error: 'Stripe secret key is not configured' },
        { status: 500 }
      );
    }

    console.log('💰 Checking Stripe price ID...');
    if (!process.env.NEXT_PUBLIC_STRIPE_PRICE_ID) {
      console.error('❌ NEXT_PUBLIC_STRIPE_PRICE_ID is missing');
      return NextResponse.json(
        { error: 'Stripe price ID is not configured' },
        { status: 500 }
      );
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2026-06-24.dahlia',
    });

    console.log('🛒 Creating Stripe checkout session...');
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: 'https://dealflowapp.app/success',
      cancel_url: 'https://dealflowapp.app/cancel',
    });

    console.log('✅ Stripe session created:', session.id);
    return NextResponse.json({ url: session.url });

  } catch (error: any) {
    console.error('❌ Stripe error:', error.message);
    console.error('Stack trace:', error.stack);
    return NextResponse.json(
      { error: error.message || 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}