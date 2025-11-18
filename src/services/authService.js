import api from './api';

const authService = {
  /**
   * Login del admin
   * @param {Object} credentials - { email, password }
   * @returns {Promise<Object>} { token, email }
   */
  login: async (credentials) => {
    try {
      const response = await api.post('/api/auth/login', credentials);
      
      // Guardar token en localStorage
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('adminEmail', response.data.email);
      }
      
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Login failed. Please check your credentials.';
    }
  },

  /**
   * Logout del admin
   */
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('adminEmail');
  },

  /**
   * Verificar si está autenticado
   * @returns {boolean}
   */
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },

  /**
   * Obtener email del admin logueado
   * @returns {string|null}
   */
  getAdminEmail: () => {
    return localStorage.getItem('adminEmail');
  }
};

export default authService;