import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import * as SecureStore from 'expo-secure-store';

const FetchCartItems = ({ onCartFetched }) => {
  useEffect(() => {
    const fetchCart = async () => {
      try {
        console.log('[FetchCartItems Log] Starting cart fetch');
        const orderId = await SecureStore.getItemAsync('order_id');
        console.log('[FetchCartItems Log] Retrieved order_id:', orderId);

        if (!orderId) {
          console.warn('[FetchCartItems Warning] No order_id found');
          return;
        }

        const response = await fetch(`https://dev.whatsdish.com/api/orders/${orderId}/cart/items`);
        console.log('[FetchCartItems Log] API Request URL:', `https://dev.whatsdish.com/api/orders/${orderId}/cart/items`);

        if (!response.ok) {
          console.error('[FetchCartItems Error] API request failed with status:', response.status);
          return;
        }

        const data = await response.json();
        console.log('[FetchCartItems Log] Fetched cart items:', JSON.stringify(data, null, 2));

        if (onCartFetched) {
          // This is where we need to pass the data to the parent component
          onCartFetched(data.result.items);  // Assuming the items are inside `result.items`
        }
      } catch (error) {
        console.error('[FetchCartItems Error] Fetch cart items failed:', error);
      }
    };

    fetchCart();
  }, []);

  return (
    <View>
      <Text>Fetching cart items...</Text>
    </View>
  );
};

export default FetchCartItems;
