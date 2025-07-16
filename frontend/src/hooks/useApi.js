import { useState, useEffect } from 'react';

export function useApi(apiCall, dependencies = []) {
  const [state, setState] = useState({
    data: null,
    loading: true,
    error: null,
  });

  const fetchData = async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const data = await apiCall();
      setState({ data, loading: false, error: null });
    } catch (error) {
      setState({ data: null, loading: false, error: error.message });
    }
  };

  useEffect(() => {
    fetchData();
  }, dependencies);

  return {
    ...state,
    refetch: fetchData,
  };
}

export function useAsyncAction() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const execute = async (action) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await action();
      setLoading(false);
      return result;
    } catch (error) {
      setError(error.message);
      setLoading(false);
      throw error;
    }
  };

  return { execute, loading, error };
}