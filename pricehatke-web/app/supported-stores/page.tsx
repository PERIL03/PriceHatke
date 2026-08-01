import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Supported Stores — PriceHatke',
  description: 'List of 100+ Indian e-commerce stores supported for price tracking.',
};

export default function SupportedStoresPage() {
  const stores = [
    'Amazon India', 'Flipkart', 'Myntra', 'Ajio', 'Meesho', 'Nykaa', 'Croma', 'Tata Cliq',
    'Reliance Digital', 'BookMyShow', 'Uber', 'Domino’s', 'Swiggy', 'Zomato', 'Blinkit', 'Zepto'
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-6">
      <h1 className="text-3xl font-black text-gray-900 tracking-tight">Supported Stores</h1>
      <p className="text-sm text-gray-600 leading-relaxed">
        PriceHatke tracks price history across all major Indian e-commerce platforms.
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4">
        {stores.map((s) => (
          <div key={s} className="bg-white border border-gray-200 rounded-xl p-4 text-center font-bold text-xs text-gray-800 shadow-2xs">
            {s}
          </div>
        ))}
      </div>
    </div>
  );
}
