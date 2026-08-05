import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import Script from "next/script";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "DealAnalytic — Flip Calculator for Real Estate Investors",
  description: "Calculate flip profits and ROI, and save your deals, in seconds.",
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Google Analytics */}
        <Script
          strategy="afterInteractive"
          src="https://www.googletagmanager.com/gtag/js?id=G-Y546C77GNF"
        />
        <Script
          id="google-analytics"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-Y546C77GNF');
            `,
          }}
        />
      </head>
      <body className={inter.className}>
        <header className="bg-white border-b border-gray-200">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
            <Link
              href="/"
              className="flex items-center gap-2.5 hover:opacity-80 transition"
            >
              <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-sm shadow-sm">
                DA
              </div>
              <span className="text-lg font-semibold tracking-tight text-gray-900">
                DealAnalytic
              </span>
            </Link>
            <nav className="flex items-center gap-1 sm:gap-2">
              <Link
                href="/dashboard"
                className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 rounded-lg transition"
              >
                Dashboard
              </Link>
              <Link
                href="/contact"
                className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 rounded-lg transition"
              >
                Contact
              </Link>
              <Link
                href="/dashboard"
                className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition shadow-sm"
              >
                Start Free Trial
              </Link>
            </nav>
          </div>
        </header>

        {children}

        <footer className="bg-gray-50 border-t border-gray-200 py-8 mt-12">
          <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-gray-600">
            <div className="flex gap-6">
              <Link href="/contact" className="hover:text-blue-600 transition">
                Contact
              </Link>
              <Link href="/privacy" className="hover:text-blue-600 transition">
                Privacy
              </Link>
              <Link href="/terms" className="hover:text-blue-600 transition">
                Terms
              </Link>
            </div>
            <p>&copy; {new Date().getFullYear()} DealAnalytic. All rights reserved.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}