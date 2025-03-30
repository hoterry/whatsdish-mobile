import React, { useState, useEffect, useContext, useRef, useCallback } from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { LanguageContext } from '../../context/LanguageContext';
import RestaurantHeader from './RestaurantHeader';
import MenuSection from './MenuSection';
import * as SecureStore from 'expo-secure-store';
import Constants from 'expo-constants';
import LottieView from 'lottie-react-native';
import useUserFetcher from '../../context/FetchUser';

const { API_URL } = Constants.expoConfig.extra;

const CustomBackButton = ({ navigation }) => {
  const handleBackPress = () => {
    if (navigation.canGoBack()) {
      try {
        navigation.goBack();
      } catch (error) {
        console.error('[Navigation] Go back failed:', error);
        navigation.navigate('HomeTabs');
      }
    } else {
      navigation.navigate('HomeTabs');
    }
  };
  
  return (
    <TouchableOpacity
      style={styles.backButton}
      onPress={handleBackPress}
    >
      <Ionicons name="arrow-back" size={24} color="black" />
    </TouchableOpacity>
  );
};

function DetailsScreen({ route, navigation }) {
  const { restaurant, restaurants, isLoading: initialLoading } = route.params;
  const { language, changeLanguage } = useContext(LanguageContext); 
  const [menu, setMenu] = useState([]);
  const [isLoading, setIsLoading] = useState(initialLoading || false);
  const [orderIdReady, setOrderIdReady] = useState(false);
  const abortControllerRef = useRef(null);
  const currentRestaurantIdRef = useRef(restaurant.gid);
  const { fetchUserData, userData } = useUserFetcher();
  const isFetchingLanguage = useRef(false);

  // Function to fetch and apply user language preference
  const fetchAndSetUserLanguage = useCallback(async () => {

    if (isFetchingLanguage.current) {
      return;
    }
    
    try {

      isFetchingLanguage.current = true;
      
      if (__DEV__) {
        console.log('[DetailsScreen] Fetching user language...');
      }
      
      // Always fetch user data when this function is called
      const userData = await fetchUserData();
      
      if (__DEV__) {
        console.log('[DetailsScreen] Fetched user data result:', userData);
      }

      if (userData && userData.languagePreference) {
        const languageMapping = {
          '中文': 'ZH',
          'English': 'EN',
          'en': 'EN',
          'zh-hant': 'ZH'
        };
        
        const appLanguage = languageMapping[userData.languagePreference] || 'EN';
        
        if (__DEV__) {
          console.log('[DetailsScreen] Setting language to:', appLanguage);
        }
        
        changeLanguage(appLanguage);
      }
    } catch (error) {
      if (__DEV__) {
        console.error('[DetailsScreen] Error fetching user data:', error);
      }
    } finally {

      isFetchingLanguage.current = false;
    }
  }, [fetchUserData, changeLanguage]);

  // Fetch user language when screen comes into focus
  useFocusEffect(
    useCallback(() => {

      isFetchingLanguage.current = false;
      fetchAndSetUserLanguage();
      
      return () => {};
    }, [fetchAndSetUserLanguage])
  );

  useEffect(() => {
    currentRestaurantIdRef.current = restaurant.gid;
    const ensureCorrectOrderId = async () => {
      try {
        setIsLoading(true);

        const storedOrderId = await SecureStore.getItemAsync('order_id');
        const storedRestaurantId = await SecureStore.getItemAsync('current_restaurant_id');

        if (storedRestaurantId === restaurant.gid && storedOrderId) {
          console.log(`[Details] Found matching orderId for restaurant ${restaurant.gid}`);
          setOrderIdReady(true);
          setIsLoading(false);
          return;
        }

        console.log(`[Details] No matching orderId, fetching for restaurant ${restaurant.gid}`);
        
        if (abortControllerRef.current) {
          abortControllerRef.current.abort();
        }

        abortControllerRef.current = new AbortController();

        const token = await SecureStore.getItemAsync('token');
        if (!token) {
          console.error('[Details] Token not found');
          setIsLoading(false);
          return;
        }

        const backendUrl = `${API_URL}/api/restaurants/${restaurant.gid}`;
        const response = await fetch(backendUrl, {
          method: 'GET',
          headers: { 'Authorization': `Bearer ${token}` },
          signal: abortControllerRef.current.signal
        });
        
        if (!response.ok) {
          throw new Error(`Failed to fetch details. Status: ${response.status}`);
        }
        
        const data = await response.json();
        const orderId = data?.data?.order?.order_id;
        
        if (orderId) {
          await SecureStore.setItemAsync('order_id', orderId);
          await SecureStore.setItemAsync('current_restaurant_id', restaurant.gid);
          console.log(`[Details] Saved orderId: ${orderId} for restaurant: ${restaurant.gid}`);
          setOrderIdReady(true);
        } else {
          console.error('[Details] No orderId found in response');
        }
      } catch (error) {
        if (error.name === 'AbortError') {
          console.log('[Details] Fetch request was aborted');
          return;
        }
        console.error('[Details] Error ensuring correct orderId:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    ensureCorrectOrderId();

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [restaurant.gid]);

  useEffect(() => {
    const currentMenu = restaurant.menu || [];
    setMenu(currentMenu);
  }, [restaurant]);

  return (
    <View style={styles.container}>
      <CustomBackButton navigation={navigation} />

      <RestaurantHeader restaurant={restaurant} />

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <LottieView
            source={require('../../../assets/loading-animation.json')}
            autoPlay
            loop
            style={styles.loadingAnimation}
          />
        </View>
      ) : (
        orderIdReady && (
          <MenuSection
            restaurantId={restaurant.gid}
            restaurants={restaurants}
            language={language}
          />
        )
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    zIndex: 1,
    padding: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 20,
  },
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
  }
});

export default DetailsScreen;