'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { User, authAPI, getAuthToken, removeAuthToken } from '../../lib/auth';
import { Event, eventsAPI } from '../../lib/events';
import io from 'socket.io-client';

const socketBase = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:5000';

export default function UserEventsPage() {
  const [user, setUser] = useState<User | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
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

  const loadEvents = async () => {
    try {
      const data = await eventsAPI.getEvents(1, 50, 'active');
      setEvents(data.events);
    } catch (error) {
      console.error('Error loading events:', error);
      setEvents([]);
    }
  };

  useEffect(() => {
    if (!loading) {
      loadEvents();
      const socket = io(socketBase);
      socket.on('event:updated', (payload: any) => {
        setEvents((prev) => prev.map((e) => e._id === payload.eventId ? { ...e, availableSeats: payload.availableSeats } : e));
      });
      socket.on('events:updated', () => {
        loadEvents(); // Reload all events when admin creates/updates/deletes
      });
      return () => {
        socket.disconnect();
      };
    }
  }, [loading]);

  if (loading) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-2xl font-bold text-gray-900">Browse Events</h1>
          <p className="text-gray-600">Welcome, {user?.name}</p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {events.length === 0 ? (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No events available</h3>
            <p className="mt-1 text-sm text-gray-500">Check back later for new events to book.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <div key={event._id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <img src={event.primaryImage.url} alt={event.title} className="w-full h-48 object-cover" />
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900">{event.title}</h3>
                  <p className="text-gray-600 text-sm line-clamp-2">{event.description}</p>
                  <div className="mt-3 text-sm text-gray-500">
                    <div>{new Date(event.date).toLocaleString()}</div>
                    <div>{event.location}</div>
                    <div>{event.availableSeats} / {event.totalSeats} seats</div>
                    <div className="text-primary-600 font-semibold">${event.ticketPrice.toFixed(2)}</div>
                  </div>
                  <button
                    onClick={() => router.push(`/events/${event._id}`)}
                    className="mt-4 w-full btn-primary"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}


