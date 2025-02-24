import React, { useEffect, useState, useRef } from 'react';
import { ActivityIndicator, Text } from 'react-native';
import * as SecureStore from 'expo-secure-store';

const MenuFetcher = ({ restaurantId, onDataFetched }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 记录上一个restaurantId，避免重复请求
  const prevRestaurantIdRef = useRef();

  useEffect(() => {
    // 如果restaurantId没有改变，则不需要重新fetch
    if (prevRestaurantIdRef.current === restaurantId) {
      return;
    }

    const fetchMenu = async () => {
      setLoading(true);
      setError(null); // 清除错误状态

      try {
        // 從 SecureStore 取得 token
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
        onDataFetched(data); // 将数据传递给父组件
      } catch (err) {
        console.error('Error fetching menu:', err.message);
        setError('Unable to load menu, please try again later.');
      } finally {
        setLoading(false);
      }
    };

    // 执行fetch请求
    fetchMenu();
    // 更新上次的restaurantId
    prevRestaurantIdRef.current = restaurantId;

  }, [restaurantId, onDataFetched]); // 只有restaurantId变化时才重新执行useEffect

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (error) {
    return <Text style={{ color: 'red' }}>{error}</Text>;
  }

  return null; // 不需要渲染 UI，数据通过回调传递
};

export default MenuFetcher;
