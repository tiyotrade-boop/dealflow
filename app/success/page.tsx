'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../lib/firebase';
import Link from 'next/link';

export default function SuccessPage() {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Wait for auth to be ready
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in, redirect to dashboard after 2 seconds
        setTimeout(() => {
          router.push('/dashboard');
        }, 2000);
        setLoading(false);
      } else {
        // User not signed in, redirect to home
        router.push('/');
      }
    });

    return () => unsubscribe();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Processing your subscription...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-8 text-center">
        <div className="text-6xl mb-4">🎉</div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Payment Successful!</h1>
        <p className="text-gray-600 mb-6">
          Thank you for subscribing to DealFlow Pro!
          <br />
          <span className="text-sm text-gray-400">You will be redirected to the dashboard...</span>
        </p>
        <Link
          href="/dashboard"
          className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Go to Dashboard Now
        </Link>
        <div className="mt-4 w-full bg-gray-200 rounded-full h-1">
          <div className="bg-blue-600 h-1 rounded-full animate-pulse w-full"></div>
        </div>
      </div>
    </div>
  );
}