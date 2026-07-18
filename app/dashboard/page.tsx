'use client';

import { useEffect, useState } from 'react';
import { onAuthStateChanged, signInWithPopup, GoogleAuthProvider, signOut } from 'firebase/auth';
import { auth } from '../lib/firebase';
import DealFlowDashboard from '../components/DealFlowDashboard';

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

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

  // THIS IS THE KEY CHANGE - Return DealFlowDashboard, not DealFlowCalculator
  return (
    <div>
      <div className="bg-white border-b border-gray-200 p-4 flex justify-between items-center max-w-5xl mx-auto">
        <div>
          <span className="font-semibold text-gray-800">DealFlow</span>
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