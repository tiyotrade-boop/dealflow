// app/api/verify-session/route.ts
// Confirms with Stripe that a checkout session was paid (or is a valid trial),
// then writes subscribed: true to users/{uid} via the Admin SDK.
//
// Requires firebase-admin for the Firestore write. To make it bundle correctly
// on Vercel, this route runs on the Node runtime AND next.config.js lists
// firebase-admin under serverComponentsExternalPackages.
//
// Required env vars:
//   STRIPE_SECRET_KEY
//   FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY

import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { adminDb } from "../../lib/firebase-admin";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const { sessionId } = await req.json();

    if (!sessionId || typeof sessionId !== "string") {
      return NextResponse.json({ error: "Missing session_id" }, { status: 400 });
    }

    if (!process.env.STRIPE_SECRET_KEY) {
      console.error("STRIPE_SECRET_KEY is not set");
      return NextResponse.json(
        { success: false, error: "Server missing STRIPE_SECRET_KEY" },
        { status: 500 }
      );
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

    // 1. Ask Stripe directly about this session — cannot be faked by a client.
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    // With a 7-day trial, no charge happens at checkout, so Stripe reports
    // payment_status "no_payment_required". "paid" covers non-trial checkouts.
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
    await adminDb().doc(`users/${uid}`).set(
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