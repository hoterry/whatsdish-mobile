import React, { useEffect, useState, useContext } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { LanguageContext } from '../context/LanguageContext';  // 引入語言上下文

function OrderHistoryScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { language } = useContext(LanguageContext); // 使用 LanguageContext 來獲取當前語言
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (route.params?.order) {
      setOrders((prevOrders) => [route.params.order, ...prevOrders]);
    }
  }, [route.params?.order]);

  return (
    <View style={styles.container}>
      {/* 固定的標頭與返回按鈕 */}
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={28} color="black" />
        </TouchableOpacity>
        <Text style={styles.header}>
          {language === 'ZH' ? '訂單歷史' : 'Order History'}  {/* 根據語言選擇顯示 */}
        </Text>
      </View>

      {/* 內容 */}
      <FlatList
        contentContainerStyle={styles.flatListContainer}
        data={orders}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.orderItem}
            onPress={() => navigation.navigate('HistoryDetail', { order: item })}
          >
            {/* 顯示餐廳 Logo */}
            <View style={styles.logoContainer}>
              <Image source={{ uri: 'https://via.placeholder.com/150' }} style={styles.restaurantLogo} />
            </View>
            <View style={styles.orderDetails}>
              {/* 顯示餐廳名稱（大字體） */}
              <Text style={styles.restaurantName}>
                {item.restaurantName || '餐廳名稱'} {/* 如果沒有餐廳名稱則顯示 '餐廳名稱' */}
              </Text>
              <Text style={styles.orderDate}>
                {language === 'ZH' ? '訂單日期' : 'Order Date'}: {new Date(item.orderTime).toLocaleDateString()}
              </Text>
              <Text style={styles.orderTotal}>
                {language === 'ZH' ? '總額' : 'Total'}: ${item.totalPrice.toFixed(2)}
              </Text>
              <Text style={styles.orderDelivery}>
                {language === 'ZH' ? '配送方式' : 'Delivery'}: {item.deliveryMethod}
              </Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  flatListContainer: {
    paddingTop: 10, // Make sure the content starts after the header
    paddingHorizontal: 20,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 100, // Match the paddingTop of the HistoryDetailScreen
    paddingHorizontal: 20,
    backgroundColor: '#fff',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,

    top: 0,
    left: 0,
    right: 0,
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    position: 'absolute',
    left: 0,
    right: 0,
    textAlign: 'center',
    paddingTop: 50, // Ensure it's aligned with the back button
  },
  backButton: {
    position: 'absolute',
    left: 20,
    paddingTop: 50, // Align with header
    zIndex: 10,
  },
  orderItem: {
    padding: 15,
    backgroundColor: '#fff',
    marginBottom: 15,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
    flexDirection: 'row', // Add this to align logo and text
    alignItems: 'center',
  },
  logoContainer: {
    marginRight: 15,
  },
  restaurantLogo: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  restaurantName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  orderDate: {
    fontSize: 16,
    color: '#555',
  },
  orderTotal: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2e7d32',
  },
  orderDelivery: {
    fontSize: 16,
    marginBottom: 10,
    fontStyle: 'italic',
    color: '#757575',
  },
});

export default OrderHistoryScreen;
