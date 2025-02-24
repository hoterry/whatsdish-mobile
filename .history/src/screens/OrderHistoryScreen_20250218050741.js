import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
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
            <Text style={styles.orderDate}>Order Date: {new Date(item.orderTime).toLocaleDateString()}</Text>
            <Text style={styles.orderTotal}>Total: ${item.totalPrice.toFixed(2)}</Text>
            <Text style={styles.orderDelivery}>Delivery: {item.deliveryMethod}</Text>
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
    paddingTop: 100, // Ensure content is not hidden under the fixed header
    paddingHorizontal: 20,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 50, // Padding to align header properly with the back button
    paddingHorizontal: 20,
    backgroundColor: '#fff',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    paddingTop: 100,
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    position: 'absolute',
    left: 0,
    right: 0,
    textAlign: 'center',
    paddingTop: 80, // Align header title with the back button
  },
  backButton: {
    position: 'absolute',
    left: 20,
    paddingTop: 80, // Align back button with the header
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
