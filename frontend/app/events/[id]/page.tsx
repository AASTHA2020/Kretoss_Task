'use client';

import { useEffect, useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Event, eventsAPI } from '../../../lib/events';
import { getAuthToken } from '../../../lib/auth';
import axios from '../../../lib/axios';

export default function EventDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Stabilize the id to avoid useEffect re-running due to params object identity changes
  const eventId = useMemo(() => {
    const p: any = params;
    if (!p || !p.id) return undefined as unknown as string | undefined;
    return Array.isArray(p.id) ? p.id[0] : (p.id as string);
  }, [params]);

  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      if (!eventId) return;
      try {
        const data = await eventsAPI.getEvent(eventId);
        if (isMounted) setEvent(data);
      } catch (e: any) {
        if (isMounted) setError('Failed to load event');
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    setLoading(true);
    load();
    return () => {
      isMounted = false;
    };
  }, [eventId]);

  const bookEvent = async () => {
    try {
      const token = getAuthToken();
      if (!token) {
        router.push('/');
        return;
      }

      if (!event) {
        alert('Event not found');
        return;
      }

      if (event.availableSeats <= 0) {
        alert('This event is sold out');
        return;
      }

      console.log('Creating checkout session for event:', event._id);
      
      // Create checkout session
      const response = await axios.post('/checkout/create-session', {
        eventId: event._id
      });
      
      console.log('Checkout session response:', response.data);
      
      if (response.data && response.data.url) {
        console.log('Redirecting to Stripe checkout:', response.data.url);
        // Redirect to Stripe hosted checkout page
        window.location.href = response.data.url;
      } else {
        console.error('No checkout URL in response:', response.data);
        throw new Error('No checkout URL received');
      }
    } catch (err: any) {
      console.error('Payment error:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Failed to start checkout';
      alert(`Payment Error: ${errorMessage}`);
    }
  };

  if (loading) return null;
  if (error || !event) return <div className="p-6 text-red-600">{error || 'Event not found'}</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <img src={event.primaryImage.url} alt={event.title} className="w-full h-80 object-cover" />
          <div className="p-6">
            <h1 className="text-3xl font-bold text-gray-900">{event.title}</h1>
            <p className="mt-3 text-gray-700">{event.description}</p>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-600">
              <div><span className="font-medium">Date:</span> {new Date(event.date).toLocaleString()}</div>
              <div><span className="font-medium">Location:</span> {event.location}</div>
              <div><span className="font-medium">Seats:</span> {event.availableSeats} / {event.totalSeats}</div>
              <div><span className="font-medium">Price:</span> ${event.ticketPrice.toFixed(2)}</div>
            </div>

            {event.secondaryImages.length > 0 && (
              <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3">
                {event.secondaryImages.map((img) => (
                  <img key={img.publicId} src={img.url} alt={event.title} className="h-24 w-full object-cover rounded" />
                ))}
              </div>
            )}

            <div className="mt-8">
              <button
                onClick={bookEvent}
                disabled={event.availableSeats <= 0}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {event.availableSeats > 0 ? 'Book / Purchase Ticket' : 'Sold Out'}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}


