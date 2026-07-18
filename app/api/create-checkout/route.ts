import { NextResponse } from 'next/server';
import Stripe from 'stripe';

export async function POST(request: Request) {
  try {
    const { userId, userEmail } = await request.json();
    
    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json(
        { error: 'Stripe secret key is not configured' },
        { status: 500 }
      );
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2026-06-24.dahlia',
    });

    // Find or create customer with Firebase UID in metadata
    let customer;
    
    // First, try to find by metadata
    const allCustomers = await stripe.customers.list({ limit: 100 });
    const existingCustomer = allCustomers.data.find(
      c => c.metadata?.firebaseUid === userId
    );

    if (existingCustomer) {
      customer = existingCustomer;
      console.log('✅ Found existing customer with Firebase UID:', userId);
    } else {
      // Check if customer exists by email
      const customersByEmail = await stripe.customers.list({
        email: userEmail,
        limit: 1,
      });

      if (customersByEmail.data.length > 0) {
        // Update existing customer with Firebase UID
        customer = await stripe.customers.update(customersByEmail.data[0].id, {
          metadata: {
            firebaseUid: userId,
          },
        });
        console.log('✅ Updated existing customer with Firebase UID:', userId);
      } else {
        // Create new customer
        customer = await stripe.customers.create({
          email: userEmail,
          metadata: {
            firebaseUid: userId,
          },
        });
        console.log('✅ Created new customer with Firebase UID:', userId);
      }
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