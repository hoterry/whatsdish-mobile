// components/RestaurantHeader.js
import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

function RestaurantHeader({ restaurant }) {
  return (
    <View style={styles.headerContainer}>
      <Image source={{ uri: restaurant.image }} style={styles.restaurantImage} />
      <View style={styles.logoContainer}>
        {restaurant.logo && <Image source={{ uri: restaurant.logo }} style={styles.restaurantLogo} />}
      </View>
      <View style={styles.centerAlignContainer}>
        {restaurant.name && <Text style={styles.headerName}>{restaurant.name}</Text>}
        {restaurant.address && <Text style={styles.address}>{restaurant.address}</Text>}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    alignItems: 'center',
    marginBottom: -90,
  },
  headerName: {
    fontSize: 28,
    fontFamily: 'Quicksand-Bold',
    fontWeight: 'bold',  // 加粗餐厅名
    textAlign: 'center',  // 置中
  },
  restaurantImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 20,
  },
  restaurantLogo: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginRight: 15,
    borderWidth: 2,
    borderColor: '#fff',
    top: -150,
  },
  logoContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 40,
  },
  centerAlignContainer: {
    marginTop: 10,
    alignItems: 'center',  // 改为 center 以使内容居中
    width: '100%',
  },
  address: {
    fontSize: 19,
    color: '#555',
    marginTop: 10,
    textAlign: 'center',  // 置中
  },
});

export default RestaurantHeader;
