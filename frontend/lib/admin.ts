import axios from './axios';

export interface AdminStats {
  totalUsers: number;
  totalEvents: number;
  totalBookings: number;
}

export const adminAPI = {
  getStats: async (): Promise<AdminStats> => {
    const response = await axios.get('/admin/stats');
    return response.data;
  },

  getEvents: async (page = 1, limit = 10, status = 'all'): Promise<{
    events: any[];
    totalPages: number;
    currentPage: number;
    total: number;
  }> => {
    const response = await axios.get('/admin/events', {
      params: { page, limit, status }
    });
    return response.data;
  },
};
