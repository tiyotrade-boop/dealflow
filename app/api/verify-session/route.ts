// app/api/verify-session/route.ts
// Called by the /success page. Confirms with STRIPE (not the browser) that the
// checkout session was actually paid, then writes subscribed: true to
// users/{uid} using the Admin SDK.
//
// Why this route exists: if the /success page wrote subscribed:true directly
// from the client, anyone could open /success and unlock the app for free.
// Here, the "subscribed" flag is only ever written after Stripe confirms payment.

import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { adminAuth } from "../../lib/firebase-admin";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: NextRequest) {
  try {
    const { sessionId } = await req.json();

    if (!sessionId || typeof sessionId !== "string") {
      return NextResponse.json({ error: "Missing session_id" }, { status: 400 });
    }

    // 1. Ask Stripe directly about this session — cannot be faked by a client.
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    // With a 7-day trial, no charge happens at checkout, so Stripe reports
    // payment_status "no_payment_required" (card saved, subscription trialing).
    // "paid" covers non-trial checkouts. Either way, status must be "complete".
    const validPayment =
      session.status === "complete" &&
      (session.payment_status === "paid" ||
        session.payment_status === "no_payment_required");
    const uid = session.client_reference_id;

    if (!validPayment || !uid) {
      return NextResponse.json(
        { success: false, error: "Payment not completed" },
        { status: 402 }
      );
    }

    // 2. Payment confirmed → mark the user as subscribed in Firestore.
    await adminDb.doc(`users/${uid}`).set(
      {
        subscribed: true,
        stripeCustomerId: session.customer ?? null,
        stripeSubscriptionId: session.subscription ?? null,
        subscribedAt: new Date().toISOString(),
      },
      { merge: true }
    );

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("verify-session error:", err);
    return NextResponse.json(
      { success: false, error: "Verification failed" },
      { status: 500 }
    );
  }
}