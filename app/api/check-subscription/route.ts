import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { customerId } = await request.json();
    
    // For testing: Return false (not subscribed)
    // Replace with real Stripe check later
    return NextResponse.json({ subscribed: false });
  } catch (error) {
    return NextResponse.json({ subscribed: false });
  }
}