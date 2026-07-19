import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { customerId } = await request.json();
    console.log('🔍 Checking subscription for user:', customerId);

    // 🔒 LOCKED: Always return false (no one is subscribed)
    // Change to true ONLY for testing
    return NextResponse.json({ subscribed: false });
  } catch (error: any) {
    console.error('Error:', error.message);
    return NextResponse.json({ subscribed: false });
  }
}