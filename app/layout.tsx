import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "DealFlow - Real Estate Profit Calculator",
  description: "Calculate your flip profits and save deals in 5 seconds",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <header className="bg-white border-b border-gray-200">
          <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <div className="bg-blue-600 text-white font-bold text-xl rounded-lg px-3 py-1">
                DF
              </div>
              <span className="text-xl font-bold text-gray-800">DealFlow</span>
            </Link>
            <nav className="flex items-center gap-4">
              <Link href="/dashboard" className="text-gray-600 hover:text-blue-600 transition">
                Dashboard
              </Link>
              <Link
                href="/dashboard"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition text-sm font-semibold"
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