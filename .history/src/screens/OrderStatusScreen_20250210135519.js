import React, { useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { supabase } from '../../supabase'; // Import Supabase instance


const OrderStatusScreen = ({ route }) => {
  const { orderData } = route.params;  // 获取传递的订单数据

  console.log('Order Data:', orderData);

  // 确保 orderData.items 是数组，且不为 undefined 或 null
  let items = orderData.items;
  if (typeof items === 'string') {
    try {
      items = JSON.parse(items);  // 如果是字符串，解析它
    } catch (error) {
      console.error("Failed to parse items:", error);
      items = [];  // 解析失败时给一个默认空数组
    }
  }

  // 确保 items 是数组类型
  if (!Array.isArray(items)) {
    items = [];  // 如果不是数组，设置为默认空数组
  }

  // 用 useEffect 確保當數據進來時就把它發送到 Supabase
  useEffect(() => {
    const sendToSupabase = async () => {
      try {
        const { data, error } = await supabase
          .from('orders')  // 假設你的 Supabase 表叫 'orders'
          .insert([orderData]);  // 把 orderData 插入到 'orders' 表中

        if (error) {
          throw new Error(error.message);
        }

        console.log('Order saved to Supabase:', data);
      } catch (error) {
        console.error('Error saving order to Supabase:', error);
      }
    };

    // 當 orderData 有變化時才執行
    if (orderData) {
      sendToSupabase();
    }
  }, [orderData]);  // 依賴 orderData，當它變動時執行

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Order Status</Text>

      <View style={styles.infoContainer}>
        <Text style={styles.infoText}>Order ID: <Text style={styles.infoValue}>{orderData.order_id}</Text></Text>
        <Text style={styles.infoText}>Order Type: <Text style={styles.infoValue}>{orderData.order_type}</Text></Text>
        <Text style={styles.infoText}>Customer Name: <Text style={styles.infoValue}>{orderData.customer_name}</Text></Text>
        <Text style={styles.infoText}>Customer Address: <Text style={styles.infoValue}>{orderData.customer_address || 'N/A'}</Text></Text>
        <Text style={styles.infoText}>Restaurant: <Text style={styles.infoValue}>{orderData.restaurant}</Text></Text>
        <Text style={styles.infoText}>Restaurant Address: <Text style={styles.infoValue}>{orderData.restaurant_address}</Text></Text>
        <Text style={styles.infoText}>Delivery Fee: <Text style={styles.infoValue}>${orderData.delivery_fee}</Text></Text>
        <Text style={styles.infoText}>Taxes: <Text style={styles.infoValue}>${orderData.taxes}</Text></Text>
        <Text style={styles.infoText}>Subtotal: <Text style={styles.infoValue}>${orderData.subtotal}</Text></Text>
        <Text style={styles.infoText}>Tips: <Text style={styles.infoValue}>${orderData.tips}</Text></Text>
        <Text style={styles.infoText}>Total Price: <Text style={styles.infoValue}>${orderData.total_price}</Text></Text>
        <Text style={styles.infoText}>Delivery Time: <Text style={styles.infoValue}>{orderData.delivery_time ? new Date(orderData.delivery_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }) : 'N/A'}</Text></Text>
        <Text style={styles.infoText}>Pickup Time: <Text style={styles.infoValue}>{orderData.pickup_time ? new Date(orderData.pickup_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }) : 'N/A'}</Text></Text>
        <Text style={styles.infoText}>Order Created At: <Text style={styles.infoValue}>{new Date(orderData.created_at).toLocaleString()}</Text></Text>
        <Text style={styles.infoText}>Status: <Text style={styles.infoValue}>{orderData.order_status}</Text></Text>
      </View>

      <Text style={styles.itemsHeader}>Items:</Text>
      {items.length > 0 ? (
        items.map((item, index) => (
          <View key={index} style={styles.itemContainer}>
            <Text style={styles.itemText}>{item.name} - <Text style={styles.itemPrice}>${item.price}</Text></Text>
          </View>
        ))
      ) : (
        <Text style={styles.noItemsText}>No items in the order.</Text>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  infoContainer: {
    marginBottom: 20,
  },
  infoText: {
    fontSize: 16,
    marginBottom: 5,
  },
  infoValue: {
    fontWeight: 'bold',
  },
  itemsHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  itemContainer: {
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  itemText: {
    fontSize: 16,
  },
  itemPrice: {
    fontWeight: 'bold',
  },
  noItemsText: {
    fontSize: 16,
    color: 'gray',
  },
});

export default OrderStatusScreen;
