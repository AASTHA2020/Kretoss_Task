import axios from './axios';
import Cookies from 'js-cookie';
import { useState, useEffect } from 'react';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
}

export interface AuthResponse {
  token: string;
  user: User;
}

export const authAPI = {
  login: async (email: string, password: string): Promise<AuthResponse> => {
    const response = await axios.post('/auth/login', {
      email,
      password,
    });
    return response.data;
  },

  register: async (name: string, email: string, password: string, role: 'admin' | 'user'): Promise<AuthResponse> => {
    const response = await axios.post('/auth/register', {
      name,
      email,
      password,
      role,
    });
    return response.data;
  },

  getCurrentUser: async (): Promise<{ user: User }> => {
    const token = Cookies.get('token');
    const response = await axios.get('/auth/me', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },
};

export const setAuthToken = (token: string) => {
  Cookies.set('token', token, { expires: 7 });
};

export const removeAuthToken = () => {
  Cookies.remove('token');
};

export const getAuthToken = () => {
  return Cookies.get('token');
};

// Auth hook for components
export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getAuthToken();
    if (!token) {
      setLoading(false);
      return;
    }

    // Verify token and get user data
    const verifyToken = async () => {
      try {
        const response = await axios.get('/auth/me');
        setUser(response.data.user);
      } catch (error) {
        console.error('Token verification failed:', error);
        removeAuthToken();
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    verifyToken();
  }, []);

  return { user, loading };
};
