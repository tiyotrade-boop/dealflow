'use client';

import { useEffect, useState } from 'react';
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
  const [user, setUser] = useState<any>(null);
  const [calcValues, setCalcValues] = useState<CalculatorValues>(DEFAULT_VALUES);
  const [deals, setDeals] = useState<SavedDeal[]>([]);
  const [dealsLoading, setDealsLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showDealModal, setShowDealModal] = useState(false);
  const [dealName, setDealName] = useState('');

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((firebaseUser) => {
      setUser(firebaseUser);
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

  const handleSaveDeal = () => {
    if (!user) {
      setError('Please sign in to save deals.');
      return;
    }
    setShowDealModal(true);
    setDealName('');
  };

  const handleConfirmSave = async () => {
    if (!dealName.trim()) return;

    setSaving(true);
    setError(null);
    try {
      await addDoc(collection(db, 'deals'), {
        userId: user!.uid,
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

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(
      value || 0
    );

  const formatPercent = (value: number) => `${(value || 0).toFixed(1)}%`;

  return (
    <div className="mx-auto max-w-5xl space-y-6 p-4 sm:p-6">
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
        <DealFlowCalculator onValuesChange={setCalcValues} />
      </div>

      {/* Save Deal Button */}
      <div className="flex justify-end">
        <button
          onClick={handleSaveDeal}
          disabled={!user || saving}
          className="rounded-lg bg-green-600 px-6 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-gray-300"
        >
          {saving ? 'Saving…' : '💾 Save Deal'}
        </button>
      </div>

      {/* Saved Deals Table */}
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