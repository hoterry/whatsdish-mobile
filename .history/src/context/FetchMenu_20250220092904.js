import React, { useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';

const FetchMenu = ({ restaurantId, onSuccess, onError }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [menu, setMenu] = useState([]);

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const token = await SecureStore.getItemAsync('token');
        if (!token) {
          throw new Error('No authentication token found');
        }
        const response = await fetch(
          `http://10.0.0.7:5000/fetch-menu?restaurantId=${restaurantId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error('Failed to fetch menu');
        }

        const data = await response.json();
        setMenu(data);
        onSuccess(data);
        console.log('Fetched Menu Data Whatsdish :', data); 
      } catch (err) {
        console.error('Error fetching menu:', err.message);
        setError('Unable to load menu, please try again later.');
        onError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (restaurantId) {
      fetchMenu();
    }
  }, [restaurantId, onSuccess, onError]);

  if (loading) {
    return null; 
  }

  if (error) {
    return null; 
  }

  return null;
};

export default FetchMenu;
