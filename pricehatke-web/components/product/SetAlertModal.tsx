'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Bell, X, Check, Loader2 } from 'lucide-react';
import { fetchApi } from '@/lib/api';

interface SetAlertModalProps {
  productId: string;
  productTitle: string;
  currentPrice: number;
  isOpen: boolean;
  onClose: () => void;
}

export default function SetAlertModal({
  productId,
  productTitle,
  currentPrice,
  isOpen,
  onClose,
}: SetAlertModalProps) {
  const [targetPrice, setTargetPrice] = useState<string>(
    Math.round(currentPrice * 0.9).toString(),
  );
  const [anyDrop, setAnyDrop] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Check auth token from localStorage / session
    const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;

    if (!token) {
      // Redirect to login if unauthenticated per PRD Task F4 DoD
      router.push(`/login?redirect=/product/${productId}`);
      return;
    }

    try {
      await fetchApi('/alerts', {
        method: 'POST',
        token,
        body: JSON.stringify({
          productId,
          targetPrice: anyDrop ? undefined : Number(targetPrice),
        }),
      });

      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 1500);
    } catch (err: any) {
      if (err?.message?.includes('401') || err?.message?.includes('Unauthorized')) {
        router.push(`/login?redirect=/product/${productId}`);
      } else {
        setError(err?.message || 'Failed to create price alert.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-5 relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-orange-100 text-orange-600 rounded-2xl flex items-center justify-center">
            <Bell className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-gray-900 text-lg">Set Price Drop Alert</h3>
            <p className="text-xs text-gray-500">We will notify you via email when price drops</p>
          </div>
        </div>

        <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
          <h4 className="font-bold text-xs text-gray-900 line-clamp-1">{productTitle}</h4>
          <p className="text-xs text-gray-500 mt-1">
            Current Price: <span className="font-black text-gray-900">₹{currentPrice.toLocaleString('en-IN')}</span>
          </p>
        </div>

        {success ? (
          <div className="py-8 text-center space-y-2">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <Check className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-gray-900 text-base">Alert Set Successfully!</h4>
            <p className="text-xs text-gray-500">You will receive an email alert on price drops.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-700 block">
                Target Alert Price (₹)
              </label>
              <input
                type="number"
                disabled={anyDrop}
                value={targetPrice}
                onChange={(e) => setTargetPrice(e.target.value)}
                placeholder="Enter target price"
                className="w-full px-4 py-3 bg-gray-50 text-gray-900 rounded-xl border border-gray-200 text-sm font-semibold focus:outline-none focus:border-orange-500 disabled:opacity-50"
              />
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="anyDrop"
                checked={anyDrop}
                onChange={(e) => setAnyDrop(e.target.checked)}
                className="w-4 h-4 text-orange-500 rounded border-gray-300 focus:ring-orange-500"
              />
              <label htmlFor="anyDrop" className="text-xs font-medium text-gray-700 cursor-pointer">
                Notify me on ANY price drop
              </label>
            </div>

            {error && (
              <div className="p-3 bg-red-50 text-red-600 text-xs rounded-xl font-medium">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm rounded-xl shadow-md shadow-orange-500/20 flex items-center justify-center space-x-2 transition-all hover:scale-[1.01]"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Setting Alert...</span>
                </>
              ) : (
                <span>Set Alert</span>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
