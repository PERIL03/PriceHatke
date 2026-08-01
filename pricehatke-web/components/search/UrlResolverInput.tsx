'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Loader2, Sparkles, ArrowRight } from 'lucide-react';
import { fetchApi } from '@/lib/api';

interface ResolveResponse {
  productId: string;
  title: string;
}

export default function UrlResolverInput() {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleResolve = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetchApi<ResolveResponse>('/products/resolve', {
        method: 'POST',
        body: JSON.stringify({ input: input.trim() }),
      });

      if (res.productId) {
        router.push(`/product/${res.productId}`);
      } else {
        setError('Could not resolve product link. Please try a valid Amazon or Flipkart URL.');
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to resolve product. Make sure the API server is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      <form onSubmit={handleResolve} className="relative flex flex-col sm:flex-row items-center gap-2">
        <div className="relative flex-grow w-full">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Paste product URL (Amazon, Flipkart, etc.) or type product name..."
            className="w-full pl-11 pr-4 py-4 text-sm sm:text-base bg-white text-gray-900 placeholder-gray-400 rounded-xl sm:rounded-2xl border-2 border-gray-200 focus:border-orange-500 focus:outline-none focus:ring-4 focus:ring-orange-500/10 shadow-lg transition-all"
            disabled={loading}
          />
        </div>
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="w-full sm:w-auto px-7 py-4 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-sm sm:text-base rounded-xl sm:rounded-2xl shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50 flex items-center justify-center space-x-2 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 disabled:pointer-events-none"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Analyzing...</span>
            </>
          ) : (
            <>
              <span>Track Price</span>
              <ArrowRight className="w-5 h-5" />
            </>
          )}
        </button>
      </form>

      {/* Error Banner */}
      {error && (
        <div className="mt-3 p-3 bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm rounded-xl flex items-center justify-between animate-fadeIn">
          <span>{error}</span>
          <button onClick={() => setError(null)} className="text-red-500 font-bold ml-2">
            ✕
          </button>
        </div>
      )}

      {/* Quick Search Chips */}
      <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs text-gray-600">
        <span className="font-semibold text-gray-500 flex items-center">
          <Sparkles className="w-3.5 h-3.5 text-amber-500 mr-1" /> Try searching:
        </span>
        {[
          'iPhone 15',
          'Samsung S24 Ultra',
          'MacBook Air M3',
          'Sony WH-1000XM5',
          'Nike Jordan 1',
        ].map((chip) => (
          <button
            key={chip}
            type="button"
            onClick={() => setInput(chip)}
            className="px-3 py-1 bg-white hover:bg-orange-50 hover:text-orange-600 hover:border-orange-200 border border-gray-200 rounded-full font-medium shadow-xs transition-colors"
          >
            {chip}
          </button>
        ))}
      </div>
    </div>
  );
}
