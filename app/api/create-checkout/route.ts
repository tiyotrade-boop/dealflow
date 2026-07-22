// app/api/create-checkout/route.ts
// Creates a Stripe Checkout session for the signed-in user.
//
// This version does NOT import firebase-admin. It verifies the Firebase ID
// token by calling Google's public token API directly, which avoids the
// serverless bundling problems firebase-admin causes on Vercel.
//
// Required env vars:
//   STRIPE_SECRET_KEY            = sk_test_... (or sk_live_...)
//   STRIPE_PRICE_ID             = price_...
//   NEXT_PUBLIC_APP_URL         = https://dealflowapp.app
//   NEXT_PUBLIC_FIREBASE_API_KEY = (your Firebase web API key — already set for the client)

import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

export const runtime = "nodejs";

// Verify a Firebase ID token via Google's REST endpoint. Returns the user's
// uid and email if valid, or null if not.
async function verifyFirebaseToken(
  idToken: string
): Promise<{ uid: string; email?: string } | null> {
  const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
  if (!apiKey) {
    console.error("NEXT_PUBLIC_FIREBASE_API_KEY is not set");
    return null;
  }

  const res = await fetch(
    `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idToken }),
    }
  );

  if (!res.ok) return null;

  const data = await res.json();
  const user = data.users?.[0];
  if (!user) return null;

  return { uid: user.localId, email: user.email };
}

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization") || "";
    const token = authHeader.startsWith("Bearer ")
      ? authHeader.slice(7)
      : null;

    if (!token) {
      return NextResponse.json({ error: "Not signed in" }, { status: 401 });
    }

    const user = await verifyFirebaseToken(token);
    if (!user) {
      return NextResponse.json({ error: "Invalid session" }, { status: 401 });
    }

    const priceId = process.env.STRIPE_PRICE_ID;
    if (!priceId) {
      console.error("STRIPE_PRICE_ID is not set");
      return NextResponse.json(
        { error: "Server missing STRIPE_PRICE_ID" },
        { status: 500 }
      );
    }
    if (!process.env.STRIPE_SECRET_KEY) {
      console.error("STRIPE_SECRET_KEY is not set");
      return NextResponse.json(
        { error: "Server missing STRIPE_SECRET_KEY" },
        { status: 500 }
      );
    }

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL!;
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      client_reference_id: user.uid,
      customer_email: user.email ?? undefined,
      line_items: [{ price: priceId, quantity: 1 }],
      // 7-day free trial managed by Stripe. Card collected now, first charge
      // only after the trial ends.
      subscription_data: { trial_period_days: 7 },
      success_url: `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/dashboard`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("create-checkout error:", err);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}