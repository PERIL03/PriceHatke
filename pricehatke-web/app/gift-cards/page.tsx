'use client';

import Link from 'next/link';
import { Gift, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';

export interface GiftCardBrand {
  slug: string;
  name: string;
  maxDiscount: number;
  category: string;
  logo: string;
  description: string;
}

export default function GiftCardsPage() {
  const brands: GiftCardBrand[] = [
    {
      slug: 'amazon-pay-gift-card',
      name: 'Amazon Pay Gift Card',
      maxDiscount: 4,
      category: 'Shopping & Utility',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg',
      description: 'Use for shopping, bill payments, mobile recharges on Amazon India.',
    },
    {
      slug: 'flipkart-gift-card',
      name: 'Flipkart E-Voucher',
      maxDiscount: 6,
      category: 'E-Commerce',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/7/7a/Flipkart_logo.svg',
      description: 'Redeem on millions of electronics, fashion, and home appliances.',
    },
    {
      slug: 'myntra-gift-card',
      name: 'Myntra Shopping Voucher',
      maxDiscount: 10,
      category: 'Fashion & Lifestyle',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/b/bc/Myntra_Logo.png',
      description: 'Instant extra discounts on top apparel and footwear brands.',
    },
    {
      slug: 'croma-gift-card',
      name: 'Croma Electronics Card',
      maxDiscount: 6,
      category: 'Electronics',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/4/4b/Croma_logo.png',
      description: 'Valid for gadgets, smartphones, and laptops at Croma stores and online.',
    },
    {
      slug: 'dominos-gift-card',
      name: 'Domino’s Pizza Voucher',
      maxDiscount: 20,
      category: 'Food & Dining',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/7/74/Dominos_pizza_logo.svg',
      description: 'Save big on pizzas, garlic bread, and sides at Domino’s India.',
    },
    {
      slug: 'uber-gift-card',
      name: 'Uber Ride Pass Card',
      maxDiscount: 8,
      category: 'Travel & Cab',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png',
      description: 'Save on daily cab commutes and Uber Auto rides nationwide.',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-orange-600 via-amber-500 to-orange-500 rounded-3xl p-8 text-white shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center space-x-1.5 bg-white/20 px-3 py-1 rounded-full text-xs font-bold">
            <Gift className="w-3.5 h-3.5" />
            <span>Instant Digital Vouchers</span>
          </div>
          <h1 className="text-3xl font-black tracking-tight">Discounted Gift Cards</h1>
          <p className="text-xs sm:text-sm text-orange-100 leading-relaxed font-medium">
            Save up to 20% flat on top brand vouchers before you checkout on Amazon, Flipkart, Myntra, Domino’s & Uber.
          </p>
        </div>
      </div>

      {/* Brand Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {brands.map((brand) => (
          <Link
            key={brand.slug}
            href={`/gift-cards/${brand.slug}`}
            className="bg-white rounded-2xl border border-gray-200 p-6 shadow-2xs hover:shadow-md transition-all hover:-translate-y-1 space-y-4 flex flex-col justify-between group"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-gray-400">
                  {brand.category}
                </span>
                <span className="bg-emerald-100 text-emerald-800 text-xs font-black px-2.5 py-0.5 rounded-full">
                  Up to {brand.maxDiscount}% OFF
                </span>
              </div>

              <div className="h-12 flex items-center">
                <h3 className="font-extrabold text-gray-900 text-lg group-hover:text-orange-600 transition-colors">
                  {brand.name}
                </h3>
              </div>

              <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed font-medium">
                {brand.description}
              </p>
            </div>

            <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
              <span className="text-xs font-bold text-gray-700 flex items-center space-x-1">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span>Instant Code</span>
              </span>

              <span className="text-xs font-bold text-orange-600 group-hover:translate-x-1 transition-transform flex items-center space-x-1">
                <span>View Vouchers</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
