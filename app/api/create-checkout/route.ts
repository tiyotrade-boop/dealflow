import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { db } from '@/lib/firebase';
import { doc, setDoc } from 'firebase/firestore';

export async function POST(request: Request) {
  try {
    const { userId, userEmail } = await request.json();
    
    console.log('📞 Creating checkout for user:', userId);

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: '2026-06-24.dahlia',
    });

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID!,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: 'https://dealflowapp.app/success?session_id={CHECKOUT_SESSION_ID}&user_id=' + userId,
      cancel_url: 'https://dealflowapp.app/cancel',
      client_reference_id: userId,
      customer_email: userEmail,
      metadata: {
        firebaseUid: userId,
      },
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