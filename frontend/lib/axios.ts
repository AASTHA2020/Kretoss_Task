import Axios from 'axios';
import Cookies from 'js-cookie';
import { showLoader, hideLoader } from './loader';

const instance = Axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
  timeout: 15000, // 15 second timeout for faster feedback
  headers: {
    'Content-Type': 'application/json',
  },
  // Performance optimizations
  maxRedirects: 2,
  maxContentLength: 10 * 1024 * 1024, // 10MB
  validateStatus: (status) => status < 500, // Don't throw on 4xx errors
  // Connection optimizations
  maxConcurrentRequests: 5,
  retry: 2,
  retryDelay: 1000,
});

// Request interceptor with performance tracking
instance.interceptors.request.use(
  (config) => {
    // Add request timestamp for performance tracking
    config.metadata = { startTime: Date.now() };
    
    // Show loader for all requests except health checks and static assets
    if (!config.url?.includes('health') && !config.url?.includes('static')) {
      showLoader();
    }
    
    // Attach auth token for protected endpoints
    const token = Cookies.get('token');
    if (token) {
      config.headers = config.headers || {};
      if (!config.headers.Authorization) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    
    // Add request ID for tracking
    config.requestId = Math.random().toString(36).substr(2, 9);
    
    return config;
  },
  (error) => {
    hideLoader();
    console.error('Request setup error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor with performance tracking
instance.interceptors.response.use(
  (response) => {
    // Calculate request duration
    const duration = Date.now() - (response.config.metadata?.startTime || 0);
    
    // Log slow requests for optimization
    if (duration > 2000) {
      console.warn(`Slow API response: ${response.config.url} took ${duration}ms`);
    }
    
    hideLoader();
    return response;
  },
  (error) => {
    hideLoader();
    
    // Calculate request duration for failed requests
    const duration = Date.now() - (error.config?.metadata?.startTime || 0);
    
    // Enhanced error handling
    if (error.response?.status === 401) {
      // Unauthorized - redirect to login
      Cookies.remove('token');
      if (typeof window !== 'undefined') {
        window.location.href = '/';
      }
    } else if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
      console.error('Request timeout - server is taking too long to respond');
    } else if (!error.response) {
      console.error('Network error - please check your connection');
    }
    
    // Log error with duration
    console.error(`API Error: ${error.config?.url} failed after ${duration}ms`, error.message);
    
    return Promise.reject(error);
  }
);

export default instance;


