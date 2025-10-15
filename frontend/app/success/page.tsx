'use client';

import { useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import axios from '../../lib/axios';

export default function SuccessPage() {
  const params = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const confirm = async () => {
      const sessionId = params.get('session_id');
      console.log('Success page - Session ID:', sessionId);
      
      if (!sessionId) {
        console.log('No session ID found');
        return;
      }
      
      try {
        console.log('Confirming payment for session:', sessionId);
        await axios.post('/checkout/confirm', { sessionId });
        console.log('Payment confirmed successfully');
      } catch (error) {
        console.error('Payment confirmation error:', error);
      }
    };
    confirm();
  }, [params]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-50">
      <div className="bg-white p-8 rounded-xl shadow text-center">
        <h1 className="text-2xl font-bold text-green-700">Payment Successful!</h1>
        <p className="mt-2 text-gray-600">Your booking has been confirmed.</p>
        <button onClick={() => router.push('/user')} className="mt-6 btn-primary">Go to Events</button>
      </div>
    </div>
  );
}


