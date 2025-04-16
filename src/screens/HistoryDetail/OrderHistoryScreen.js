import React, { useEffect, useState, useContext } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  StyleSheet, 
  TouchableOpacity, 
  Image,
  SafeAreaView,
  StatusBar,
  Platform,
  Alert
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { LanguageContext } from '../../context/LanguageContext';
import * as SecureStore from 'expo-secure-store';
// 引入 Lottie 動畫庫
import LottieView from 'lottie-react-native';

const Logger = {
  info: (tag, message, data) => {},
  error: (tag, message, error) => {},
  debug: (tag, message, data) => {}
};

const translations = {
  EN: {
    orderHistory: "Order History",
    noOrders: "No orders yet",
    startOrdering: "Start ordering delicious food!",
    orderDate: "Order Date",
    total: "Total",
    delivery: "Delivery Method",
    pickup: "Pickup",
    items: "items",
    viewDetails: "View Details",
    loading: "Loading orders...",
    error: "Error loading orders",
    orderId: "Order ID",
    loadingDetails: "Loading order details..."
  },
  ZH: {
    orderHistory: "訂單歷史",
    noOrders: "還沒有訂單",
    startOrdering: "開始訂購美食吧！",
    orderDate: "訂單日期",
    total: "總額",
    delivery: "配送方式",
    pickup: "自取",
    items: "項目",
    viewDetails: "查看詳情",
    loading: "正在加載訂單...",
    error: "加載訂單時出錯",
    orderId: "訂單編號",
    loadingDetails: "正在加載訂單詳情..."
  }
};

