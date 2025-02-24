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
      {/* 固定在頂部的標題與返回按鈕 */}
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={28} color="black" />
        </TouchableOpacity>
        <Text style={styles.header}>訂單歷史</Text>
      </View>

      {/* 訂單歷史內容 */}
      {orders.length === 0 ? (
        <Text style={styles.emptyText}>No orders yet.</Text>
      ) : (
        <FlatList
          data={orders}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.orderItem}
              onPress={() => navigation.navigate('HistoryDetail', { order: item })}
            >
              <View style={styles.row}>
                <Text style={styles.orderDate}>訂單日期: {new Date(item.orderTime).toLocaleDateString()}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.orderTotal}>總金額: ${item.totalPrice.toFixed(2)}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.orderDelivery}>配送方式: {item.deliveryMethod}</Text>
              </View>
            </TouchableOpacity>
          )}
        />
      )}

      <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate('Home')}>
        <Text style={styles.backButtonText}>返回首頁</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f9f9f9',
    paddingTop: 50,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 20,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    position: 'relative'
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    position: 'absolute',
    left: 0,
    right: 0,
    textAlign: 'center',
    paddingTop: 20,
  },
  backButton: {
    position: 'absolute',
    left: 20,
    zIndex: 10,
    paddingTop: 20,
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
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
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
    fontStyle: 'italic',
    color: '#757575',
  },
  backButton: {
    paddingVertical: 12,
    backgroundColor: '#000',
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  backButtonText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default OrderHistoryScreen;
