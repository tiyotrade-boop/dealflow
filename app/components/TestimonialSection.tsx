'use client';

import { useEffect, useState, useRef } from 'react';

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

function SkeletonCard() {
  return (
    <div className="shrink-0 w-72 bg-gray-50 rounded-xl p-6 border border-gray-100 shadow-sm animate-pulse">
      <div className="h-4 bg-gray-200 rounded mb-2 w-full" />
      <div className="h-4 bg-gray-200 rounded mb-2 w-4/5" />
      <div className="h-4 bg-gray-200 rounded mb-6 w-3/5" />
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gray-200 shrink-0" />
        <div className="flex-1">
          <div className="h-3 bg-gray-200 rounded mb-2 w-24" />
          <div className="h-3 bg-gray-200 rounded w-16" />
        </div>
      </div>
    </div>
  );
}

export default function TestimonialSection() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch('/api/testimonials')
      .then((r) => r.json())
      .then((data) => {
        setTestimonials(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: direction === 'right' ? 320 : -320,
        behavior: 'smooth',
      });
    }
  };

  const renderStars = (rating: number) =>
    '⭐'.repeat(rating) + '☆'.repeat(5 - rating);

  return (
    <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center">
        🏠 What Investors Are Saying
      </h2>

      {loading ? (
        <div className="flex gap-4 overflow-hidden px-2">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      ) : testimonials.length === 0 ? (
        <p className="text-gray-500 text-center">No reviews yet. Be the first to leave one!</p>
      ) : (
        <div className="relative">
          {/* Left arrow */}
          <button
            onClick={() => scroll('left')}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-10 h-10 bg-white border border-gray-200 rounded-full shadow-md flex items-center justify-center hover:bg-gray-50 transition"
          >
            ←
          </button>

          {/* Scrollable container */}
          <div
            ref={scrollRef}
            className="flex gap-4 overflow-x-auto scroll-smooth pb-4 px-2"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {testimonials.map((t, i) => (
              <div
                key={t.id}
                className="shrink-0 w-72 bg-gray-50 rounded-xl p-6 border border-gray-100 shadow-sm flex flex-col justify-between"
              >
                <p className="text-gray-700 leading-relaxed mb-4 text-sm">
                  &ldquo;{t.review}&rdquo;
                </p>
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-full ${AVATAR_COLORS[i % AVATAR_COLORS.length]} flex items-center justify-center text-white font-bold text-sm shrink-0`}
                  >
                    {getInitials(t.name)}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">{t.name}</p>
                    <p className="text-xs text-gray-500">{t.role}</p>
                    <p className="text-xs text-yellow-500">{renderStars(t.rating)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Right arrow */}
          <button
            onClick={() => scroll('right')}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-10 h-10 bg-white border border-gray-200 rounded-full shadow-md flex items-center justify-center hover:bg-gray-50 transition"
          >
            →
          </button>
        </div>
      )}
    </div>
  );
}