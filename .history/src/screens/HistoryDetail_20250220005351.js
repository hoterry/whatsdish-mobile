import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

function HistoryDetailScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const order = route.params?.order;
  const { restaurantId, restaurants } = route.params;

  // 使用 restaurants.data 獲取餐廳資料
  const restaurantData = restaurants?.data || [];

  // 根據 restaurantId 找到對應的餐廳
  const restaurant = restaurantData.find(restaurant => restaurant.gid === restaurantId);

  console.log("Order: ", order);
  console.log("Restaurant ID: ", restaurantId);
  console.log("Restaurants: ", restaurantData);
  console.log("Selected Restaurant: ", restaurant);

  if (!order) {
    return (
      <View style={styles.container}>
        <Text style={styles.header}>Order Details</Text>
        <Text style={styles.emptyText}>No order details available.</Text>
      </View>
    );
  }

  const handleBackPress = () => {
    navigation.navigate('HomeTabs', { screen: 'Orders' });
  };

  const isPickup = order.deliveryMethod === 'pickup';

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
          <Ionicons name="arrow-back" size={28} color="black" />
        </TouchableOpacity>
        <Text style={styles.header}>訂單詳情</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>

        {restaurant && (
          <View style={styles.section}>
            <Image source={{ uri: restaurant.logo_url }} style={styles.restaurantLogo} />
            <Text style={styles.restaurantName}>{restaurant.name}</Text>
            <Text style={styles.restaurantAddress}>{restaurant.formatted_address}</Text>
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.orderIdTitle}>ORDER ID</Text>
          {!isPickup && <Text style={styles.orderId}>{order.orderNumber}</Text>}

          <View style={styles.separator} />
          
          {/* 配送方式 */}
          <View style={styles.row}>
            <Text style={styles.label}>配送方式</Text>
            <Text style={styles.value}>{order.deliveryMethod}</Text>
          </View>

          {/* 配送時間 / 自取時間 */}
          {!isPickup ? (
            <View style={styles.row}>
              <Text style={styles.label}>配送時間</Text>
              <Text style={styles.value}>{order.deliveryScheduledTime ? order.deliveryScheduledTime : '立即配送'}</Text>
            </View>
          ) : (
            <View style={styles.row}>
              <Text style={styles.label}>自取時間</Text>
              <Text style={styles.value}>{order.pickupScheduledTime}</Text>
            </View>
          )}

          {/* 送達地址 */}
          {!isPickup && (
            <View style={styles.row}>
              <Text style={styles.label}>送達地址</Text>
              <Text style={styles.value}>{order.address}</Text>
            </View>
          )}

          {/* 預約時間 */}
          {!isPickup && (
            <View style={styles.row}>
              <Text style={styles.label}>預約時間</Text>
              <Text style={styles.value}>
                {order.deliveryMethod === 'delivery' 
                  ? order.deliveryScheduledTime 
                  : order.pickupScheduledTime}
              </Text>
            </View>
          )}

          {/* 其他詳細資料 */}
          {!isPickup && (
            <>
              <View style={styles.row}>
                <Text style={styles.label}>收件人</Text>
                <Text style={styles.value}>{order.recipient}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>聯繫電話</Text>
                <Text style={styles.value}>{order.phone}</Text>
              </View>
            </>
          )}
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
    backgroundColor: '#fff',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  backButton: {
    marginRight: 10,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  scrollContainer: {
    padding: 15,
  },
  section: {
    marginBottom: 20,
  },
  restaurantLogo: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10,
  },
  restaurantName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  restaurantAddress: {
    fontSize: 14,
    color: 'gray',
  },
  orderIdTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  orderId: {
    fontSize: 16,
    marginVertical: 10,
  },
  separator: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginVertical: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 5,
  },
  label: {
    fontSize: 14,
    color: 'gray',
  },
  value: {
    fontSize: 14,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  foodItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 5,
  },
  foodName: {
    fontSize: 14,
  },
  foodPrice: {
    fontSize: 14,
    color: 'gray',
  },
  total: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'right',
  },
});

export default HistoryDetailScreen;
