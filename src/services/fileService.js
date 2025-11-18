import api from './api';

const fileService = {
  /**
   * Subir archivo (imagen) - ADMIN
   * @param {File} file - Archivo a subir
   * @returns {Promise<Object>} { fileName, fileDownloadUri, fileType, size }
   */
  uploadFile: async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await api.post('/api/files/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.data;
  },

  /**
   * Obtener URL completa para descargar/mostrar archivo
   * @param {string} fileName - Nombre del archivo
   * @returns {string} URL completa
   */
  getFileUrl: (fileName) => {
    if (!fileName) return null;
    const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080';
    return `${baseUrl}/api/files/download/${fileName}`;
  },

  /**
   * Eliminar archivo - ADMIN
   * @param {string} fileName - Nombre del archivo a eliminar
   * @returns {Promise<Object>} { message, fileName }
   */
  deleteFile: async (fileName) => {
    const response = await api.delete(`/api/files/${fileName}`);
    return response.data;
  }
};

export default fileService;