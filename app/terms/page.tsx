import Link from 'next/link';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Terms of Service</h1>
        <p className="text-gray-500 text-sm mb-8">Last updated: July 26, 2026</p>

        <div className="space-y-6 text-gray-700">
          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">1. Acceptance of Terms</h2>
            <p>
              By using DealAnalytic, you agree to these Terms of Service. If you don't agree, please don't use our service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">2. Subscription & Payments</h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>DealAnalytic offers a 7-day free trial, then $49/month</li>
              <li>You can cancel anytime — no questions asked</li>
              <li>Refunds are available within 14 days of first payment</li>
              <li>Prices may change with 30 days notice</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">3. Your Responsibilities</h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>You must be 18+ years old</li>
              <li>You agree to provide accurate information</li>
              <li>You are responsible for your account security</li>
              <li>You will use the service for legitimate business purposes only</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">4. Intellectual Property</h2>
            <p>
              All content and code on DealAnalytic is our property. You may not copy, modify, or distribute our software without permission.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">5. Limitation of Liability</h2>
            <p>
              DealAnalytic is provided "as is." We are not responsible for investment decisions you make using our tool. Always consult with a professional before making real estate decisions.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">6. Cancellation & Refund</h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>Cancel anytime from your dashboard</li>
              <li>Refunds available within 14 days of first payment</li>
              <li>No partial refunds for unused time</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">7. Contact</h2>
            <p>
              Questions? Contact us at <a href="mailto:support@dealanalytic.com" className="text-blue-600 hover:underline">support@dealanalytic.com</a>.
            </p>
          </section>
        </div>

        <div className="mt-8 pt-6 border-t">
          <Link href="/" className="text-sm text-blue-600 hover:underline">
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}