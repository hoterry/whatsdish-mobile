import React, { useEffect, useState, useCallback } from 'react';
import { ActivityIndicator, Text } from 'react-native';

const RestaurantFetcher = ({ onDataFetched }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 使用 useCallback 保证 onDataFetched 是稳定的
  const stableOnDataFetched = useCallback(onDataFetched, []);

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const response = await fetch('http://192.168.1.78:5000/restaurant');
        if (!response.ok) {
          throw new Error('Failed to fetch restaurants');
        }
        const data = await response.json();
        stableOnDataFetched(data); // 使用稳定的回调函数
      } catch (err) {
        setError(err.message);
        console.error('Error fetching restaurants:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, [stableOnDataFetched]); // 只依赖稳定的回调

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (error) {
    return <Text>Error: {error}</Text>;
  }

  return null; // 数据通过回调传递，不需要渲染任何 UI
};

export default RestaurantFetcher;
