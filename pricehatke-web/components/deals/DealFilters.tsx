'use client';

import { Filter, RotateCcw } from 'lucide-react';

interface DealFiltersProps {
  store: string;
  minDiscount: number;
  category: string;
  sort: string;
  onStoreChange: (store: string) => void;
  onDiscountChange: (discount: number) => void;
  onCategoryChange: (category: string) => void;
  onSortChange: (sort: string) => void;
  onReset: () => void;
}

export default function DealFilters({
  store,
  minDiscount,
  category,
  sort,
  onStoreChange,
  onDiscountChange,
  onCategoryChange,
  onSortChange,
  onReset,
}: DealFiltersProps) {
  const stores = ['Amazon', 'Flipkart', 'Myntra', 'Ajio', 'Meesho', 'Nykaa', 'Croma', 'Tata Cliq'];
  const discounts = [
    { label: 'Min 40%', value: 40 },
    { label: 'Min 50%', value: 50 },
    { label: 'Min 60%', value: 60 },
    { label: 'Min 70%', value: 70 },
  ];
  const categories = ['All', 'Audio', 'Electronics', 'Laptops', 'Fashion', 'Footwear', 'Home & Kitchen', 'Wearables'];

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs space-y-6">
      <div className="flex items-center justify-between border-b border-gray-100 pb-3">
        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4 text-orange-500" />
          <h3 className="font-bold text-gray-900 text-sm">Filter & Sort Deals</h3>
        </div>
        <button
          onClick={onReset}
          className="text-xs font-semibold text-gray-400 hover:text-orange-600 flex items-center space-x-1 transition-colors"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset</span>
        </button>
      </div>

      {/* Sort Option */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-gray-700 block uppercase tracking-wider">
          Sort By
        </label>
        <select
          value={sort}
          onChange={(e) => onSortChange(e.target.value)}
          className="w-full px-3 py-2 bg-gray-50 text-gray-900 rounded-xl border border-gray-200 text-xs font-semibold focus:outline-none focus:border-orange-500"
        >
          <option value="popularity">Most Popular</option>
          <option value="discount">Highest Discount %</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
          <option value="newest">Newest Deals</option>
        </select>
      </div>

      {/* Minimum Discount Filter */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-gray-700 block uppercase tracking-wider">
          Minimum Discount
        </label>
        <div className="grid grid-cols-2 gap-2">
          {discounts.map((d) => (
            <button
              key={d.value}
              onClick={() => onDiscountChange(minDiscount === d.value ? 0 : d.value)}
              className={`py-2 px-2.5 text-xs rounded-xl font-bold border transition-all ${
                minDiscount === d.value
                  ? 'bg-orange-500 text-white border-orange-500 shadow-xs'
                  : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-orange-50 hover:border-orange-200'
              }`}
            >
              {d.label}
            </button>
          ))}
        </div>
      </div>

      {/* Store Filter */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-gray-700 block uppercase tracking-wider">
          Filter Store
        </label>
        <div className="flex flex-wrap gap-1.5">
          <button
            onClick={() => onStoreChange('')}
            className={`px-3 py-1.5 text-xs rounded-lg font-semibold transition-all ${
              !store
                ? 'bg-gray-900 text-white font-bold'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            All Stores
          </button>
          {stores.map((s) => {
            const isSelected = store.toLowerCase() === s.toLowerCase();
            return (
              <button
                key={s}
                onClick={() => onStoreChange(isSelected ? '' : s.toLowerCase())}
                className={`px-3 py-1.5 text-xs rounded-lg font-semibold transition-all ${
                  isSelected
                    ? 'bg-orange-500 text-white font-bold'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {s}
              </button>
            );
          })}
        </div>
      </div>

      {/* Category Filter */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-gray-700 block uppercase tracking-wider">
          Category
        </label>
        <select
          value={category}
          onChange={(e) => onCategoryChange(e.target.value === 'All' ? '' : e.target.value)}
          className="w-full px-3 py-2 bg-gray-50 text-gray-900 rounded-xl border border-gray-200 text-xs font-semibold focus:outline-none focus:border-orange-500"
        >
          {categories.map((c) => (
            <option key={c} value={c === 'All' ? '' : c}>
              {c}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
