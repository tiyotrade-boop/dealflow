// app/api/check-subscription/route.ts
// Verifies the caller's Firebase ID token, then reads users/{uid}.subscribed.
// The client can never fake this — the uid comes from the verified token,
// and the read happens with the Admin SDK on the server.

import { NextRequest, NextResponse } from "next/server";
import { adminAuth } from "../../lib/firebase-admin";

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization") || "";
    const token = authHeader.startsWith("Bearer ")
      ? authHeader.slice(7)
      : null;

    if (!token) {
      return NextResponse.json({ subscribed: false, error: "No token" }, { status: 401 });
    }

    const decoded = await adminAuth.verifyIdToken(token);
    const snap = await adminDb.doc(`users/${decoded.uid}`).get();

    const subscribed = snap.exists && snap.data()?.subscribed === true;

    return NextResponse.json({ subscribed });
  } catch (err) {
    console.error("check-subscription error:", err);
    // Fail closed: on any error, treat as not subscribed.
    return NextResponse.json({ subscribed: false }, { status: 500 });
  }
}