import api from './api';

const fileService = {
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

  getFileUrl: (fileName) => {
    if (!fileName) return null;
    const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080';
    return `${baseUrl}/api/files/download/${fileName}`;
  },

  deleteFile: async (fileName) => {
    const response = await api.delete(`/api/files/${fileName}`);
    return response.data;
  }
};

export default fileService;