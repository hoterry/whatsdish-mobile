import React, { useState, useEffect, useContext } from 'react';
import { View, Text, ScrollView, Pressable, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { LanguageContext } from '../context/LanguageContext';

const translations = {
  EN: {
    pickUp: "Pick Up",
    delivery: "Delivery",
  },
  ZH: {
    pickUp: "自取",
    delivery: "外送",
  },
};

const RestaurantList = ({ restaurants }) => {
  const navigation = useNavigation();
  const [bookmarkedRestaurants, setBookmarkedRestaurants] = useState([]);
  const { language } = useContext(LanguageContext);

  useEffect(() => {
    if (restaurants.length > 0) {
      console.log('Received restaurants data:', restaurants);
    }
  }, [restaurants]);

  const t = (key) => translations[language][key] || key;

  const toggleBookmark = (restaurant) => {
    setBookmarkedRestaurants((prev) => {
      if (prev.some((item) => item.restaurant_id === restaurant.restaurant_id)) {
        return prev.filter((item) => item.restaurant_id !== restaurant.restaurant_id);
      } else {
        return [...prev, restaurant];
      }
    });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {restaurants.map((item) => (
        <View key={item.restaurant_id.toString()} style={styles.restaurantCard}>
          <Pressable onPress={() => navigation.navigate('Details', { restaurant: item, restaurants })}>
            {/* Check and render discount */}
            {item.discount && item.discount[language] && (
              <View style={styles.discountTag}>
                <Text style={styles.discountText}>
                  {item.discount[language]} {/* Display discount based on current language */}
                </Text>
              </View>
            )}
            <Image source={{ uri: item.image }} style={styles.restaurantImage} />
            <View style={styles.restaurantInfo}>
              <Text style={styles.restaurantName} numberOfLines={1} ellipsizeMode="tail">{item.name}</Text>
              <View style={styles.tagContainer}>
                {item.pickup && (
                  <View style={styles.tag}>
                    <Ionicons name="checkmark-circle" size={14} color="green" />
                    <Text style={styles.tagText}>{t('pickUp')}</Text>
                  </View>
                )}
                {item.delivery && (
                  <View style={styles.tag}>
                    <Ionicons name="checkmark-circle" size={14} color="green" />
                    <Text style={styles.tagText}>{t('delivery')}</Text>
                  </View>
                )}
              </View>
            </View>
            {item.address && <Text style={styles.restaurantAddress}>{item.address}</Text>}
          </Pressable>
          <TouchableOpacity onPress={() => toggleBookmark(item)} style={styles.bookmarkIcon}>
            <Image
              source={bookmarkedRestaurants.some((res) => res.restaurant_id === item.restaurant_id)
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
    padding: 10,
  },
  restaurantCard: {
    marginBottom: 15,
    backgroundColor: '#fff',
    borderRadius: 8,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  restaurantImage: {
    width: '100%',
    height: 180,
  },
  discountTag: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: '#f4c542',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  discountText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
  },
  restaurantInfo: {
    padding: 10,
  },
  restaurantName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  tagContainer: {
    flexDirection: 'row',
    marginTop: 5,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
  },
  tagText: {
    fontSize: 14,
    marginLeft: 5,
  },
  restaurantAddress: {
    fontSize: 14,
    color: '#777',
    marginTop: 10,
  },
  bookmarkIcon: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
});

export default RestaurantList;
