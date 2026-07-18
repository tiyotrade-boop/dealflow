import { NextResponse } from 'next/server';
import Stripe from 'stripe';

export async function POST(request: Request) {
  try {
    const { customerId } = await request.json();
    
    if (!customerId) {
      return NextResponse.json({ subscribed: false });
    }

    // For testing - return true for specific user
    // Replace with real Stripe check later
    return NextResponse.json({ subscribed: true });
  } catch (error) {
    return NextResponse.json({ subscribed: false });
  }
}