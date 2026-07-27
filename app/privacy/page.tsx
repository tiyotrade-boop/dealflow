import Link from 'next/link';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Privacy Policy</h1>
        <p className="text-gray-500 text-sm mb-8">Last updated: July 26, 2026</p>

        <div className="space-y-6 text-gray-700">
          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">1. Information We Collect</h2>
            <p>
              We collect information you provide directly, including your name, email address, and payment information when you subscribe.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">2. How We Use Your Information</h2>
            <p>
              We use your information to:
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Provide and maintain our service</li>
              <li>Process your payments</li>
              <li>Send you updates and support communications</li>
              <li>Improve our service</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">3. Data Security</h2>
            <p>
              We use industry-standard encryption and security measures to protect your data. Your payment information is processed securely by Stripe and is never stored on our servers.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">4. Third-Party Services</h2>
            <p>
              We use the following third-party services:
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li><strong>Firebase</strong> - Authentication and database</li>
              <li><strong>Stripe</strong> - Payment processing</li>
              <li><strong>Vercel</strong> - Hosting</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">5. Your Rights</h2>
            <p>
              You have the right to access, modify, or delete your personal data at any time. Contact us at <a href="mailto:support@dealanalytic.com" className="text-blue-600 hover:underline">support@dealanalytic.com</a>.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">6. Contact</h2>
            <p>
              Questions about this Privacy Policy? Contact us at <a href="mailto:support@dealanalytic.com" className="text-blue-600 hover:underline">support@dealanalytic.com</a>.
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