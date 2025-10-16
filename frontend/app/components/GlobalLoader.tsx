'use client';

import { useEffect, useState, useCallback } from 'react';
import { isLoaderVisible, subscribeLoader, getLoaderDuration, getRequestCount } from '../../lib/loader';

export default function GlobalLoader() {
  const [visible, setVisible] = useState(false);
  const [duration, setDuration] = useState(0);
  const [requestCount, setRequestCount] = useState(0);
  const [showTimeoutWarning, setShowTimeoutWarning] = useState(false);

  const handleLoaderChange = useCallback((isVisible: boolean) => {
    setVisible(isVisible);
    if (isVisible) {
      setShowTimeoutWarning(false);
    }
  }, []);

  useEffect(() => {
    setVisible(isLoaderVisible());
    const unsubscribe = subscribeLoader(handleLoaderChange);

    // Update duration and request count every second
    const interval = setInterval(() => {
      if (visible) {
        const currentDuration = getLoaderDuration();
        const currentRequestCount = getRequestCount();
        setDuration(currentDuration);
        setRequestCount(currentRequestCount);
        
        // Show timeout warning after 3 seconds for faster feedback
        if (currentDuration > 3000 && !showTimeoutWarning) {
          setShowTimeoutWarning(true);
        }
      }
    }, 1000);

    return () => {
      unsubscribe();
      clearInterval(interval);
    };
  }, [handleLoaderChange, visible, showTimeoutWarning]);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="flex flex-col items-center bg-white rounded-2xl shadow-2xl p-8 max-w-sm mx-4 animate-pulse">
        {/* Enhanced Spinner */}
        <div className="relative mb-6">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200"></div>
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-transparent border-t-blue-600 absolute top-0 left-0"></div>
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-transparent border-r-blue-400 absolute top-0 left-0" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
        </div>
        
        {/* Progress Text */}
        <div className="text-center">
          <p className="text-gray-800 font-semibold text-lg animate-pulse">
            {showTimeoutWarning ? 'Taking longer than expected...' : 'Processing Request...'}
          </p>
          <p className="mt-2 text-gray-600 text-sm">
            {showTimeoutWarning 
              ? 'Server is responding slowly, please wait...' 
              : 'Please wait while we process your request'
            }
          </p>
          {duration > 0 && (
            <p className="mt-1 text-xs text-gray-500">
              {Math.floor(duration / 1000)}s elapsed
            </p>
          )}
          {requestCount > 1 && (
            <p className="mt-1 text-xs text-blue-600">
              {requestCount} requests in progress
            </p>
          )}
        </div>
        
        {/* Enhanced Loading Dots */}
        <div className="mt-6 flex space-x-2">
          <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce"></div>
          <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-3 h-3 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          <div className="w-3 h-3 bg-blue-300 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }}></div>
        </div>
        
        {/* Progress Bar */}
        <div className="mt-4 w-full bg-gray-200 rounded-full h-2 overflow-hidden">
          <div className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full animate-pulse" style={{ 
            animation: 'progress 2s ease-in-out infinite',
            width: '100%'
          }}></div>
        </div>
        
        {/* Loading Message */}
        <p className="mt-4 text-xs text-gray-500 animate-pulse">
          {showTimeoutWarning ? 'This may take a few more moments...' : 'This may take a few moments...'}
        </p>
      </div>
      
      <style jsx>{`
        @keyframes progress {
          0% { transform: translateX(-100%); }
          50% { transform: translateX(0%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
}


