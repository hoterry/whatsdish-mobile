// useApi.js
import { useState } from 'react';

export const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchData = async (url, options) => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch(url, options);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong');
      }

      return data;
    } catch (err) {
      setError(err.message || 'Unexpected error occurred');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { fetchData, loading, error };
};