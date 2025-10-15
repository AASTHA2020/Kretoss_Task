import axios from './axios';
import { getAuthToken } from './auth';

export interface Event {
  _id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  totalSeats: number;
  availableSeats: number;
  ticketPrice: number;
  primaryImage: {
    publicId: string;
    url: string;
  };
  secondaryImages: Array<{
    publicId: string;
    url: string;
  }>;
  status: 'active' | 'cancelled' | 'completed';
  createdBy: {
    _id: string;
    name: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
  isFullyBooked: boolean;
  isSoldOut: boolean;
}

export interface CreateEventData {
  title: string;
  description: string;
  date: string;
  location: string;
  totalSeats: number;
  ticketPrice: number;
  primaryImage: File;
  secondaryImages?: File[];
}

export interface UpdateEventData {
  title?: string;
  description?: string;
  date?: string;
  location?: string;
  totalSeats?: number;
  ticketPrice?: number;
  primaryImage?: File;
  secondaryImages?: File[];
}

export const eventsAPI = {
  getEvents: async (page = 1, limit = 10, status = 'active'): Promise<{
    events: Event[];
    totalPages: number;
    currentPage: number;
    total: number;
  }> => {
    const response = await axios.get('/events', {
      params: { page, limit, status }
    });
    return response.data;
  },

  getEvent: async (id: string): Promise<Event> => {
    const response = await axios.get(`/events/${id}`);
    return response.data;
  },

  createEvent: async (eventData: CreateEventData): Promise<Event> => {
    const token = getAuthToken();
    const formData = new FormData();
    
    formData.append('title', eventData.title);
    formData.append('description', eventData.description);
    formData.append('date', eventData.date);
    formData.append('location', eventData.location);
    formData.append('totalSeats', eventData.totalSeats.toString());
    formData.append('ticketPrice', eventData.ticketPrice.toString());
    formData.append('primaryImage', eventData.primaryImage);
    
    if (eventData.secondaryImages) {
      eventData.secondaryImages.forEach((image, index) => {
        formData.append('secondaryImages', image);
      });
    }

    const response = await axios.post('/events', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },

  updateEvent: async (id: string, eventData: UpdateEventData): Promise<Event> => {
    const token = getAuthToken();
    const formData = new FormData();
    
    if (eventData.title) formData.append('title', eventData.title);
    if (eventData.description) formData.append('description', eventData.description);
    if (eventData.date) formData.append('date', eventData.date);
    if (eventData.location) formData.append('location', eventData.location);
    if (eventData.totalSeats) formData.append('totalSeats', eventData.totalSeats.toString());
    if (eventData.ticketPrice) formData.append('ticketPrice', eventData.ticketPrice.toString());
    if (eventData.primaryImage) formData.append('primaryImage', eventData.primaryImage);
    
    if (eventData.secondaryImages) {
      eventData.secondaryImages.forEach((image) => {
        formData.append('secondaryImages', image);
      });
    }

    const response = await axios.put(`/events/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },

  deleteEvent: async (id: string): Promise<void> => {
    const token = getAuthToken();
    await axios.delete(`/events/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  updateEventStatus: async (id: string, status: 'active' | 'cancelled' | 'completed'): Promise<Event> => {
    const token = getAuthToken();
    const response = await axios.patch(`/events/${id}/status`, 
      { status },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  },
};
