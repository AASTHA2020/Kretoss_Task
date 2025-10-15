'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { User, authAPI, getAuthToken, removeAuthToken } from '../../../lib/auth';
import { Event, eventsAPI } from '../../../lib/events';
import EventList from '../components/EventList';
import EventForm from '../components/EventForm';

export default function AdminEventsPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState<Event[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [eventsLoading, setEventsLoading] = useState(false);
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
        if (response.user.role !== 'admin') {
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

  useEffect(() => {
    if (user) {
      loadEvents();
    }
  }, [user, currentPage]);

  const loadEvents = async () => {
    setEventsLoading(true);
    try {
      const response = await eventsAPI.getEvents(currentPage, 10, 'all');
      setEvents(response.events);
      setTotalPages(response.totalPages);
    } catch (error) {
      console.error('Error loading events:', error);
    } finally {
      setEventsLoading(false);
    }
  };

  const handleCreateEvent = () => {
    setEditingEvent(null);
    setShowForm(true);
  };

  const handleEditEvent = (event: Event) => {
    setEditingEvent(event);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingEvent(null);
  };

  const handleFormSubmit = async () => {
    setShowForm(false);
    setEditingEvent(null);
    await loadEvents();
  };

  const handleDeleteEvent = async (eventId: string) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        await eventsAPI.deleteEvent(eventId);
        await loadEvents();
      } catch (error) {
        console.error('Error deleting event:', error);
        alert('Failed to delete event');
      }
    }
  };

  const handleStatusChange = async (eventId: string, status: 'active' | 'cancelled' | 'completed') => {
    try {
      await eventsAPI.updateEventStatus(eventId, status);
      await loadEvents();
    } catch (error) {
      console.error('Error updating event status:', error);
      alert('Failed to update event status');
    }
  };

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
            <div className="flex items-center space-x-4">
              {/* <button
                onClick={() => router.push('/admin-dashboard')}
                className="text-gray-500 hover:text-gray-700"
              >
                ← Back to Dashboard
              </button> */}
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Event Management</h1>
                <p className="text-gray-600">Manage your events</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={handleCreateEvent}
                className="btn-primary"
              >
                + Create Event
              </button>
              <button
                onClick={handleLogout}
                className="btn-secondary"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {showForm ? (
          <EventForm
            event={editingEvent}
            onClose={handleFormClose}
            onSubmit={handleFormSubmit}
          />
        ) : (
          <EventList
            events={events}
            loading={eventsLoading}
            onEdit={handleEditEvent}
            onDelete={handleDeleteEvent}
            onStatusChange={handleStatusChange}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        )}
      </main>
    </div>
  );
}
