import React, { useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import Constants from 'expo-constants';
import { View, Text } from 'react-native';

const FetchMenu = ({ orderId, lang, onSuccess, onError }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [menu, setMenu] = useState([]);
  
  const { API_URL } = Constants.expoConfig.extra;

  useEffect(() => {
    const fetchMenu = async () => {
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
        onSuccess(data);
        
        if (__DEV__) {
          console.log('[Fetched Menu Log] Data:', data);
        }
      } catch (err) {
        console.error('Error fetching menu:', err.message);
        setError('Unable to load menu, please try again later.');
        onError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (orderId && lang) {
      fetchMenu();
    }
  }, [orderId, lang, onSuccess, onError, API_URL]);

  if (loading) {
    return null; // Or add a loading spinner
  }

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
