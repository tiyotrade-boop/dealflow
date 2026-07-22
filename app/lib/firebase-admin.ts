// lib/firebase-admin.ts
// Server-side Firebase (Admin SDK). Used only in API routes.
//
// Lazy initialization: nothing connects to Firebase until an API route is
// actually called. This keeps `next build` from failing when env vars are
// missing or malformed — errors surface at runtime in the function logs
// instead of killing the deploy.
//
// Required env vars (Vercel → Settings → Environment Variables):
//   FIREBASE_PROJECT_ID
//   FIREBASE_CLIENT_EMAIL
//   FIREBASE_PRIVATE_KEY   (paste WITHOUT surrounding quotes; multi-line OK)

import { initializeApp, getApps, cert, App } from "firebase-admin/app";
import { getAuth, Auth } from "firebase-admin/auth";
import { getFirestore, Firestore } from "firebase-admin/firestore";

function normalizePrivateKey(raw: string | undefined): string {
  if (!raw) {
    throw new Error("FIREBASE_PRIVATE_KEY is not set");
  }
  let key = raw.trim();
  // Strip accidental surrounding quotes (common when copied from .env.local)
  if (
    (key.startsWith('"') && key.endsWith('"')) ||
    (key.startsWith("'") && key.endsWith("'"))
  ) {
    key = key.slice(1, -1);
  }
  // Convert escaped \n sequences to real newlines (no-op for multi-line keys)
  key = key.replace(/\\n/g, "\n");

  if (!key.includes("BEGIN PRIVATE KEY")) {
    throw new Error(
      "FIREBASE_PRIVATE_KEY looks malformed: missing BEGIN PRIVATE KEY header"
    );
  }
  return key;
}

function getAdminApp(): App {
  const existing = getApps()[0];
  if (existing) return existing;

  return initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: normalizePrivateKey(process.env.FIREBASE_PRIVATE_KEY),
    }),
  });
}

export function adminAuth(): Auth {
  return getAuth(getAdminApp());
}

export function adminDb(): Firestore {
  return getFirestore(getAdminApp());
}