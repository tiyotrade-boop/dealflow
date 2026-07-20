// app/api/create-checkout/route.ts
// Creates a Stripe Checkout session for the signed-in user.
// Required env vars:
//   STRIPE_SECRET_KEY=sk_live_... (or sk_test_...)
//   STRIPE_PRICE_ID=price_...     (your subscription price)
//   NEXT_PUBLIC_APP_URL=https://yourapp.com  (or http://localhost:3000 in dev)

import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { adminAuth } from "@/app/lib/firebase-admin";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: NextRequest) {
  try {
    // 1. Identify the user from their Firebase ID token.
    const authHeader = req.headers.get("authorization") || "";
    const token = authHeader.startsWith("Bearer ")
      ? authHeader.slice(7)
      : null;

    if (!token) {
      return NextResponse.json({ error: "Not signed in" }, { status: 401 });
    }

    const decoded = await adminAuth.verifyIdToken(token);
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL!;

    // 2. Create the checkout session. client_reference_id carries the uid
    //    so /api/verify-session knows exactly which user paid.
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      client_reference_id: decoded.uid,
      customer_email: decoded.email ?? undefined,
      line_items: [{ price: process.env.STRIPE_PRICE_ID!, quantity: 1 }],
      // 7-day free trial managed by Stripe. Card is collected at checkout,
      // but the first charge only happens after the trial ends.
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