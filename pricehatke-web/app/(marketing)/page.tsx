'use client';

import { useState } from 'react';
import Link from 'next/link';
import UrlResolverInput from '@/components/search/UrlResolverInput';
import {
  Sparkles,
  TrendingDown,
  Tag,
  Gift,
  ShieldCheck,
  Zap,
  ChevronDown,
  ArrowRight,
  ShoppingBag,
  Car,
  Bot,
  PieChart,
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { fetchApi } from '@/lib/api';

interface Deal {
  id: string;
  title: string;
  imageUrl: string;
  store: string;
  storeUrl: string;
  price: number;
  mrp: number;
  discountPct: number;
  category: string;
  verified: boolean;
}

export default function HomePage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // Fetch top 4 hot deals for homepage
  const { data: dealsData } = useQuery({
    queryKey: ['home-hot-deals'],
    queryFn: () => fetchApi<{ data: Deal[] }>('/deals?limit=4&sort=popularity'),
  });

  const deals = dealsData?.data || [
    {
      id: 'demo-1',
      title: 'Sony WH-1000XM5 Wireless Headphones - 35% Flat Off',
      store: 'amazon',
      price: 22690,
      mrp: 34990,
      discountPct: 35,
      imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop',
      verified: true,
      category: 'Audio',
      storeUrl: 'https://amazon.in',
    },
    {
      id: 'demo-2',
      title: 'Samsung Galaxy S24 Ultra 5G - Price Drop Alert!',
      store: 'flipkart',
      price: 109999,
      mrp: 139999,
      discountPct: 21,
      imageUrl: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=500&auto=format&fit=crop',
      verified: true,
      category: 'Electronics',
      storeUrl: 'https://flipkart.com',
    },
    {
      id: 'demo-3',
      title: 'MacBook Air M3 Chip - Lowest Ever Price',
      store: 'amazon',
      price: 89900,
      mrp: 114900,
      discountPct: 22,
      imageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&auto=format&fit=crop',
      verified: true,
      category: 'Laptops',
      storeUrl: 'https://amazon.in',
    },
    {
      id: 'demo-4',
      title: 'Boat Airdopes 141 TWS Earbuds @ ₹999 (75% Off)',
      store: 'flipkart',
      price: 999,
      mrp: 4490,
      discountPct: 75,
      imageUrl: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500&auto=format&fit=crop',
      verified: true,
      category: 'Audio',
      storeUrl: 'https://flipkart.com',
    },
  ];

  const stores = [
    { name: 'Amazon', color: 'text-amber-600', bg: 'bg-amber-50 border-amber-200' },
    { name: 'Flipkart', color: 'text-blue-600', bg: 'bg-blue-50 border-blue-200' },
    { name: 'Myntra', color: 'text-pink-600', bg: 'bg-pink-50 border-pink-200' },
    { name: 'Ajio', color: 'text-indigo-600', bg: 'bg-indigo-50 border-indigo-200' },
    { name: 'Meesho', color: 'text-rose-600', bg: 'bg-rose-50 border-rose-200' },
    { name: 'Nykaa', color: 'text-fuchsia-600', bg: 'bg-fuchsia-50 border-fuchsia-200' },
    { name: 'Tata Cliq', color: 'text-red-600', bg: 'bg-red-50 border-red-200' },
    { name: 'Croma', color: 'text-teal-600', bg: 'bg-teal-50 border-teal-200' },
  ];

  const faqs = [
    {
      q: 'How does PriceHatke track price history?',
      a: 'PriceHatke continuously monitors price changes across 100+ top Indian online stores. We plot the full price timeline so you can instantly verify whether a discount is genuine or inflated before sale season.',
    },
    {
      q: 'What is the "Magic Trick" URL feature?',
      a: 'You can type "pricehatke.com/" before any Amazon or Flipkart product URL in your browser bar. It instantly redirects to the PriceHatke price history chart for that item!',
    },
    {
      q: 'Are Price Drop Alerts free to use?',
      a: 'Yes, 100% free! You can set your desired target price or choose to be notified on any drop. We send instant email notifications as soon as the price falls.',
    },
    {
      q: 'Are gift card discounts instant?',
      a: 'Yes! When you purchase brand gift cards on PriceHatke, you get instant digital code delivery with extra cashback and discounts.',
    },
  ];

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-orange-50/70 via-white to-gray-50 pt-12 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center space-x-2 bg-orange-100/80 border border-orange-200 text-orange-700 px-3.5 py-1.5 rounded-full text-xs font-bold tracking-wide uppercase shadow-xs">
            <Zap className="w-3.5 h-3.5 text-orange-600 animate-pulse" />
            <span>India’s #1 Price History & Deal Engine</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-gray-900 tracking-tight leading-tight">
            Find Real Deals, <br />
            <span className="bg-gradient-to-r from-orange-600 via-amber-500 to-orange-500 bg-clip-text text-transparent">
              Skip the Fake Ones
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-sm sm:text-base text-gray-600 font-medium leading-relaxed">
            Track genuine price drops across Amazon, Flipkart, Myntra, and 100+ stores. Never overpay again.
          </p>

          {/* Universal Search Bar */}
          <div className="pt-2">
            <UrlResolverInput />
          </div>

          {/* Magic Trick Card */}
          <div className="pt-4 max-w-xl mx-auto">
            <div className="bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-amber-500/10 border border-orange-200/80 rounded-2xl p-3.5 flex items-center justify-between text-xs text-gray-800 shadow-sm">
              <div className="flex items-center space-x-2">
                <span className="text-lg">🎩</span>
                <span className="font-bold text-gray-900">Magic Trick:</span>
                <span className="text-gray-600 hidden sm:inline">Type</span>
                <code className="bg-white px-2 py-0.5 rounded font-mono font-bold text-orange-600 border border-orange-200">
                  pricehatke.com/
                </code>
                <span className="text-gray-600">before any product link</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stores Logo Strip */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-6">
          <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400">
            Supported Stores Tracked 24/7
          </h3>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          {stores.map((store) => (
            <div
              key={store.name}
              className={`${store.bg} border rounded-xl py-3 px-2 text-center transition-all hover:scale-105 shadow-2xs flex items-center justify-center`}
            >
              <span className={`font-black text-sm ${store.color}`}>{store.name}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Hot Deals Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center space-x-2">
              <span className="p-1 bg-red-100 rounded-md text-red-600">
                <Tag className="w-5 h-5" />
              </span>
              <h2 className="text-2xl font-black text-gray-900 tracking-tight">Hot Deals Under Scanner</h2>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Curated deals with verified lowest prices in recent months
            </p>
          </div>
          <Link
            href="/deals"
            className="flex items-center space-x-1 text-xs font-bold text-orange-600 hover:text-orange-700 bg-orange-50 px-3 py-2 rounded-lg transition-colors"
          >
            <span>View All Deals</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Deals Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {deals.map((deal) => (
            <div
              key={deal.id}
              className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-xs hover:shadow-md transition-all hover:-translate-y-1 flex flex-col justify-between"
            >
              <div>
                <div className="relative aspect-4/3 bg-gray-100 overflow-hidden">
                  <img
                    src={deal.imageUrl}
                    alt={deal.title}
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute top-2 left-2 bg-orange-600 text-white font-extrabold text-xs px-2.5 py-1 rounded-md shadow-md">
                    {deal.discountPct}% OFF
                  </span>
                  <span className="absolute top-2 right-2 bg-black/60 backdrop-blur text-white text-[10px] uppercase font-bold px-2 py-0.5 rounded">
                    {deal.store}
                  </span>
                </div>
                <div className="p-4 space-y-2">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                    {deal.category}
                  </span>
                  <h3 className="font-bold text-gray-900 text-sm line-clamp-2 leading-snug">
                    {deal.title}
                  </h3>
                </div>
              </div>

              <div className="p-4 pt-0 flex items-center justify-between border-t border-gray-50 mt-2">
                <div>
                  <span className="text-base font-black text-gray-900">
                    ₹{deal.price.toLocaleString('en-IN')}
                  </span>
                  {deal.mrp && (
                    <span className="text-xs text-gray-400 line-through ml-2">
                      ₹{deal.mrp.toLocaleString('en-IN')}
                    </span>
                  )}
                </div>
                <a
                  href={deal.storeUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-gray-900 hover:bg-orange-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition-colors"
                >
                  Buy Now
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Feature Grid */}
      <section className="bg-gray-900 text-white py-16 px-4 sm:px-6 lg:px-8 my-8">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <h2 className="text-3xl font-black tracking-tight">Smart Tools Built For Savings</h2>
            <p className="text-gray-400 text-sm">
              Discover auxiliary features designed to give you complete price clarity before you buy.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-800/80 border border-gray-700 p-6 rounded-2xl space-y-3">
              <div className="w-10 h-10 bg-orange-500/20 text-orange-400 rounded-xl flex items-center justify-center">
                <Bot className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white">Product Lens AI</h3>
              <p className="text-gray-400 text-xs leading-relaxed">
                AI-powered pros/cons summary and sentiment analysis across thousands of verified customer reviews.
              </p>
              <Link href="/product-lens" className="inline-flex items-center text-xs font-bold text-orange-400 hover:text-orange-300">
                <span>Try Product Lens</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Link>
            </div>

            <div className="bg-gray-800/80 border border-gray-700 p-6 rounded-2xl space-y-3">
              <div className="w-10 h-10 bg-amber-500/20 text-amber-400 rounded-xl flex items-center justify-center">
                <PieChart className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white">Spend Lens</h3>
              <p className="text-gray-400 text-xs leading-relaxed">
                Visualize your e-commerce spending patterns and identify category leaks where you can save more.
              </p>
              <Link href="/spending-calculator" className="inline-flex items-center text-xs font-bold text-amber-400 hover:text-amber-300">
                <span>Open Spend Lens</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Link>
            </div>

            <div className="bg-gray-800/80 border border-gray-700 p-6 rounded-2xl space-y-3">
              <div className="w-10 h-10 bg-emerald-500/20 text-emerald-400 rounded-xl flex items-center justify-center">
                <Gift className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white">Gift Cards Store</h3>
              <p className="text-gray-400 text-xs leading-relaxed">
                Buy brand vouchers for Amazon, Flipkart, Myntra, Domino’s & Uber at flat extra discounts up to 20%.
              </p>
              <Link href="/gift-cards" className="inline-flex items-center text-xs font-bold text-emerald-400 hover:text-emerald-300">
                <span>Browse Gift Cards</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Accordion Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-black text-gray-900">Frequently Asked Questions</h2>
          <p className="text-xs text-gray-500">Everything you need to know about PriceHatke tracking</p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-2xs"
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full px-6 py-4 text-left font-bold text-sm text-gray-900 flex items-center justify-between hover:bg-gray-50"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-gray-500 transition-transform ${
                      isOpen ? 'transform rotate-180 text-orange-600' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-6 pb-4 pt-1 text-xs text-gray-600 leading-relaxed border-t border-gray-50">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
