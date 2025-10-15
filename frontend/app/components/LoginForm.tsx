'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { authAPI, setAuthToken } from '../../lib/auth';

interface LoginFormProps {
  role: 'admin' | 'user';
  onBack: () => void;
  onSwitchToSignup: () => void;
}

export default function LoginForm({ role, onBack, onSwitchToSignup }: LoginFormProps) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await authAPI.login(formData.email, formData.password);
      
      // Check if the user's role matches the login form
      if (response.user.role !== role) {
        setError(`Please use the ${response.user.role} login form instead.`);
        setLoading(false);
        return;
      }

      setAuthToken(response.token);
      
      // Redirect based on role
      if (response.user.role === 'admin') {
        router.push('/admin-dashboard');
      } else {
        router.push('/user');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <button
              onClick={onBack}
              className="text-gray-500 hover:text-gray-700 mb-4"
            >
              ← Back to Welcome
            </button>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {role === 'admin' ? '🔐 Admin Login' : '👤 User Login'}
            </h1>
            <p className="text-gray-600">
              Sign in to your {role} account
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="form-label">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="input-field"
                required
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="input-field"
                required
                placeholder="Enter your password"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary py-3 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              Don't have an account?{' '}
              <button
                onClick={onSwitchToSignup}
                className="text-primary-600 hover:text-primary-700 font-medium"
              >
                Sign up as {role}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
