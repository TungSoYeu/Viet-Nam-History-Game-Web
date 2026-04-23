import { useState, useEffect } from 'react';

const API_OPEN_PROVINCE = "https://provinces.open-api.vn/api/";
let cachedProvinces = [];

export function useProvinces() {
  const [provinces, setProvinces] = useState(cachedProvinces);
  const [loading, setLoading] = useState(!cachedProvinces.length);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (cachedProvinces.length > 0) {
      return;
    }

    let isMounted = true;
    const fetchProvinces = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${API_OPEN_PROVINCE}?depth=2`);
        if (!response.ok) throw new Error("Failed to fetch provinces");
        const data = await response.json();
        
        if (isMounted) {
          cachedProvinces = data;
          setProvinces(data);
          setError(null);
        }
      } catch (err) {
        if (isMounted) setError(err.message);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchProvinces();
    return () => {
      isMounted = false;
    };
  }, []);

  return { provinces, loading, error };
}
