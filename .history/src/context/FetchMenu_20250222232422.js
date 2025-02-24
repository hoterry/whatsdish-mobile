import React, { useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import Constants from 'expo-constants';

const FetchMenu = ({ restaurantId, onSuccess, onError }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [menu, setMenu] = useState([]);
  
  const { API_URL } = Constants.expoConfig.extra; // 從環境變數中獲取 API URL

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const token = await SecureStore.getItemAsync('token');
        if (!token) {
          throw new Error('No authentication token found');
        }

        // 使用環境變數中的 API URL
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
          console.log('Fetched Menu Data:', data); // 開發模式下輸出 log
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
  }, [restaurantId, onSuccess, onError, API_URL]); // 確保在 URL 改變時重新觸發

  if (loading) {
    return null; // 如果正在加載，什麼都不顯示
  }

  if (error) {
    return null; // 如果出錯，也不顯示任何東西
  }

  // 返回你可能需要的 Menu 列表 UI，這裡假設需要展示 menu
  return (
    <View>
      {menu.map((item, index) => (
        <Text key={index}>{item.name}</Text>  // 假設 menu 的每個項目有 `name`
      ))}
    </View>
  );
};

export default FetchMenu;
