import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

function HistoryDetailScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const order = route.params?.order;
  console.log(order);

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
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={28} color="black" />
        </TouchableOpacity>
        <Text style={styles.header}>訂單詳情</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>

        <View style={styles.section}>
          <Text style={styles.orderIdTitle}>ORDER ID</Text>
          <Text style={styles.orderId}>{order.orderNumber}</Text>
          <View style={styles.separator} />
          
          {/* 配送方式 */}
          <View style={styles.row}>
            <Text style={styles.label}>配送方式</Text>
            <Text style={styles.value}>{order.deliveryMethod}</Text>
          </View>

          {/* 配送時間 */}
          <View style={styles.row}>
            <Text style={styles.label}>配送時間</Text>
            <Text style={styles.value}>{order.deliveryScheduledTime ? order.deliveryScheduledTime : '立即配送'}</Text>
          </View>

          {/* 地址 */}
          <View style={styles.row}>
            <Text style={styles.label}>送達地址</Text>
            <Text style={styles.value}>{order.address}</Text>
          </View>

          {/* 預約時間 */}
          <View style={styles.row}>
            <Text style={styles.label}>預約時間</Text>
            <Text style={styles.value}>
              {order.deliveryMethod === 'delivery' 
                ? order.deliveryScheduledTime 
                : order.pickupScheduledTime}
            </Text>
          </View>

          {/* 其他詳細資料 */}
          <View style={styles.row}>
            <Text style={styles.label}>收件人</Text>
            <Text style={styles.value}>{order.recipient}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>聯繫電話</Text>
            <Text style={styles.value}>{order.phone}</Text>
          </View>
        </View>

        {/* 訂單訊息 */}
        <View style={styles.section}>
          <Text style={styles.cardTitle}>訂餐訊息</Text>
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
          <Text style={styles.cardTitle}>訂單內容</Text>
          <Text style={styles.restaurant}>{order.restaurant}</Text>
          {order.items.map((item, index) => (
            <View key={index} style={styles.foodItem}>
              <Image source={{ uri: item.image }} style={styles.foodImage} />
              <View style={styles.foodDetails}>
                <Text style={styles.foodName}>x{item.quantity} {item.name}</Text>
                <Text style={styles.foodPrice}>${item.price.toFixed(2)}</Text>
              </View>
            </View>
          ))}
          <Text style={styles.total}>合計 ${order.totalPrice.toFixed(2)}</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  headerContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  backButton: { marginRight: 10 },
  header: { fontSize: 24, fontWeight: 'bold' },
  scrollContainer: { paddingBottom: 20 },
  section: { marginBottom: 20 },
  orderIdTitle: { fontSize: 18, fontWeight: 'bold' },
  orderId: { fontSize: 16, color: '#555' },
  separator: { height: 1, backgroundColor: '#ccc', marginVertical: 10 },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  label: { fontWeight: 'bold' },
  value: { fontSize: 16, color: '#555' },
  cardTitle: { fontSize: 18, fontWeight: 'bold', marginVertical: 10 },
  restaurant: { fontSize: 16, fontWeight: 'bold', marginBottom: 10 },
  foodItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 5 },
  foodImage: { width: 50, height: 50, borderRadius: 5, marginRight: 10 },
  foodDetails: { flex: 1 },
  foodName: { fontSize: 16 },
  foodPrice: { fontSize: 16, color: '#555' },
  total: { fontSize: 18, fontWeight: 'bold', marginTop: 10, textAlign: 'right' },
  emptyText: { fontSize: 16, textAlign: 'center', color: '#555' },
});

export default HistoryDetailScreen;
