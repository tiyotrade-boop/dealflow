// app/api/check-subscription/route.ts
// Verifies the caller's Firebase ID token (via Google's REST API, so no
// firebase-admin needed for auth), then reads users/{uid}.subscribed from
// Firestore using the Admin SDK.
//
// The client can never fake this: the uid comes from the verified token, and
// the read happens server-side.
//
// Required env vars:
//   NEXT_PUBLIC_FIREBASE_API_KEY
//   FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY

import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "../../lib/firebase-admin";

export const runtime = "nodejs";

async function verifyFirebaseToken(
  idToken: string
): Promise<{ uid: string } | null> {
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
  return user ? { uid: user.localId } : null;
}

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization") || "";
    const token = authHeader.startsWith("Bearer ")
      ? authHeader.slice(7)
      : null;

    if (!token) {
      return NextResponse.json(
        { subscribed: false, error: "No token" },
        { status: 401 }
      );
    }

    const user = await verifyFirebaseToken(token);
    if (!user) {
      return NextResponse.json({ subscribed: false }, { status: 401 });
    }

    const snap = await adminDb().doc(`users/${user.uid}`).get();
    const subscribed = snap.exists && snap.data()?.subscribed === true;

    return NextResponse.json({ subscribed });
  } catch (err) {
    console.error("check-subscription error:", err);
    // Fail closed: on any error, treat as not subscribed.
    return NextResponse.json({ subscribed: false }, { status: 500 });
  }
}