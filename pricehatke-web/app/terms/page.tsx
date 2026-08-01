import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms & Conditions — PriceHatke',
  description: 'Terms of service and legal conditions for PriceHatke users.',
};

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-6">
      <h1 className="text-3xl font-black text-gray-900 tracking-tight">Terms & Conditions</h1>
      <p className="text-xs text-gray-500">Last updated: August 1, 2026</p>

      <div className="prose prose-sm text-gray-600 space-y-4">
        <p>
          By accessing or using PriceHatke, you agree to be bound by these Terms and Conditions. PriceHatke provides price comparison and tracking tools for informational purposes.
        </p>
        <h3 className="font-bold text-gray-900 text-sm">Use of Service</h3>
        <p>
          Price data is gathered from publicly available sources. While we strive for 100% accuracy, merchant stores may change prices at any time. Always verify final prices on the seller’s checkout page.
        </p>
      </div>
    </div>
  );
}
