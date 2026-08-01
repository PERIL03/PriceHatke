import type { Metadata } from 'next';
import Link from 'next/link';
import { Sparkles, PieChart, ArrowLeft } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Spend Lens — E-Commerce Spending Calculator',
  description: 'Analyze and track your total e-commerce spending history across Amazon and Flipkart.',
};

export default function SpendLensPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center space-y-6">
      <div className="w-14 h-14 bg-amber-100 text-amber-600 rounded-3xl flex items-center justify-center mx-auto shadow-sm">
        <PieChart className="w-7 h-7" />
      </div>
      <div className="inline-flex items-center space-x-1.5 bg-amber-50 text-amber-800 border border-amber-200 px-3 py-1 rounded-full text-xs font-bold">
        <Sparkles className="w-3.5 h-3.5" />
        <span>Phase 2 Preview Feature</span>
      </div>
      <h1 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">Spend Lens Calculator</h1>
      <p className="text-xs sm:text-sm text-gray-500 max-w-lg mx-auto leading-relaxed">
        Connect your Amazon and Flipkart order histories to automatically calculate total yearly spending, category breakdowns, and potential savings.
      </p>
      <div className="pt-4">
        <Link
          href="/"
          className="inline-flex items-center space-x-1 bg-gray-900 hover:bg-orange-600 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>
      </div>
    </div>
  );
}
