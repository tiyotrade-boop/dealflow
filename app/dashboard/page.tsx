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
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">DealFlow</h1>
          <p className="text-gray-600 mb-6">Sign in to access the calculator</p>
          <button
            onClick={handleSignIn}
            className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition font-semibold"
          >
            Sign in with Google
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="bg-white border-b border-gray-200 p-4 flex justify-between items-center">
        <span className="font-semibold text-gray-800">Signed in as: {user.email}</span>
        <button
          onClick={handleSignOut}
          className="bg-gray-200 text-gray-700 px-4 py-1 rounded-lg hover:bg-gray-300 transition"
        >
          Sign Out
        </button>
      </div>
      <DealFlowDashboard />
    </div>
  );
}