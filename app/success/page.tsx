"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../lib/firebase";
import { welcomeEmail } from "../lib/email-templates";

function SuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [state, setState] = useState<"verifying" | "done" | "failed">(
    "verifying"
  );

  useEffect(() => {
    const sessionId = searchParams.get("session_id");

    if (!sessionId) {
      setState("failed");
      return;
    }

    (async () => {
      try {
        // 1. Verify payment with Stripe
        const res = await fetch("/api/verify-session", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sessionId }),
        });
        const data = await res.json();

        if (data.success) {
          // 2. Get current user
          const user = auth.currentUser;
          const userEmail = user?.email || "";
          const userName = user?.displayName || "there";

          // 3. Send welcome email
          try {
            await fetch("/api/send-email", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                to: userEmail,
                subject: "Welcome to DealAnalytic! 🏠",
                html: welcomeEmail(userName).html,
              }),
            });
          } catch (emailError) {
            console.error("Email sending failed:", emailError);
            // Don't block the user — email failure shouldn't break the flow
          }

          setState("done");
          setTimeout(() => router.replace("/dashboard"), 1500);
        } else {
          setState("failed");
        }
      } catch {
        setState("failed");
      }
    })();
  }, [searchParams, router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-lg">
        {state === "verifying" && (
          <>
            <h1 className="text-2xl font-bold">Confirming your payment…</h1>
            <p className="mt-3 text-gray-600">
              One moment while we activate your subscription.
            </p>
          </>
        )}

        {state === "done" && (
          <>
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-green-100 text-3xl">
              ✅
            </div>
            <h1 className="text-2xl font-bold">Your free trial has started!</h1>
            <p className="mt-3 text-gray-600">
              Taking you to your calculator…
            </p>
          </>
        )}

        {state === "failed" && (
          <>
            <h1 className="text-2xl font-bold">We couldn't confirm payment</h1>
            <p className="mt-3 text-gray-600">
              If you were charged, your access will activate shortly — try
              opening the dashboard. Otherwise, please try subscribing again.
            </p>
            <button
              onClick={() => router.replace("/dashboard")}
              className="mt-6 w-full rounded-lg bg-black px-6 py-3 font-medium text-white hover:bg-gray-800"
            >
              Go to dashboard
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default function SuccessPage() {
  // useSearchParams requires a Suspense boundary in Next.js 14.
  return (
    <Suspense fallback={null}>
      <SuccessContent />
    </Suspense>
  );
}