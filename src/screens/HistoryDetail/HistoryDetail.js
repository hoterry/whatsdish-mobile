import React, { useContext, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Image,
  SafeAreaView,
  StatusBar,
  Platform,
  FlatList,
  BackHandler,
  Dimensions
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { LanguageContext } from '../../context/LanguageContext';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const isNarrowDevice = SCREEN_WIDTH < 360;

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
    immediatePickup: "Immediate Pickup",
    note: "Note",
    subTotal: "Subtotal",
    tax: "Tax (GST 5%)",
    discount: "Discount",
    paid: "Paid",
    customer: "Customer",
    location: "Location",
    timezone: "Timezone",
    paymentStatus: "Payment Status",
    itemDetails: "Item Details",
    modifiers: "Modifiers",
    environment: "Environment",
    currency: "Currency",
    paymentMethod: "Payment Method",
    paymentProvider: "Payment Provider"
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
    immediatePickup: "立即自取",
    note: "備註",
    subTotal: "小計",
    tax: "稅費 (GST 5%)",
    discount: "折扣",
    paid: "已付",
    customer: "顧客",
    location: "位置",
    timezone: "時區",
    paymentStatus: "支付狀態",
    itemDetails: "項目詳情",
    modifiers: "附加選項",
    environment: "環境",
    currency: "貨幣",
    paymentMethod: "支付方式",
    paymentProvider: "支付提供商"
  }
};

function HistoryDetailScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { language } = useContext(LanguageContext);
  const t = translations[language];
  
  const responseData = route.params?.responseData;
  
  const orderData = responseData?.result?.order || null;
  const items = responseData?.result?.items || [];
  const payments = responseData?.result?.payments || [];
  const merchants = orderData?.merchants || [];
  const restaurants = responseData?.result?.restaurants || {};
  const customer = orderData?.customer || {};
  
  const payment = payments && payments.length > 0 ? payments[0] : null;
  
  if (__DEV__) {
    console.log("Payments array:", JSON.stringify(payments, null, 2));
    if (payment) {
      console.log("First payment object:", JSON.stringify(payment, null, 2));
      console.log("Payment amount_in_cents:", payment.amount_in_cents);
    } else {
      console.log("No payment found");
    }
  }
  
  const mainRestaurantId = orderData?.google_place_ids?.[0]?.gid || 
                          Object.keys(restaurants)[0];

  let restaurantInfo = null;
  if (restaurants && mainRestaurantId && restaurants[mainRestaurantId]) {
    restaurantInfo = restaurants[mainRestaurantId];
  } else if (merchants.length > 0) {
    restaurantInfo = merchants[0];
  }
  
  const restaurant = restaurantInfo ? {
    ...restaurantInfo,
    ...(merchants.length > 0 ? {
      formatted_address: restaurantInfo.formatted_address || merchants[0].formatted_address,
      google_place_id: restaurantInfo.google_place_id || merchants[0].google_place_id,
      timezone: restaurantInfo.timezone || merchants[0].timezone
    } : {})
  } : (merchants.length > 0 ? merchants[0] : null);
  
  const formatDate = (dateString) => {
    if (!dateString) return '';
    
    const options = { 
      hour: '2-digit', 
      minute: '2-digit',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    };
    
    return new Date(dateString).toLocaleString(language === 'ZH' ? 'zh-TW' : 'en-US', options);
  };

  if (__DEV__) {
    const subtotal = items.reduce((total, item) => total + (item.applied_fee_in_cents || 0), 0);
    const taxRate = 0.05;
    const tax = Math.round(subtotal * taxRate);
    const total = payment ? payment.amount_in_cents : 0;
    const discount = (subtotal + tax) - total;
    
    console.log("Price Calculation: ", {
      subtotalInCents: subtotal,
      subtotalFormatted: `${(subtotal / 100).toFixed(2)}`,
      taxInCents: tax,
      taxFormatted: `${(tax / 100).toFixed(2)}`,
      totalInCents: total,
      totalFormatted: `${(total / 100).toFixed(2)}`,
      discountInCents: discount,
      discountFormatted: `${(discount / 100).toFixed(2)}`
    });
  }

  const handleBackPress = () => {
    navigation.navigate('HomeTabs', { screen: 'Orders' });
    return true;
  };
  
  useEffect(() => {
    if (Platform.OS === 'android') {
      BackHandler.addEventListener('hardwareBackPress', handleBackPress);
      
      return () => {
        BackHandler.removeEventListener('hardwareBackPress', handleBackPress);
      };
    }
  }, []);

  if (!orderData) {
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
            <View style={styles.headerTitleContainer}>
              <Text style={styles.headerTitle} numberOfLines={1}>{t.orderDetails}</Text>
            </View>
          </View>
          <View style={styles.emptyContainer}>
            <Ionicons name="document-outline" size={60} color="#CCCCCC" />
            <Text style={styles.emptyText}>{t.noOrderDetails}</Text>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  const isPickup = orderData.mode === 'pickup';

  const getDeliveryMethodText = (method) => {
    if (method === 'pickup') return language === 'ZH' ? '自取' : 'Pickup';
    if (method === 'delivery') return language === 'ZH' ? '外送' : 'Delivery';
    return method;
  };
  
  const getTotalItems = () => {
    if (!items) return 0;
    return items.reduce((sum, item) => sum + (item.count || 1), 0);
  };

  const formatPrice = (cents) => {
    if (!cents && cents !== 0) return "0.00";
    return (cents / 100).toFixed(2);
  };

  const calculateOrderPrices = () => {
    const subtotalInCents = items.reduce((total, item) => total + (item.applied_fee_in_cents || 0), 0);
    
    const taxRate = 0.05;
    const taxInCents = Math.round(subtotalInCents * taxRate);
    
    const totalInCents = payment?.amount_in_cents || 
                        (responseData?.result?.payments && 
                         responseData.result.payments[0]?.amount_in_cents) || 353;
    
    if (__DEV__) {
      console.log("Updated total calculation:", {
        paymentExists: !!payment,
        responseDataPaymentsExists: !!(responseData?.result?.payments && responseData.result.payments.length > 0),
        totalInCents: totalInCents,
        paymentAmountInCents: payment?.amount_in_cents || 'N/A',
        responseDataAmount: responseData?.result?.payments?.[0]?.amount_in_cents || 'N/A'
      });
    }
    
    const expectedTotalInCents = subtotalInCents + taxInCents;
    const discountInCents = expectedTotalInCents - totalInCents;
    
    return {
      subtotalInCents,
      taxInCents,
      totalInCents,
      discountInCents
    };
  };

  const { subtotalInCents, taxInCents, totalInCents, discountInCents } = calculateOrderPrices();

  const renderInfoRow = (label, value, valueStyle = {}) => {
    if (value === null || value === undefined || value === '') return null;
    
    return (
      <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>{label}</Text>
        <Text style={[styles.infoValue, valueStyle]} numberOfLines={2}>{value}</Text>
      </View>
    );
  };

  const renderItemImage = (item) => {
    if (!item.image_thumb_url) return null;
    
    const imageSize = isNarrowDevice ? 40 : 45;
    
    return (
      <Image 
        source={{ uri: item.image_thumb_url }} 
        style={[styles.itemImage, {width: imageSize, height: imageSize}]}
        defaultSource={{ uri: 'https://res.cloudinary.com/dfbpwowvb/image/upload/v1733574455/342534_m5opy3.png' }}
      />
    );
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
          <View style={styles.headerTitleContainer}>
            <Text style={styles.headerTitle} numberOfLines={1} ellipsizeMode="tail">{t.orderDetails}</Text>
          </View>
        </View>
  
        <ScrollView 
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.orderStatusContainer}>
            <View style={styles.orderStatusBadge}>
              <Ionicons 
                name={isPickup ? "restaurant-outline" : "bicycle-outline"} 
                size={18} 
                color="#FFFFFF" 
              />
              <Text style={styles.orderStatusText}>
                {getDeliveryMethodText(orderData.mode)}
              </Text>
            </View>
            <Text style={styles.orderTimeInfo} numberOfLines={1}>
              {payment && formatDate(payment.paid_at)}
            </Text>
          </View>
  
          <View style={styles.restaurantCard}>
            {restaurant?.image_url ? (
              <Image 
                source={{ uri: restaurant.image_url }} 
                style={[styles.restaurantLogo, isNarrowDevice && {width: 60, height: 60}]}
                defaultSource={{ uri: 'https://res.cloudinary.com/dfbpwowvb/image/upload/v1733574455/342534_m5opy3.png' }}
              />
            ) : (
              <View style={[styles.restaurantPlaceholder, isNarrowDevice && {width: 60, height: 60}]}>
                <Ionicons name="restaurant" size={isNarrowDevice ? 24 : 30} color="#DDDDDD" />
              </View>
            )}
            <View style={styles.restaurantInfo}>
              <Text style={styles.restaurantName} numberOfLines={1} ellipsizeMode="tail">
                {restaurant?.name || 'Restaurant'}
              </Text>
              {restaurant?.formatted_address && (
                <Text style={styles.restaurantAddress} numberOfLines={2} ellipsizeMode="tail">
                  {restaurant.formatted_address}
                </Text>
              )}
              {(!restaurant?.formatted_address && restaurant?.address) && (
                <Text style={styles.restaurantAddress} numberOfLines={2} ellipsizeMode="tail">
                  {restaurant.address}
                </Text>
              )}
              {(restaurant?.google_place_id || restaurant?.gid) && (
                <Text style={styles.restaurantId} numberOfLines={1} ellipsizeMode="middle">
                  ID: {restaurant?.google_place_id || restaurant?.gid}
                </Text>
              )}
            </View>
          </View>
  
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="information-circle-outline" size={20} color="#555555" />
              <Text style={styles.sectionTitle}>{t.orderInfo}</Text>
            </View>
  
            {renderInfoRow(t.orderId, orderData.order_id)}
            {renderInfoRow(t.deliveryMethod, getDeliveryMethodText(orderData.mode))}
            {renderInfoRow(t.paymentStatus, orderData.status)}
            
            {payment && (
              <>
                {renderInfoRow(t.orderTime, formatDate(payment.paid_at))}
                {renderInfoRow(t.paymentMethod, payment.payment_method === 'CREDIT' ? 
                  (language === 'ZH' ? '信用卡' : 'Credit Card') : 
                  payment.payment_method)}
                {renderInfoRow(t.paymentProvider, payment.tender)}
                {renderInfoRow(t.currency, payment.currency)}
              </>
            )}
            
            {restaurant && (
              <>
                {renderInfoRow(t.location, restaurant.formatted_address || restaurant.address)}
                {renderInfoRow(t.timezone, restaurant.timezone)}
              </>
            )}
          </View>
  
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="list-outline" size={20} color="#555555" />
              <Text style={styles.sectionTitle}>{t.orderItems}</Text>
            </View>
  
            <View style={styles.itemsContainer}>
              {items && items.map((item, index) => (
                <View key={`${item.id || index}`} style={styles.foodItem}>
                  <View style={styles.foodItemLeft}>
                    {renderItemImage(item)}
                    <View style={styles.foodQuantityContainer}>
                      <Text style={styles.foodQuantity}>x{item.count || 1}</Text>
                    </View>
                    <View style={styles.foodDetails}>
                      <Text style={styles.foodName} numberOfLines={2} ellipsizeMode="tail">
                        {item.name}
                      </Text>
                      {item.note && item.note.trim() !== "" && (
                        <Text style={styles.foodNote} numberOfLines={1} ellipsizeMode="tail">
                          {t.note}: {item.note}
                        </Text>
                      )}
                      {item.modifications && item.modifications.length > 0 && (
                        <View>
                          {item.modifications.map((mod, idx) => (
                            <Text key={`mod-${idx}`} style={styles.foodModifier} numberOfLines={1} ellipsizeMode="tail">
                              {mod.name} (+${formatPrice(mod.applied_fee_in_cents)})
                            </Text>
                          ))}
                        </View>
                      )}
                    </View>
                  </View>
                  <Text style={styles.foodPrice}>
                    ${formatPrice(item.applied_fee_in_cents)}
                  </Text>
                </View>
              ))}
            </View>
  
            <View style={styles.orderSummary}>
              <View style={styles.summaryRow}>
                <Text style={styles.subtotalLabel}>{t.subTotal}</Text>
                <Text style={styles.subtotalValue}>${formatPrice(subtotalInCents)}</Text>
              </View>
              
              <View style={styles.summaryRow}>
                <Text style={styles.subtotalLabel}>{t.tax}</Text>
                <Text style={styles.subtotalValue}>${formatPrice(taxInCents)}</Text>
              </View>
              
              {discountInCents > 0 && (
                <View style={styles.summaryRow}>
                  <Text style={styles.subtotalLabel}>{t.discount}</Text>
                  <Text style={[styles.subtotalValue, styles.discountValue]}>-${formatPrice(discountInCents)}</Text>
                </View>
              )}
              
              <View style={[styles.summaryRow, styles.totalRow]}>
                <Text style={styles.summaryLabel}>{t.total}</Text>
                <Text style={styles.summaryValue}>${formatPrice(totalInCents)}</Text>
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
    height: 56,
    paddingHorizontal: 16,
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
  headerTitleContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
    textAlign: 'center',
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContainer: {
    padding: isNarrowDevice ? 12 : 16,
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
    fontSize: isNarrowDevice ? 12 : 14,
    color: '#666666',
    flex: 1,
    textAlign: 'right',
    marginLeft: 8,
  },
  restaurantCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: isNarrowDevice ? 12 : 16,
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
    marginRight: isNarrowDevice ? 12 : 16,
    backgroundColor: '#F0F0F0',
  },
  restaurantPlaceholder: {
    width: 70,
    height: 70,
    borderRadius: 8,
    marginRight: isNarrowDevice ? 12 : 16,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  restaurantInfo: {
    flex: 1,
  },
  restaurantName: {
    fontSize: isNarrowDevice ? 16 : 18,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 6,
  },
  restaurantAddress: {
    fontSize: isNarrowDevice ? 13 : 14,
    color: '#666666',
    lineHeight: isNarrowDevice ? 18 : 20,
  },
  restaurantId: {
    fontSize: isNarrowDevice ? 11 : 12,
    color: '#888888',
    marginTop: 2,
  },
  section: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: isNarrowDevice ? 12 : 16,
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
    fontSize: isNarrowDevice ? 15 : 16,
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
    flexWrap: 'wrap',
  },
  infoLabel: {
    fontSize: isNarrowDevice ? 13 : 14,
    color: '#666666',
    flex: isNarrowDevice ? 0.9 : 1,
  },
  infoValue: {
    fontSize: isNarrowDevice ? 13 : 14,
    color: '#333333',
    fontWeight: '500',
    textAlign: 'right',
    flex: isNarrowDevice ? 1.1 : 2,
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
    alignItems: 'flex-start',
  },
  itemImage: {
    width: 45,
    height: 45,
    borderRadius: 6,
    marginRight: isNarrowDevice ? 6 : 8,
    backgroundColor: '#F5F5F5',
  },
  foodQuantityContainer: {
    marginRight: isNarrowDevice ? 6 : 8,
    minWidth: isNarrowDevice ? 20 : 24,
  },
  foodQuantity: {
    fontSize: isNarrowDevice ? 14 : 15,
    fontWeight: '600',
    color: '#555555',
  },
  foodDetails: {
    flex: 1,
  },
  foodName: {
    fontSize: isNarrowDevice ? 14 : 15,
    color: '#333333',
    marginBottom: 4,
    flex: 1,
  },
  foodNote: {
    fontSize: isNarrowDevice ? 12 : 13,
    fontStyle: 'italic',
    color: '#666666',
    marginTop: 2,
  },
  foodModifier: {
    fontSize: isNarrowDevice ? 12 : 13,
    color: '#777777',
    marginTop: 2,
  },
  foodPrice: {
    fontSize: isNarrowDevice ? 14 : 15,
    fontWeight: '600',
    color: '#333333',
    textAlign: 'right',
    minWidth: isNarrowDevice ? 60 : 70,
    marginLeft: 4,
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
  totalRow: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
  },
  summaryLabel: {
    fontSize: isNarrowDevice ? 15 : 16,
    fontWeight: '600',
    color: '#333333',
  },
  summaryValue: {
    fontSize: isNarrowDevice ? 16 : 18,
    fontWeight: '700',
    color: '#4CAF50',
  },
  subtotalLabel: {
    fontSize: isNarrowDevice ? 13 : 14,
    color: '#666666',
  },
  subtotalValue: {
    fontSize: isNarrowDevice ? 13 : 14,
    fontWeight: '500',
    color: '#333333',
  },
  discountValue: {
    color: '#E53935',
  },
  totalItems: {
    alignItems: 'flex-end',
    marginTop: 8,
  },
  totalItemsText: {
    fontSize: isNarrowDevice ? 12 : 13,
    color: '#777777',
  },
  debugContainer: {
    padding: 8,
    backgroundColor: '#F5F5F5',
    borderRadius: 6,
  },
  debugTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 8,
  },
  debugText: {
    fontSize: 11,
    color: '#555555',
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
});

export default HistoryDetailScreen;