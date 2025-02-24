import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Text } from 'react-native';

const MenuFetcher = ({ restaurantId, onDataFetched }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const response = await fetch(
          `http://10.0.0.7:5000/menu?restaurant_id=${restaurantId}`
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

    fetchMenu();
  }, [restaurantId, onDataFetched]);

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (error) {
    return <Text style={{ color: 'red' }}>{error}</Text>;
  }

  return null; // 不需要渲染 UI，数据通过回调传递
};

export default MenuFetcher;