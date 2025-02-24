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
    padding: 15,
    marginBottom: 10,
    backgroundColor: '#f4f4f4',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    alignItems: 'center',
  },
  restaurantImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 10,
  },
  restaurantName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  restaurantDescription: {
    fontSize: 14,
    color: '#555',
    textAlign: 'center',
  },
  restaurantAddress: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
    marginTop: 5,
  },
});

export default RestaurantList;
