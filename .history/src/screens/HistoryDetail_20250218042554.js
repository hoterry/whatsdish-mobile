import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

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
    <View style={styles.container}>
      {/* 返回按鈕 */}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={28} color="black" />
      </TouchableOpacity>

      {/* 訂單詳情 */}
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.header}>訂單詳情</Text>

        {/* 配送資訊 */}
        <View style={styles.section}>
          <View style={styles.row}>
            <Text style={styles.label}>配送方式</Text>
            <Text style={styles.value}>{order.deliveryMethod}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>配送時間</Text>
            <Text style={styles.value}>立即配送</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>送達地址</Text>
            <Text style={styles.value}>{order.address}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>門牌號碼</Text>
            <Text style={styles.value}>{order.unitNumber}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>地址備註</Text>
            <Text style={styles.value}>{order.addressNote}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>收件人</Text>
            <Text style={styles.value}>{order.recipient}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>聯繫電話</Text>
            <Text style={styles.value}>{order.phone}</Text>
          </View>
        </View>

        {/* 訂單資訊 */}
        <View style={styles.section}>
          <View style={styles.row}>
            <Text style={styles.label}>取餐號</Text>
            <Text style={styles.value}>{order.pickupNumber}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>訂單號</Text>
            <Text style={styles.value}>{order.orderNumber}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>下單時間</Text>
            <Text style={styles.value}>{order.orderTime}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>支付方式</Text>
            <Text style={styles.value}>{order.paymentMethod}</Text>
          </View>
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
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    paddingTop: 40, // 增加 paddingTop 讓畫面向下移動
  },
  scrollContainer: {
    padding: 20,
  },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 10,
    padding: 10,
    zIndex: 10,
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
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#666',
  },
  value: {
    fontSize: 16,
    color: '#333',
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
  total: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 5,
    textAlign: 'right',
  },
});

export default HistoryDetailScreen;
