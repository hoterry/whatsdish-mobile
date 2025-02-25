import React, { useEffect, useState, useRef } from 'react';
import { ActivityIndicator, Text } from 'react-native';
import Constants from 'expo-constants';
import * as SecureStore from 'expo-secure-store';  // Import SecureStore

const MenuFetcher = ({ onDataFetched }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [orderId, setOrderId] = useState(null);  // State to hold orderId

  const prevOrderIdRef = useRef();
  const { API_URL } = Constants.expoConfig.extra;

  const lang = 'en';

  useEffect(() => {
    const fetchOrderIdFromSecureStore = async () => {
      try {
        const storedOrderId = await SecureStore.getItemAsync('order_id');
        if (storedOrderId) {
          setOrderId(storedOrderId);
          console.log('[MenuFetcher Log] Retrieved orderId from SecureStore:', storedOrderId);
        } else {
          console.log('[MenuFetcher Log] No orderId found in SecureStore');
        }
      } catch (err) {
        console.error('[MenuFetcher Log] Error retrieving orderId from SecureStore:', err);
      }
    };

    fetchOrderIdFromSecureStore();
  }, []);  // Empty dependency array to run only once on mount

  useEffect(() => {
    if (!orderId) {
      return;  // Skip fetching if orderId is not available yet
    }

    // Log the orderId whenever it changes or component mounts
    console.log('[MenuFetcher Log] Current orderId:', orderId);

    if (__DEV__) {
      console.log('[MenuFetcher Log] Component mounted or orderId changed');
    }

    // If the orderId hasn't changed, skip fetching
    if (prevOrderIdRef.current === orderId) {
      if (__DEV__) {
        console.log('[MenuFetcher Log] Skipping fetch, orderId has not changed');
      }
      return;
    }

    const fetchMenu = async () => {
      setLoading(true);
      setError(null);

      try {
        if (__DEV__) {
          console.log('[MenuFetcher Log] Attempting to fetch menu for orderId:', orderId, 'with language:', lang);
        }

        // API request with orderId and hardcoded lang
        const apiUrl = `https://dev.whatsdish.com/api/orders/${orderId}/items?language=${lang}`;

        if (__DEV__) {
          console.log('[MenuFetcher Log] Fetching menu from API URL:', apiUrl);
        }

        const response = await fetch(apiUrl, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch menu with status: ${response.status}`);
        }

        const data = await response.json();
        if (__DEV__) {
          console.log('[MenuFetcher Log] Fetched menu data:', data);
        }

        onDataFetched(data); // Pass the fetched data to the parent component
      } catch (err) {
        console.error('[MenuFetcher Log] Error fetching menu:', err.message);
        setError('Unable to load menu, please try again later.');
      } finally {
        if (__DEV__) {
          console.log('[MenuFetcher Log] Finished fetching menu for orderId:', orderId);
        }
        setLoading(false);
      }
    };

    fetchMenu();

    prevOrderIdRef.current = orderId; // Update the previous orderId to the current one

  }, [orderId, onDataFetched]);

  if (loading) {
    if (__DEV__) {
      console.log('[MenuFetcher Log] Loading...');
    }
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (error) {
    if (__DEV__) {
      console.log('[MenuFetcher Log] Error occurred:', error);
    }
    return <Text style={{ color: 'red' }}>{error}</Text>;
  }

  return null;
};

export default MenuFetcher;
