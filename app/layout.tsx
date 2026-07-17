import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "DealFlow - Flip Calculator for Real Estate Agents",
  description: "Calculate your flip profits and save deals in 5 seconds",
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
      <body className={inter.className}>
        <header className="bg-white border-b border-gray-100 shadow-sm">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition">
              <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center text-white font-bold text-sm shadow-sm">
                DF
              </div>
              <span className="text-lg font-semibold text-gray-800">DealFlow</span>
            </Link>
            <nav className="flex items-center gap-1 sm:gap-3">
              <Link
                href="/dashboard"
                className="px-3 py-1.5 text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
              >
                Dashboard
              </Link>
              <Link
                href="/#pricing"
                className="px-4 py-1.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition shadow-sm"
              >
                Free Trial
              </Link>
            </nav>
          </div>
        </header>
        {children}
      </body>
    </html>
  );
}