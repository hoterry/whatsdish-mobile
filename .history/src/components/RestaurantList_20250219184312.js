import React, { useState, useEffect, useContext } from 'react';
import { View, Text, ScrollView, Pressable, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { LanguageContext } from '../context/LanguageContext'; // 引入 LanguageContext

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

const RestaurantList = ({ restaurants }) => {
  const navigation = useNavigation();
  const [bookmarkedRestaurants, setBookmarkedRestaurants] = useState([]);
  const { language } = useContext(LanguageContext);

  useEffect(() => {
    if (restaurants && Array.isArray(restaurants.data) && restaurants.data.length > 0) {
      console.log('Fetched data:', restaurants.data); // 打印返回的數據
    } else {
      console.log('Invalid restaurants data:', restaurants); // 輸出錯誤數據
    }
  }, [restaurants]);

  // 如果restaurants.data不是數組，返回空的view
  if (!restaurants || !Array.isArray(restaurants.data)) {
    return <Text>No restaurants available</Text>; // 顯示錯誤提示
  }

  // 翻译函数
  const t = (key) => translations[language][key] || key;

  // 添加或移除书签
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

                  <View style={styles.tag}>
                    <Ionicons name="location-outline" size={18} color="#888" />
                    <Text style={styles.tagText}>{`${0.5} km`}</Text> 
                  </View>
                
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
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff', // Lighter soft green background
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 20,
    minWidth: 80,  // Ensures the tag doesn't change size with content
    justifyContent: 'center',
  },
  tagText: {
    marginLeft: 5,
    fontSize: 16,
    color: '#888', // Dark green for text
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
