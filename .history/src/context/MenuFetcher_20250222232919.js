import React, { useEffect, useState, useRef } from 'react';
import { ActivityIndicator, Text } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import Constants from 'expo-constants';

const MenuFetcher = ({ restaurantId, onDataFetched }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const prevRestaurantIdRef = useRef();

  const { API_URL } = Constants.expoConfig.extra;  

  useEffect(() => {
    if (prevRestaurantIdRef.current === restaurantId) {
      return;
    }

    const fetchMenu = async () => {
      setLoading(true);
      setError(null);

      try {
        const token = await SecureStore.getItemAsync('token');
        if (!token) {
          throw new Error('No token found');
        }

        if (__DEV__) {
          console.log('[Fetched Menu Log] Fetching menu from URL:', `${API_URL}/api/rn/merchants/${restaurantId}`);
          console.log('[Fetched Menu Log] Authorization Header:', `Bearer ${token}`);
        }

        const response = await fetch(
          `${API_URL}/api/rn/merchants/${restaurantId}`,
          {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );

        if (!response.ok) {
          throw new Error('Failed to fetch menu');
        }

        const data = await response.json();

        if (__DEV__) {
          console.log('[Fetched Menu Log] Fetched menu data:');
        }

        onDataFetched(data); 
      } catch (err) {
        console.error('Error fetching menu:', err.message);
        setError('Unable to load menu, please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchMenu();

    prevRestaurantIdRef.current = restaurantId;

  }, [restaurantId, onDataFetched, API_URL]);

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (error) {
    return <Text style={{ color: 'red' }}>{error}</Text>;
  }

  return null; 
};

export default MenuFetcher;
