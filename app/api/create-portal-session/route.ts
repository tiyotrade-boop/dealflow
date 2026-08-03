// app/api/create-portal-session/route.ts
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { adminDb } from '../../lib/firebase-admin';

export async function POST(req: NextRequest) {
  try {
    const { customerId } = await req.json();

    if (!customerId) {
      return NextResponse.json(
        { error: 'Customer ID is required' },
        { status: 400 }
      );
    }

    // Get Stripe customer ID from Firebase
    const userDoc = await adminDb.doc(`users/${customerId}`).get();
    const userData = userDoc.data();
    const stripeCustomerId = userData?.stripeCustomerId;

    if (!stripeCustomerId) {
      return NextResponse.json(
        { error: 'No Stripe customer found' },
        { status: 404 }
      );
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

    const session = await stripe.billingPortal.sessions.create({
      customer: stripeCustomerId,
      return_url: 'https://dealanalytic.com/dashboard',
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error('Portal session error:', error);
    return NextResponse.json(
      { error: 'Failed to create portal session' },
      { status: 500 }
    );
  }
}