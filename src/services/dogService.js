import api from './api';

const dogService = {
  /**
   * Obtener todos los perros (con paginación)
   * @param {Object} params - { page, size, sortBy, sortDir }
   * @returns {Promise<Object>} Page<DogResponse>
   */
  getAllDogs: async (params = {}) => {
    const { page = 0, size = 12, sortBy = 'createdAt', sortDir = 'DESC' } = params;
    const response = await api.get('/api/dogs', {
      params: { page, size, sortBy, sortDir }
    });
    return response.data;
  },

  /**
   * Obtener perro por ID
   * @param {string} id - UUID del perro
   * @returns {Promise<Object>} DogResponse
   */
  getDogById: async (id) => {
    const response = await api.get(`/api/dogs/${id}`);
    return response.data;
  },

  /**
   * Filtrar perros
   * @param {Object} filters - { status, name, gender, size, page, pageSize }
   * @returns {Promise<Object>} Page<DogResponse>
   */
  filterDogs: async (filters = {}) => {
    const { page = 0, pageSize = 12, ...rest } = filters;
    const response = await api.get('/api/dogs/filter', {
      params: { page, pageSize, ...rest }
    });
    return response.data;
  },

  /**
   * Crear nuevo perro (ADMIN)
   * @param {Object} dogData - DogRequest
   * @returns {Promise<Object>} DogResponse
   */
  createDog: async (dogData) => {
    const response = await api.post('/api/dogs', dogData);
    return response.data;
  },

  /**
   * Actualizar perro (ADMIN)
   * @param {string} id - UUID del perro
   * @param {Object} dogData - DogRequest
   * @returns {Promise<Object>} DogResponse
   */
  updateDog: async (id, dogData) => {
    const response = await api.put(`/api/dogs/${id}`, dogData);
    return response.data;
  },

  /**
   * Eliminar perro (ADMIN)
   * @param {string} id - UUID del perro
   * @returns {Promise<void>}
   */
  deleteDog: async (id) => {
    await api.delete(`/api/dogs/${id}`);
  },

  /**
   * Contar perros por estado (ADMIN)
   * @param {string} status - 'AVAILABLE', 'ADOPTED', 'IN_PROCESS'
   * @returns {Promise<number>}
   */
  countByStatus: async (status) => {
    const response = await api.get('/api/dogs/stats/count-by-status', {
      params: { status }
    });
    return response.data;
  }
};

export default dogService;