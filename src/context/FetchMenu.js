import React, { useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import Constants from 'expo-constants';
import { View, Text } from 'react-native';
import { useLoading } from '../../context/LoadingContext';

const FetchMenu = ({ orderId, lang, onSuccess, onError }) => {
  const { setIsLoading } = useLoading();
  const [error, setError] = useState(null);
  const [menu, setMenu] = useState([]);
  
  const { API_URL } = Constants.expoConfig.extra;

  useEffect(() => {
    const fetchMenu = async () => {
      setIsLoading(true);
      
      try {
        const token = await SecureStore.getItemAsync('token');
        if (!token) {
          throw new Error('No authentication token found');
        }

        if (__DEV__) {
          console.log('[Fetched Menu Log] Fetching menu with API URL:', `${API_URL}/fetch-menu?orderId=${orderId}&lang=${lang}`);
          console.log('[Fetched Menu Log] Authorization Header:', `Bearer ${token}`);
        }

        // API request with orderId and lang
        const response = await fetch(
          `${API_URL}/fetch-menu?orderId=${orderId}&lang=${lang}`,
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
        setMenu(data.categories || []);  // Assuming 'categories' is the key in response
        
        if (onSuccess && typeof onSuccess === 'function') {
          onSuccess(data);
        }
        
        if (__DEV__) {
          console.log('[Fetched Menu Log] Data:', data);
        }
      } catch (err) {
        console.error('Error fetching menu:', err.message);
        setError('Unable to load menu, please try again later.');
        
        if (onError && typeof onError === 'function') {
          onError(err.message);
        }
      } finally {
        setIsLoading(false);
      }
    };

    if (orderId && lang) {
      fetchMenu();
    }
  }, [orderId, lang, onSuccess, onError, setIsLoading, API_URL]);

  if (error) {
    return <Text>{error}</Text>; // Display error message
  }

  return (
    <View>
      {menu.map((category, index) => (
        <View key={index}>
          <Text>{category.name}</Text>
          <Text>{category.description}</Text>
        </View>
      ))}
    </View>
  );
};

export default FetchMenu;