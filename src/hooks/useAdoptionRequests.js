import { useState, useEffect } from 'react';
import adoptionRequestService from '../services/adoptionRequestService';

/**
 * Hook para obtener solicitudes de adopción
 * @param {Object} params - Parámetros de paginación y filtros
 * @returns {Object} { requests, loading, error, totalPages, refetch }
 */
const useAdoptionRequests = (params = {}) => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      setError(null);
      
      let response;
      
      // Si hay filtros, usar el endpoint de filtrado
      if (params.status || params.dogId || params.requesterName) {
        response = await adoptionRequestService.filterRequests(params);
      } else {
        response = await adoptionRequestService.getAllRequests(params);
      }
      
      setRequests(response.content || []);
      setTotalPages(response.totalPages || 0);
      setTotalElements(response.totalElements || 0);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch adoption requests');
      setRequests([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [JSON.stringify(params)]); // Refetch cuando cambien los parámetros

  return {
    requests,
    loading,
    error,
    totalPages,
    totalElements,
    refetch: fetchRequests
  };
};

export default useAdoptionRequests;