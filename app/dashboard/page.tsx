'use client';

import { useEffect, useState } from 'react';
import { onAuthStateChanged, signInWithPopup, GoogleAuthProvider, signOut } from 'firebase/auth';
import { auth } from '../lib/firebase';
import DealFlowCalculator from '../components/DealFlowCalculator';

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [checking, setChecking] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        await checkSubscription(firebaseUser.uid);
      } else {
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  const checkSubscription = async (userId: string) => {
    setChecking(true);
    try {
      const res = await fetch('/api/check-subscription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customerId: userId }),
      });
      const data = await res.json();
      setIsSubscribed(data.subscribed);
    } catch (error) {
      setIsSubscribed(false);
    } finally {
      setLoading(false);
      setChecking(false);
    }
  };

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

  const refreshSubscription = async () => {
    if (user) {
      setChecking(true);
      await checkSubscription(user.uid);
    }
  };

  if (loading || checking) {
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
          >
            Already subscribed? Click here to refresh
          </button>
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

  // Subscribed - show the full calculator
  return (
    <div className="max-w-5xl mx-auto p-4">
      <div className="flex justify-between items-center bg-white rounded-xl p-4 shadow-sm mb-6">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Deal Flow Dashboard</h1>
          <p className="text-sm text-gray-500">{user.email}</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full font-medium">
            ✅ Subscribed
          </span>
          <button
            onClick={handleSignOut}
            className="text-sm text-gray-600 hover:text-gray-800 bg-gray-100 px-3 py-1.5 rounded-lg"
          >
            Sign out
          </button>
        </div>
      </div>
      <DealFlowCalculator />
    </div>
  );
}