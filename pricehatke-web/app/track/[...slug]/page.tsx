'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { fetchApi } from '@/lib/api';

export default function TrackMagicPage() {
  const params = useParams();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const slugArray = params?.slug as string[];
    if (!slugArray || slugArray.length === 0) return;

    const rawUrl = slugArray.join('/');
    const fullUrl = rawUrl.startsWith('http') ? rawUrl : `https://${rawUrl}`;

    async function resolveAndRedirect() {
      try {
        const res = await fetchApi<{ productId: string }>('/products/resolve', {
          method: 'POST',
          body: JSON.stringify({ input: fullUrl }),
        });

        if (res.productId) {
          router.replace(`/product/${res.productId}`);
        } else {
          setError('Could not resolve product.');
        }
      } catch (err: any) {
        setError(err?.message || 'Failed to resolve URL.');
      }
    }

    resolveAndRedirect();
  }, [params, router]);

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4 px-4 text-center">
      {error ? (
        <div className="space-y-2 text-red-600">
          <h3 className="font-bold text-lg">Magic Trick Resolve Failed</h3>
          <p className="text-xs text-gray-500">{error}</p>
        </div>
      ) : (
        <>
          <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-2xl flex items-center justify-center animate-bounce">
            <Loader2 className="w-6 h-6 animate-spin" />
          </div>
          <h3 className="font-bold text-gray-900 text-base">Magic Trick Resolving Link...</h3>
          <p className="text-xs text-gray-500">Redirecting to price history chart</p>
        </>
      )}
    </div>
  );
}
