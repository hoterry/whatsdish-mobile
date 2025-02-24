import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

function OrderHistoryScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (route.params?.order) {
      setOrders((prevOrders) => [route.params.order, ...prevOrders]);
    }
  }, [route.params?.order]);

  return (
    <View style={styles.container}>
      {/* Fixed Header with Back Button */}
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={28} color="black" />
        </TouchableOpacity>
        <Text style={styles.header}>Order History</Text>
      </View>

      {/* Content */}
      <FlatList
        contentContainerStyle={styles.flatListContainer}
        data={orders}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.orderItem}
            onPress={() => navigation.navigate('HistoryDetail', { order: item })}
          >
            {/* Display Restaurant Logo */}
            <View style={styles.logoContainer}>
              <Image source={{ uri: item.restaurantLogo }} style={styles.restaurantLogo} />
            </View>
            <View style={styles.orderDetails}>
              <Text style={styles.orderDate}>
                {item.language === 'ZH' ? '訂單日期' : 'Order Date'}: {new Date(item.orderTime).toLocaleDateString()}
              </Text>
              <Text style={styles.orderTotal}>
                {item.language === 'ZH' ? '總額' : 'Total'}: ${item.totalPrice.toFixed(2)}
              </Text>
              <Text style={styles.orderDelivery}>
                {item.language === 'ZH' ? '配送方式' : 'Delivery'}: {item.deliveryMethod}
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
