// lib/firebase-admin.ts
// Server-side Firebase (Admin SDK). Used only in API routes.
// Required env vars (add to .env.local):
//   FIREBASE_PROJECT_ID=your-project-id
//   FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project-id.iam.gserviceaccount.com
//   FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
// (Get these from Firebase Console → Project Settings → Service Accounts → Generate new private key)

import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

const app =
  getApps()[0] ??
  initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      // Vercel/env files escape newlines, so restore them:
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    }),
  });

export const adminAuth = getAuth(app);
export const adminDb = getFirestore(app);