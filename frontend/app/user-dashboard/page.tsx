'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { User, authAPI, getAuthToken, removeAuthToken } from '../../lib/auth';

export default function UserDashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const token = getAuthToken();
      if (!token) {
        router.push('/');
        return;
      }

      try {
        const response = await authAPI.getCurrentUser();
        if (response.user.role !== 'user') {
          removeAuthToken();
          router.push('/');
          return;
        }
        setUser(response.user);
      } catch (error) {
        removeAuthToken();
        router.push('/');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  const handleLogout = () => {
    removeAuthToken();
    router.push('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">User Dashboard</h1>
              <p className="text-gray-600">Welcome back, {user?.name}</p>
            </div>
            <button
              onClick={handleLogout}
              className="btn-secondary"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Welcome to your Dashboard</h2>
          <p className="text-gray-600 mb-6">Browse and book events from our collection</p>
          <button
            onClick={() => router.push('/user')}
            className="btn-primary"
          >
            Browse Events
          </button>
        </div>

      </main>
    </div>
  );
}
