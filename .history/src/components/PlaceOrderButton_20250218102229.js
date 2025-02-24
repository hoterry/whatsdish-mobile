import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useSupabase } from '../../supabase';  // 假設你有一個用於與 Supabase 交互的 hook

const PlaceOrderButton = ({
  orderData,
  clearCart,
  language
}) => {
  const navigation = useNavigation();
  const { supabase } = useSupabase();  // 假設你有一個 hook 用來訪問 supabase
  const [loading, setLoading] = React.useState(false);

  const handlePlaceOrder = async () => {
    setLoading(true);
    
    try {
      // 插入訂單數據到 Supabase
      const { data, error } = await supabase
        .from('orders')  // 假設表名是 'orders'
        .insert([
          {
            restaurant_id: orderData.restaurantId,
            items: orderData.items,
            total_price: orderData.totalPrice,
            delivery_method: orderData.deliveryMethod,
            delivery_option: orderData.deliveryOption,
            delivery_scheduled_time: orderData.deliveryScheduledTime,
            pickup_option: orderData.pickupOption,
            pickup_scheduled_time: orderData.pickupScheduledTime,
            address: orderData.address,
            tip: orderData.tip,
            payment: orderData.payment,
            order_time: orderData.orderTime,
          }
        ]);

      if (error) {
        throw new Error(error.message);
      }

      // 清空購物車
      clearCart();

      // 訂單成功後跳轉到訂單歷史頁面
      navigation.navigate('HomeTabs', {
        screen: 'Orders',
        params: { order: orderData },
      });
    } catch (error) {
      console.error('Error placing order:', error);
      // 顯示錯誤提示
    } finally {
      setLoading(false);
    }
  };

  return (
    <TouchableOpacity
      style={styles.placeOrderButton}
      onPress={handlePlaceOrder}
      disabled={loading}
    >
      {loading ? (
        <Text style={styles.placeOrderText}>
          {language === 'ZH' ? '提交中...' : 'Submitting...'}
        </Text>
      ) : (
        <Text style={styles.placeOrderText}>
          {language === 'ZH' ? '確認下單' : 'Place Order'}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  placeOrderButton: {
    backgroundColor: '#f15a29',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeOrderText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default PlaceOrderButton;
