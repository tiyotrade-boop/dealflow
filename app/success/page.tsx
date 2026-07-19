'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import Link from 'next/link';

function SuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<'saving' | 'saved' | 'error'>('saving');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const saveSubscription = async () => {
      try {
        const userId = searchParams.get('user_id');
        
        if (!userId) {
          setStatus('error');
          setErrorMsg('No user ID found');
          return;
        }

        // Save subscription status to Firebase
        await setDoc(doc(db, 'users', userId), {
          subscribed: true,
          subscribedAt: new Date().toISOString(),
        }, { merge: true });

        setStatus('saved');
        
        // Redirect to dashboard after 2 seconds
        setTimeout(() => {
          router.push('/dashboard');
        }, 2000);
      } catch (err: any) {
        console.error('❌ Error saving subscription:', err);
        setStatus('error');
        setErrorMsg(err.message || 'Failed to save subscription');
      }
    };

    saveSubscription();
  }, [router, searchParams]);

  if (status === 'saving') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
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

  if (status === 'error') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-8 text-center">
          <div className="text-5xl mb-4">❌</div>
          <h1 className="text-xl font-bold text-gray-800 mb-2">Something went wrong</h1>
          <p className="text-gray-600 mb-6">{errorMsg || 'Could not activate subscription'}</p>
          <Link href="/dashboard" className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition">
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
        <div className="w-full h-1 bg-gray-200 rounded-full overflow-hidden">
          <div className="w-full h-full bg-green-500 animate-pulse"></div>
        </div>
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