import React, { useEffect, useState, useRef, useContext } from 'react';
import { Text, View } from 'react-native';
import Constants from 'expo-constants';
import * as SecureStore from 'expo-secure-store';
import { LanguageContext } from '../context/LanguageContext';
import { useLoading } from '../context/LoadingContext'; // 使用全局加載狀態

const MenuFetcher = ({ onDataFetched }) => {
  const [error, setError] = useState(null);
  const [orderId, setOrderId] = useState(null);

  // 使用全局加載狀態
  const { setIsLoading } = useLoading();

  const prevOrderIdRef = useRef();
  const { API_URL } = Constants.expoConfig.extra;

  const { language } = useContext(LanguageContext);
  const lang = language === 'ZH' ? 'zh-hant' : 'en';

  useEffect(() => {
    const fetchOrderIdFromSecureStore = async () => {
      try {
        const storedOrderId = await SecureStore.getItemAsync('order_id');
        if (storedOrderId) {
          setOrderId(storedOrderId);
          console.log('[MenuFetcher Log] Retrieved orderId from SecureStore:', storedOrderId);
        } else {
          console.log('[MenuFetcher Log] No orderId found in SecureStore');
        }
      } catch (err) {
        console.error('[MenuFetcher Log] Error retrieving orderId from SecureStore:', err);
      }
    };

    fetchOrderIdFromSecureStore();
  }, []);

  useEffect(() => {
    if (!orderId) {
      return;
    }

    console.log('[MenuFetcher Log] Current orderId:', orderId);

    if (__DEV__) {
      console.log('[MenuFetcher Log] Component mounted or orderId changed');
    }

    if (prevOrderIdRef.current === orderId) {
      if (__DEV__) {
        console.log('[MenuFetcher Log] Skipping fetch, orderId has not changed');
      }
      return;
    }

    const fetchMenu = async () => {
      // 設置全局加載狀態為 true
      setIsLoading(true);
      setError(null);

      try {
        if (__DEV__) {
          console.log('[MenuFetcher Log] Attempting to fetch menu for orderId:', orderId, 'with language:', lang);
        }

        const apiUrl = `https://dev.whatsdish.com/api/orders/${orderId}/items?language=${lang}`;

        if (__DEV__) {
          console.log('[MenuFetcher Log] Fetching menu from API URL:', apiUrl);
        }

        const response = await fetch(apiUrl, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch menu with status: ${response.status}`);
        }

        const data = await response.json();
        if (__DEV__) {
          //console.log('[MenuFetcher Log] Fetched menu data:', data);
        }

        onDataFetched(data);
      } catch (err) {
        console.error('[MenuFetcher Log] Error fetching menu:', err.message);
        setError('Unable to load menu, please try again later.');
        
        // 在出錯時關閉加載狀態
        setTimeout(() => {
          setIsLoading(false);
        }, 1000);
      } finally {
        if (__DEV__) {
          console.log('[MenuFetcher Log] Finished fetching menu for orderId:', orderId);
        }
        
        // FetchCartItems 組件會在數據加載完成後設置加載狀態，
        // 所以這裡不需要關閉加載狀態
      }
    };

    fetchMenu();

    prevOrderIdRef.current = orderId;
    
    // 組件卸載時清理
    return () => {
      setIsLoading(false);
    };
  }, [orderId, onDataFetched, lang, setIsLoading]);

  if (error) {
    if (__DEV__) {
      console.log('[MenuFetcher Log] Error occurred:', error);
    }
    return <Text style={{ color: 'red' }}>{error}</Text>;
  }

  return null;
};

export default MenuFetcher;