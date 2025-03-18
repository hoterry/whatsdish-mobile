import React, { useState, useEffect, useContext, useRef } from 'react';
import { View, Text, ScrollView, Pressable, TouchableOpacity, Image, StyleSheet, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LanguageContext } from '../context/LanguageContext';
import Distance from '../context/DistanceCalculator';
import * as SecureStore from 'expo-secure-store';
import Constants from 'expo-constants';

const { API_URL } = Constants.expoConfig.extra;

const translations = {
  EN: {
    pickUp: "Pick Up",
    delivery: "Delivery",
    distance: "Distance",
  },
  ZH: {
    pickUp: "自取",
    delivery: "外送",
    distance: "距離",
  },
};

const RestaurantList = ({ restaurants, userLocation }) => {
  const navigation = useNavigation();
  const [bookmarkedRestaurants, setBookmarkedRestaurants] = useState([]);
  const [token, setToken] = useState(null);
  const { language } = useContext(LanguageContext);
  const [loadingRestaurantId, setLoadingRestaurantId] = useState(null);
  const abortControllerRef = useRef(null);

  const t = (key) => translations[language][key] || key;

  useEffect(() => {
    const fetchToken = async () => {
      const storedToken = await SecureStore.getItemAsync('token');
      setToken(storedToken);
    };

    fetchToken();

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  if (!restaurants || !Array.isArray(restaurants.data)) {
    return <Text> </Text>;
  }

  const toggleBookmark = (restaurant) => {
    setBookmarkedRestaurants((prev) => {
      const exists = prev.find((item) => item.gid === restaurant.gid);
      return exists ? prev.filter((item) => item.gid !== restaurant.gid) : [...prev, restaurant];
    });
  };

  const handlePressRestaurant = async (restaurant) => {
    if (!restaurant.is_active) return;
    if (!token) {
      console.log('Token not available yet');
      navigation.navigate('Details', { 
        restaurant, 
        restaurants,

      });
      return;
    }

    const restaurantId = restaurant.gid;
    


    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    setLoadingRestaurantId(restaurantId);

    navigation.navigate('Details', { 
      restaurant, 
      restaurants,

    });
    
    try {
      if (__DEV__) {
        console.log(`[RestaurantList] Fetching details for restaurant: ${restaurantId}`);
      }
      
      const backendUrl = `${API_URL}/api/restaurants/${restaurantId}`;
      const response = await fetch(backendUrl, {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${token}` },
        signal: abortControllerRef.current.signal
      });

      if (!response.ok) {
        console.error(`Failed to fetch restaurant details. Status: ${response.status}`);
        return;
      }

      const data = await response.json();
      const orderId = data?.data?.order?.order_id;

      if (orderId) {

        await SecureStore.setItemAsync('order_id', orderId);
        await SecureStore.setItemAsync('current_restaurant_id', restaurantId);
        
        if (__DEV__) {
          console.log(`[RestaurantList] Stored order_id: ${orderId} for restaurant: ${restaurantId}`);
        }

      }
    } catch (error) {

      if (error.name === 'AbortError') {
        console.log('[RestaurantList] Fetch request was aborted');
        return;
      }
      console.error('Error fetching restaurant details:', error);
    } finally {

      if (loadingRestaurantId === restaurantId) { 
        setLoadingRestaurantId(null);
      }
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {restaurants.data
        .filter((item) => item.is_shown) 
        .map((item) => (
          <View key={item.gid} style={styles.restaurantCard}>
            <Pressable 
              onPress={() => handlePressRestaurant(item)}
              android_ripple={{ color: 'rgba(0, 0, 0, 0.1)' }}
              style={({pressed}) => [
                pressed && styles.pressedCard
              ]}
            >
              <View style={styles.imageContainer}>
                <Image
                  source={{ uri: item.banner_url }}
                  style={[styles.restaurantImage, !item.is_active && styles.inactiveBanner]}
                />
                {!item.is_active && (
                  <View style={styles.unavailableOverlay}>
                    <Text style={styles.unavailableText}>Currently Not Available</Text>
                  </View>
                )}

              </View>
              <View style={styles.restaurantInfo}>
                <Image source={{ uri: item.logo_url }} style={styles.restaurantLogo} />
                <View style={styles.textContainer}>
                  <Text style={styles.restaurantName} numberOfLines={1} ellipsizeMode="tail">
                    {item.name}
                  </Text>
                  <Text style={styles.restaurantAddress} numberOfLines={1} ellipsizeMode="tail">
                    {item.formatted_address}
                  </Text>
                </View>
                <View style={styles.tagContainer}>
                </View>
              </View>
            </Pressable>
            <TouchableOpacity onPress={() => toggleBookmark(item)} style={styles.bookmarkIcon}>
              <Image
                source={bookmarkedRestaurants.some((res) => res.gid === item.gid)
                  ? require('../../assets/mark.png')
                  : require('../../assets/unmark.png')}
                style={styles.bookmarkIcon}
              />
            </TouchableOpacity>
          </View>
        ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 8,
    paddingVertical: 15,
    marginBottom: 20,
  },
  restaurantCard: {
    marginBottom: 12,
    backgroundColor: '#fff',
    borderRadius: 8,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  pressedCard: {
    opacity: 0.8,
  },
  imageContainer: {
    position: 'relative',
  },
  restaurantImage: {
    width: '100%',
    height: 150,
    resizeMode: 'cover',
  },
  inactiveBanner: {
    opacity: 0.4,
  },
  unavailableOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  unavailableText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    backgroundColor: 'rgba(0, 0, 0, 0.6)', 
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  loadingIndicator: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    padding: 8,
    borderRadius: 20,
  },
  restaurantInfo: {
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  restaurantLogo: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  textContainer: {
    flex: 1,
    marginRight: 10,
  },
  restaurantName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333', 
  },
  restaurantAddress: {
    fontSize: 14,
    color: '#888',
    marginTop: 4,
  },
  tagContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bookmarkIcon: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 25,
    height: 25,
  },
});

export default RestaurantList;