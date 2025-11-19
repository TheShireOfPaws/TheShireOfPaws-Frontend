import { useState, useEffect } from 'react';
import dogService from '../services/dogService';

const useDogs = (params = {}) => {
  const [dogs, setDogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  const fetchDogs = async () => {
    try {
      setLoading(true);
      setError(null);
      
      let response;
      
      if (params.status || params.name || params.gender || params.size) {
        response = await dogService.filterDogs(params);
      } else {
        response = await dogService.getAllDogs(params);
      }
      
      setDogs(response.content || []);
      setTotalPages(response.totalPages || 0);
      setTotalElements(response.totalElements || 0);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch dogs');
      setDogs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDogs();
  }, [JSON.stringify(params)]);

  return {
    dogs,
    loading,
    error,
    totalPages,
    totalElements,
    refetch: fetchDogs
  };
};

export default useDogs;