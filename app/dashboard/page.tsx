// app/dashboard/page.tsx
"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged, signInWithPopup, User } from "firebase/auth";
import { auth, googleProvider } from "../lib/firebase";
import DealFlowDashboard from "../components/DealFlowDashboard";

type Status = "loading" | "signed-out" | "locked" | "unlocked";

export default function DashboardPage() {
  const [status, setStatus] = useState<Status>("loading");
  const [user, setUser] = useState<User | null>(null);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [signingIn, setSigningIn] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 1. Wait for Firebase auth, then verify subscription on the SERVER.
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        setStatus("signed-out");
        return;
      }
      setUser(firebaseUser);

      try {
        const token = await firebaseUser.getIdToken();
        const res = await fetch("/api/check-subscription", {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setStatus(data.subscribed ? "unlocked" : "locked");
      } catch {
        // If the check fails, fail CLOSED — never show the calculator.
        setStatus("locked");
        setError("Could not verify your subscription. Please refresh.");
      }
    });
    return () => unsub();
  }, []);

  // 2. Sign in with Google.
  async function handleSignIn() {
    setSigningIn(true);
    setError(null);
    try {
      await signInWithPopup(auth, googleProvider);
      // onAuthStateChanged above picks it up and runs the subscription check.
    } catch (e: any) {
      console.error("Sign-in failed:", e);
      if (e?.code === "auth/popup-blocked") {
        setError("Your browser blocked the sign-in popup. Allow popups and try again.");
      } else if (e?.code === "auth/popup-closed-by-user") {
        setError(null); // user cancelled — not an error worth showing
      } else {
        setError("Sign-in failed. Please try again.");
      }
      setSigningIn(false);
    }
  }

  // 3. Start Stripe checkout.
  async function handleSubscribe() {
    if (!user) return;
    setCheckoutLoading(true);
    setError(null);
    try {
      const token = await user.getIdToken();
      const res = await fetch("/api/create-checkout", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url; // → Stripe Checkout
      } else {
        throw new Error(data.error || "No checkout URL returned");
      }
    } catch (e) {
      setError("Could not start checkout. Please try again.");
      setCheckoutLoading(false);
    }
  }

  // ---- Render states ----

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-gray-500">Checking your account…</p>
      </div>
    );
  }

  if (status === "signed-out") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
        <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-lg">
          <h1 className="text-2xl font-bold">Sign in to DealFlow</h1>
          <p className="mt-3 text-gray-600">
            Sign in to access your calculator and saved deals.
          </p>
          <button
            onClick={handleSignIn}
            disabled={signingIn}
            className="mt-6 w-full rounded-lg bg-black px-6 py-3 font-medium text-white transition hover:bg-gray-800 disabled:opacity-50"
          >
            {signingIn ? "Opening sign-in…" : "Sign in with Google"}
          </button>
          {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
        </div>
      </div>
    );
  }

  if (status === "locked") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
        <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-lg">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 text-3xl">
            🔒
          </div>
          <h1 className="text-2xl font-bold">Start Your Free Trial</h1>
          <p className="mt-3 text-gray-600">
            Try the DealFlow Calculator free for 7 days, then $49/mo. Cancel
            anytime during the trial and you won't be charged.
          </p>
          <button
            onClick={handleSubscribe}
            disabled={checkoutLoading}
            className="mt-6 w-full rounded-lg bg-black px-6 py-3 font-medium text-white transition hover:bg-gray-800 disabled:opacity-50"
          >
            {checkoutLoading ? "Redirecting to checkout…" : "Start 7-Day Free Trial"}
          </button>
          {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
          <button
            onClick={() => auth.signOut()}
            className="mt-4 text-sm text-gray-400 underline"
          >
            Sign out
          </button>
        </div>
      </div>
    );
  }

  // status === "unlocked" — subscriber sees the real dashboard/calculator.
  return <DealFlowDashboard />;
}
