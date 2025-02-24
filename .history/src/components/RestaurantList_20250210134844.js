import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Pressable, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

const RestaurantList = ({ restaurants }) => {
  const navigation = useNavigation();
  const [bookmarkedRestaurants, setBookmarkedRestaurants] = useState([]);

  useEffect(() => {
    if (restaurants.length > 0) {
      console.log('Received restaurants data:', restaurants);
    }
  }, [restaurants]);

  // 添加到书签
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
    <View style={styles.container}>
      <FlatList
        data={restaurants}
        keyExtractor={(item) => item.restaurant_id.toString()}
        renderItem={({ item }) => (
          <View style={styles.restaurantCard}>
            {/* 点击进入详情页 */}
            <Pressable onPress={() => navigation.navigate('Details', { restaurant: item, restaurants })}>
              {/* 折扣标签 */}
              {item.discount && (
                <View style={styles.discountTag}>
                  <Text style={styles.discountText}>{item.discount}</Text>
                </View>
              )}
              {/* 餐厅图片 */}
              <Image source={{ uri: item.image }} style={styles.restaurantImage} />
              {/* 餐厅信息 */}
              <View style={styles.restaurantInfo}>
                <Text style={styles.restaurantName} numberOfLines={1} ellipsizeMode="tail">{item.name}</Text>
                <View style={styles.tagContainer}>
                  {item.pickup && (
                    <View style={styles.tag}>
                      <Ionicons name="checkmark-circle" size={16} color="green" />
                      <Text style={styles.tagText}>Pick Up</Text>
                    </View>
                  )}
                  {item.delivery && (
                    <View style={styles.tag}>
                      <Ionicons name="checkmark-circle" size={16} color="green" />
                      <Text style={styles.tagText}>Delivery</Text>
                    </View>
                  )}
                </View>
              </View>
              {/* 餐厅地址 */}
              {item.address && <Text style={styles.restaurantAddress}>{item.address}</Text>}
            </Pressable>

            {/* 书签按钮 */}
            <TouchableOpacity onPress={() => toggleBookmark(item)} style={styles.bookmarkIcon}>
              <Image
                source={bookmarkedRestaurants.some((res) => res.restaurant_id === item.restaurant_id)
                  ? require('../../assets/mark.png')
                  : require('../../assets/unmark.png')}
                style={styles.bookmarkIcon}
              />
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 10,
    paddingVertical: 20,
    marginBottom: 30
  },
  restaurantCard: {
    marginBottom: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
    overflow: 'hidden',
  },
  cardContent: {
    position: 'relative',
  },
  discountTag: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: '#4ecd5d',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    zIndex: 1,
    width: 70,
    height: 30,
  },
  discountText: {
    color: 'white',
    fontSize: 17,
    fontWeight: 'bold',
  },
  restaurantImage: {
    width: '100%',
    height: 170,
    borderRadius: 10,
  },
  restaurantInfo: {
    marginTop: 10,
    marginLeft: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap', // Allow the text and tags to wrap if needed
  },
  restaurantName: {
    fontSize: 20,
    fontWeight: 'bold',
    flex: 1, // Allow the restaurant name to take available space
  },
  tagContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10,
    flexWrap: 'wrap', // Allow tags to wrap if there's not enough space

  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10,
    backgroundColor: '#e0f7e0',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 20,
  },
  tagText: {
    marginLeft: 5,
    fontSize: 14,
    color: 'green',
  },
  restaurantAddress: {
    fontSize: 16,
    color: '#888',
    marginHorizontal: 5,
    marginBottom: 10,
  },
  bookmarkIcon: {
    position: 'absolute',
    top: 5,
    right: 10,
    width: 30,
    height: 30,
  },
});

export default RestaurantList;
