import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

function HistoryDetailScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const order = route.params?.order;

  if (!order) {
    return (
      <View style={styles.container}>
        <Text style={styles.header}>Order Details</Text>
        <Text style={styles.emptyText}>No order details available.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>訂單詳情</Text>
      
      {/* 配送資訊 */}
      <View style={styles.section}>
        <Text style={styles.label}>配送方式</Text>
        <Text style={styles.value}>{order.deliveryMethod}</Text>
        
        <Text style={styles.label}>配送時間</Text>
        <Text style={styles.value}>立即配送</Text>
        
        <Text style={styles.label}>送達地址</Text>
        <Text style={styles.value}>{order.address}</Text>
        
        <Text style={styles.label}>門牌號碼</Text>
        <Text style={styles.value}>{order.unitNumber}</Text>
        
        <Text style={styles.label}>地址備註</Text>
        <Text style={styles.value}>{order.addressNote}</Text>
        
        <Text style={styles.label}>收件人</Text>
        <Text style={styles.value}>{order.recipient}</Text>
        
        <Text style={styles.label}>聯繫電話</Text>
        <Text style={styles.value}>{order.phone}</Text>
      </View>
      
      {/* 訂單資訊 */}
      <View style={styles.section}>
        <Text style={styles.label}>取餐號</Text>
        <Text style={styles.value}>{order.pickupNumber}</Text>
        
        <Text style={styles.label}>訂單號</Text>
        <Text style={styles.value}>{order.orderNumber}</Text>
        
        <Text style={styles.label}>下單時間</Text>
        <Text style={styles.value}>{order.orderTime}</Text>
        
        <Text style={styles.label}>支付方式</Text>
        <Text style={styles.value}>{order.paymentMethod}</Text>
      </View>
      
      {/* 訂單內容 */}
      <View style={styles.section}>
        <Text style={styles.restaurant}>{order.restaurant}</Text>
        {order.items.map((item, index) => (
          <View key={index} style={styles.foodItem}>
            <Text style={styles.foodName}>x{item.quantity} {item.name}</Text>
            <Text style={styles.foodPrice}>${item.price.toFixed(2)}</Text>
          </View>
        ))}
        <Text style={styles.total}>合計 ${order.totalPrice.toFixed(2)}</Text>
      </View>
      
      {/* 返回按鈕 */}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backButtonText}>返回</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    padding: 20,
    margintop: 20
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  section: {
    backgroundColor: '#fff',
    padding: 15,
    marginBottom: 15,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#666',
  },
  value: {
    fontSize: 16,
    marginBottom: 10,
  },
  restaurant: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  foodItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  foodName: {
    fontSize: 16,
  },
  foodPrice: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  discount: {
    fontSize: 16,
    color: 'red',
    marginTop: 10,
  },
  total: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 5,
  },
  backButton: {
    backgroundColor: '#000',
    paddingVertical: 12,
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 20,
  },
  backButtonText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default HistoryDetailScreen;
