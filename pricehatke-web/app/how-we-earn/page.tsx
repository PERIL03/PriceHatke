import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'How We Earn — PriceHatke Transparency',
  description: '100% transparent explanation of PriceHatke affiliate commissions.',
};

export default function HowWeEarnPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-6">
      <h1 className="text-3xl font-black text-gray-900 tracking-tight">How We Earn</h1>
      <p className="text-sm text-gray-600 leading-relaxed">
        PriceHatke is 100% free for users. When you click our outbound buy links to Amazon, Flipkart, Myntra, or other merchant stores and complete a purchase, the store may pay us a small affiliate referral commission.
      </p>
      <p className="text-xs text-gray-500 leading-relaxed">
        This commission comes at zero extra cost to you. It supports our engineering team and infrastructure costs to keep price tracking free for everyone.
      </p>
    </div>
  );
}
