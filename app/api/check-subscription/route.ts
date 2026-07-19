import { NextResponse } from 'next/server';

// 🔑 MANUAL SUBSCRIPTION CONTROL
// Change this to true to UNLOCK the calculator
// Change this to false to LOCK the calculator
const SUBSCRIPTION_STATUS = false; // <-- Change this

export async function POST(request: Request) {
  try {
    const { customerId } = await request.json();
    console.log('🔍 Subscription check for user:', customerId);
    console.log('📦 Returning:', SUBSCRIPTION_STATUS);
    
    return NextResponse.json({ subscribed: SUBSCRIPTION_STATUS });
  } catch (error: any) {
    console.error('Error:', error.message);
    return NextResponse.json({ subscribed: false });
  }
}