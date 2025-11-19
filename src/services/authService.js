import api from './api';

const authService = {
  login: async (credentials) => {
    try {
      const response = await api.post('/api/auth/login', credentials);
      
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('adminEmail', response.data.email);
      }
      
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Login failed. Please check your credentials.';
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('adminEmail');
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },

  getAdminEmail: () => {
    return localStorage.getItem('adminEmail');
  }
};

export default authService;