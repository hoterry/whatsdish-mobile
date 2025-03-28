import React, { useEffect, useState, useCallback } from 'react';
import { Text, StyleSheet } from 'react-native';
import Constants from 'expo-constants';
import { useLoading } from '../context/LoadingContext'; // 確保路徑正確

const RestaurantFetcher = ({ onDataFetched }) => {
  const [error, setError] = useState(null);
  const { setIsLoading } = useLoading(); // 使用 LoadingContext
  
  const stableOnDataFetched = useCallback(onDataFetched, []);

  useEffect(() => {
    // 設置全局加載狀態為 true
    setIsLoading(true);
    
    const fetchRestaurants = async () => {
      const { API_URL } = Constants.expoConfig.extra;

      try {
        const response = await fetch(`${API_URL}/api/restaurants`);

        if (!response.ok) {
          throw new Error('Failed to fetch restaurants');
        }

        const data = await response.json();
        
        // 添加延遲，確保動畫顯示足夠時間
        setTimeout(() => {
          stableOnDataFetched(data);
          // 設置全局加載狀態為 false
          setIsLoading(false);
        }, 1000);
        
      } catch (err) {
        setTimeout(() => {
          setError(err.message);
          // 設置全局加載狀態為 false
          setIsLoading(false);
        }, 1000);
      }
    };

    fetchRestaurants();
    
    // 在組件卸載時確保設置加載狀態為 false
    return () => {
      setIsLoading(false);
    };
  }, [stableOnDataFetched, setIsLoading]);

  // 只有在出錯時才渲染內容
  if (error) {
    return <Text style={styles.errorText}>Error: {error}</Text>;
  }

  // 不需要在這裡處理加載狀態，因為它已經由 LoadingContext 處理
  return null;
};

const styles = StyleSheet.create({
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginTop: 16,
    padding: 20,
  },
});

export default RestaurantFetcher;