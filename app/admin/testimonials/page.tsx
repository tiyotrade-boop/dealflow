'use client';

import { useEffect, useState } from 'react';
import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from 'firebase/firestore';
import { db } from '../../lib/firebase';

interface Testimonial {
  id: string;
  name: string;
  role: string;
  review: string;
  rating: number;
  status: 'pending' | 'approved';
}

export default function AdminTestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [review, setReview] = useState('');
  const [rating, setRating] = useState(5);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [tab, setTab] = useState<'pending' | 'approved'>('pending');

  useEffect(() => {
    const q = query(collection(db, 'testimonials'), orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(q, (snap) => {
      setTestimonials(
        snap.docs.map((d) => ({ id: d.id, ...d.data() } as Testimonial))
      );
    });
    return () => unsub();
  }, []);

  const handleAdd = async () => {
    if (!name.trim() || !review.trim()) {
      setError('Name and review are required.');
      return;
    }
    setSaving(true);
    setError('');
    try {
      await addDoc(collection(db, 'testimonials'), {
        name: name.trim(),
        role: role.trim(),
        review: review.trim(),
        rating,
        status: 'approved',
        createdAt: serverTimestamp(),
      });
      setName('');
      setRole('');
      setReview('');
      setRating(5);
    } catch {
      setError('Failed to save. Try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleApprove = async (id: string) => {
    await updateDoc(doc(db, 'testimonials', id), { status: 'approved' });
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this testimonial?')) return;
    await deleteDoc(doc(db, 'testimonials', id));
  };

  const filtered = testimonials.filter((t) => (t.status || 'approved') === tab);

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Manage Testimonials</h1>

      {/* Add form */}
      <div className="bg-white rounded-xl shadow p-6 mb-8 space-y-4">
        <h2 className="text-lg font-semibold text-gray-800">Add Testimonial</h2>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <input
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Name *"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Role (e.g. Real Estate Investor)"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        />
        <textarea
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Review *"
          rows={3}
          value={review}
          onChange={(e) => setReview(e.target.value)}
        />
        <div className="flex items-center gap-3">
          <label className="text-sm text-gray-600">Rating:</label>
          <select
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
            value={rating}
            onChange={(e) => setRating(Number(e.target.value))}
          >
            {[5, 4, 3, 2, 1].map((r) => (
              <option key={r} value={r}>{r} star{r !== 1 ? 's' : ''}</option>
            ))}
          </select>
        </div>
        <button
          onClick={handleAdd}
          disabled={saving}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition disabled:bg-gray-300"
        >
          {saving ? 'Saving...' : 'Add Testimonial'}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setTab('pending')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
            tab === 'pending'
              ? 'bg-yellow-500 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          Pending ({testimonials.filter((t) => (t.status || 'approved') === 'pending').length})
        </button>
        <button
          onClick={() => setTab('approved')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
            tab === 'approved'
              ? 'bg-green-600 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          Approved ({testimonials.filter((t) => (t.status || 'approved') === 'approved').length})
        </button>
      </div>

      {/* List */}
      <div className="space-y-4">
        {filtered.length === 0 && (
          <p className="text-gray-500 text-sm">No {tab} testimonials.</p>
        )}
        {filtered.map((t) => (
          <div key={t.id} className="bg-white rounded-xl shadow p-4">
            <p className="text-gray-700 text-sm mb-1">&ldquo;{t.review}&rdquo;</p>
            <p className="font-semibold text-sm text-gray-900">{t.name}</p>
            <p className="text-xs text-gray-500">{t.role}</p>
            <p className="text-xs text-yellow-500 mb-3">{'⭐'.repeat(t.rating)}</p>
            <div className="flex gap-2">
              {tab === 'pending' && (
                <button
                  onClick={() => handleApprove(t.id)}
                  className="bg-green-600 text-white text-xs px-3 py-1 rounded-lg hover:bg-green-700 transition"
                >
                  ✓ Approve
                </button>
              )}
              <button
                onClick={() => handleDelete(t.id)}
                className="text-red-500 text-xs border border-red-200 px-3 py-1 rounded-lg hover:bg-red-50 transition"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
