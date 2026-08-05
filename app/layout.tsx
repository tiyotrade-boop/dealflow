import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import Script from "next/script";
import { Analytics } from '@vercel/analytics/react'; // ← ADD THIS

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
      </head>
      <body className={inter.className}>
        <header className="bg-white border-b border-gray-200">
          {/* Your existing header */}
        </header>
        {children}
        <footer>
          {/* Your existing footer */}
        </footer>
        <Analytics /> {/* ← ADD THIS */}
      </body>
    </html>
  );
}