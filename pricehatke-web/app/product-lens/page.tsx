import type { Metadata } from 'next';
import Link from 'next/link';
import { Bot, Sparkles, ArrowLeft } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Product Lens AI — Instant Review Analysis',
  description: 'AI-generated pros and cons summary from thousands of customer reviews.',
};

export default function ProductLensPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center space-y-6">
      <div className="w-14 h-14 bg-indigo-100 text-indigo-600 rounded-3xl flex items-center justify-center mx-auto shadow-sm">
        <Bot className="w-7 h-7" />
      </div>
      <div className="inline-flex items-center space-x-1.5 bg-indigo-50 text-indigo-800 border border-indigo-200 px-3 py-1 rounded-full text-xs font-bold">
        <Sparkles className="w-3.5 h-3.5" />
        <span>Phase 2 Preview Feature</span>
      </div>
      <h1 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">Product Lens AI</h1>
      <p className="text-xs sm:text-sm text-gray-500 max-w-lg mx-auto leading-relaxed">
        AI sentiment analysis that condenses 1,000+ customer reviews into concise pros, cons, and durability ratings.
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
