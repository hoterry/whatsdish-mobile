import React, { useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';

const FetchMenu = ({ restaurantId, onSuccess, onError }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [menu, setMenu] = useState([]);

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        // 從 SecureStore 獲取 token
        const token = await SecureStore.getItemAsync('token');
        if (!token) {
          throw new Error('No authentication token found');
        }

        // 發送請求到後端 API，並附帶 token
        const response = await fetch(
          `http://10.0.0.7:5000/fetch-menu?restaurantId=${restaurantId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`, // 將 token 添加到請求頭
            },
          }
        );

        if (!response.ok) {
          throw new Error('Failed to fetch menu');
        }

        const data = await response.json();
        setMenu(data);
        onSuccess(data); // 返回數據給父組件
        console.log('Fetched Menu Data:', data); // 將數據 log 出來
      } catch (err) {
        console.error('Error fetching menu:', err.message);
        setError('Unable to load menu, please try again later.');
        onError(err.message); // 返回錯誤信息給父組件
      } finally {
        setLoading(false);
      }
    };

    if (restaurantId) {
      fetchMenu();
    }
  }, [restaurantId, onSuccess, onError]);

  if (loading) {
    return null; // 這裡返回 null 讓父組件自己處理加載狀態
  }

  if (error) {
    return null; // 這裡返回 null 讓父組件自己處理錯誤顯示
  }

  return null;
};

export default FetchMenu;
