import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';

const RestaurantCard = ({ restaurant }) => {
  return (
    <TouchableOpacity style={styles.card}>
      {/* 折扣标签 */}
      {restaurant.discount && (
        <View style={styles.discountTag}>
          <Text style={styles.discountText}>{restaurant.discount}</Text>
        </View>
      )}
      {/* 图片 */}
      <Image source={{ uri: restaurant.image }} style={styles.image} />
      {/* 餐厅信息 */}
      <View style={styles.info}>
        <Text style={styles.name}>{restaurant.name}</Text>
        <Text style={styles.description}>{restaurant.description}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
    overflow: 'hidden',
    elevation: 3,
  },
  discountTag: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: 'green', // 绿色背景
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    zIndex: 1, // 确保标签位于图片上方
  },
  discountText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  image: {
    width: '100%',
    height: 150,
  },
  info: {
    padding: 10,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  description: {
    fontSize: 14,
    color: '#666',
  },
});


export default RestaurantCard;
