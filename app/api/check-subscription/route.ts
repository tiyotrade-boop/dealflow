import { NextResponse } from 'next/server';
import { adminDb } from '../../lib/firebase-admin';

export async function POST(request: Request) {
  try {
    const { customerId } = await request.json();
    
    console.log('🔍 Checking subscription for user:', customerId);

    if (!customerId) {
      return NextResponse.json({ subscribed: false });
    }

    // Read subscription status from Firebase using Admin SDK
    const userDoc = await adminDb.collection('users').doc(customerId).get();
    
    if (!userDoc.exists) {
      console.log('❌ User not found in Firebase:', customerId);
      return NextResponse.json({ subscribed: false });
    }

    const userData = userDoc.data();
    const isSubscribed = userData?.subscribed === true;
    
    console.log(`✅ Subscription status: ${isSubscribed ? 'ACTIVE' : 'INACTIVE'}`);
    return NextResponse.json({ subscribed: isSubscribed });
  } catch (error: any) {
    console.error('❌ Error checking subscription:', error.message);
    return NextResponse.json({ subscribed: false });
  }
}