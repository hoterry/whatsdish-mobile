import React, { useEffect, useState, useCallback } from 'react';
import { ActivityIndicator, Text } from 'react-native';

const RestaurantFetcher = ({ onDataFetched }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 使用 useCallback 保證 onDataFetched 是穩定的
  const stableOnDataFetched = useCallback(onDataFetched, []);

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const response = await fetch('https://dev.whatsdish.com/api/rn/merchants');
        if (!response.ok) {
          throw new Error('Failed to fetch restaurants');
        }
        const data = await response.json();
        
        console.log('Fetched data:', data);  // 在這裡打印返回的數據
        
        stableOnDataFetched(data); // 使用穩定的回調函數
      } catch (err) {
        setError(err.message);
        console.error('Error fetching restaurants:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, [stableOnDataFetched]); // 只依賴穩定的回調

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (error) {
    return <Text>Error: {error}</Text>;
  }

  return null; // 數據通過回調傳遞，不需要渲染任何 UI
};

export default RestaurantFetcher;
