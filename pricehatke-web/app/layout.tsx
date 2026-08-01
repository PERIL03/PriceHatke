import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import StatsBar from '@/components/layout/StatsBar';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import QueryProvider from '@/components/providers/QueryProvider';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'PriceHatke — Advance Price Tracker for Amazon, Flipkart & More',
  description:
    'Track price drop history, compare prices across stores, browse curated deals, and buy discounted gift cards.',
  keywords: [
    'price history tracker',
    'amazon price drop alert',
    'flipkart price tracker',
    'pricehatke',
    'buyhatke clone',
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen flex flex-col bg-gray-50 font-sans text-gray-900 antialiased selection:bg-orange-500 selection:text-white">
        <QueryProvider>
          <StatsBar />
          <Navbar />
          <main className="flex-grow">{children}</main>
          <Footer />
        </QueryProvider>
      </body>
    </html>
  );
}
