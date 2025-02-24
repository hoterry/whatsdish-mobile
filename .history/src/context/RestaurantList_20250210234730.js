import React from 'react';
import { FlatList, TouchableOpacity, StyleSheet, Image, Text, View } from 'react-native';

// 餐厅列表组件
const RestaurantList = ({ restaurants, onPressRestaurant }) => {
  return (
    <FlatList
      data={restaurants}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <TouchableOpacity
          style={styles.restaurantCard}
          onPress={() => onPressRestaurant(item)}
        >
          <Image source={{ uri: item.image }} style={styles.restaurantImage} />
          <Text style={styles.restaurantName}>{item.name}</Text>
          <Text style={styles.restaurantDescription}>{item.description}</Text>
          <Text style={styles.restaurantAddress}>{item.address}</Text>
        </TouchableOpacity>
      )}
    />
  );
};

const styles = StyleSheet.create({
  restaurantCard: {
    padding: 12,  // 调小内边距
    marginBottom: 8,  // 调小底部外边距
    backgroundColor: '#f4f4f4',
    borderRadius: 8,  // 调小圆角
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,  // 调小阴影透明度
    shadowRadius: 3,  // 调小阴影半径
    elevation: 3,  // 调小阴影提升
    alignItems: 'center',
  },
  restaurantImage: {
    width: '100%',
    height: 160,  // 调小图片高度
    borderRadius: 8,  // 调小圆角
    marginBottom: 8,  // 调小底部外边距
  },
  restaurantName: {
    fontSize: 16,  // 调小字体大小
    fontWeight: 'bold',
    marginBottom: 4,  // 调小底部外边距
  },
  restaurantDescription: {
    fontSize: 12,  // 调小字体大小
    color: '#555',
    textAlign: 'center',
    marginBottom: 4,  // 调小底部外边距
  },
  restaurantAddress: {
    fontSize: 12,  // 调小字体大小
    color: '#888',
    textAlign: 'center',
    marginTop: 4,  // 调小顶部外边距
  },
});

export default RestaurantList;
