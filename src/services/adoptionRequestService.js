import api from './api';

const adoptionRequestService = {
  getAllRequests: async (params = {}) => {
    const { page = 0, size = 15, sortBy = 'createdAt', sortDir = 'DESC' } = params;
    const response = await api.get('/api/adoption-requests', {
      params: { page, size, sortBy, sortDir }
    });
    return response.data;
  },

  getRequestById: async (id) => {
    const response = await api.get(`/api/adoption-requests/${id}`);
    return response.data;
  },

  filterRequests: async (filters = {}) => {
    const { page = 0, size = 15, ...rest } = filters;
    const response = await api.get('/api/adoption-requests/filter', {
      params: { page, size, ...rest }
    });
    return response.data;
  },

  getRequestsByDog: async (dogId, params = {}) => {
    const { page = 0, size = 15 } = params;
    const response = await api.get(`/api/adoption-requests/dog/${dogId}`, {
      params: { page, size }
    });
    return response.data;
  },

  createRequest: async (requestData) => {
    const response = await api.post('/api/adoption-requests', requestData);
    return response.data;
  },

  updateRequestStatus: async (id, status) => {
    const response = await api.put(`/api/adoption-requests/${id}/status`, { status });
    return response.data;
  },

  countByStatus: async (status) => {
    const response = await api.get('/api/adoption-requests/stats/count-by-status', {
      params: { status }
    });
    return response.data;
  }
};

export default adoptionRequestService;
