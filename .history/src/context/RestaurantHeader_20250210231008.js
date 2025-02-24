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
        <View style={styles.textContainer}>
          {restaurant.name && <Text style={styles.headerName}>{restaurant.name}</Text>}
          {restaurant.address && <Text style={styles.address}>{restaurant.address}</Text>}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    alignItems: 'center',
    marginBottom: 20, // 增加底部间距
  },
  headerName: {
    fontSize: 28,
    fontFamily: 'Quicksand-Bold',
    fontWeight: 'bold',  // 加粗餐厅名
    marginTop: 10, // 调整餐厅名和logo的间距
  },
  restaurantImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 10, // 减小图片与logo之间的间距
  },
  restaurantLogo: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginRight: 15,
    borderWidth: 2,
    borderColor: '#fff',
    marginTop: -30,  // 稍微调整logo与餐厅名的间距，避免过大空白
  },
  logoContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: -40, // 减小logo和图片之间的空白
  },
  centerAlignContainer: {
    width: '100%',
    alignItems: 'center',  // 使文本居中
    marginTop: 20, // 控制餐厅名和地址之间的间距
  },
  textContainer: {
    alignItems: 'center',  // 使内容在行内居中
  },
  address: {
    fontSize: 19,
    color: '#555',
    marginTop: 10, // 给地址和餐厅名之间加一点间距
  },
});

export default RestaurantHeader;
