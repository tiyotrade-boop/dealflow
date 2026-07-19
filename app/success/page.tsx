'use client';

import { Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { db } from '../lib/firebase';
import { doc, setDoc } from 'firebase/firestore';
import Link from 'next/link';

function SuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [saving, setSaving] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const saveSubscription = async () => {
      try {
        const userId = searchParams.get('user_id');
        const sessionId = searchParams.get('session_id');
        
        console.log('📝 Saving subscription for user:', userId);
        console.log('📝 Session ID:', sessionId);

        if (!userId) {
          setError('No user ID found');
          setSaving(false);
          return;
        }

        await setDoc(doc(db, 'users', userId), {
          subscribed: true,
          subscribedAt: new Date().toISOString(),
          stripeSessionId: sessionId || 'unknown',
        }, { merge: true });

        console.log('✅ Subscription saved successfully!');
        setSaving(false);

        setTimeout(() => {
          router.push('/dashboard');
        }, 2000);
      } catch (err) {
        console.error('❌ Error saving subscription:', err);
        setError('Could not save subscription status. Please contact support.');
        setSaving(false);
      }
    };

    saveSubscription();
  }, [router, searchParams]);

  if (saving) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">⏳</div>
          <p className="text-gray-600">Activating your subscription...</p>
          <div className="mt-4 w-48 h-1 bg-gray-200 rounded-full overflow-hidden">
            <div className="w-full h-full bg-blue-600 animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-8 text-center">
          <div className="text-5xl mb-4">😅</div>
          <h1 className="text-xl font-bold text-gray-800 mb-2">Something went wrong</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <Link href="/dashboard" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition">
            Go to Dashboard
          </Link>
        </div>
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
          <span className="text-sm text-gray-400">Redirecting to dashboard...</span>
        </p>
        <Link href="/dashboard" className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition">
          Go to Dashboard Now
        </Link>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><p className="text-gray-500">Loading...</p></div>}>
      <SuccessContent />
    </Suspense>
  );
}