import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { name, email, message } = await req.json();

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    // Send email via Resend (or your preferred service)
    // For now, just log it and return success
    console.log('📧 Contact form submission:', { name, email, message });

    // You can add email sending here later:
    // await resend.emails.send({ ... });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Contact error:', error);
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
  }
}