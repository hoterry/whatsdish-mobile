import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

function HistoryDetailScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const order = route.params?.order;
  const { restaurantId, restaurants } = route.params;
  const restaurantData = restaurants?.data || [];

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

  const formatDate = (date) => {
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const day = daysOfWeek[date.getDay()];
    const month = date.getMonth() + 1;
    const dayOfMonth = date.getDate();
    return `${day}, ${month}/${dayOfMonth}`;
  };

  
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
          <View style={styles.restaurantSection}>
            <Image source={{ uri: restaurant.logo_url }} style={styles.restaurantLogo} />
            <Text style={styles.restaurantName}>{restaurant.name}</Text>
            <Text style={styles.restaurantAddress}>{restaurant.formatted_address}</Text>
          </View>
        )}
  
        <View style={styles.section}>
          <Text style={styles.orderIdTitle}>ORDER ID</Text>
          {!isPickup && <Text style={styles.orderId}>{order.orderNumber}</Text>}
  
          <View style={styles.separator} />
  
          <View style={styles.row}>
            <Text style={styles.label}>配送方式</Text>
            <Text style={styles.value}>{order.deliveryMethod}</Text>
          </View>
  
          {!isPickup ? (
            <View style={styles.row}>
              <Text style={styles.label}>配送時間</Text>
              <Text style={styles.value}>
                {order.deliveryScheduledTime ? formatDate(new Date(order.deliveryScheduledTime)) : '立即配送'}
              </Text>
            </View>
          ) : (
            <View style={styles.row}>
              <Text style={styles.label}>自取時間</Text>
              <Text style={styles.value}>
                {order.pickupScheduledTime ? formatDate(new Date(order.pickupScheduledTime)) : '立即自取'}
              </Text>
            </View>
          )}
  
          {!isPickup && (
            <View style={styles.row}>
              <Text style={styles.label}>送達地址</Text>
              <Text style={styles.value}>{order.address}</Text>
            </View>
          )}
  
          {!isPickup && (
            <View style={styles.row}>
              <Text style={styles.label}>預約時間</Text>
              <Text style={styles.value}>
                {order.deliveryMethod === 'delivery'
                  ? formatDate(new Date(order.deliveryScheduledTime))
                  : formatDate(new Date(order.pickupScheduledTime))}
              </Text>
            </View>
          )}
  
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
  
        <View style={styles.section}>
          <Text style={styles.cardTitle}>訂餐訊息</Text>
          <View style={styles.row}>
            <Text style={styles.label}>下單時間</Text>
            <Text style={styles.value}>{formatDate(new Date(order.orderTime))}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>支付方式</Text>
            <Text style={styles.value}>{order.paymentMethod}</Text>
          </View>
        </View>
  
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
    backgroundColor: '#f9f9f9',
  },
  scrollContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    paddingVertical: 30
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 100,
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
    paddingTop: 50,
  },
  backButton: {
    position: 'absolute',
    left: 20, 
    zIndex: 10,
    paddingTop: 50,
  }
  ,
  orderIdTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  restaurantSection: {
    marginBottom: 20,
    alignItems: 'center',
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
  restaurantCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    marginBottom: 15,
  },
  restaurantLogo: {
    width: 70,
    height: 70,
    borderRadius: 25,
    marginRight: 10,
    marginBottom: 5
  },
  restaurantInfo: {
    flexDirection: 'column',
  },
  restaurantName: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 5
  },
  restaurantAddress: {
    fontSize: 18,
    color: '#666',
    maxWidth: 300,
    textAlign: "center",
    marginBottom: 5
  },
  orderId: {
    fontSize: 18,
    color: '#666',
    marginBottom: 10,
  },
  separator: {
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    marginBottom: 15,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  separator: {
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    marginBottom: 15,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
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
