
import React, { useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, BackHandler } from 'react-native';
import { useCart } from '../context/CartContext';

const OrderConfirmationScreen = ({ navigation }) => {
  const { cartItems } = useCart();

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + item.price, 0).toFixed(2);
  };


  useEffect(() => {
    const backAction = () => {
      return true; 
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);

    return () => {
      backHandler.remove();
    };
  }, []);

  const handlePlaceOrder = () => {
    alert('Order placed successfully!');
    
    // 使用 navigation.reset() 重置导航堆栈并跳转到首页
    navigation.reset({
      index: 0, // 设置新的堆栈中的第一个页面
      routes: [{ name: 'Home' }], // 目标路由为 Home
    });

    // 禁用返回按钮
    navigation.setOptions({ headerLeft: () => null });
  };

  return (
    <View style={styles.container}>
      {cartItems.length === 0 ? (
        <Text style={styles.emptyCartText}>No items in your order!</Text>
      ) : (
        <>
          <Text style={styles.header}>Order Confirmation</Text>
          <FlatList
            data={cartItems}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <View style={styles.orderItem}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemPrice}>${item.price.toFixed(2)}</Text>
              </View>
            )}
          />
          <Text style={styles.totalText}>Total: ${calculateTotal()}</Text>
          <TouchableOpacity
            style={styles.confirmButton}
            onPress={handlePlaceOrder} // 调用 handlePlaceOrder 函数
          >
            <Text style={styles.confirmText}>Place Order</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  emptyCartText: {
    fontSize: 18,
    textAlign: 'center',
    color: '#666',
  },
  orderItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
    marginBottom: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
    elevation: 3,
  },
  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  itemPrice: {
    fontSize: 16,
    color: '#666',
  },
  totalText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'right',
    marginTop: 20,
  },
  confirmButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 15,
    borderRadius: 10,
    marginTop: 20,
    alignItems: 'center',
  },
  confirmText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default OrderConfirmationScreen;

