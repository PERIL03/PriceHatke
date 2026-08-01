'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Tag, Sparkles, Plane, ShoppingBasket, Utensils, Gift, Search, Menu, X, User } from 'lucide-react';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { name: 'Deals', href: '/deals', icon: Tag },
    { name: 'Spend Lens', href: '/spending-calculator', icon: Sparkles },
    { name: 'Flights', href: '/flights', icon: Plane, badge: 'New', badgeColor: 'bg-emerald-500' },
    { name: 'Grocery', href: '/grocery-price-comparison', icon: ShoppingBasket, badge: 'Beta', badgeColor: 'bg-amber-500' },
    { name: 'Food Compare', href: '/food-compare', icon: Utensils, badge: 'Beta', badgeColor: 'bg-orange-500' },
    { name: 'Gift Cards', href: '/gift-cards', icon: Gift },
    { name: 'Product Lens', href: '/product-lens', icon: Sparkles, badge: 'New', badgeColor: 'bg-indigo-500' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-9 h-9 bg-gradient-to-tr from-orange-600 to-amber-500 rounded-xl flex items-center justify-center shadow-md shadow-orange-500/20">
                <span className="text-white font-extrabold text-xl tracking-tighter">P</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-black text-gray-900 tracking-tight flex items-center">
                  Price<span className="text-orange-500">Hatke</span>
                </span>
                <span className="text-[10px] text-gray-400 font-medium tracking-widest uppercase -mt-1">
                  Price Tracker
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              const Icon = link.icon;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`relative flex items-center space-x-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                    isActive
                      ? 'text-orange-600 bg-orange-50'
                      : 'text-gray-700 hover:text-orange-600 hover:bg-gray-50'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-orange-600' : 'text-gray-400'}`} />
                  <span>{link.name}</span>
                  {link.badge && (
                    <span
                      className={`text-[9px] font-bold text-white px-1.5 py-0.5 rounded-full ${link.badgeColor}`}
                    >
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Items */}
          <div className="hidden md:flex items-center space-x-3">
            <Link
              href="/price-alert"
              className="text-xs font-semibold text-gray-700 hover:text-orange-600 px-3 py-2 rounded-lg transition-colors"
            >
              Price Alerts
            </Link>
            <Link
              href="/dashboard"
              className="flex items-center space-x-1.5 text-xs font-semibold text-gray-700 hover:text-orange-600 px-3 py-2 rounded-lg transition-colors"
            >
              <User className="w-3.5 h-3.5 text-gray-500" />
              <span>Dashboard</span>
            </Link>
            <Link
              href="/login"
              className="bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold px-4 py-2 rounded-lg shadow-sm shadow-orange-500/20 transition-all hover:scale-[1.02]"
            >
              Log In
            </Link>
          </div>

          {/* Mobile menu trigger */}
          <div className="flex md:hidden items-center space-x-2">
            <Link
              href="/login"
              className="bg-orange-500 text-white text-xs font-bold px-3 py-1.5 rounded-md"
            >
              Log In
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-gray-600 rounded-lg hover:bg-gray-100 focus:outline-none"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Overlay */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 pt-2 pb-6 space-y-1 shadow-lg">
          {navLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-semibold text-gray-700 hover:bg-orange-50 hover:text-orange-600"
              >
                <div className="flex items-center space-x-2.5">
                  <Icon className="w-4 h-4 text-orange-500" />
                  <span>{link.name}</span>
                </div>
                {link.badge && (
                  <span
                    className={`text-[10px] font-bold text-white px-2 py-0.5 rounded-full ${link.badgeColor}`}
                  >
                    {link.badge}
                  </span>
                )}
              </Link>
            );
          })}
          <div className="pt-4 border-t border-gray-100 flex flex-col space-y-2">
            <Link
              href="/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-2 text-sm font-semibold text-gray-700 border border-gray-200 rounded-lg"
            >
              My Dashboard
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