function OrderHistoryScreen() {
  const TAG = "OrderHistoryScreen";
  const navigation = useNavigation();
  const route = useRoute();
  const { language } = useContext(LanguageContext);
  const t = translations[language];
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [error, setError] = useState(null);

  const API_BASE_URL = __DEV__ 
    ? "https://dev.whatsdish.com/api" 
    : "https://whatsdish.com/api";

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        
        const phoneNumber = await SecureStore.getItemAsync('phoneNumber');
        
        if (!phoneNumber) {
          setLoading(false);
          return;
        }
        
        const response = await fetch('https://whatsdish.com/api/orders/list');
        const data = await response.json();
        
        if (data.success && data.result) {
          const userOrders = data.result.filter(
            order => order.order?.customer?.phone_number === phoneNumber && 
                     order.order?.environment === "development"
          );
          
          const formattedOrders = userOrders.map(order => {
            const formattedOrder = {
              id: order.order_id,
              orderTime: order.createdAt,
              totalPrice: order.amount_in_cents / 100,
              deliveryMethod: order.order?.mode || 'pickup',
              restaurantId: order.google_place_ids?.[0]?.gid || '',
              restaurants: order.google_place_ids?.reduce((acc, restaurant) => {
                acc[restaurant.gid] = {
                  name: restaurant.name,
                  image_url: restaurant.logo_url,
                  formatted_address: restaurant.formatted_address || ''
                };
                return acc;
              }, {}),
              items: [],
              status: order.status,
              paymentMethod: order.payment_method,
              currency: order.currency,
              rawOrder: order
            };
            return formattedOrder;
          });
          
          setOrders(formattedOrders);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  useEffect(() => {
    if (route.params?.order) {
      setOrders((prevOrders) => [route.params.order, ...prevOrders]);
    }
  }, [route.params?.order]);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(language === 'ZH' ? 'zh-TW' : 'en-US', options);
  };

  const getItemsCount = (order) => {
    if (!order.items) return 0;
    return order.items.reduce((sum, item) => sum + (item.quantity || 1), 0);
  };

  const getDeliveryMethodLabel = (method) => {
    if (method === 'pickup') return language === 'ZH' ? '自取' : 'Pickup';
    if (method === 'delivery') return language === 'ZH' ? '外送' : 'Delivery';
    return method;
  };

  const getStatusBadgeColor = (method) => {
    if (method === 'pickup') return '#E8F5E9';
    if (method === 'delivery') return '#E3F2FD';
    return '#E3F2FD';
  };

  const fetchOrderDetails = async (orderId, orderData) => {
    setLoadingDetails(true);
    
    try {
      const token = await SecureStore.getItemAsync('token');
      const gid = orderData.restaurantId;
      const lang = language.toLowerCase();
      
      if (!gid) {
        Alert.alert("Error", "Missing restaurant information");
        setLoadingDetails(false);
        return null;
      }
      
      const detailsUrl = `${API_BASE_URL}/orders/${orderId}/cart/items/render?language=${lang}&gids=${gid}`;
      console.log(detailsUrl);
      
      const response = await fetch(detailsUrl, {
        method: 'GET',
        headers: {
          'Authorization': token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to fetch order details');
      }
      
      return data.result;
      
    } catch (err) {
      Alert.alert(
        "Error",
        "Failed to load order details. Please try again later."
      );
      return null;
    } finally {
      setLoadingDetails(false);
    }
  };

  const handleOrderPress = async (order) => {
    setLoadingDetails(true);
    
    try {
      const orderDetails = await fetchOrderDetails(order.id, order);
      
      setLoadingDetails(false);
      
      if (!orderDetails) {
        return;
      }
      
      // Create a similar data structure to what CheckoutScreen is sending
      const restaurantInfo = order.restaurants[order.restaurantId] || {};
      
      // Format items similar to CheckoutScreen's format
      const formattedItems = orderDetails.items?.map(item => ({
        name: item.name || item.title || "Item",
        count: item.quantity || 1,
        applied_fee_in_cents: Math.round((item.price * (item.quantity || 1)) * 100),
        image_thumb_url: item.image_url || item.imageUrl || item.image || null,
        // Include other fields from the original item
        ...item
      })) || [];
      
      // Format payments similar to CheckoutScreen
      const formattedPayments = [{
        paid_at: order.orderTime,
        amount_in_cents: Math.round(order.totalPrice * 100),
        payment_method: order.paymentMethod || 'CREDIT',
        tender: 'Card',
        currency: order.currency || 'CAD'
      }];
      
      // Format order similar to CheckoutScreen's structure
      const formattedOrder = {
        order_id: order.id,
        mode: order.deliveryMethod,
        status: order.status || 'confirmed',
        merchants: [{
          name: restaurantInfo.name || "Restaurant",
          formatted_address: restaurantInfo.formatted_address || "",
          address: restaurantInfo.formatted_address || "",
          image_url: restaurantInfo.image_url || null
        }],
        customer: order.rawOrder?.order?.customer,
        // Include other fields from the original order
        ...order.rawOrder?.order
      };
      
      navigation.navigate('HistoryDetail', { 
        responseData: {
          success: true,
          result: {
            order: formattedOrder,
            items: formattedItems,
            payments: formattedPayments,
            restaurants: order.restaurants
          }
        }
      });
      
    } catch (err) {
      setLoadingDetails(false);
      Alert.alert(
        "Error",
        "Something went wrong. Please try again later."
      );
    }
  };

  const renderEmptyComponent = () => {
    if (loading) {
      return (
        <View style={styles.emptyContainer}>
          {/* 使用 Lottie 動畫替換原本的 ActivityIndicator */}
          <LottieView 
            source={require('/Users/terryho/whatsdish-mobile/assets/wd-loading-animation.json')} 
            autoPlay 
            loop 
            style={{ width: 300, height: 300 }} 
          />
        </View>
      );
    }
    
    if (error) {
      return (
        <View style={styles.emptyContainer}>
          <Ionicons name="alert-circle-outline" size={60} color="#FF6B6B" />
          <Text style={[styles.emptyTitle, { marginTop: 16 }]}>{t.error}</Text>
          <Text style={styles.emptySubtitle}>{error}</Text>
        </View>
      );
    }
    
    return (
      <View style={styles.emptyContainer}>
        <Image
          source={{ uri: 'https://res.cloudinary.com/dfbpwowvb/image/upload/v1733574455/no_orders_icon.png' }}
          style={styles.emptyImage}
        />
        <Text style={styles.emptyTitle}>{t.noOrders}</Text>
        <Text style={styles.emptySubtitle}>{t.startOrdering}</Text>
      </View>
    );
  };

  const renderOrderItem = ({ item, index }) => {
    return (
      <TouchableOpacity
        style={styles.orderCard}
        activeOpacity={0.7}
        onPress={() => {
          handleOrderPress(item);
        }}
      >
        <View style={styles.orderIdContainer}>
          <Text style={styles.orderId}>
            {t.orderId}: {item.id}
          </Text>
        </View>
        
        <View style={styles.orderCardHeader}>
          <View style={styles.logoContainer}>
            <Image 
              source={{ 
                uri: item.restaurants?.[item.restaurantId]?.image_url || 'https://res.cloudinary.com/dfbpwowvb/image/upload/v1733574455/342534_m5opy3.png' 
              }} 
              style={styles.restaurantLogo}
            />
          </View>
          <View style={styles.headerInfo}>
            <Text style={styles.restaurantName} numberOfLines={1}>
              {item.restaurants?.[item.restaurantId]?.name || 'Restaurant'}
            </Text>
            <Text style={styles.orderDate}>
              {formatDate(item.orderTime)}
            </Text>
          </View>
          <View style={styles.orderStatus}>
            <View style={[
              styles.statusBadge, 
              { backgroundColor: getStatusBadgeColor(item.deliveryMethod) }
            ]}>
              <Text style={styles.statusText}>
                {getDeliveryMethodLabel(item.deliveryMethod)}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.orderDivider} />

        <View style={styles.orderCardBody}>
          <View style={styles.orderInfo}>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>{t.total}</Text>
              <Text style={styles.infoValue}>${item.totalPrice.toFixed(2)}</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>{language === 'ZH' ? '狀態' : 'Status'}</Text>
              <Text style={styles.infoValue}>{item.status}</Text>
            </View>
          </View>
          
          <TouchableOpacity 
            style={styles.detailsButton}
            onPress={() => {
              handleOrderPress(item);
            }}
          >
            <Text style={styles.detailsButtonText}>{t.viewDetails}</Text>
            <Ionicons name="chevron-forward" size={16} color="#555555" />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <Text style={styles.headerTitle}>{t.orderHistory}</Text>
        </View>

        {(loading || error || orders.length === 0) ? (
          renderEmptyComponent()
        ) : (
          <FlatList
            contentContainerStyle={styles.listContainer}
            data={orders}
            keyExtractor={(item, index) => {
              return `${item.id}-${index}`;
            }}
            renderItem={renderOrderItem}
            showsVerticalScrollIndicator={false}
            onEndReached={() => {}}
          />
        )}
        
        {loadingDetails && (
          <View style={styles.loadingOverlay}>
            {/* 使用 Lottie 動畫替換原本的 ActivityIndicator */}
            <LottieView 
              source={require('/Users/terryho/whatsdish-mobile/assets/wd-loading-animation.json')} 
              autoPlay 
              loop 
              style={{ width: 250, height: 250 }} 
            />
            <Text style={styles.loadingText}>{t.loadingDetails}</Text>
          </View>
        )}
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
  listContainer: {
    padding: 16,
    paddingBottom: 32,
  },
  orderCard: {
    marginBottom: 16,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
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
  orderIdContainer: {
    backgroundColor: '#2E8B57',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  orderId: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  orderCardHeader: {
    flexDirection: 'row',
    padding: 16,
    alignItems: 'center',
  },
  logoContainer: {
    marginRight: 12,
  },
  restaurantLogo: {
    width: 50,
    height: 50,
    borderRadius: 8,
    backgroundColor: '#F0F0F0',
  },
  headerInfo: {
    flex: 1,
  },
  restaurantName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 4,
  },
  orderDate: {
    fontSize: 14,
    color: '#666666',
  },
  orderStatus: {
    marginLeft: 8,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#0D47A1',
  },
  orderDivider: {
    height: 1,
    backgroundColor: '#F0F0F0',
    marginHorizontal: 16,
  },
  orderCardBody: {
    padding: 16,
  },
  orderInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  infoItem: {
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: 13,
    color: '#777777',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
  },
  detailsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#F5F5F5',
  },
  detailsButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#555555',
    marginRight: 4,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'white',
  },
  emptyImage: {
    width: 100,
    height: 100,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#777777',
    textAlign: 'center',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 1)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  loadingText: {
    color: '#FFFFFF',
    marginTop: 12,
    fontSize: 16,
    fontWeight: '500',
  },
});

export default OrderHistoryScreen;