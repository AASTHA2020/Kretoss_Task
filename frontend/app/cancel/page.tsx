'use client';

import { useRouter } from 'next/navigation';

export default function CancelPage() {
  const router = useRouter();
  return (
    <div className="min-h-screen flex items-center justify-center bg-red-50">
      <div className="bg-white p-8 rounded-xl shadow text-center">
        <h1 className="text-2xl font-bold text-red-700">Payment Cancelled</h1>
        <p className="mt-2 text-gray-600">Your payment was not completed.</p>
        <button onClick={() => router.push('/user')} className="mt-6 btn-secondary">Back to Events</button>
      </div>
    </div>
  );
}


