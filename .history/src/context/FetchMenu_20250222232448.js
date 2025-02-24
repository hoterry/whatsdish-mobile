import React, { useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import Constants from 'expo-constants';

const FetchMenu = ({ restaurantId, onSuccess, onError }) => {
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

        const response = await fetch(
          `${API_URL}/fetch-menu?restaurantId=${restaurantId}`,
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
        
        if (__DEV__) {
          console.log('Fetched Menu Data:', data); 
        }
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
  }, [restaurantId, onSuccess, onError, API_URL]); 

  if (loading) {
    return null; 
  }

  if (error) {
    return null; 
  }

  return (
    <View>
      {menu.map((item, index) => (
        <Text key={index}>{item.name}</Text>  
      ))}
    </View>
  );
};

export default FetchMenu;
