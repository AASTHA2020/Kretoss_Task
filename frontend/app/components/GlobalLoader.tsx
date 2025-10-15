'use client';

import { useEffect, useState, useCallback } from 'react';
import { isLoaderVisible, subscribeLoader } from '../../lib/loader';

export default function GlobalLoader() {
  const [visible, setVisible] = useState(false);

  const handleLoaderChange = useCallback((isVisible: boolean) => {
    setVisible(isVisible);
  }, []);

  useEffect(() => {
    // Set initial loader visibility
    setVisible(isLoaderVisible());

    // Subscribe to loader updates
    const unsubscribe = subscribeLoader(handleLoaderChange);

    // Cleanup function must return a function
    return () => {
      unsubscribe(); // only function
    };
  }, [handleLoaderChange]);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="flex flex-col items-center bg-white rounded-2xl shadow-2xl p-8 max-w-sm mx-4">
        <div className="relative">
          <div className="animate-spin rounded-full h-20 w-20 border-4 border-gray-200"></div>
          <div className="animate-spin rounded-full h-20 w-20 border-4 border-transparent border-t-primary-600 absolute top-0 left-0"></div>
        </div>
        <div className="mt-6 text-center">
          <p className="text-gray-800 font-semibold text-lg">Processing...</p>
          <p className="mt-2 text-gray-600 text-sm">Please wait while we handle your request</p>
        </div>
        <div className="mt-4 flex space-x-1">
          <div className="w-2 h-2 bg-primary-600 rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-primary-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-2 h-2 bg-primary-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        </div>
      </div>
    </div>
  );
}


