import React, { useContext } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Image,
  SafeAreaView,
  StatusBar,
  Platform
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { LanguageContext } from '../../context/LanguageContext';

const translations = {
  EN: {
    orderDetails: "Order Details",
    noOrderDetails: "No order details available.",
    orderId: "ORDER ID",
    deliveryMethod: "Delivery Method",
    deliveryTime: "Delivery Time",
    pickupTime: "Pickup Time",
    deliveryAddress: "Delivery Address",
    scheduledTime: "Scheduled Time",
    recipient: "Recipient",
    contactPhone: "Contact Phone",
    orderInfo: "Order Information",
    orderTime: "Order Time",
    paymentMethod: "Payment Method",
    orderItems: "Order Items",
    total: "Total",
    immediateDelivery: "Immediate Delivery",
    immediatePickup: "Immediate Pickup"
  },
  ZH: {
    orderDetails: "訂單詳情",
    noOrderDetails: "沒有可用的訂單詳情。",
    orderId: "訂單編號",
    deliveryMethod: "配送方式",
    deliveryTime: "配送時間",
    pickupTime: "自取時間",
    deliveryAddress: "送達地址",
    scheduledTime: "預約時間",
    recipient: "收件人",
    contactPhone: "聯繫電話",
    orderInfo: "訂餐訊息",
    orderTime: "下單時間",
    paymentMethod: "支付方式",
    orderItems: "訂單內容",
    total: "合計",
    immediateDelivery: "立即配送",
    immediatePickup: "立即自取"
  }
};

function HistoryDetailScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { language } = useContext(LanguageContext);
  const t = translations[language];
  
  const order = route.params?.order;
  const { restaurantId, restaurants } = route.params || {};
  const restaurantData = restaurants?.data || [];

  // 查找餐廳信息
  const restaurant = restaurantData.find(r => r.gid === restaurantId);

  if (__DEV__) {
    console.log("Order: ", order);
    console.log("Restaurant ID: ", restaurantId);
    console.log("Restaurants: ", restaurantData);
    console.log("Selected Restaurant: ", restaurant);
  }

  if (!order) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
        <View style={styles.container}>
          <View style={styles.headerContainer}>
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <Ionicons name="arrow-back" size={24} color="#000000" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>{t.orderDetails}</Text>
          </View>
          <View style={styles.emptyContainer}>
            <Ionicons name="document-outline" size={60} color="#CCCCCC" />
            <Text style={styles.emptyText}>{t.noOrderDetails}</Text>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  const handleBackPress = () => {
    navigation.navigate('HomeTabs', { screen: 'Orders' });
  };

  const isPickup = order.deliveryMethod === 'pickup';

  const formatDate = (date) => {
    const options = { 
      hour: '2-digit', 
      minute: '2-digit',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    };
    
    return new Date(date).toLocaleString(language === 'ZH' ? 'zh-TW' : 'en-US', options);
  };

  // 獲取配送方式顯示文字
  const getDeliveryMethodText = (method) => {
    if (method === 'pickup') return language === 'ZH' ? '自取' : 'Pickup';
    if (method === 'delivery') return language === 'ZH' ? '外送' : 'Delivery';
    return method;
  };
  
  // 計算訂單總項目數
  const getTotalItems = () => {
    if (!order.items) return 0;
    return order.items.reduce((sum, item) => sum + (item.quantity || 1), 0);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={handleBackPress}
          >
            <Ionicons name="arrow-back" size={24} color="#000000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{t.orderDetails}</Text>
        </View>
  
        <ScrollView 
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          {/* 訂單狀態徽章 */}
          <View style={styles.orderStatusContainer}>
            <View style={styles.orderStatusBadge}>
              <Ionicons 
                name={isPickup ? "restaurant-outline" : "bicycle-outline"} 
                size={18} 
                color="#FFFFFF" 
              />
              <Text style={styles.orderStatusText}>
                {getDeliveryMethodText(order.deliveryMethod)}
              </Text>
            </View>
            <Text style={styles.orderTimeInfo}>
              {formatDate(new Date(order.orderTime))}
            </Text>
          </View>
  
          {/* 餐廳資訊 */}
          {restaurant ? (
            <View style={styles.restaurantCard}>
              <Image 
                source={{ uri: restaurant.logo_url || 'https://via.placeholder.com/70' }} 
                style={styles.restaurantLogo} 
              />
              <View style={styles.restaurantInfo}>
                <Text style={styles.restaurantName}>{restaurant.name}</Text>
                <Text style={styles.restaurantAddress} numberOfLines={2}>
                  {restaurant.formatted_address}
                </Text>
              </View>
            </View>
          ) : (
            <View style={styles.restaurantCard}>
              <View style={styles.restaurantPlaceholder}>
                <Ionicons name="restaurant" size={30} color="#DDDDDD" />
              </View>
              <View style={styles.restaurantInfo}>
                <Text style={styles.restaurantName}>
                  {order.restaurantName || "Restaurant"}
                </Text>
              </View>
            </View>
          )}
  
          {/* 訂單詳情 */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="information-circle-outline" size={20} color="#555555" />
              <Text style={styles.sectionTitle}>{t.orderInfo}</Text>
            </View>
  
            {(order.orderNumber || order.orderId) && (
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>{t.orderId}</Text>
                <Text style={styles.infoValue}>{order.orderNumber}</Text>
              </View>
            )}
  
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>{t.deliveryMethod}</Text>
              <Text style={styles.infoValue}>
                {getDeliveryMethodText(order.deliveryMethod)}
              </Text>
            </View>
  
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>
                {isPickup ? t.pickupTime : t.deliveryTime}
              </Text>
              <Text style={styles.infoValue}>
                {isPickup 
                  ? (order.pickupScheduledTime ? formatDate(new Date(order.pickupScheduledTime)) : t.immediatePickup)
                  : (order.deliveryScheduledTime ? formatDate(new Date(order.deliveryScheduledTime)) : t.immediateDelivery)
                }
              </Text>
            </View>
  
            {!isPickup && order.address && (
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>{t.deliveryAddress}</Text>
                <Text style={styles.infoValue}>{order.address}</Text>
              </View>
            )}
  
            {order.recipient && (
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>{t.recipient}</Text>
                <Text style={styles.infoValue}>{order.recipient}</Text>
              </View>
            )}
  
            {order.phone && (
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>{t.contactPhone}</Text>
                <Text style={styles.infoValue}>{order.phone}</Text>
              </View>
            )}
  
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>{t.orderTime}</Text>
              <Text style={styles.infoValue}>{formatDate(new Date(order.orderTime))}</Text>
            </View>
  
            {order.paymentMethod && (
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>{t.paymentMethod}</Text>
                <Text style={styles.infoValue}>{order.paymentMethod}</Text>
              </View>
            )}
          </View>
  
          {/* 訂單內容 */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="list-outline" size={20} color="#555555" />
              <Text style={styles.sectionTitle}>{t.orderItems}</Text>
            </View>
  
            <View style={styles.itemsContainer}>
              {order.items && order.items.map((item, index) => (
                <View key={index} style={styles.foodItem}>
                  <View style={styles.foodItemLeft}>
                    <Text style={styles.foodQuantity}>x{item.quantity || 1}</Text>
                    <View>
                      <Text style={styles.foodName}>{item.name}</Text>
                      {item.selectedModifiers && item.selectedModifiers.length > 0 && (
                        <View>
                          {item.selectedModifiers.map((mod, idx) => (
                            <Text key={idx} style={styles.foodModifier}>
                              {mod.name} (+${(mod.price || 0).toFixed(2)})
                            </Text>
                          ))}
                        </View>
                      )}
                    </View>
                  </View>
                  <Text style={styles.foodPrice}>${(item.price * (item.quantity || 1)).toFixed(2)}</Text>
                </View>
              ))}
            </View>
  
            <View style={styles.orderSummary}>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>{t.total}</Text>
                <Text style={styles.summaryValue}>${order.totalPrice.toFixed(2)}</Text>
              </View>
              <View style={styles.totalItems}>
                <Text style={styles.totalItemsText}>
                  {getTotalItems()} {language === 'ZH' ? '項商品' : 'items'}
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 16,
    paddingBottom: 16,
    paddingHorizontal: 20,
    backgroundColor: '#FFFFFF',
    ...Platform.select({
      ios: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
  },
  backButton: {
    position: 'absolute',
    left: 16,
    padding: 4,
  },
  scrollContainer: {
    padding: 16,
    paddingBottom: 32,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#666666',
    marginTop: 16,
  },
  orderStatusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  orderStatusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4CAF50',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  orderStatusText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
    marginLeft: 6,
  },
  orderTimeInfo: {
    fontSize: 14,
    color: '#666666',
  },
  restaurantCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 3,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  restaurantLogo: {
    width: 70,
    height: 70,
    borderRadius: 8,
    marginRight: 16,
    backgroundColor: '#F0F0F0',
  },
  restaurantPlaceholder: {
    width: 70,
    height: 70,
    borderRadius: 8,
    marginRight: 16,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  restaurantInfo: {
    flex: 1,
  },
  restaurantName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 6,
  },
  restaurantAddress: {
    fontSize: 14,
    color: '#666666',
    lineHeight: 20,
  },
  section: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 3,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginLeft: 8,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  infoLabel: {
    fontSize: 14,
    color: '#666666',
    flex: 1,
  },
  infoValue: {
    fontSize: 14,
    color: '#333333',
    fontWeight: '500',
    textAlign: 'right',
    flex: 2,
  },
  itemsContainer: {
    marginBottom: 16,
  },
  foodItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  foodItemLeft: {
    flexDirection: 'row',
    flex: 1,
  },
  foodQuantity: {
    fontSize: 15,
    fontWeight: '600',
    color: '#555555',
    marginRight: 12,
    minWidth: 24,
  },
  foodName: {
    fontSize: 15,
    color: '#333333',
    marginBottom: 4,
    flex: 1,
  },
  foodModifier: {
    fontSize: 13,
    color: '#777777',
    marginTop: 2,
  },
  foodPrice: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333333',
    textAlign: 'right',
    minWidth: 70,
  },
  orderSummary: {
    marginTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
    paddingTop: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#4CAF50',
  },
  totalItems: {
    alignItems: 'flex-end',
  },
  totalItemsText: {
    fontSize: 13,
    color: '#777777',
  },
});

export default HistoryDetailScreen;