import React, { useState, useEffect, useContext } from 'react';
import { View, Text, ScrollView, Pressable, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LanguageContext } from '../context/LanguageContext';
import Distance from '../context/DistanceCalsulator'; // 引入刚刚创建的 Distance 组件

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

  useEffect(() => {
    if (restaurants && Array.isArray(restaurants.data) && restaurants.data.length > 0) {
      console.log('Fetched data:', restaurants.data);
    } else {
      console.log('Invalid restaurants data:', restaurants);
    }
  }, [restaurants]);

  if (!restaurants || !Array.isArray(restaurants.data)) {
    return <Text>No restaurants available</Text>;
  }

  const t = (key) => translations[language][key] || key;

  const toggleBookmark = (restaurant) => {
    setBookmarkedRestaurants((prev) => {
      if (prev.some((item) => item.gid === restaurant.gid)) {
        return prev.filter((item) => item.gid !== restaurant.gid);
      } else {
        return [...prev, restaurant];
      }
    });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {restaurants.data.map((item) => (
        <View key={item.gid} style={styles.restaurantCard}>
          <Pressable onPress={() => navigation.navigate('Details', { restaurant: item, restaurants })}>
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
                <Distance
                  userLocation={userLocation} // 用户当前位置
                  restaurantLocation={item.location} // 餐厅位置
                />
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
    fontSize: 16,
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
