import api from './api';

const requestService = {
  getRequests: async (status, page = 1, limit = 10, role) => {
    const response = await api.get('/borrow-requests', {
      params: { status, page, limit, role },
    });
    return response.data;
  },

  getRequest: async (requestId) => {
    const response = await api.get(`/borrow-requests/${requestId}`);
    return response.data;
  },

  createRequest: async (itemId, dueDate, notes = '') => {
    const response = await api.post('/borrow-requests', {
      itemId,
      dueDate,
      notes,
    });
    return response.data;
  },

  updateRequestStatus: async (requestId, newStatus) => {
    const response = await api.put(`/borrow-requests/${requestId}/status`, { newStatus });
    return response.data;
  },

  cancelRequest: async (requestId) => {
    const response = await api.delete(`/borrow-requests/${requestId}`);
    return response.data;
  },

  createReview: async (borrowRequestId, rating, comment, reviewType) => {
    const response = await api.post('/reviews', {
      borrowRequestId,
      rating,
      comment,
      reviewType,
    });
    return response.data;
  },

  getUserReviews: async (userId, page = 1, limit = 10) => {
    const response = await api.get(`/reviews/user/${userId}`, {
      params: { page, limit },
    });
    return response.data;
  },
};

export default requestService;
