'use client';

import { useEffect, useState } from 'react';
import { onAuthStateChanged, signInWithPopup, GoogleAuthProvider, signOut } from 'firebase/auth';
import { auth } from '../lib/firebase';
import DealFlowDashboard from '../components/DealFlowDashboard';

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [checking, setChecking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Auth listener - NO automatic subscription check
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleSignIn = async () => {
    try {
      await signInWithPopup(auth, new GoogleAuthProvider());
    } catch (error) {
      console.error('Sign-in failed:', error);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Sign-out failed:', error);
    }
  };

  const handleSubscribe = async () => {
    try {
      const response = await fetch('/api/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user?.uid,
          userEmail: user?.email,
        }),
      });
      const data = await response.json();
      if (data.error) {
        alert(data.error);
        return;
      }
      window.location.href = data.url;
    } catch (error) {
      console.error('Error:', error);
      alert('Something went wrong. Please try again.');
    }
  };

  // Manual refresh - only called when user clicks the button
  const refreshSubscription = async () => {
    if (!user) return;
    setChecking(true);
    setError(null);
    try {
      const res = await fetch('/api/check-subscription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customerId: user.uid }),
      });
      const data = await res.json();
      setIsSubscribed(data.subscribed);
      if (data.error) {
        setError(data.error);
      }
    } catch (err: any) {
      setError(err.message || 'Error checking subscription');
      setIsSubscribed(false);
    }
    setChecking(false);
  };

  // MANUAL OVERRIDE - Click to unlock
  const forceUnlock = () => {
    setIsSubscribed(true);
    setError(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-8 text-center">
          <div className="text-5xl mb-4">🏠</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">DealFlow</h1>
          <p className="text-gray-600 mb-6">Sign in to access the calculator</p>
          <button
            onClick={handleSignIn}
            className="w-full bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition font-semibold"
          >
            Sign in with Google
          </button>
        </div>
      </div>
    );
  }

  // 🔒 LOCKED - Show lock screen
  if (!isSubscribed) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-8 text-center">
          <div className="text-6xl mb-4">🔒</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Subscribe to Unlock</h1>
          <p className="text-gray-600 mb-4">
            Get full access to the calculator and start saving deals.
          </p>
          <div className="bg-blue-50 rounded-lg p-4 mb-6">
            <p className="text-blue-700 font-semibold text-lg">$49/month</p>
            <p className="text-blue-600 text-sm">7-day free trial</p>
          </div>
          <button
            onClick={handleSubscribe}
            className="w-full bg-purple-600 text-white px-4 py-3 rounded-lg hover:bg-purple-700 transition font-semibold text-lg"
          >
            Start Free Trial
          </button>
          <button
            onClick={refreshSubscription}
            className="mt-3 text-sm text-blue-600 hover:text-blue-800 block w-full"
            disabled={checking}
          >
            {checking ? 'Checking...' : 'Already subscribed? Click here to refresh'}
          </button>
          <button
            onClick={forceUnlock}
            className="mt-3 text-sm text-green-600 hover:text-green-800 block w-full border border-green-300 rounded-lg py-2 font-semibold"
          >
            ✅ Unlock Calculator (Manual)
          </button>
          {error && (
            <p className="mt-2 text-sm text-red-500">{error}</p>
          )}
          <p className="text-gray-400 text-sm mt-4">No credit card required to try</p>
          <button
            onClick={handleSignOut}
            className="mt-4 text-sm text-gray-500 hover:text-gray-700"
          >
            Sign out
          </button>
        </div>
      </div>
    );
  }

  // ✅ UNLOCKED - Show calculator
  return (
    <div>
      <div className="bg-white border-b border-gray-200 p-4 flex justify-between items-center max-w-5xl mx-auto">
        <div>
          <span className="font-semibold text-gray-800">DealFlow</span>
          <span className="text-sm text-green-600 ml-3">✅ Subscribed</span>
          <span className="text-sm text-gray-500 ml-3">{user.email}</span>
        </div>
        <button
          onClick={handleSignOut}
          className="text-sm text-gray-600 hover:text-gray-800 bg-gray-100 px-3 py-1.5 rounded-lg"
        >
          Sign out
        </button>
      </div>
      <DealFlowDashboard />
    </div>
  );
}