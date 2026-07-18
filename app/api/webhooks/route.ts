import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { db } from '../../../lib/firebase';
import { doc, setDoc } from 'firebase/firestore';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-06-24.dahlia',
});

export async function POST(request: Request) {
  try {
    const body = await request.text();
    const sig = request.headers.get('stripe-signature')!;
    
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;
    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
    } catch (err) {
      console.error('Webhook signature verification failed:', err);
      return NextResponse.json({ error: 'Webhook Error' }, { status: 400 });
    }

    const session = event.data.object as Stripe.Checkout.Session;

    // Handle successful checkout
    if (event.type === 'checkout.session.completed') {
      const userId = session.client_reference_id;
      const customerId = session.customer as string;
      
      console.log('✅ Checkout completed for user:', userId);
      console.log('✅ Customer ID:', customerId);
      
      if (userId) {
        // Save subscription status in Firebase
        await setDoc(doc(db, 'users', userId), {
          stripeCustomerId: customerId,
          subscribed: true,
          subscribedAt: new Date().toISOString(),
        }, { merge: true });
        
        console.log('✅ Subscription saved for user:', userId);
      }
    }

    // Handle subscription canceled/deleted
    if (event.type === 'customer.subscription.deleted') {
      // Find user by customer ID and set subscribed to false
      // You'll need to query users by stripeCustomerId
      console.log('⚠️ Subscription canceled');
      
      // For now, we'll handle this in the check-subscription API
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: 'Webhook error' }, { status: 500 });
  }
}