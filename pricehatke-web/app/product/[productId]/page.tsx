'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { fetchApi } from '@/lib/api';
import PriceStatCards from '@/components/product/PriceStatCards';
import PriceHistoryChart from '@/components/product/PriceHistoryChart';
import StoreCompareTable from '@/components/product/StoreCompareTable';
import SetAlertModal from '@/components/product/SetAlertModal';
import { Bell, Share2, ShieldCheck, ArrowLeft, ExternalLink, Loader2 } from 'lucide-react';
import Link from 'next/link';

interface ProductDetail {
  id: string;
  canonicalTitle: string;
  category: string;
  imageUrl: string;
  stats: {
    currentPrice: number;
    lowestEver: number;
    highestEver: number;
    averagePrice: number;
  };
  stores: any[];
}

export default function ProductPage() {
  const params = useParams();
  const productId = params?.productId as string;

  const [range, setRange] = useState<string>('all');
  const [alertModalOpen, setAlertModalOpen] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  // 1. Product Details Query
  const { data: product, isLoading: loadingProduct } = useQuery<ProductDetail>({
    queryKey: ['product-detail', productId],
    queryFn: () => fetchApi<ProductDetail>(`/products/${productId}`),
    enabled: !!productId,
  });

  // 2. Price History Query
  const { data: history, isLoading: loadingHistory } = useQuery({
    queryKey: ['price-history', productId, range],
    queryFn: () => fetchApi<any[]>(`/products/${productId}/history?range=${range}`),
    enabled: !!productId,
  });

  // 3. Store Compare Query
  const { data: compareStores } = useQuery({
    queryKey: ['store-compare', productId],
    queryFn: () => fetchApi<any[]>(`/products/${productId}/compare`),
    enabled: !!productId,
  });

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loadingProduct) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-3">
        <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
        <p className="text-xs text-gray-500 font-medium">Loading product price history...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-4xl mx-auto py-16 px-4 text-center space-y-4">
        <h2 className="text-2xl font-bold text-gray-900">Product Not Found</h2>
        <p className="text-sm text-gray-500">The product you requested could not be loaded.</p>
        <Link
          href="/"
          className="inline-flex items-center space-x-1 text-xs font-bold text-orange-600 hover:underline"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Breadcrumb / Back Link */}
      <div className="flex items-center justify-between text-xs text-gray-500">
        <Link
          href="/"
          className="inline-flex items-center space-x-1 font-semibold hover:text-orange-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Search</span>
        </Link>
        <span className="uppercase font-bold tracking-wider text-orange-600 bg-orange-50 px-2.5 py-1 rounded-md">
          {product.category || 'General'}
        </span>
      </div>

      {/* Main Product Header Card */}
      <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-xs flex flex-col md:flex-row gap-6 lg:gap-8 items-start">
        {/* Product Image */}
        <div className="w-full md:w-64 h-64 bg-gray-50 rounded-2xl overflow-hidden border border-gray-100 flex-shrink-0">
          <img
            src={product.imageUrl || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500'}
            alt={product.canonicalTitle}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Info & CTAs */}
        <div className="flex-grow space-y-4 w-full">
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-gray-900 leading-snug">
              {product.canonicalTitle}
            </h1>
            <p className="text-xs text-gray-500 mt-1 flex items-center space-x-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span>Verified price tracking engine</span>
            </p>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => setAlertModalOpen(true)}
              className="px-5 py-3 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md shadow-orange-500/20 flex items-center space-x-2 transition-all hover:scale-[1.02]"
            >
              <Bell className="w-4 h-4" />
              <span>Set Price Drop Alert</span>
            </button>

            <button
              onClick={handleShare}
              className="px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold text-xs sm:text-sm rounded-xl transition-colors flex items-center space-x-1.5"
            >
              <Share2 className="w-4 h-4" />
              <span>{copied ? 'Copied Link!' : 'Share'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 1. Price Stat Cards */}
      <PriceStatCards
        currentPrice={product.stats.currentPrice}
        lowestEver={product.stats.lowestEver}
        highestEver={product.stats.highestEver}
        averagePrice={product.stats.averagePrice}
      />

      {/* 2. Interactive Price History Chart */}
      <PriceHistoryChart
        history={history || []}
        selectedRange={range}
        onRangeChange={setRange}
      />

      {/* 3. Cross Store Comparison Table */}
      <StoreCompareTable stores={compareStores || product.stores} />

      {/* Set Alert Modal */}
      <SetAlertModal
        productId={product.id}
        productTitle={product.canonicalTitle}
        currentPrice={product.stats.currentPrice}
        isOpen={alertModalOpen}
        onClose={() => setAlertModalOpen(false)}
      />
    </div>
  );
}
