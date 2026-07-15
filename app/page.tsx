'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Testimonial {
  id: string;
  name: string;
  role: string;
  review: string;
  rating: number;
}

export default function Home() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [formStatus, setFormStatus] = useState<{ message: string; type: 'success' | 'error' | null }>({
    message: '',
    type: null,
  });

  // Fetch testimonials on load
  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const res = await fetch('/api/testimonials');
        if (!res.ok) {
          console.error('Failed to fetch testimonials:', res.status);
          setTestimonials([]);
          return;
        }
        const data = await res.json();
        // Make sure data is an array
        if (Array.isArray(data)) {
          setTestimonials(data);
        } else {
          console.error('Testimonials data is not an array:', data);
          setTestimonials([]);
        }
      } catch (error) {
        console.error('Failed to load testimonials:', error);
        setTestimonials([]);
      } finally {
        setLoading(false);
      }
    };
    fetchTestimonials();
  }, []);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    const name = formData.get('name') as string;
    const role = formData.get('role') as string;
    const review = formData.get('review') as string;
    const rating = parseInt(formData.get('rating') as string) || 5;

    if (!name || !review) {
      setFormStatus({ message: 'Please fill in all required fields.', type: 'error' });
      return;
    }

    try {
      const res = await fetch('/api/testimonials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, role, review, rating }),
      });

      if (res.ok) {
        setFormStatus({ message: '✅ Thank you! Your review has been submitted for approval.', type: 'success' });
        form.reset();
      } else {
        const error = await res.json();
        setFormStatus({ message: error.error || 'Something went wrong. Please try again.', type: 'error' });
      }
    } catch (error) {
      setFormStatus({ message: 'Network error. Please try again.', type: 'error' });
    }
  };

  // Star rating display
  const renderStars = (rating: number) => {
    return '⭐'.repeat(rating) + '☆'.repeat(5 - rating);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="max-w-5xl mx-auto px-4 py-12 text-center">
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-2xl p-12 mb-8 shadow-xl">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            ⚡ 5 Seconds to Know <br />If a Deal Is Worth It
          </h1>
          <p className="text-xl md:text-2xl text-blue-100 mb-6">
            Stop wasting hours on spreadsheets. Get instant profit & ROI analysis.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/dashboard"
              className="bg-white text-blue-700 font-semibold px-8 py-3 rounded-lg hover:bg-blue-50 transition text-lg"
            >
              🚀 Try Free for 7 Days
            </Link>
            <Link
              href="/dashboard"
              className="bg-blue-700 text-white font-semibold px-8 py-3 rounded-lg hover:bg-blue-900 transition text-lg"
            >
              See the Calculator
            </Link>
          </div>
          <p className="text-blue-200 text-sm mt-4">✅ No credit card required</p>
        </div>

        {/* Comparison Table */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Why Agents Choose DealFlow
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b">
                  <th className="py-3 px-4 font-semibold text-gray-600">Feature</th>
                  <th className="py-3 px-4 font-semibold text-green-600">DealFlow</th>
                  <th className="py-3 px-4 font-semibold text-red-500">Competitors</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="py-3 px-4">💰 Price</td>
                  <td className="py-3 px-4 font-bold text-green-600">$49/mo</td>
                  <td className="py-3 px-4 text-red-500">$99+/mo</td>
                </tr>
                <tr className="border-b">
                  <td className="py-3 px-4">⏱️ Time to Calculate</td>
                  <td className="py-3 px-4 font-bold text-green-600">5 seconds</td>
                  <td className="py-3 px-4 text-red-500">10+ minutes</td>
                </tr>
                <tr className="border-b">
                  <td className="py-3 px-4">📱 Mobile Friendly</td>
                  <td className="py-3 px-4 font-bold text-green-600">✅ Yes</td>
                  <td className="py-3 px-4 text-red-500">❌ Often no</td>
                </tr>
                <tr>
                  <td className="py-3 px-4">🎓 Learning Curve</td>
                  <td className="py-3 px-4 font-bold text-green-600">Zero</td>
                  <td className="py-3 px-4 text-red-500">Steep</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="text-center mt-6">
            <Link
              href="/dashboard"
              className="bg-blue-600 text-white font-semibold px-8 py-3 rounded-lg hover:bg-blue-700 transition text-lg"
            >
              Start Your Free Trial →
            </Link>
          </div>
        </div>

        {/* Testimonials Display */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            🏠 What Agents Are Saying
          </h2>

          {loading ? (
            <p className="text-gray-500">Loading reviews...</p>
          ) : testimonials.length === 0 ? (
            <p className="text-gray-500">No reviews yet. Be the first to leave one!</p>
          ) : (
            <div className="grid md:grid-cols-3 gap-6">
              {testimonials.map((t) => (
                <div key={t.id} className="bg-gray-50 p-6 rounded-lg text-left">
                  <p className="text-gray-700 mb-3">"{t.review}"</p>
                  <p className="font-semibold">— {t.name}</p>
                  <p className="text-sm text-gray-500">{t.role}</p>
                  <p className="text-sm text-yellow-500">{renderStars(t.rating)}</p>
                </div>
              ))}
            </div>
          )}
          <p className="text-gray-500 text-sm mt-4">⭐ Join 500+ agents already using DealFlow</p>
        </div>

        {/* Submit Testimonial Form */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            ✍️ Share Your Experience
          </h2>
          <p className="text-gray-600 mb-6">
            Used DealFlow? Let others know what you think!
          </p>

          {formStatus.message && (
            <div
              className={`mb-4 p-3 rounded-lg ${
                formStatus.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
              }`}
            >
              {formStatus.message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="max-w-lg mx-auto">
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Your Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                placeholder="e.g., Sarah M."
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Your Role</label>
              <input
                type="text"
                name="role"
                placeholder="e.g., Realtor, Investor"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Your Review <span className="text-red-500">*</span>
              </label>
              <textarea
                name="review"
                rows={3}
                placeholder="How did DealFlow help you?"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
                required
              ></textarea>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
              <select
                name="rating"
                className="w-full border border-gray-300 rounded-lg px-4 py-2"
              >
                <option value="5">⭐⭐⭐⭐⭐ (5)</option>
                <option value="4">⭐⭐⭐⭐☆ (4)</option>
                <option value="3">⭐⭐⭐☆☆ (3)</option>
                <option value="2">⭐⭐☆☆☆ (2)</option>
                <option value="1">⭐☆☆☆☆ (1)</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition font-semibold"
            >
              Submit Review
            </button>
          </form>

          <p className="text-gray-400 text-sm mt-4 text-center">
            ⚡ Reviews are moderated. Your email will not be published.
          </p>
        </div>

        {/* CTA Section */}
        <div className="bg-blue-600 text-white rounded-xl p-8">
          <h2 className="text-2xl font-bold mb-4">
            Ready to Save Time & Close More Deals?
          </h2>
          <Link
            href="/dashboard"
            className="bg-white text-blue-700 font-semibold px-8 py-3 rounded-lg hover:bg-blue-50 transition text-lg inline-block"
          >
            🚀 Start Your Free 7-Day Trial
          </Link>
          <p className="text-blue-200 text-sm mt-4">No credit card required. Cancel anytime.</p>
        </div>
      </section>
    </div>
  );
}