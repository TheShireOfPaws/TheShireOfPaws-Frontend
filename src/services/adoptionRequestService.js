import api from './api';

const adoptionRequestService = {
  /**
   * Obtener todas las solicitudes (ADMIN, con paginación)
   * @param {Object} params - { page, size, sortBy, sortDir }
   * @returns {Promise<Object>} Page<AdoptionRequestResponse>
   */
  getAllRequests: async (params = {}) => {
    const { page = 0, size = 15, sortBy = 'createdAt', sortDir = 'DESC' } = params;
    const response = await api.get('/api/adoption-requests', {
      params: { page, size, sortBy, sortDir }
    });
    return response.data;
  },

  /**
   * Obtener solicitud por ID (ADMIN)
   * @param {string} id - UUID de la solicitud
   * @returns {Promise<Object>} AdoptionRequestResponse
   */
  getRequestById: async (id) => {
    const response = await api.get(`/api/adoption-requests/${id}`);
    return response.data;
  },

  /**
   * Filtrar solicitudes (ADMIN)
   * @param {Object} filters - { status, dogId, requesterName, page, size }
   * @returns {Promise<Object>} Page<AdoptionRequestResponse>
   */
  filterRequests: async (filters = {}) => {
    const { page = 0, size = 15, ...rest } = filters;
    const response = await api.get('/api/adoption-requests/filter', {
      params: { page, size, ...rest }
    });
    return response.data;
  },

  /**
   * Obtener solicitudes por perro (ADMIN)
   * @param {string} dogId - UUID del perro
   * @param {Object} params - { page, size }
   * @returns {Promise<Object>} Page<AdoptionRequestResponse>
   */
  getRequestsByDog: async (dogId, params = {}) => {
    const { page = 0, size = 15 } = params;
    const response = await api.get(`/api/adoption-requests/dog/${dogId}`, {
      params: { page, size }
    });
    return response.data;
  },

  /**
   * Crear solicitud de adopción (PÚBLICO)
   * @param {Object} requestData - AdoptionRequestRequest
   * @returns {Promise<Object>} AdoptionRequestResponse
   */
  createRequest: async (requestData) => {
    const response = await api.post('/api/adoption-requests', requestData);
    return response.data;
  },

  /**
   * Actualizar estado de solicitud (ADMIN)
   * @param {string} id - UUID de la solicitud
   * @param {string} status - 'IN_PROCESS', 'APPROVED', 'DENIED'
   * @returns {Promise<Object>} AdoptionRequestResponse
   */
  updateRequestStatus: async (id, status) => {
    const response = await api.put(`/api/adoption-requests/${id}/status`, { status });
    return response.data;
  },

  /**
   * Contar solicitudes por estado (ADMIN)
   * @param {string} status - 'IN_PROCESS', 'APPROVED', 'DENIED'
   * @returns {Promise<number>}
   */
  countByStatus: async (status) => {
    const response = await api.get('/api/adoption-requests/stats/count-by-status', {
      params: { status }
    });
    return response.data;
  }
};

export default adoptionRequestService;