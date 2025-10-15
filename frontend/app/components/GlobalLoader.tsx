'use client';

import { useEffect, useState } from 'react';
import { isLoaderVisible, subscribeLoader } from '../../lib/loader';

export default function GlobalLoader() {
  const [visible, setVisible] = useState(isLoaderVisible());

  useEffect(() => {
    const unsubscribe = subscribeLoader(setVisible);
    return () => unsubscribe();
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/70 backdrop-blur-sm">
      <div className="flex flex-col items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        <p className="mt-3 text-gray-700 font-medium">Please wait...</p>
      </div>
    </div>
  );
}


