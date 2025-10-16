type Listener = (visible: boolean) => void;

let visible = false;
let startTime = 0;
let timeoutId: NodeJS.Timeout | null = null;
let requestCount = 0;
const listeners = new Set<Listener>();

// Optimized loader with performance tracking
export function showLoader() {
  requestCount++;
  
  if (!visible) {
    visible = true;
    startTime = Date.now();
    listeners.forEach((l) => l(true));
    
    // Set timeout warning after 3 seconds for faster feedback
    timeoutId = setTimeout(() => {
      console.warn('Request taking longer than expected...');
    }, 3000);
  }
}

export function hideLoader() {
  requestCount = Math.max(0, requestCount - 1);
  
  if (visible && requestCount === 0) {
    visible = false;
    const duration = Date.now() - startTime;
    
    // Log performance metrics
    if (duration > 1000) {
      console.log(`Slow request completed in ${duration}ms`);
    }
    
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
    
    listeners.forEach((l) => l(false));
  }
}

export function subscribeLoader(listener: Listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function isLoaderVisible() {
  return visible;
}

export function getLoaderDuration() {
  return visible ? Date.now() - startTime : 0;
}

export function getRequestCount() {
  return requestCount;
}


