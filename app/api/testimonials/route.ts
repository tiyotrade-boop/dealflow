import { NextResponse } from 'next/server';
import { addDoc, collection, getDocs, query, orderBy, limit, where } from 'firebase/firestore';
import { db } from '../../lib/firebase';

// GET: Fetch approved testimonials
export async function GET() {
  try {
    const q = query(
      collection(db, 'testimonials'),
      where('approved', '==', true),
      orderBy('createdAt', 'desc'),
      limit(10)
    );
    const snapshot = await getDocs(q);
    const testimonials = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return NextResponse.json(testimonials);
  } catch (error) {
    console.error('Error fetching testimonials:', error);
    return NextResponse.json(
      { error: 'Failed to fetch testimonials' },
      { status: 500 }
    );
  }
}

// POST: Submit a new testimonial
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, role, review, rating } = body;

    if (!name || !review) {
      return NextResponse.json(
        { error: 'Name and review are required' },
        { status: 400 }
      );
    }

    const docRef = await addDoc(collection(db, 'testimonials'), {
      name: name.trim(),
      role: role?.trim() || 'Real Estate Professional',
      review: review.trim(),
      rating: rating || 5,
      approved: false,
      createdAt: new Date().toISOString(),
    });

    return NextResponse.json({
      id: docRef.id,
      message: 'Testimonial submitted for approval',
    });
  } catch (error) {
    console.error('Error submitting testimonial:', error);
    return NextResponse.json(
      { error: 'Failed to submit testimonial' },
      { status: 500 }
    );
  }
}