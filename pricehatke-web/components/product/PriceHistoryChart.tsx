'use client';

import { useState } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';
import { Calendar } from 'lucide-react';

interface HistoryPoint {
  id: string;
  store: string;
  price: number;
  mrp?: number | null;
  date: string;
  capturedAt: string;
}

interface PriceHistoryChartProps {
  history: HistoryPoint[];
  selectedRange: string;
  onRangeChange: (range: string) => void;
}

export default function PriceHistoryChart({
  history,
  selectedRange,
  onRangeChange,
}: PriceHistoryChartProps) {
  const ranges = [
    { label: '7 Days', value: '7d' },
    { label: '1 Month', value: '1m' },
    { label: '3 Months', value: '3m' },
    { label: '6 Months', value: '6m' },
    { label: 'All Time', value: 'all' },
  ];

  // Group history points by date for multi-store lines
  const dateMap: Record<string, any> = {};
  const stores = Array.from(new Set(history.map((h) => h.store)));

  history.forEach((h) => {
    if (!dateMap[h.date]) {
      dateMap[h.date] = { date: h.date };
    }
    dateMap[h.date][h.store] = h.price;
  });

  const chartData = Object.values(dateMap).sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
  );

  const storeColors: Record<string, string> = {
    amazon: '#f59e0b',  // amber
    flipkart: '#2563eb', // blue
    myntra: '#ec4899',   // pink
    croma: '#0d9488',    // teal
    tatacliq: '#dc2626', // red
    generic: '#6b7280',  // gray
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs space-y-4">
      {/* Chart Header & Range Buttons */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-gray-100 pb-4">
        <div className="flex items-center space-x-2">
          <Calendar className="w-5 h-5 text-orange-500" />
          <h3 className="font-bold text-gray-900 text-base">Historical Price Trend</h3>
        </div>

        <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-xl text-xs font-semibold">
          {ranges.map((r) => (
            <button
              key={r.value}
              onClick={() => onRangeChange(r.value)}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                selectedRange === r.value
                  ? 'bg-white text-orange-600 shadow-xs font-bold'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      {/* Chart Container */}
      <div className="h-72 sm:h-80 w-full pt-2">
        {chartData.length === 0 ? (
          <div className="h-full flex items-center justify-center text-gray-400 text-sm">
            No historical price data for selected range.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 11, fill: '#64748b' }}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fill: '#64748b' }}
                tickFormatter={(val) => `₹${val.toLocaleString('en-IN')}`}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip
                formatter={(value: any) => [`₹${Number(value).toLocaleString('en-IN')}`, 'Price']}
                contentStyle={{
                  backgroundColor: '#0f172a',
                  color: '#fff',
                  borderRadius: '12px',
                  border: 'none',
                  fontSize: '12px',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.3)',
                }}
              />
              <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
              {stores.map((st) => (
                <Line
                  key={st}
                  type="monotone"
                  dataKey={st}
                  name={st.toUpperCase()}
                  stroke={storeColors[st.toLowerCase()] || '#f97316'}
                  strokeWidth={2.5}
                  dot={{ r: 3, strokeWidth: 1 }}
                  activeDot={{ r: 6 }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
