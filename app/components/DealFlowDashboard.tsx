'use client';

import { useEffect, useState } from 'react';
import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
  type User,
} from 'firebase/auth';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  where,
} from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import DealFlowCalculator from './DealFlowCalculator';

interface CalculatorValues {
  purchasePrice: number;
  renovationBudget: number;
  holdingCosts: number;
  arv: number;
  profit: number;
  roi: number;
}

interface SavedDeal extends CalculatorValues {
  id: string;
  dealName: string;
  userId: string;
  createdAt?: { toDate: () => Date } | null;
}

const DEFAULT_VALUES: CalculatorValues = {
  purchasePrice: 0,
  renovationBudget: 0,
  holdingCosts: 0,
  arv: 0,
  profit: 0,
  roi: 0,
};

export default function DealFlowDashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [calcValues, setCalcValues] = useState<CalculatorValues>(DEFAULT_VALUES);
  const [deals, setDeals] = useState<SavedDeal[]>([]);
  const [dealsLoading, setDealsLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showDealModal, setShowDealModal] = useState(false);
  const [dealName, setDealName] = useState('');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) {
      setDeals([]);
      return;
    }

    setDealsLoading(true);
    const dealsQuery = query(
      collection(db, 'deals'),
      where('userId', '==', user.uid),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(
      dealsQuery,
      (snapshot) => {
        const results: SavedDeal[] = snapshot.docs.map((docSnap) => {
          const data = docSnap.data();
          return {
            id: docSnap.id,
            dealName: data.dealName,
            userId: data.userId,
            purchasePrice: data.purchasePrice,
            renovationBudget: data.renovationBudget,
            holdingCosts: data.holdingCosts,
            arv: data.arv,
            profit: data.profit,
            roi: data.roi,
            createdAt: data.createdAt,
          };
        });
        setDeals(results);
        setDealsLoading(false);
      },
      (err) => {
        console.error('Failed to load deals:', err);
        setError('Could not load saved deals.');
        setDealsLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user]);

  const handleSignIn = async () => {
    setError(null);
    try {
      await signInWithPopup(auth, new GoogleAuthProvider());
    } catch (err) {
      console.error('Sign-in failed:', err);
      setError('Sign-in failed. Please try again.');
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error('Sign-out failed:', err);
    }
  };

  const handleSaveDeal = () => {
    if (!user) return;
    setShowDealModal(true);
    setDealName('');
  };

  const handleConfirmSave = async () => {
    if (!dealName.trim()) return;

    setSaving(true);
    setError(null);
    try {
      await addDoc(collection(db, 'deals'), {
        userId: user.uid,
        dealName: dealName.trim(),
        purchasePrice: calcValues.purchasePrice,
        renovationBudget: calcValues.renovationBudget,
        holdingCosts: calcValues.holdingCosts,
        arv: calcValues.arv,
        profit: calcValues.profit,
        roi: calcValues.roi,
        createdAt: serverTimestamp(),
      });
      setShowDealModal(false);
      setDealName('');
    } catch (err) {
      console.error('Failed to save deal:', err);
      setError('Could not save this deal. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteDeal = async (dealId: string) => {
    const confirmed = window.confirm('Delete this deal? This cannot be undone.');
    if (!confirmed) return;

    try {
      await deleteDoc(doc(db, 'deals', dealId));
    } catch (err) {
      console.error('Failed to delete deal:', err);
      setError('Could not delete this deal. Please try again.');
    }
  };

  const handleSubscribe = async () => {
    try {
      const response = await fetch('/api/create-checkout', {
        method: 'POST',
      });
      const data = await response.json();
      
      if (data.error) {
        alert(data.error);
        return;
      }
      
      // Redirect to Stripe checkout
      window.location.href = data.url;
    } catch (error) {
      console.error('Error:', error);
      alert('Something went wrong. Please try again.');
    }
  };

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(
      value || 0
    );

  const formatPercent = (value: number) => `${(value || 0).toFixed(1)}%`;

  return (
    <div className="mx-auto max-w-5xl space-y-6 p-4 sm:p-6">
      <div className="flex flex-col items-start justify-between gap-3 rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Deal Flow Dashboard</h1>
          <p className="text-sm text-gray-500">
            Run the numbers, then save and track your deals.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {authLoading ? (
            <span className="text-sm text-gray-400">Checking sign-in status…</span>
          ) : user ? (
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-gray-700">{user.email}</span>
              <button
                onClick={handleSignOut}
                className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
              >
                Sign out
              </button>
            </div>
          ) : (
            <button
              onClick={handleSignIn}
              className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700"
            >
              <svg className="h-4 w-4" viewBox="0 0 48 48" aria-hidden="true">
                <path
                  fill="#FFC107"
                  d="M43.6 20.5h-1.9V20.5H24v7.5h11.3c-1.6 4.6-6 7.5-11.3 7.5-6.9 0-12.5-5.6-12.5-12.5S17.1 10.5 24 10.5c3.2 0 6 1.2 8.2 3.1l5.3-5.3C34.3 5.4 29.4 3.5 24 3.5 12.7 3.5 3.5 12.7 3.5 24S12.7 44.5 24 44.5 44.5 35.3 44.5 24c0-1.2-.1-2.4-.9-3.5z"
                />
                <path
                  fill="#FF3D00"
                  d="M6.3 14.7l6.2 4.5C14.2 15.6 18.8 13 24 13c3.2 0 6 1.2 8.2 3.1l5.3-5.3C34.3 7.9 29.4 6 24 6c-7.5 0-13.9 4.3-17.7 8.7z"
                />
                <path
                  fill="#4CAF50"
                  d="M24 44.5c5.3 0 10.1-1.8 13.7-4.9l-6.3-5.2c-2 1.4-4.6 2.3-7.4 2.3-5.3 0-9.7-2.9-11.3-7.5l-6.3 4.9c3.7 4.6 9.7 7.6 16.6 7.6z"
                />
                <path
                  fill="#1976D2"
                  d="M43.6 20.5H24v7.5h11.3c-.8 2.3-2.2 4.1-4.1 5.4l6.3 5.2c3.7-3.4 5.9-8.5 5.9-15.1 0-1.2-.1-2.4-.8-3z"
                />
              </svg>
              Sign in with Google
            </button>
          )}
        </div>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
        <DealFlowCalculator onValuesChange={setCalcValues} />
      </div>

      <div className="flex justify-end gap-4">
        <button
          onClick={handleSaveDeal}
          disabled={!user || saving}
          className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-gray-300"
        >
          {saving ? 'Saving…' : 'Save Deal'}
        </button>

        <button
          onClick={handleSubscribe}
          className="rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-purple-700"
        >
          💳 Subscribe ($49/mo)
        </button>
      </div>
      {!user && (
        <p className="text-right text-xs text-gray-400">Sign in to save deals.</p>
      )}

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-200 px-4 py-3">
          <h2 className="text-sm font-semibold text-gray-900">Saved Deals</h2>
        </div>

        {!user ? (
          <p className="px-4 py-6 text-sm text-gray-400">
            Sign in to view your saved deals.
          </p>
        ) : dealsLoading ? (
          <p className="px-4 py-6 text-sm text-gray-400">Loading deals…</p>
        ) : deals.length === 0 ? (
          <p className="px-4 py-6 text-sm text-gray-400">
            No deals saved yet. Run the numbers above and click "Save Deal."
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                <tr>
                  <th className="px-4 py-2">Deal Name</th>
                  <th className="px-4 py-2">Purchase Price</th>
                  <th className="px-4 py-2">Renovation</th>
                  <th className="px-4 py-2">Holding Costs</th>
                  <th className="px-4 py-2">ARV</th>
                  <th className="px-4 py-2">Profit</th>
                  <th className="px-4 py-2">ROI</th>
                  <th className="px-4 py-2"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {deals.map((deal) => (
                  <tr key={deal.id} className="hover:bg-gray-50">
                    <td className="px-4 py-2 font-medium text-gray-900">
                      {deal.dealName}
                    </td>
                    <td className="px-4 py-2 text-gray-600">
                      {formatCurrency(deal.purchasePrice)}
                    </td>
                    <td className="px-4 py-2 text-gray-600">
                      {formatCurrency(deal.renovationBudget)}
                    </td>
                    <td className="px-4 py-2 text-gray-600">
                      {formatCurrency(deal.holdingCosts)}
                    </td>
                    <td className="px-4 py-2 text-gray-600">{formatCurrency(deal.arv)}</td>
                    <td
                      className={`px-4 py-2 font-medium ${
                        deal.profit >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}
                    >
                      {formatCurrency(deal.profit)}
                    </td>
                    <td className="px-4 py-2 text-gray-600">{formatPercent(deal.roi)}</td>
                    <td className="px-4 py-2 text-right">
                      <button
                        onClick={() => handleDeleteDeal(deal.id)}
                        className="rounded-md border border-red-200 px-2 py-1 text-xs font-medium text-red-600 transition hover:bg-red-50"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Save Deal Modal */}
      {showDealModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <h2 className="text-xl font-semibold mb-4">Save Deal</h2>
            <p className="text-gray-600 mb-4">Enter a name for this deal:</p>
            <input
              type="text"
              value={dealName}
              onChange={(e) => setDealName(e.target.value)}
              placeholder="e.g., House #1"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-4"
              autoFocus
            />
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowDealModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmSave}
                disabled={saving}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:bg-gray-300"
              >
                {saving ? 'Saving...' : 'Save Deal'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}