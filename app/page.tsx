import DealFlowDashboard from "@/app/components/DealFlowDashboard";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Landing Section */}
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

        {/* Testimonials */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            🏠 What Agents Are Saying
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-gray-50 p-6 rounded-lg text-left">
              <p className="text-gray-700 mb-3">
                "DealFlow saves me 2 hours per deal. I can't imagine going back to spreadsheets."
              </p>
              <p className="font-semibold">— Sarah M., Realtor</p>
              <p className="text-sm text-gray-500">⭐⭐⭐⭐⭐</p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg text-left">
              <p className="text-gray-700 mb-3">
                "The easiest flip calculator I've ever used. Clients love the quick reports."
              </p>
              <p className="font-semibold">— Mike T., Investor</p>
              <p className="text-sm text-gray-500">⭐⭐⭐⭐⭐</p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg text-left">
              <p className="text-gray-700 mb-3">
                "I've tried everything else. DealFlow is the only one I actually use."
              </p>
              <p className="font-semibold">— Jessica R., Agent</p>
              <p className="text-sm text-gray-500">⭐⭐⭐⭐⭐</p>
            </div>
          </div>
          <p className="text-gray-500 text-sm mt-4">⭐ Join 500+ agents already using DealFlow</p>
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