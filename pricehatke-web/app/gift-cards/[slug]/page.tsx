'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Gift, ShieldCheck, Sparkles, Check } from 'lucide-react';

interface Denomination {
  faceValue: number;
  sellPrice: number;
  discountPct: number;
}

interface BrandDetails {
  name: string;
  category: string;
  description: string;
  denominations: Denomination[];
}

export default function BrandDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;

  const brandDataMap: Record<string, BrandDetails> = {
    'amazon-pay-gift-card': {
      name: 'Amazon Pay Gift Card',
      category: 'Shopping & Utility',
      description: 'Use for shopping, bill payments, mobile recharges on Amazon India.',
      denominations: [
        { faceValue: 500, sellPrice: 485, discountPct: 3 },
        { faceValue: 1000, sellPrice: 970, discountPct: 3 },
        { faceValue: 5000, sellPrice: 4800, discountPct: 4 },
      ],
    },
    'flipkart-gift-card': {
      name: 'Flipkart E-Voucher',
      category: 'E-Commerce',
      description: 'Redeem on millions of electronics, fashion, and home appliances.',
      denominations: [
        { faceValue: 500, sellPrice: 475, discountPct: 5 },
        { faceValue: 2000, sellPrice: 1900, discountPct: 5 },
        { faceValue: 5000, sellPrice: 4700, discountPct: 6 },
      ],
    },
    'myntra-gift-card': {
      name: 'Myntra Shopping Voucher',
      category: 'Fashion & Lifestyle',
      description: 'Instant extra discounts on top apparel and footwear brands.',
      denominations: [
        { faceValue: 1000, sellPrice: 920, discountPct: 8 },
        { faceValue: 2500, sellPrice: 2275, discountPct: 9 },
        { faceValue: 5000, sellPrice: 4500, discountPct: 10 },
      ],
    },
    'croma-gift-card': {
      name: 'Croma Electronics Card',
      category: 'Electronics',
      description: 'Valid for gadgets, smartphones, and laptops at Croma stores and online.',
      denominations: [
        { faceValue: 1000, sellPrice: 960, discountPct: 4 },
        { faceValue: 3000, sellPrice: 2850, discountPct: 5 },
        { faceValue: 10000, sellPrice: 9400, discountPct: 6 },
      ],
    },
    'dominos-gift-card': {
      name: 'Domino’s Pizza Voucher',
      category: 'Food & Dining',
      description: 'Save big on pizzas, garlic bread, and sides at Domino’s India.',
      denominations: [
        { faceValue: 250, sellPrice: 212, discountPct: 15 },
        { faceValue: 500, sellPrice: 415, discountPct: 17 },
        { faceValue: 1000, sellPrice: 800, discountPct: 20 },
      ],
    },
    'uber-gift-card': {
      name: 'Uber Ride Pass Card',
      category: 'Travel & Cab',
      description: 'Save on daily cab commutes and Uber Auto rides nationwide.',
      denominations: [
        { faceValue: 250, sellPrice: 237, discountPct: 5 },
        { faceValue: 500, sellPrice: 465, discountPct: 7 },
        { faceValue: 1000, sellPrice: 920, discountPct: 8 },
      ],
    },
  };

  const brand = brandDataMap[slug] || brandDataMap['amazon-pay-gift-card'];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <Link
        href="/gift-cards"
        className="inline-flex items-center space-x-1 text-xs font-semibold text-gray-500 hover:text-orange-600 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Gift Cards Catalog</span>
      </Link>

      {/* Brand Header */}
      <div className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 space-y-4 shadow-2xs">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-orange-600 bg-orange-50 px-3 py-1 rounded-md">
            {brand.category}
          </span>
          <span className="text-xs text-emerald-600 font-bold flex items-center space-x-1">
            <ShieldCheck className="w-4 h-4" />
            <span>Instant Digital Delivery</span>
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-black text-gray-900">{brand.name}</h1>
        <p className="text-xs sm:text-sm text-gray-500 font-medium leading-relaxed">
          {brand.description}
        </p>
      </div>

      {/* Available Denominations List */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-gray-900">Select Voucher Denomination</h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {brand.denominations.map((denom) => (
            <div
              key={denom.faceValue}
              className="bg-white rounded-2xl border border-gray-200 p-5 space-y-4 shadow-2xs hover:border-orange-300 transition-all flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400 font-medium">Voucher Value</span>
                  <span className="bg-emerald-100 text-emerald-800 text-xs font-black px-2.5 py-0.5 rounded-full">
                    {denom.discountPct}% OFF
                  </span>
                </div>

                <div className="text-2xl font-black text-gray-900">
                  ₹{denom.faceValue.toLocaleString('en-IN')}
                </div>

                <div className="text-xs text-gray-600 pt-1">
                  Pay Only:{' '}
                  <span className="font-extrabold text-orange-600">
                    ₹{denom.sellPrice.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => alert(`Gift Card checkout for ₹${denom.faceValue} is a Phase 2 preview.`)}
                className="w-full py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs rounded-xl shadow-xs transition-colors"
              >
                Buy Voucher (Phase 2 Preview)
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
