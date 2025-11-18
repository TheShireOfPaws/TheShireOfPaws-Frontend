import api from './api';

const statsService = {
  getStats: async () => {
    try {
      const response = await api.get('/api/dogs/stats');
      return response.data;
    } catch (error) {
      console.error('Error fetching stats:', error);
      throw error;
    }
  }
};

export default statsService;