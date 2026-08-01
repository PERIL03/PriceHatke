'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchApi } from '@/lib/api';
import { clearAuthSession, getAccessToken, getUserSession } from '@/lib/auth-client';
import {
  Bell,
  Trash2,
  Copy,
  Check,
  LogOut,
  User,
  ShoppingBag,
  ExternalLink,
  ShieldCheck,
  Loader2,
  Tag,
} from 'lucide-react';

interface ActiveAlert {
  id: string;
  productId: string;
  productTitle: string;
  productImage: string;
  targetPrice: number | null;
  status: string;
  createdAt: string;
  currentLowestPrice: number | null;
}

export default function DashboardPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<'alerts' | 'orders' | 'settings'>('alerts');
  const [copied, setCopied] = useState(false);

  const token = typeof window !== 'undefined' ? getAccessToken() : null;
  const user = typeof window !== 'undefined' ? getUserSession() : null;

  useEffect(() => {
    if (!token) {
      router.replace('/login?redirect=/dashboard');
    }
  }, [token, router]);

  // Fetch User Alerts from backend API
  const { data: alerts, isLoading: loadingAlerts } = useQuery<ActiveAlert[]>({
    queryKey: ['user-alerts'],
    queryFn: () => fetchApi<ActiveAlert[]>('/alerts', { token: token! }),
    enabled: !!token,
  });

  // Delete Alert Mutation
  const deleteAlertMutation = useMutation({
    mutationFn: (alertId: string) =>
      fetchApi(`/alerts/${alertId}`, {
        method: 'DELETE',
        token: token!,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-alerts'] });
    },
  });

  const handleLogout = () => {
    clearAuthSession();
    router.replace('/');
  };

  const handleCopyReferral = () => {
    if (user?.referralCode && typeof window !== 'undefined') {
      navigator.clipboard.writeText(user.referralCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!token) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* User Banner */}
      <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 rounded-3xl p-6 sm:p-8 text-white shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="flex items-center space-x-4">
          <div className="w-14 h-14 bg-gradient-to-tr from-orange-500 to-amber-500 rounded-2xl flex items-center justify-center text-white text-2xl font-black shadow-lg shadow-orange-500/20">
            {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight">{user?.name || 'PriceHatke User'}</h1>
            <p className="text-xs text-gray-400 font-medium">{user?.email}</p>
          </div>
        </div>

        <div className="flex items-center space-x-3 w-full sm:w-auto justify-end">
          <button
            onClick={handleLogout}
            className="px-4 py-2.5 bg-gray-800 hover:bg-red-500/20 hover:text-red-400 text-gray-300 border border-gray-700 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center space-x-2 border-b border-gray-200 pb-2">
        <button
          onClick={() => setActiveTab('alerts')}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'alerts'
              ? 'bg-orange-500 text-white shadow-sm shadow-orange-500/20'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <Bell className="w-4 h-4" />
          <span>Active Price Alerts ({alerts?.length || 0})</span>
        </button>

        <button
          onClick={() => setActiveTab('orders')}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'orders'
              ? 'bg-orange-500 text-white shadow-sm shadow-orange-500/20'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Gift Card Orders</span>
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'settings'
              ? 'bg-orange-500 text-white shadow-sm shadow-orange-500/20'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <User className="w-4 h-4" />
          <span>Account & Referral</span>
        </button>
      </div>

      {/* TAB 1: ACTIVE ALERTS */}
      {activeTab === 'alerts' && (
        <div className="space-y-4">
          {loadingAlerts ? (
            <div className="py-12 text-center text-xs text-gray-500">Loading alerts...</div>
          ) : !alerts || alerts.length === 0 ? (
            <div className="bg-white rounded-3xl border border-gray-200 p-12 text-center space-y-3">
              <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-2xl flex items-center justify-center mx-auto">
                <Bell className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">No Active Price Alerts</h3>
              <p className="text-xs text-gray-500 max-w-sm mx-auto">
                Search for any product and click "Set Price Drop Alert" to receive email notifications when prices drop.
              </p>
              <Link
                href="/"
                className="inline-flex items-center space-x-1 text-xs font-bold text-orange-600 hover:underline pt-2"
              >
                <span>Search Products</span>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {alerts.map((alert) => (
                <div
                  key={alert.id}
                  className="bg-white rounded-2xl border border-gray-200 p-5 shadow-2xs space-y-4 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span
                        className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full ${
                          alert.status === 'triggered'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {alert.status === 'triggered' ? '⚡ Triggered!' : '🟢 Active Tracking'}
                      </span>
                      <button
                        onClick={() => deleteAlertMutation.mutate(alert.id)}
                        disabled={deleteAlertMutation.isPending}
                        className="text-gray-400 hover:text-red-600 p-1 rounded-lg hover:bg-red-50 transition-colors"
                        title="Delete Alert"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="flex items-center space-x-3">
                      <img
                        src={alert.productImage || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500'}
                        alt={alert.productTitle}
                        className="w-14 h-14 object-cover rounded-xl border border-gray-100 flex-shrink-0"
                      />
                      <Link
                        href={`/product/${alert.productId}`}
                        className="font-bold text-gray-900 text-xs line-clamp-2 leading-snug hover:text-orange-600 transition-colors"
                      >
                        {alert.productTitle}
                      </Link>
                    </div>

                    <div className="bg-gray-50 p-3 rounded-xl border border-gray-100 text-xs space-y-1">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Target Alert Price:</span>
                        <span className="font-bold text-gray-900">
                          {alert.targetPrice ? `₹${alert.targetPrice.toLocaleString('en-IN')}` : 'Any Drop'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Current Lowest:</span>
                        <span className="font-bold text-emerald-600">
                          {alert.currentLowestPrice ? `₹${alert.currentLowestPrice.toLocaleString('en-IN')}` : 'N/A'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <Link
                    href={`/product/${alert.productId}`}
                    className="w-full py-2 bg-gray-900 hover:bg-orange-600 text-white font-bold text-xs rounded-xl flex items-center justify-center space-x-1 transition-colors"
                  >
                    <span>View Price History</span>
                    <ExternalLink className="w-3 h-3" />
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: GIFT CARD ORDERS */}
      {activeTab === 'orders' && (
        <div className="bg-white rounded-3xl border border-gray-200 p-8 text-center space-y-3">
          <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center mx-auto">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-gray-900">No Gift Card Orders Yet</h3>
          <p className="text-xs text-gray-500 max-w-sm mx-auto">
            Explore discounted gift card vouchers for Amazon, Flipkart, Myntra, Domino’s and Uber.
          </p>
          <Link
            href="/gift-cards"
            className="inline-flex items-center space-x-1 text-xs font-bold text-orange-600 hover:underline pt-2"
          >
            <span>Browse Gift Cards Catalog</span>
          </Link>
        </div>
      )}

      {/* TAB 3: ACCOUNT & REFERRAL SETTINGS */}
      {activeTab === 'settings' && (
        <div className="max-w-2xl bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 space-y-6 shadow-2xs">
          <h3 className="font-extrabold text-gray-900 text-lg border-b border-gray-100 pb-3">
            Account Details & Referral Code
          </h3>

          <div className="space-y-4 text-xs font-medium text-gray-700">
            <div className="flex justify-between py-2 border-b border-gray-50">
              <span className="text-gray-400">Full Name</span>
              <span className="font-bold text-gray-900">{user?.name || 'Shopper'}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-50">
              <span className="text-gray-400">Email Address</span>
              <span className="font-bold text-gray-900">{user?.email}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-50">
              <span className="text-gray-400">Login Provider</span>
              <span className="font-bold uppercase text-gray-900">{user?.provider || 'Credentials'}</span>
            </div>
          </div>

          {/* Referral Card */}
          <div className="bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200 rounded-2xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-bold text-gray-900 text-sm">Your Referral Code</h4>
                <p className="text-xs text-gray-500">Share with friends to earn reward coins</p>
              </div>
              <code className="bg-white px-3 py-1.5 rounded-xl border border-orange-300 font-mono font-black text-orange-600 text-base shadow-xs">
                {user?.referralCode || 'HATKE100'}
              </code>
            </div>

            <button
              onClick={handleCopyReferral}
              className="w-full py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs rounded-xl shadow-xs flex items-center justify-center space-x-1.5 transition-all"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Referral Code Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copy Referral Code</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
