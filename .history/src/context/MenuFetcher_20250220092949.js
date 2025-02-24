import React, { useEffect, useState, useRef } from 'react';
import { ActivityIndicator, Text } from 'react-native';
import * as SecureStore from 'expo-secure-store';

const MenuFetcher = ({ restaurantId, onDataFetched }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const prevRestaurantIdRef = useRef();

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

        const response = await fetch(
          `https://dev.whatsdish.com/api/rn/merchants/${restaurantId}`,
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
        console.log("Fetched menu data:", data);
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

  }, [restaurantId, onDataFetched]);

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (error) {
    return <Text style={{ color: 'red' }}>{error}</Text>;
  }

  return null; 
};

export default MenuFetcher;
