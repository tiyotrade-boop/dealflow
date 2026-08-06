import { NextResponse } from 'next/server';
import { adminDb } from '../../lib/firebase-admin';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function GET() {
  try {
    const snap = await adminDb()
      .collection('testimonials')
      .orderBy('createdAt', 'desc')
      .get();

    const testimonials = snap.docs
      .map((doc) => ({ id: doc.id, ...doc.data() }))
      .filter((t: any) => t.status === 'approved');

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

    // Save to Firestore
    const docRef = await adminDb().collection('testimonials').add({
      name,
      role: role || '',
      review,
      rating: rating || 5,
      status: 'pending',
      createdAt: new Date(),
    });

    // Send email notification
    try {
      await resend.emails.send({
        from: 'DealAnalytic <onboarding@resend.dev>',
        to: 'tiyotrade@gmail.com',
        subject: '⭐ New Review Pending Approval',
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: #2563eb; padding: 20px; border-radius: 12px; text-align: center; margin-bottom: 24px;">
              <h1 style="color: white; margin: 0; font-size: 24px;">New Review Submitted</h1>
              <p style="color: #bfdbfe; margin: 8px 0 0;">Pending your approval</p>
            </div>

            <div style="background: #f9fafb; border-radius: 12px; padding: 20px; margin-bottom: 20px; border: 1px solid #e5e7eb;">
              <p style="color: #6b7280; font-size: 14px; margin: 0 0 12px;">Review</p>
              <p style="color: #111827; font-size: 16px; font-style: italic; margin: 0 0 16px;">"${review}"</p>
              <p style="color: #111827; font-weight: bold; margin: 0;">${name}</p>
              <p style="color: #6b7280; font-size: 14px; margin: 4px 0 0;">${role || 'No role provided'}</p>
              <p style="color: #f59e0b; margin: 8px 0 0;">${'⭐'.repeat(rating || 5)}</p>
            </div>

            <div style="text-align: center;">
              <a href="https://dealanalytic.com/admin/testimonials"
                style="display: inline-block; background: #16a34a; color: white; padding: 12px 32px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 16px;">
                ✓ Review & Approve
              </a>
            </div>

            <p style="color: #9ca3af; font-size: 12px; text-align: center; margin-top: 24px;">
              DealAnalytic · dealanalytic.com
            </p>
          </div>
        `,
      });
    } catch (emailError) {
      console.error('Failed to send email notification:', emailError);
      // Don't fail the request if email fails
    }

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