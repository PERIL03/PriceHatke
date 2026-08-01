import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Us — PriceHatke',
  description: 'Learn how PriceHatke helps millions of Indian shoppers save money with price history tracking and genuine deals.',
};

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-6">
      <h1 className="text-3xl font-black text-gray-900 tracking-tight">About PriceHatke</h1>
      <p className="text-sm text-gray-600 leading-relaxed">
        PriceHatke is India’s leading shopping assistant and price history tracking platform. Founded with the mission to bring 100% price transparency to Indian e-commerce, we empower shoppers to make smart buying decisions by plotting full historical price trends across Amazon, Flipkart, Myntra, Ajio, and 100+ top online stores.
      </p>
      <div className="bg-orange-50 border border-orange-200 rounded-2xl p-6 space-y-2">
        <h3 className="font-bold text-orange-900 text-base">Our Vision</h3>
        <p className="text-xs text-orange-800 leading-relaxed">
          To ensure no Indian online shopper ever pays more than the true lowest price for any product.
        </p>
      </div>
    </div>
  );
}
