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
  Platform
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { LanguageContext } from '../context/LanguageContext';

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
    viewDetails: "View Details"
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
    viewDetails: "查看詳情"
  }
};

function OrderHistoryScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { language } = useContext(LanguageContext);
  const t = translations[language];
  const [orders, setOrders] = useState([]);
  
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

  const renderEmptyComponent = () => (
    <View style={styles.emptyContainer}>
      <Image
        source={{ uri: 'https://res.cloudinary.com/dfbpwowvb/image/upload/v1733574455/no_orders_icon.png' }}
        style={styles.emptyImage}
      />
      <Text style={styles.emptyTitle}>{t.noOrders}</Text>
      <Text style={styles.emptySubtitle}>{t.startOrdering}</Text>
    </View>
  );

  const renderOrderItem = ({ item, index }) => (
    <TouchableOpacity
      style={styles.orderCard}
      activeOpacity={0.7}
      onPress={() => navigation.navigate('HistoryDetail', { order: item })}
    >
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
            {item.restaurants?.[item.restaurantId]?.name || 'Peaches Cafe Richmond'}
          </Text>
          <Text style={styles.orderDate}>
            {formatDate(item.orderTime)}
          </Text>
        </View>
        <View style={styles.orderStatus}>
          <View style={[
            styles.statusBadge, 
            { backgroundColor: '#E3F2FD' }
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
            <Text style={styles.infoLabel}>{language === 'ZH' ? '數量' : 'Items'}</Text>
            <Text style={styles.infoValue}>{getItemsCount(item)} {t.items}</Text>
          </View>
        </View>
        
        <TouchableOpacity style={styles.detailsButton}>
          <Text style={styles.detailsButtonText}>{t.viewDetails}</Text>
          <Ionicons name="chevron-forward" size={16} color="#555555" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="arrow-back" size={24} color="#000000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{t.orderHistory}</Text>
        </View>

        {orders.length === 0 ? (
          renderEmptyComponent()
        ) : (
          <FlatList
            contentContainerStyle={styles.listContainer}
            data={orders}
            keyExtractor={(item, index) => index.toString()}
            renderItem={renderOrderItem}
            showsVerticalScrollIndicator={false}
          />
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
});

export default OrderHistoryScreen;