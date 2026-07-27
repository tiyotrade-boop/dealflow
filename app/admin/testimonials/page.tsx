'use client';

import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '../../lib/firebase';
import { collection, query, where, getDocs, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';

export default function AdminTestimonialsPage() {
  const [user, setUser] = useState<any>(null);
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        router.push('/');
        return;
      }
      setUser(firebaseUser);
      await fetchTestimonials();
    });
    return () => unsubscribe();
  }, [router]);

  const fetchTestimonials = async () => {
    try {
      const q = query(
        collection(db, 'testimonials'),
        where('approved', '==', false)
      );
      const snapshot = await getDocs(q);
      const results = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTestimonials(results);
    } catch (error) {
      console.error('Error fetching testimonials:', error);
    } finally {
      setLoading(false);
    }
  };

  const approveTestimonial = async (id: string) => {
    try {
      await updateDoc(doc(db, 'testimonials', id), {
        approved: true,
      });
      setTestimonials(testimonials.filter(t => t.id !== id));
    } catch (error) {
      console.error('Error approving testimonial:', error);
    }
  };

  const deleteTestimonial = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'testimonials', id));
      setTestimonials(testimonials.filter(t => t.id !== id));
    } catch (error) {
      console.error('Error deleting testimonial:', error);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Pending Testimonials</h1>
      {testimonials.length === 0 ? (
        <p className="text-gray-500">No pending testimonials.</p>
      ) : (
        <div className="space-y-4">
          {testimonials.map((t) => (
            <div key={t.id} className="bg-white rounded-xl shadow-lg p-6">
              <p className="text-gray-700 mb-2">"{t.review}"</p>
              <p className="font-semibold">— {t.name}</p>
              <p className="text-sm text-gray-500">{t.role}</p>
              <p className="text-yellow-500">{"⭐".repeat(t.rating)}</p>
              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => approveTestimonial(t.id)}
                  className="bg-green-600 text-white px-4 py-1 rounded-lg hover:bg-green-700"
                >
                  Approve
                </button>
                <button
                  onClick={() => deleteTestimonial(t.id)}
                  className="bg-red-600 text-white px-4 py-1 rounded-lg hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}