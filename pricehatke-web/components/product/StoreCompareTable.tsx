'use client';

import { ExternalLink, CheckCircle2 } from 'lucide-react';

interface StoreItem {
  storeListingId: string;
  store: string;
  storeUrl: string;
  price: number;
  mrp?: number;
  discountPct?: number;
  inStock?: boolean;
}

export default function StoreCompareTable({ stores }: { stores: StoreItem[] }) {
  if (!stores || stores.length === 0) return null;

  // Find cheapest store
  const sorted = [...stores].sort((a, b) => a.price - b.price);
  const lowestPrice = sorted[0]?.price;

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs space-y-4">
      <div className="flex items-center justify-between border-b border-gray-100 pb-3">
        <h3 className="font-bold text-gray-900 text-base">Cross-Store Price Comparison</h3>
        <span className="text-xs text-gray-500 font-medium">Updated live across stores</span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs sm:text-sm">
          <thead>
            <tr className="border-b border-gray-100 text-gray-400 uppercase text-[10px] font-bold tracking-wider">
              <th className="py-2.5 px-3">Store</th>
              <th className="py-2.5 px-3">Current Price</th>
              <th className="py-2.5 px-3">MRP</th>
              <th className="py-2.5 px-3">Discount</th>
              <th className="py-2.5 px-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 font-medium">
            {sorted.map((item) => {
              const isBest = item.price === lowestPrice;
              return (
                <tr
                  key={item.storeListingId}
                  className={`hover:bg-gray-50/80 transition-colors ${
                    isBest ? 'bg-orange-50/40' : ''
                  }`}
                >
                  <td className="py-3 px-3">
                    <div className="flex items-center space-x-2">
                      <span className="font-bold uppercase text-gray-900">{item.store}</span>
                      {isBest && (
                        <span className="inline-flex items-center space-x-1 bg-emerald-100 text-emerald-800 text-[10px] font-extrabold px-2 py-0.5 rounded-full">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          <span>Lowest Price</span>
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-3 font-bold text-gray-900 text-sm">
                    ₹{item.price.toLocaleString('en-IN')}
                  </td>
                  <td className="py-3 px-3 text-gray-400 line-through">
                    {item.mrp ? `₹${item.mrp.toLocaleString('en-IN')}` : '-'}
                  </td>
                  <td className="py-3 px-3 text-emerald-600 font-bold">
                    {item.discountPct ? `${item.discountPct}% OFF` : '-'}
                  </td>
                  <td className="py-3 px-3 text-right">
                    <a
                      href={item.storeUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center space-x-1 bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs px-3.5 py-1.5 rounded-lg shadow-xs transition-colors"
                    >
                      <span>Buy Now</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
