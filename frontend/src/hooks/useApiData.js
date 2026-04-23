import { useState, useEffect, useCallback } from 'react';

export function useApiData(url, options = {}) {
  const [data, setData] = useState(options.initialData || null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    if (!url) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const headers = { ...(options.fetchOptions?.headers || {}) };
      if (token && !headers['Authorization']) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(url, {
        ...options.fetchOptions,
        headers,
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      setData(result);
    } catch (err) {
      console.error('Error fetching data from', url, err);
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [url]);

  useEffect(() => {
    if (options.skip) return;
    fetchData();
  }, [fetchData, options.skip]);

  return { data, loading, error, refetch: fetchData, setData };
}
