'use client';

import { Suspense, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { setAuthTokens } from '@/lib/auth-client';
import { Loader2 } from 'lucide-react';

function CallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const accessToken = searchParams?.get('accessToken');
    const refreshToken = searchParams?.get('refreshToken');

    if (accessToken && refreshToken) {
      setAuthTokens(accessToken, refreshToken);
      router.replace('/dashboard');
    } else {
      router.replace('/login');
    }
  }, [searchParams, router]);

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-3">
      <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
      <p className="text-xs text-gray-500 font-medium">Completing login...</p>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-gray-500">Completing login...</div>}>
      <CallbackContent />
    </Suspense>
  );
}
