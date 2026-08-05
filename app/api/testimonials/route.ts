import { NextResponse } from 'next/server';
import { db } from '@/app/lib/firebase-admin';

export async function GET() {
  try {
    const snap = await db
      .collection('testimonials')
      .orderBy('createdAt', 'desc')
      .get();

    const testimonials = snap.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json(testimonials);
  } catch (error) {
    console.error('Failed to fetch testimonials:', error);
    return NextResponse.json([], { status: 500 });
  }
}