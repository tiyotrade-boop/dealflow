import { NextResponse } from 'next/server';
import { adminDb } from '../../lib/firebase-admin';

export async function GET() {
  try {
    const snap = await adminDb()
      .collection('testimonials')
      .where('status', '==', 'approved')
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

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, role, review, rating } = body;

    if (!name || !review) {
      return NextResponse.json({ error: 'Name and review are required' }, { status: 400 });
    }

    const docRef = await adminDb().collection('testimonials').add({
      name,
      role: role || '',
      review,
      rating: rating || 5,
      status: 'pending',
      createdAt: new Date(),
    });

    return NextResponse.json({ id: docRef.id });
  } catch (error) {
    console.error('Failed to add testimonial:', error);
    return NextResponse.json({ error: 'Failed to save' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    await adminDb().collection('testimonials').doc(id).delete();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete testimonial:', error);
    return NextResponse.json({ error: 'Failed to delete' }, { status: 500 });
  }
}