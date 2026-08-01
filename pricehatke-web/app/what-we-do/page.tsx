import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'What We Do — PriceHatke',
  description: 'Understand how PriceHatke monitors prices and verifies genuine deals.',
};

export default function WhatWeDoPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-6">
      <h1 className="text-3xl font-black text-gray-900 tracking-tight">What We Do</h1>
      <p className="text-sm text-gray-600 leading-relaxed">
        PriceHatke automatically scans over 100 online stores in India, capturing price snapshots every day. Our algorithm analyzes price histories to detect artificial price hikes before sale events and alerts you when prices reach all-time lows.
      </p>
    </div>
  );
}
