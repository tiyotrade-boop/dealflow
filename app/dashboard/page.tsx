'use client';

import { useEffect, useState } from 'react';
import { onAuthStateChanged, signInWithPopup, GoogleAuthProvider, signOut } from 'firebase/auth';
import { auth } from '../lib/firebase';
import DealFlowCalculator from '../components/DealFlowCalculator';

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isSubscribed, setIsSubscribed] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        try {
          const res = await fetch('/api/check-subscription', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ customerId: firebaseUser.uid }),
          });
          const data = await res.json();
          setIsSubscribed(data.subscribed);
        } catch (error) {
          setIsSubscribed(false);
        }
      }
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

  return (
    <div className="max-w-5xl mx-auto p-4">
      {/* Header */}
      <div className="flex justify-between items-center bg-white rounded-xl p-4 shadow-sm mb-6">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Deal Flow Dashboard</h1>
          <p className="text-sm text-gray-500">{user.email}</p>
        </div>
        <div className="flex items-center gap-3">
          {isSubscribed && (
            <span className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full font-medium">
              ✅ Subscribed
            </span>
          )}
          <button
            onClick={handleSignOut}
            className="text-sm text-gray-600 hover:text-gray-800 bg-gray-100 px-3 py-1.5 rounded-lg"
          >
            Sign out
          </button>
        </div>
      </div>

      {/* Calculator Section with Lock Overlay */}
      <div className="relative">
        {/* The Calculator (always visible) */}
        <div className={!isSubscribed ? 'opacity-50 pointer-events-none' : ''}>
          <DealFlowCalculator />
        </div>

        {/* Lock Overlay for Non-Subscribers */}
        {!isSubscribed && (
          <div className="absolute inset-0 bg-white/80 backdrop-blur-sm rounded-2xl flex flex-col items-center justify-center p-8">
            <div className="text-6xl mb-4">🔒</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Subscribe to Unlock</h2>
            <p className="text-gray-600 mb-4 text-center max-w-md">
              Get full access to the calculator, save deals, and track your profits.
            </p>
            <div className="bg-blue-50 rounded-lg p-4 mb-6 text-center">
              <p className="text-blue-700 font-semibold text-lg">$49/month</p>
              <p className="text-blue-600 text-sm">7-day free trial</p>
            </div>
            <button
              onClick={handleSubscribe}
              className="bg-purple-600 text-white px-8 py-3 rounded-lg hover:bg-purple-700 transition font-semibold text-lg"
            >
              Start Free Trial
            </button>
            <p className="text-gray-400 text-sm mt-4">No credit card required to try</p>
          </div>
        )}
      </div>
    </div>
  );
}