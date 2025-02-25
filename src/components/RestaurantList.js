import React, { useState, useEffect, useContext } from 'react';
import { View, Text, ScrollView, Pressable, TouchableOpacity, Image, StyleSheet } from 'react-native';
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
  const { language } = useContext(LanguageContext);

  const t = (key) => translations[language][key] || key;

  useEffect(() => {
    if (__DEV__) {
      if (restaurants && Array.isArray(restaurants.data) && restaurants.data.length > 0) {
        console.log('[Restaurant List Log] Fetched data:', restaurants.data);
        console.log('[Restaurant List Log] Fetched data:', restaurants);
      } else {
        console.warn('[Restaurant List Log] Invalid restaurants data:', restaurants);
      }
    }
  }, [restaurants]);

  if (!restaurants || !Array.isArray(restaurants.data)) {
    return <Text>No restaurants available</Text>;
  }

  const toggleBookmark = (restaurant) => {
    setBookmarkedRestaurants((prev) => {
      const exists = prev.find((item) => item.gid === restaurant.gid);
      return exists ? prev.filter((item) => item.gid !== restaurant.gid) : [...prev, restaurant];
    });
  };

  const handlePressRestaurant = async (restaurant) => {
    const restaurantId = restaurant.gid;
    if (__DEV__) {
        console.log(`[Restaurant List Log] Fetching restaurant details for ID: ${restaurantId}`);
    }

    try {
        const token = await SecureStore.getItemAsync('token');
        if (!token) {
            console.error('Token not found in SecureStore');
            return;
        }
        const backendUrl = `${API_URL}/api/restaurants/${restaurantId}`; // 你的後端 API
        if (__DEV__) {
            console.log(`[Restaurant List Log] Fetching from backend: ${backendUrl}`);
        }

        const response = await fetch(backendUrl, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            console.error(`Failed to fetch restaurant details. Status: ${response.status}`);
            return;
        }

        const data = await response.json();
        const orderId = data?.data?.order?.order_id;

        if (orderId) {
            await SecureStore.setItemAsync('order_id', orderId);
            if (__DEV__) {
                console.log('[Restaurant List Log] Order ID stored in SecureStore:', orderId);
            }
            navigation.navigate('Details', { restaurant, data, restaurants });
        } else {
            console.warn('[Restaurant List Log] No Order ID found for this restaurant.');
        }
    } catch (error) {
        console.error('Error fetching restaurant details:', error);
    }
};


  return (
    <ScrollView contentContainerStyle={styles.container}>
      {restaurants.data.map((item) => (
        <View key={item.gid} style={styles.restaurantCard}>
          <Pressable onPress={() => handlePressRestaurant(item)}>
            <Image source={{ uri: item.banner_url }} style={styles.restaurantImage} />
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
                <Distance userLocation={userLocation} restaurant={item} />
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
  },
  restaurantImage: {
    width: '100%',
    height: 150,
    borderRadius: 8,
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
