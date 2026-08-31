import api from './api';

const itemService = {
  getItems: async (category, location, page = 1, limit = 12, search) => {
    const response = await api.get('/items', {
      params: { category, location, page, limit, search },
    });
    return response.data;
  },

  getItem: async (itemId) => {
    const response = await api.get(`/items/${itemId}`);
    return response.data;
  },

  getUserItems: async (userId, page = 1, limit = 12) => {
    const response = await api.get(`/items/user/${userId}`, {
      params: { page, limit },
    });
    return response.data;
  },

  createItem: async (formData) => {
    const response = await api.post('/items', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  updateItem: async (itemId, data) => {
    const response = await api.put(`/items/${itemId}`, data, {
      headers: data instanceof FormData ? { 'Content-Type': 'multipart/form-data' } : {},
    });
    return response.data;
  },

  deleteItem: async (itemId) => {
    const response = await api.delete(`/items/${itemId}`);
    return response.data;
  },
};

export default itemService;
