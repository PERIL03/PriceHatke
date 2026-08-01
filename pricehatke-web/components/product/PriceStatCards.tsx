'use client';

import { TrendingDown, TrendingUp, DollarSign, Activity } from 'lucide-react';

interface StatsProps {
  currentPrice: number;
  lowestEver: number;
  highestEver: number;
  averagePrice: number;
}

export default function PriceStatCards({
  currentPrice,
  lowestEver,
  highestEver,
  averagePrice,
}: StatsProps) {
  const cards = [
    {
      label: 'Current Price',
      value: currentPrice,
      icon: DollarSign,
      color: 'text-gray-900',
      bg: 'bg-white',
      border: 'border-gray-200',
    },
    {
      label: 'Lowest Ever',
      value: lowestEver,
      icon: TrendingDown,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50/60',
      border: 'border-emerald-200',
      badge: 'Best Time to Buy',
    },
    {
      label: 'Highest Ever',
      value: highestEver,
      icon: TrendingUp,
      color: 'text-red-600',
      bg: 'bg-red-50/60',
      border: 'border-red-200',
    },
    {
      label: 'Average Price',
      value: averagePrice,
      icon: Activity,
      color: 'text-blue-600',
      bg: 'bg-blue-50/60',
      border: 'border-blue-200',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.label}
            className={`${card.bg} border ${card.border} rounded-2xl p-4 space-y-2 shadow-2xs relative overflow-hidden`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-gray-500">{card.label}</span>
              <Icon className={`w-4 h-4 ${card.color}`} />
            </div>
            <div className="flex items-baseline space-x-1">
              <span className={`text-xl sm:text-2xl font-black ${card.color}`}>
                ₹{card.value ? card.value.toLocaleString('en-IN') : 'N/A'}
              </span>
            </div>
            {card.badge && (
              <span className="inline-block text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md">
                {card.badge}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}
