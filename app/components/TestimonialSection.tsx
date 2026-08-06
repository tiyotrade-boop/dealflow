'use client';

import { useEffect, useState } from 'react';

interface Testimonial {
  id: string;
  name: string;
  role: string;
  review: string;
  rating: number;
}

function getInitials(name: string) {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

const AVATAR_COLORS = [
  'bg-blue-600',
  'bg-indigo-600',
  'bg-violet-600',
  'bg-sky-600',
  'bg-teal-600',
  'bg-emerald-600',
];

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
      <h2 className="text-2xl font-bold text-gray-800 mb-10 text-center">
        🏠 What Investors Are Saying
      </h2>

      {loading ? (
        <p className="text-gray-500 text-center">Loading reviews...</p>
      ) : testimonials.length === 0 ? (
        <p className="text-gray-500 text-center">No reviews yet. Be the first to leave one!</p>
      ) : (
        <div className="space-y-8">
          {testimonials.map((t, i) => {
            const isLeft = i % 2 === 0;
            const avatarColor = AVATAR_COLORS[i % AVATAR_COLORS.length];
            return (
              <div
                key={t.id}
                className={`flex items-start gap-6 ${isLeft ? 'flex-row' : 'flex-row-reverse'}`}
              >
                {/* Avatar */}
                <div className={`shrink-0 w-14 h-14 rounded-full ${avatarColor} flex items-center justify-center text-white font-bold text-lg shadow-md`}>
                  {getInitials(t.name)}
                </div>

                {/* Card */}
                <div className={`flex-1 bg-gray-50 rounded-xl p-6 relative shadow-sm border border-gray-100 ${isLeft ? 'rounded-tl-none' : 'rounded-tr-none'}`}>
                  {/* Speech bubble triangle */}
                  <div
                    className={`absolute top-4 w-3 h-3 bg-gray-50 border-gray-100 rotate-45 ${
                      isLeft
                        ? '-left-1.5 border-l border-t'
                        : '-right-1.5 border-r border-t'
                    }`}
                  />
                  <p className="text-gray-700 mb-4 leading-relaxed">
                    &ldquo;{t.review}&rdquo;
                  </p>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-gray-900">{t.name}</p>
                      <p className="text-sm text-gray-500">{t.role}</p>
                    </div>
                    <p className="text-sm text-yellow-500">{renderStars(t.rating)}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}