import { NextResponse } from 'next/server';
import Stripe from 'stripe';

export async function POST(request: Request) {
  try {
    const { customerId } = await request.json();
    
    console.log('🔍 Checking subscription for Firebase UID:', customerId);

    if (!customerId) {
      return NextResponse.json({ subscribed: false });
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: '2026-06-24.dahlia',
    });

    // Get ALL customers and find by metadata
    let allCustomers: any[] = [];
    let hasMore = true;
    let startingAfter: string | undefined = undefined;

    while (hasMore) {
      const response = await stripe.customers.list({
        limit: 100,
        starting_after: startingAfter,
      });
      allCustomers = allCustomers.concat(response.data);
      hasMore = response.has_more;
      if (response.data.length > 0) {
        startingAfter = response.data[response.data.length - 1].id;
      }
    }

    console.log(`📋 Found ${allCustomers.length} total customers in Stripe`);

    // Find customer with matching Firebase UID
    const customer = allCustomers.find(
      c => c.metadata?.firebaseUid === customerId
    );

    if (!customer) {
      console.log('❌ No Stripe customer found for Firebase UID:', customerId);
      
      // Try to find by email as fallback
      console.log('🔍 Trying to find by email...');
      const userEmail = allCustomers.find(c => c.email);
      if (userEmail) {
        console.log(`📧 Found customer by email: ${userEmail.email}`);
      }
      
      return NextResponse.json({ subscribed: false });
    }

    console.log('✅ Found Stripe customer:', customer.id);

    const subscriptions = await stripe.subscriptions.list({
      customer: customer.id,
      status: 'active',
      limit: 10,
    });

    console.log(`📊 Found ${subscriptions.data.length} active subscriptions`);
    const isSubscribed = subscriptions.data.length > 0;

    return NextResponse.json({
      subscribed: isSubscribed,
    });
  } catch (error: any) {
    console.error('❌ Error checking subscription:', error.message);
    return NextResponse.json(
      { subscribed: false, error: error.message },
      { status: 500 }
    );
  }
}