'use client';

import { TrendingDown, Users, ShoppingBag, Star } from 'lucide-react';

export default function StatsBar() {
  const stats = [
    { label: '100M+ Shoppers', icon: Users, desc: 'Trusted across India' },
    { label: '₹200Cr+ Saved', icon: TrendingDown, desc: 'In price drop savings' },
    { label: '100+ Stores Tracked', icon: ShoppingBag, desc: 'Amazon, Flipkart & more' },
    { label: '4.8 ★ Rating', icon: Star, desc: 'Top Chrome extension' },
  ];

  return (
    <div className="bg-gradient-to-r from-orange-600 via-amber-500 to-orange-500 text-white py-2.5 px-4 shadow-sm">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4 text-xs md:text-sm font-medium">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="flex items-center space-x-2">
              <div className="bg-white/20 p-1.5 rounded-full">
                <Icon className="w-4 h-4 text-white" />
              </div>
              <div>
                <span className="font-bold block leading-none">{stat.label}</span>
                <span className="text-orange-100 text-[11px] font-normal hidden sm:inline">
                  {stat.desc}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
