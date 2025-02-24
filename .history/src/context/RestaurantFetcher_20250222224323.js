import React, { useEffect, useState, useCallback } from 'react';
import { ActivityIndicator, Text } from 'react-native';
import Constants from 'expo-constants'; // 引入 Expo Constants

const RestaurantFetcher = ({ onDataFetched }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const stableOnDataFetched = useCallback(onDataFetched, []);

  useEffect(() => {
    const fetchRestaurants = async () => {
      const { API_URL } = Constants.expoConfig.extra; // 從環境變量獲取 API URL

      if (__DEV__) {
        console.log('[Restaurant Fetcher Log] __DEV__:', __DEV__);
        console.log('[Restaurant Fetcher Log] Fetching restaurants from:', API_URL); // 只在 DEV 環境中顯示
      }

      try {
        const response = await fetch(`${API_URL}/api/restaurants`); // 使用環境變量

        if (!response.ok) {
          throw new Error('Failed to fetch restaurants');
        }

        const data = await response.json();
        
        if (__DEV__) {
          console.log('[Restaurant Fetcher Log] Fetched data:', data); // 只在 DEV 環境中顯示
        }

        stableOnDataFetched(data); 
      } catch (err) {
        setError(err.message);
        if (__DEV__) {
          console.error('Error fetching restaurants:', err); // 只在 DEV 環境中顯示
        }
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, [stableOnDataFetched]);

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (error) {
    return <Text>Error: {error}</Text>;
  }

  return null;
};

export default RestaurantFetcher;
