'use client';

import { usePathname, useRouter } from 'next/navigation';
import { getAuthToken, removeAuthToken } from '../../lib/auth';
import { useEffect, useState } from 'react';

export default function TopBar() {
  const router = useRouter();
  const pathname = usePathname();
  const [hasToken, setHasToken] = useState(false);

  useEffect(() => {
    setHasToken(!!getAuthToken());
  }, [pathname]);

  // Hide top bar on login page
  if (pathname === '/' || pathname === '/login' || pathname === '/signup') {
    return null;
  }

  const goBack = () => router.back();
  const logout = () => {
    removeAuthToken();
    router.push('/');
  };

  return (
    <div className="sticky top-0 z-40 bg-white/80 backdrop-blur border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex items-center justify-between">
        <button
          onClick={goBack}
          className="inline-flex items-center text-sm text-gray-700 hover:text-gray-900"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>

        {hasToken && (
          <button
            onClick={logout}
            className="inline-flex items-center text-sm text-red-600 hover:text-red-700"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H7a2 2 0 01-2-2V7a2 2 0 012-2h4a2 2 0 012 2v1" />
            </svg>
            Logout
          </button>
        )}
      </div>
    </div>
  );
}


