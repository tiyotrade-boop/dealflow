'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

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

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const res = await fetch('/api/testimonials');
        if (!res.ok) {
          setTestimonials([]);
          return;
        }
        const data = await res.json();
        if (Array.isArray(data)) {
          setTestimonials(data);
        } else {
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

  const renderStars = (rating: number) => {
    return '⭐'.repeat(rating) + '☆'.repeat(5 - rating);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="max-w-5xl mx-auto px-4 py-12 text-center">
        {/* Hero */}
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

        {/* Calculator Preview */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            🖥️ See What You Get
          </h2>
          <p className="text-gray-600 mb-6">
            Professional flip calculator with instant profit & ROI analysis
          </p>
          <div className="rounded-xl overflow-hidden shadow-md border border-gray-200 bg-gray-100 p-4">
            <div className="bg-white rounded-lg p-4">
              <div className="grid grid-cols-2 gap-4 text-left">
                <div>
                  <p className="text-xs text-gray-500">Purchase Price</p>
                  <p className="font-semibold">$200,000</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Renovation Budget</p>
                  <p className="font-semibold">$50,000</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Holding Costs</p>
                  <p className="font-semibold">$2,000</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">After Repair Value</p>
                  <p className="font-semibold">$300,000</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t">
                <div>
                  <p className="text-xs text-gray-500">Total Cost</p>
                  <p className="font-bold text-gray-800">$252,000</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Profit</p>
                  <p className="font-bold text-green-600">$48,000</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">ROI</p>
                  <p className="font-bold text-yellow-600">19.0%</p>
                </div>
              </div>
            </div>
          </div>
          <p className="text-gray-400 text-sm mt-3">🔒 Full access with subscription</p>
          <div className="text-center mt-6">
            <Link
              href="/dashboard"
              className="bg-blue-600 text-white font-semibold px-8 py-3 rounded-lg hover:bg-blue-700 transition text-lg"
            >
              Try It Free →
            </Link>
            <p className="text-gray-400 text-sm mt-2">7-day free trial. No credit card required.</p>
          </div>
        </div>

        {/* Comparison Table */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Why Agents Choose DealFlow</h2>
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

        {/* Testimonials */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">🏠 What Agents Are Saying</h2>
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

        {/* CTA */}
        <div className="bg-blue-600 text-white rounded-xl p-8">
          <h2 className="text-2xl font-bold mb-4">Ready to Save Time & Close More Deals?</h2>
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