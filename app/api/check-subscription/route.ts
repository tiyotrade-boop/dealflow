import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { customerId } = await request.json();
    console.log('🔍 Checking subscription for user:', customerId);

    // TEMPORARY: Hardcoded to return true for testing
    // Remove this after testing
    return NextResponse.json({ subscribed: true });
  } catch (error: any) {
    console.error('Error:', error.message);
    return NextResponse.json({ subscribed: false });
  }
}