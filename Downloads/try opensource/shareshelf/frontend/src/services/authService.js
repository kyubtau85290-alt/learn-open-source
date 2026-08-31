import api from './api';

const authService = {
  register: async (name, email, password, location) => {
    const response = await api.post('/auth/register', {
      name,
      email,
      password,
      location,
    });
    return response.data;
  },

  login: async (email, password) => {
    const response = await api.post('/auth/login', {
      email,
      password,
    });
    return response.data;
  },

  refreshToken: async (refreshToken) => {
    const response = await api.post('/auth/refresh', { refreshToken });
    return response.data;
  },

  getProfile: async () => {
    const response = await api.get('/users/profile/me');
    return response.data;
  },

  updateProfile: async (userId, data) => {
    const response = await api.put(`/users/${userId}`, data);
    return response.data;
  },

  getUserProfile: async (userId) => {
    const response = await api.get(`/users/${userId}`);
    return response.data;
  },

  getAllUsers: async (location, page = 1, limit = 10) => {
    const response = await api.get('/users', {
      params: { location, page, limit },
    });
    return response.data;
  },

  recalculateTrustScore: async (userId) => {
    const response = await api.post(`/users/${userId}/recalculate-trust`);
    return response.data;
  },
};

export default authService;
