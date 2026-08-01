'use client';

import { Suspense, useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { fetchApi } from '@/lib/api';
import DealFilters from '@/components/deals/DealFilters';
import DealGrid, { DealItem } from '@/components/deals/DealGrid';
import { ChevronLeft, ChevronRight, Tag } from 'lucide-react';

interface DealsApiResponse {
  data: DealItem[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

function DealsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [store, setStore] = useState<string>(searchParams?.get('store') || '');
  const [minDiscount, setMinDiscount] = useState<number>(
    Number(searchParams?.get('minDiscount')) || 0,
  );
  const [category, setCategory] = useState<string>(searchParams?.get('category') || '');
  const [sort, setSort] = useState<string>(searchParams?.get('sort') || 'popularity');
  const [page, setPage] = useState<number>(Number(searchParams?.get('page')) || 1);

  // Sync state to URL params
  useEffect(() => {
    const params = new URLSearchParams();
    if (store) params.set('store', store);
    if (minDiscount > 0) params.set('minDiscount', minDiscount.toString());
    if (category) params.set('category', category);
    if (sort && sort !== 'popularity') params.set('sort', sort);
    if (page > 1) params.set('page', page.toString());

    const queryString = params.toString();
    router.push(`/deals${queryString ? `?${queryString}` : ''}`, { scroll: false });
  }, [store, minDiscount, category, sort, page, router]);

  // Fetch Deals from API
  const { data, isLoading } = useQuery<DealsApiResponse>({
    queryKey: ['deals-feed', store, minDiscount, category, sort, page],
    queryFn: () => {
      const params = new URLSearchParams();
      if (store) params.set('store', store);
      if (minDiscount > 0) params.set('minDiscount', minDiscount.toString());
      if (category) params.set('category', category);
      if (sort) params.set('sort', sort);
      params.set('page', page.toString());
      params.set('limit', '9');

      return fetchApi<DealsApiResponse>(`/deals?${params.toString()}`);
    },
  });

  const handleReset = () => {
    setStore('');
    setMinDiscount(0);
    setCategory('');
    setSort('popularity');
    setPage(1);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Header */}
      <div className="border-b border-gray-200 pb-6">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-orange-100 text-orange-600 rounded-xl flex items-center justify-center">
            <Tag className="w-4 h-4" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
            Hot Online Deals
          </h1>
        </div>
        <p className="text-xs sm:text-sm text-gray-500 mt-1">
          Verified high-discount deals across Amazon, Flipkart, Myntra, Ajio & 100+ stores.
        </p>
      </div>

      {/* Grid & Filter Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Filters */}
        <div className="lg:col-span-1">
          <DealFilters
            store={store}
            minDiscount={minDiscount}
            category={category}
            sort={sort}
            onStoreChange={(s) => {
              setStore(s);
              setPage(1);
            }}
            onDiscountChange={(d) => {
              setMinDiscount(d);
              setPage(1);
            }}
            onCategoryChange={(c) => {
              setCategory(c);
              setPage(1);
            }}
            onSortChange={(s) => {
              setSort(s);
              setPage(1);
            }}
            onReset={handleReset}
          />
        </div>

        {/* Main Feed */}
        <div className="lg:col-span-3 space-y-8">
          <DealGrid deals={data?.data || []} loading={isLoading} />

          {/* Pagination Controls */}
          {data?.meta && data.meta.totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-gray-200 pt-6">
              <span className="text-xs text-gray-500 font-semibold">
                Page <span className="text-gray-900 font-bold">{data.meta.page}</span> of{' '}
                <span className="text-gray-900 font-bold">{data.meta.totalPages}</span> ({data.meta.total} deals)
              </span>

              <div className="flex items-center space-x-2">
                <button
                  disabled={page <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="px-3 py-2 border border-gray-200 rounded-xl text-xs font-bold text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:pointer-events-none flex items-center space-x-1"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Prev</span>
                </button>

                <button
                  disabled={page >= data.meta.totalPages}
                  onClick={() => setPage((p) => Math.min(data.meta.totalPages, p + 1))}
                  className="px-3 py-2 border border-gray-200 rounded-xl text-xs font-bold text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:pointer-events-none flex items-center space-x-1"
                >
                  <span>Next</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function DealsPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-gray-500">Loading Deals...</div>}>
      <DealsContent />
    </Suspense>
  );
}
