import React, { useEffect, useState, useRef, useContext } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import Constants from 'expo-constants';
import * as SecureStore from 'expo-secure-store';
import { LanguageContext } from '../context/LanguageContext';
import LottieView from 'lottie-react-native'; 

const MenuFetcher = ({ onDataFetched }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [orderId, setOrderId] = useState(null);

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
      setLoading(true);
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
      } finally {
        if (__DEV__) {
          console.log('[MenuFetcher Log] Finished fetching menu for orderId:', orderId);
        }
        setLoading(false);
      }
    };

    fetchMenu();

    prevOrderIdRef.current = orderId;
  }, [orderId, onDataFetched, lang]);

  if (loading) {
    if (__DEV__) {
      console.log('[MenuFetcher Log] Loading...');
    }
    return (
      <View style={styles.loadingContainer}>
        <LottieView
          source={require('../../assets/loading-animation.json')} // Path to your Lottie JSON file
          autoPlay
          loop
          style={styles.loadingAnimation}
        />
        <Text style={styles.loadingText}>Loading menu...</Text>
      </View>
    );
  }

  if (error) {
    if (__DEV__) {
      console.log('[MenuFetcher Log] Error occurred:', error);
    }
    return <Text style={{ color: 'red' }}>{error}</Text>;
  }

  return null;
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 250
  },
  loadingAnimation: {
    width: 100,
    height: 100,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#000',
  },
});

export default MenuFetcher;