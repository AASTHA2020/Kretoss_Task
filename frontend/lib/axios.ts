import Axios, { InternalAxiosRequestConfig } from 'axios';
import Cookies from 'js-cookie';
import { showLoader, hideLoader } from './loader';

const instance = Axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
  timeout: 30000, // 30 second timeout
  headers: {
    'Content-Type': 'application/json',
  }
});

// Request interceptor
instance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Show loader for all requests except health checks
    if (!config.url?.includes('health')) {
      showLoader();
    }
    
    // Attach auth token for protected endpoints
    const token = Cookies.get('token');
    if (token) {
      // Create a new headers object if it doesn't exist
      const headers: any = config.headers || {};
      headers.Authorization = `Bearer ${token}`;
      config.headers = headers;
    }
    
    return config;
  },
  (error) => {
    hideLoader();
    return Promise.reject(error);
  }
);

// Response interceptor
instance.interceptors.response.use(
  (response) => {
    hideLoader();
    return response;
  },
  (error) => {
    hideLoader();
    
    // Handle specific error cases
    if (error.response?.status === 401) {
      // Unauthorized - redirect to login
      Cookies.remove('token');
      if (typeof window !== 'undefined') {
        window.location.href = '/';
      }
    }
    
    return Promise.reject(error);
  }
);

export default instance;


