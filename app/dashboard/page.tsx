import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../lib/firebase';
import Link from 'next/link';

// Lazy load the dashboard
const DealFlowDashboard = React.lazy(() => import('../components/DealFlowDashboard'));

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [subscribed, setSubscribed] = useState(false);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        router.push('/');
        return;
      }

      setUser(firebaseUser);

      try {
        const res = await fetch('/api/check-subscription', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ customerId: firebaseUser.uid }),
        });
        const data = await res.json();
        setSubscribed(data.subscribed);
      } catch (error) {
        console.error('Error checking subscription:', error);
        setSubscribed(false);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  if (!subscribed) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-8 text-center">
          <div className="text-6xl mb-4">🔒</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Subscribe to Unlock</h1>
          <p className="text-gray-600 mb-6">
            You need an active subscription to use the DealFlow calculator.
          </p>
          <div className="bg-blue-50 rounded-lg p-4 mb-6">
            <p className="text-blue-700 font-semibold">$49/month</p>
            <p className="text-blue-600 text-sm">7-day free trial</p>
          </div>
          <Link
            href="/"
            className="block w-full bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition font-semibold"
          >
            Start Free Trial
          </Link>
          <p className="text-gray-400 text-sm mt-4">No credit card required to try</p>
        </div>
      </div>
    );
  }

  return (
    <React.Suspense fallback={<div className="min-h-screen flex items-center justify-center"><p className="text-gray-500">Loading dashboard...</p></div>}>
      <DealFlowDashboard />
    </React.Suspense>
  );
}