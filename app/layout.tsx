import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Script from 'next/script';
import { Analytics } from '@vercel/analytics/react';
import Link from 'next/link';
import Header from './components/Header';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'DealAnalytic — Flip Calculator for Real Estate Investors',
  description: 'Calculate flip profits and ROI, and save your deals, in seconds.',
  icons: {
    icon: '/favicon.svg',
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
        <Script strategy="afterInteractive" src="https://www.googletagmanager.com/gtag/js?id=AW-18367676947" />
        <Script id="google-ads-tag" strategy="afterInteractive" dangerouslySetInnerHTML={{ __html: `window.dataLayer = window.dataLayer || [];function gtag(){dataLayer.push(arguments);}gtag('js', new Date());gtag('config', 'AW-18367676947');` }} />
        <Script strategy="afterInteractive" src="https://www.googletagmanager.com/gtag/js?id=G-Y546C77GNF" />
        <Script id="google-analytics" strategy="afterInteractive" dangerouslySetInnerHTML={{ __html: `window.dataLayer = window.dataLayer || [];function gtag(){dataLayer.push(arguments);}gtag('js', new Date());gtag('config', 'G-Y546C77GNF');` }} />
        <Script
          id="crisp-chat"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `window.$crisp=[];window.CRISP_WEBSITE_ID="9b9e90aa-dbfe-40d5-8bba-6337f56f6e9f";(function(){d=document;s=d.createElement("script");s.src="https://client.crisp.chat/l.js";s.async=1;d.getElementsByTagName("head")[0].appendChild(s);})();`,
          }}
        />
      </head>
      <body className={inter.className}>
        <Header />
        {children}
        <footer className="bg-gray-50 border-t border-gray-200 py-8 mt-12">
          <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-gray-600">
            <div className="flex gap-6">
              <Link href="/contact" className="hover:text-blue-600 transition">Contact</Link>
              <Link href="/privacy" className="hover:text-blue-600 transition">Privacy</Link>
              <Link href="/terms" className="hover:text-blue-600 transition">Terms</Link>
            </div>
            <p>&copy; {new Date().getFullYear()} DealAnalytic. All rights reserved.</p>
          </div>
        </footer>
        <Analytics />
      </body>
    </html>
  );
}
