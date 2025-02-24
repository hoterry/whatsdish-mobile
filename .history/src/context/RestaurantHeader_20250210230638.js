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
    flexDirection: 'row',  // 设置为横向排列
    justifyContent: 'center',  // 水平居中
    alignItems: 'center',  // 垂直居中
    marginTop: 10,
    width: '100%',
  },
  address: {
    fontSize: 19,
    color: '#555',
    marginLeft: 10,  // 给地址和餐厅名之间加一点间距
  },
});

export default RestaurantHeader;
