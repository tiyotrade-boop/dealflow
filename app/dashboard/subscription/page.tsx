'use client';

import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../lib/firebase';
import Link from 'next/link';

export default function SubscriptionPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [subscription, setSubscription] = useState<any>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        // Fetch subscription details
        try {
          const res = await fetch('/api/check-subscription', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ customerId: firebaseUser.uid }),
          });
          const data = await res.json();
          setSubscription(data);
        } catch (error) {
          console.error('Error fetching subscription:', error);
        }
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Please sign in to view your subscription.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Subscription Management</h1>

      <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Current Plan</h2>
        <div className="flex justify-between items-center border-b pb-4">
          <div>
            <p className="font-bold text-lg">DealAnalytic Pro</p>
            <p className="text-gray-500">$49/month</p>
          </div>
          <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
            Active
          </span>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Billing History</h2>
        <p className="text-gray-500">No invoices yet.</p>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-semibold mb-4 text-red-600">Cancel Subscription</h2>
        <p className="text-gray-600 mb-4">
          Canceling your subscription will remove access to the calculator and saved deals.
        </p>
        <button
          onClick={() => {
            if (confirm('Are you sure you want to cancel your subscription?')) {
              // Redirect to Stripe customer portal
              window.location.href = 'https://billing.stripe.com/p/login/your-portal-link';
            }
          }}
          className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition"
        >
          Cancel Subscription
        </button>
      </div>

      <div className="mt-6">
        <Link href="/dashboard" className="text-blue-600 hover:underline">
          ← Back to Dashboard
        </Link>
      </div>
    </div>
  );
}