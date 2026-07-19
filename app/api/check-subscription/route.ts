import { NextResponse } from 'next/server';
import { db } from '../../lib/firebase';
import { doc, getDoc } from 'firebase/firestore';

export async function POST(request: Request) {
  try {
    const { customerId } = await request.json();
    
    console.log('🔍 Checking subscription for user:', customerId);

    if (!customerId) {
      return NextResponse.json({ subscribed: false });
    }

    const userDoc = await getDoc(doc(db, 'users', customerId));
    
    if (!userDoc.exists()) {
      console.log('❌ User not found in Firebase:', customerId);
      return NextResponse.json({ subscribed: false });
    }

    const userData = userDoc.data();
    const isSubscribed = userData.subscribed === true;
    
    console.log(`✅ Subscription status: ${isSubscribed ? 'ACTIVE' : 'INACTIVE'}`);
    return NextResponse.json({ subscribed: isSubscribed });
  } catch (error: any) {
    console.error('❌ Error checking subscription:', error.message);
    return NextResponse.json({ subscribed: false });
  }
}