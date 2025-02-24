import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, ScrollView } from 'react-native';
import { useCart } from '../context/CartContext'; // 引入 useCart
import { useNavigation, useRoute } from '@react-navigation/native'; // 引入 useNavigation 和 useRoute
import ScreenWrapper from '../components/ScreenWrapper'; // 引入 ScreenWrapper 组件

function CartScreen() {
  const { cartItems, removeFromCart, addToCart, updateQuantity, getTotalItems, getTotalPrice } = useCart();
  const navigation = useNavigation();
  const route = useRoute();
  const { restaurantId, restaurants } = route.params;  // 获取传递过来的数据

  console.log('CartScreen - restaurantId:', restaurantId); // 输出当前餐厅 ID

  const safeCart = cartItems[restaurantId] || [];
  console.log('CartScreen - safeCart:', safeCart); // 输出当前餐厅的购物车内容

  const handleIncreaseQuantity = (itemId) => {
    const item = safeCart.find(item => item.id === itemId);
    console.log('handleIncreaseQuantity - item:', item); // 输出增加数量的商品信息
    if (item) {
      addToCart(restaurantId, item, 1);
    }
  };

  const handleDecreaseQuantity = (itemId) => {
    const item = safeCart.find(item => item.id === itemId);
    console.log('handleDecreaseQuantity - item:', item); // 输出减少数量的商品信息
    if (item && item.quantity > 1) {
      updateQuantity(restaurantId, item.id, item.quantity - 1);
    }
  };

  const renderCartItem = (item) => {
    return (
      <View style={styles.cartItem} key={item.uniqueId}>
        <Image source={{ uri: item.image_url }} style={styles.cartItemImage} />
        <View style={styles.cartItemDetails}>
          <Text style={styles.cartItemName}>{item.name}</Text>
          
          {/* 显示选项/规格 */}
          {item.selectedOptions && (
            <View style={styles.optionsContainer}>
              {Object.entries(item.selectedOptions).map(([key, value]) => (
                <Text key={key} style={styles.optionText}>
                  {key}: {value}
                </Text>
              ))}
            </View>
          )}
  
          <Text style={styles.cartItemPrice}>${(item.price * item.quantity).toFixed(2)}</Text>
          
          {/* 数量调整按钮 */}
          <View style={styles.quantityContainer}>
            <TouchableOpacity onPress={() => handleDecreaseQuantity(item.uniqueId)} style={styles.quantityButton}>
              <Text style={styles.quantityButtonText}>-</Text>
            </TouchableOpacity>
            <Text style={styles.quantityText}>{item.quantity}</Text>
            <TouchableOpacity onPress={() => handleIncreaseQuantity(item.uniqueId)} style={styles.quantityButton}>
              <Text style={styles.quantityButtonText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>
  
        {/* 移除按钮 */}
        <TouchableOpacity onPress={() => removeFromCart(restaurantId, item.uniqueId)} style={styles.removeButton}>
          <Text style={styles.removeButtonText}>Remove</Text>
        </TouchableOpacity>
      </View>
    );
  };
  

  return (
    <ScreenWrapper>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.header}>Your Cart</Text>
        {safeCart.length === 0 ? (
          <Text style={styles.emptyText}>Your cart is empty</Text>
        ) : (
          safeCart.map(item => renderCartItem(item))
        )}
        {safeCart.length > 0 && (
          <View style={styles.checkoutContainer}>
            <Text style={styles.totalPrice}>
              Total: ${getTotalPrice(restaurantId).toFixed(2)}
            </Text>
            <Text style={styles.totalItems}>
              Total Items: {getTotalItems(restaurantId)}
            </Text>
            <TouchableOpacity
              style={styles.checkoutButton}
              onPress={() => {
                console.log('Checkout button pressed');
                navigation.navigate('Checkout', { restaurantId, restaurants }); // 同时传递 restaurantId 和 restaurants
              }}
            >
              <Text style={styles.checkoutButtonText}>Checkout</Text>
            </TouchableOpacity>
          </View>
        )}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => {
            console.log('Go Back button pressed');
            navigation.goBack();
          }}
        >
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#fff',
    paddingTop: 100
  },
  header: {
    fontSize: 34,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  cartItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 15,
    marginBottom: 15,
    backgroundColor: '#f8f8f8',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    alignSelf: 'stretch',
  },
  cartItemImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginRight: 15,
    marginLeft: -12
  },
  cartItemDetails: {
    flex: 1,
    justifyContent: 'center',
  },
  cartItemName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    maxWidth: '75%',
  },
  cartItemPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginVertical: 5,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },
  quantityButton: {
    backgroundColor: '#000',
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  quantityText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginHorizontal: 10,
  },
  removeButton: {
    backgroundColor: '#000',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
    alignSelf: 'center',
  },
  removeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
  checkoutContainer: {
    marginTop: 30,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    paddingTop: 20,
    alignItems: 'center',
  },
  totalPrice: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  totalItems: {
    fontSize: 16,
    color: '#333',
    marginBottom: 20,
  },
  checkoutButton: {
    backgroundColor: '#333',
    paddingVertical: 16,
    paddingHorizontal: 30,
    borderRadius: 5,
    marginBottom: 15,
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkoutButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  backButton: {
    backgroundColor: '#aaa',
    paddingVertical: 16,
    paddingHorizontal: 30,
    borderRadius: 5,
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
    justifyContent: 'center',

  },
  backButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  emptyText: {
    fontSize: 18,
    color: '#888',
    textAlign: 'center',
    marginTop: 50,
  },
});

export default CartScreen;
