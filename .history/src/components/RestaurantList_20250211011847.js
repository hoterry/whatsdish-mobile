import React, { useState, useEffect, useContext } from 'react';
import { View, Text, ScrollView, Pressable, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { LanguageContext } from '../context/LanguageContext'; // 引入 LanguageContext

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
  const { language } = useContext(LanguageContext); // 获取当前语言

  useEffect(() => {
    if (restaurants.length > 0) {
      console.log('Received restaurants data:', restaurants);

    }
  }, [restaurants]);

  // 翻译函数
  const t = (key) => translations[language][key] || key;

  // 获取当前语言的折扣信息
  const getDiscountText = (discount) => {
    if (!discount) return null; // 如果没有折扣信息，返回 null
    return discount[language] || discount.EN; // 默认显示英文
  };

  // 添加或移除书签
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
            {item.discount && (
              <View style={styles.discountTag}>
                <Text style={styles.discountText}>{getDiscountText(item.discount)}</Text>
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
    flex: 1,
    paddingHorizontal: 8,  // 调小左右内边距
    paddingVertical: 15,  // 调小垂直内边距
    marginBottom: 20,  // 调小底部外边距
  },
  restaurantCard: {
    marginBottom: 12,  // 调小底部外边距
    backgroundColor: '#fff',
    borderRadius: 8,  // 调小圆角
    overflow: 'hidden',
  },
  cardContent: {
    position: 'relative',
  },
  discountTag: {
    position: 'absolute',
    top: 8,  // 保持原来的间距
    left: 8,  // 保持原来的间距
    backgroundColor: '#4ecd5d',
    paddingHorizontal: 6,  // 保持原来的水平内边距
    paddingVertical: 3,  // 保持原来的垂直内边距
    borderRadius: 4,
    zIndex: 1,
    height: 25,  // 保持原来的高度
    justifyContent: 'center',  // 添加这行代码以确保垂直居中
    alignItems: 'center',  // 添加这行代码以确保水平居中
    display: 'flex',  // 确保容器是一个 flex 容器
    minWidth: 60,  // 保证最小宽度，避免文字太短时标签过小
  },  
  discountText: {
    color: 'white',
    fontSize: 14,  // 调小字体大小
    fontWeight: 'bold',
  },
  restaurantImage: {
    width: '100%',
    height: 150,  // 调小图片高度
    borderRadius: 8,  // 调小圆角
  },
  restaurantInfo: {
    marginTop: 8,  // 调小顶部外边距
    marginLeft: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  restaurantName: {
    fontSize: 16,  // 调小字体大小
    fontWeight: 'bold',
    flex: 1,
  },
  tagContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 8,  // 调小左边距
    flexWrap: 'wrap',
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 8,  // 调小左边距
    backgroundColor: '#e0f7e0',
    paddingVertical: 4,  // 调小垂直内边距
    paddingHorizontal: 8,  // 调小水平内边距
    borderRadius: 20,
  },
  tagText: {
    marginLeft: 5,
    fontSize: 12,  // 调小字体大小
    color: 'green',
  },
  restaurantAddress: {
    fontSize: 14,  // 调小字体大小
    color: '#888',
    marginHorizontal: 5,
    marginBottom: 8,  // 调小底部外边距
  },
  bookmarkIcon: {
    position: 'absolute',
    top: 5,  // 调小顶部外边距
    right: 8,  // 调小右边距
    width: 25,  // 调小宽度
    height: 25,  // 调小高度
  },
});

export default RestaurantList;
