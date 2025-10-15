'use client';

import { useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

export default function SuccessPage() {
  const params = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const confirm = async () => {
      const sessionId = params.get('session_id');
      if (!sessionId) return;
      await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/checkout/confirm`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId })
      });
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


