'use client';

import { useEffect, useState } from 'react';

interface Testimonial {
  id: string;
  name: string;
  role: string;
  review: string;
  rating: number;
}

export default function TestimonialSection() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/testimonials')
      .then((r) => r.json())
      .then((data) => {
        setTestimonials(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const renderStars = (rating: number) =>
    '⭐'.repeat(rating) + '☆'.repeat(5 - rating);

  return (
    <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        🏠 What Investors Are Saying
      </h2>
      {loading ? (
        <p className="text-gray-500">Loading reviews...</p>
      ) : testimonials.length === 0 ? (
        <p className="text-gray-500">No reviews yet. Be the first!</p>
      ) : (
        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div key={t.id} className="bg-gray-50 p-6 rounded-lg text-left">
              <p className="text-gray-700 mb-3">&ldquo;{t.review}&rdquo;</p>
              <p className="font-semibold text-gray-900">— {t.name}</p>
              <p className="text-sm text-gray-500">{t.role}</p>
              <p className="text-sm text-yellow-500 mt-1">{renderStars(t.rating)}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}