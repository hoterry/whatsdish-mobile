import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity } from 'react-native';
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
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={28} color="black" />
        </TouchableOpacity>
        <Text style={styles.header}>Order History</Text>
      </View>

      {orders.length === 0 ? (
        <Text style={styles.emptyText}>No orders yet.</Text>
      ) : (
        <FlatList
          data={orders}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.orderItem}
              onPress={() => navigation.navigate('OrderDetail', { order: item })}
            >
              <Text style={styles.orderDate}>Order Date: {new Date(item.orderTime).toLocaleDateString()}</Text>
              <Text style={styles.orderTotal}>Total: ${item.totalPrice.toFixed(2)}</Text>
              <Text style={styles.orderDelivery}>Delivery: {item.deliveryMethod}</Text>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f9f9f9',
    paddingTop: 70, // Increased paddingTop for space due to fixed header
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingTop: 60,
    zIndex: 1,
    backgroundColor: '#fff', // To make sure the header is visible
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginLeft: 40, // Spacing after the icon
    color: '#333',
  },
  emptyText: {
    fontSize: 18,
    textAlign: 'center',
    color: '#888',
    marginTop: 20,
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
  backButton: {
    position: 'absolute',
    left: 20,
    top: 20,
    zIndex: 2,
  },
  backIcon: {
    width: 30,
    height: 30,
    tintColor: '#333', // Adjust icon color if necessary
  },
});

export default OrderHistoryScreen;
