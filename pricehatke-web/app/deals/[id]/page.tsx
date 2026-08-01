'use client';

import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { fetchApi } from '@/lib/api';
import Link from 'next/link';
import { ArrowLeft, ExternalLink, ShieldCheck, Tag, Loader2 } from 'lucide-react';

interface DealDetail {
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

export default function DealDetailPage() {
  const params = useParams();
  const dealId = params?.id as string;

  const { data: deal, isLoading } = useQuery<DealDetail>({
    queryKey: ['deal-detail', dealId],
    queryFn: () => fetchApi<DealDetail>(`/deals/${dealId}`),
    enabled: !!dealId,
  });

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-3">
        <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
        <p className="text-xs text-gray-500 font-medium">Loading deal details...</p>
      </div>
    );
  }

  if (!deal) {
    return (
      <div className="max-w-4xl mx-auto py-16 px-4 text-center space-y-4">
        <h2 className="text-2xl font-bold text-gray-900">Deal Not Found</h2>
        <p className="text-sm text-gray-500">The deal you requested may have expired.</p>
        <Link href="/deals" className="inline-flex items-center space-x-1 text-xs font-bold text-orange-600">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Deals</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <Link
        href="/deals"
        className="inline-flex items-center space-x-1 text-xs font-semibold text-gray-500 hover:text-orange-600 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Deals Feed</span>
      </Link>

      <div className="bg-white rounded-3xl border border-gray-200 overflow-hidden shadow-sm grid grid-cols-1 md:grid-cols-2 gap-8 p-6 sm:p-8">
        <div className="aspect-square bg-gray-50 rounded-2xl overflow-hidden border border-gray-100 relative">
          <img
            src={deal.imageUrl || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500'}
            alt={deal.title}
            className="w-full h-full object-cover"
          />
          <span className="absolute top-4 left-4 bg-orange-600 text-white font-black text-sm px-3 py-1 rounded-lg shadow-md">
            {deal.discountPct}% OFF
          </span>
        </div>

        <div className="space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="bg-gray-100 text-gray-700 uppercase px-2.5 py-1 rounded-md">
                {deal.store}
              </span>
              {deal.verified && (
                <span className="text-emerald-600 flex items-center space-x-1">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Verified Deal</span>
                </span>
              )}
            </div>

            <h1 className="text-xl sm:text-2xl font-black text-gray-900 leading-snug">
              {deal.title}
            </h1>

            <div className="p-4 bg-orange-50/50 rounded-2xl border border-orange-100 space-y-1">
              <div className="flex items-baseline space-x-3">
                <span className="text-3xl font-black text-gray-900">
                  ₹{deal.price.toLocaleString('en-IN')}
                </span>
                {deal.mrp && (
                  <span className="text-sm text-gray-400 line-through">
                    ₹{deal.mrp.toLocaleString('en-IN')}
                  </span>
                )}
              </div>
              <p className="text-xs text-emerald-700 font-bold">
                You save ₹{((deal.mrp || deal.price) - deal.price).toLocaleString('en-IN')} ({deal.discountPct}% off)
              </p>
            </div>
          </div>

          <a
            href={deal.storeUrl || '#'}
            target="_blank"
            rel="noreferrer"
            className="w-full py-4 bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm rounded-2xl shadow-lg shadow-orange-500/20 flex items-center justify-center space-x-2 transition-all hover:scale-[1.01]"
          >
            <span>Claim Deal on {deal.store.toUpperCase()}</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  );
}
