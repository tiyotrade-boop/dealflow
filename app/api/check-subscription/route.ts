import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { db } from '../../lib/firebase';
import { doc, getDoc } from 'firebase/firestore';

export async function POST(request: Request) {
  try {
    const { customerId } = await request.json();
    
    if (!customerId) {
      return NextResponse.json({ subscribed: false });
    }

    // Get the user's Stripe customer ID from Firebase
    const userDoc = await getDoc(doc(db, 'users', customerId));
    
    if (!userDoc.exists()) {
      return NextResponse.json({ subscribed: false });
    }

    const userData = userDoc.data();
    const stripeCustomerId = userData.stripeCustomerId;

    if (!stripeCustomerId) {
      return NextResponse.json({ subscribed: false });
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: '2026-06-24.dahlia',
    });

    const subscriptions = await stripe.subscriptions.list({
      customer: stripeCustomerId,
      status: 'active',
      limit: 1,
    });

    return NextResponse.json({
      subscribed: subscriptions.data.length > 0,
    });
  } catch (error: any) {
    console.error('Error checking subscription:', error.message);
    return NextResponse.json(
      { subscribed: false },
      { status: 500 }
    );
  }
}