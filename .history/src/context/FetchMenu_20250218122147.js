import React, { useState, useEffect } from 'react';

const FetchMenu = ({ restaurantId, onSuccess, onError }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [menu, setMenu] = useState([]);

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const response = await fetch(
          `http://192.168.1.78:5000/menu?restaurant_id=${restaurantId}`
        );
        if (!response.ok) {
          throw new Error('Failed to fetch menu');
        }

        const data = await response.json();
        setMenu(data);
        onSuccess(data);  // 返回數據給父組件
      } catch (err) {
        console.error('Error fetching menu:', err.message);
        setError('Unable to load menu, please try again later.');
        onError(err.message);  // 返回錯誤信息給父組件
      } finally {
        setLoading(false);
      }
    };

    if (restaurantId) {
      fetchMenu();
    }
  }, [restaurantId, onSuccess, onError]);

  if (loading) {
    return null;  // 這裡返回 null 讓父組件自己處理加載狀態
  }

  if (error) {
    return null;  // 這裡返回 null 讓父組件自己處理錯誤顯示
  }

  return null;
};

export default FetchMenu;
