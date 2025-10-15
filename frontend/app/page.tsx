'use client';

import { useState } from 'react';
import LoginForm from './components/LoginForm';
import SignupForm from './components/SignupForm';

export default function Home() {
  const [showLogin, setShowLogin] = useState<'admin' | 'user' | null>(null);
  const [showSignup, setShowSignup] = useState<'admin' | 'user' | null>(null);

  const handleLoginClick = (role: 'admin' | 'user') => {
    setShowLogin(role);
    setShowSignup(null);
  };

  const handleSignupClick = (role: 'admin' | 'user') => {
    setShowSignup(role);
    setShowLogin(null);
  };

  const handleBackToWelcome = () => {
    setShowLogin(null);
    setShowSignup(null);
  };

  if (showLogin) {
    return (
      <LoginForm 
        role={showLogin} 
        onBack={handleBackToWelcome}
        onSwitchToSignup={() => {
          setShowLogin(null);
          setShowSignup(showLogin);
        }}
      />
    );
  }

  if (showSignup) {
    return (
      <SignupForm 
        role={showSignup} 
        onBack={handleBackToWelcome}
        onSwitchToLogin={() => {
          setShowSignup(null);
          setShowLogin(showSignup);
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Event Booking Platform
            </h1>
            <p className="text-gray-600">
              Choose your role to continue
            </p>
          </div>

          <div className="space-y-4">
            <button
              onClick={() => handleLoginClick('admin')}
              className="w-full btn-primary text-lg py-3"
            >
              🔐 Login as Admin
            </button>
            
            <button
              onClick={() => handleLoginClick('user')}
              className="w-full btn-secondary text-lg py-3"
            >
              👤 Login as User
            </button>
          </div>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              New to the platform?{' '}
              <button
                onClick={() => handleSignupClick('user')}
                className="text-primary-600 hover:text-primary-700 font-medium"
              >
                Sign up as User
              </button>
              {' or '}
              <button
                onClick={() => handleSignupClick('admin')}
                className="text-primary-600 hover:text-primary-700 font-medium"
              >
                Sign up as Admin
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
