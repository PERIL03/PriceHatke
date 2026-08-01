'use client';

import Link from 'next/link';
import { ExternalLink, ShieldCheck, Tag } from 'lucide-react';

export interface DealItem {
  id: string;
  title: string;
  imageUrl: string;
  store: string;
  storeUrl: string;
  price: number;
  mrp?: number;
  discountPct: number;
  category?: string;
  verified?: boolean;
}

interface DealGridProps {
  deals: DealItem[];
  loading: boolean;
}

export default function DealGrid({ deals, loading }: DealGridProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-2xl border border-gray-100 p-4 space-y-3 animate-pulse shadow-2xs"
          >
            <div className="w-full h-48 bg-gray-200 rounded-xl" />
            <div className="h-4 bg-gray-200 rounded w-3/4" />
            <div className="h-4 bg-gray-200 rounded w-1/2" />
            <div className="h-8 bg-gray-200 rounded-lg pt-2" />
          </div>
        ))}
      </div>
    );
  }

  if (!deals || deals.length === 0) {
    return (
      <div className="bg-white rounded-3xl border border-gray-200 p-12 text-center space-y-4 shadow-2xs">
        <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-2xl flex items-center justify-center mx-auto">
          <Tag className="w-6 h-6" />
        </div>
        <h3 className="text-xl font-bold text-gray-900">No Deals Found</h3>
        <p className="text-xs text-gray-500 max-w-md mx-auto">
          No active deals match your selected store, category, or discount filters. Try clearing or relaxing your filter selection.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {deals.map((deal) => (
        <div
          key={deal.id}
          className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-2xs hover:shadow-md transition-all hover:-translate-y-1 flex flex-col justify-between"
        >
          <div>
            <div className="relative aspect-4/3 bg-gray-100 overflow-hidden">
              <img
                src={deal.imageUrl || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500'}
                alt={deal.title}
                className="w-full h-full object-cover"
              />
              <span className="absolute top-2.5 left-2.5 bg-orange-600 text-white font-black text-xs px-2.5 py-1 rounded-md shadow-md">
                {deal.discountPct}% OFF
              </span>
              <span className="absolute top-2.5 right-2.5 bg-black/60 backdrop-blur text-white text-[10px] uppercase font-bold px-2 py-0.5 rounded">
                {deal.store}
              </span>
            </div>

            <div className="p-4 space-y-2">
              <div className="flex items-center justify-between text-[10px] font-bold text-gray-400">
                <span className="uppercase tracking-wider">{deal.category || 'General'}</span>
                {deal.verified && (
                  <span className="text-emerald-600 flex items-center space-x-0.5">
                    <ShieldCheck className="w-3 h-3" />
                    <span>Verified Deal</span>
                  </span>
                )}
              </div>

              <Link href={`/deals/${deal.id}`} className="block">
                <h3 className="font-bold text-gray-900 text-sm line-clamp-2 leading-snug hover:text-orange-600 transition-colors">
                  {deal.title}
                </h3>
              </Link>
            </div>
          </div>

          <div className="p-4 pt-0 flex items-center justify-between border-t border-gray-50 mt-2">
            <div>
              <span className="text-lg font-black text-gray-900">
                ₹{deal.price.toLocaleString('en-IN')}
              </span>
              {deal.mrp && (
                <span className="text-xs text-gray-400 line-through ml-2">
                  ₹{deal.mrp.toLocaleString('en-IN')}
                </span>
              )}
            </div>

            <a
              href={deal.storeUrl || '#'}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center space-x-1 bg-gray-900 hover:bg-orange-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition-colors"
            >
              <span>Get Deal</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      ))}
    </div>
  );
}
