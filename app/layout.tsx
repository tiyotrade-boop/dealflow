import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Script from "next/script";
import { Analytics } from '@vercel/analytics/react';
import Header from "./components/Header"; // ← Import Header

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
        {/* Google Ads Tag */}
        <Script
          strategy="afterInteractive"
          src="https://www.googletagmanager.com/gtag/js?id=AW-18367676947"
        />
        <Script
          id="google-ads-tag"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'AW-18367676947');
            `,
          }}
        />

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
        <Header /> {/* ← Use Header component */}
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
        <Analytics />
      </body>
    </html>
  );
}