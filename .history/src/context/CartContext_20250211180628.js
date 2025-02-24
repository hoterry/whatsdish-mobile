import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, ScrollView } from 'react-native';
import { useCart } from '../context/CartContext';
import { useNavigation, useRoute } from '@react-navigation/native';
import ScreenWrapper from '../components/ScreenWrapper';

function CartScreen() {
  const { cartItems, removeFromCart, addToCart, updateQuantity, getTotalItems, getTotalPrice } = useCart();
  const navigation = useNavigation();
  const route = useRoute();
  const { restaurantId, restaurants } = route.params;

  const safeCart = cartItems[restaurantId] || [];

  const handleIncreaseQuantity = (itemId) => {
    const item = safeCart.find(item => item.id === itemId);
    if (item) {
      addToCart(restaurantId, item, 1);
    }
  };

  const handleDecreaseQuantity = (itemId) => {
    const item = safeCart.find(item => item.id === itemId);
    if (item && item.quantity > 1) {
      updateQuantity(restaurantId, item.id, item.quantity - 1);
    }
  };

  const renderCartItem = (item) => {
    return (
      <View style={styles.cartItem} key={item.id}>
        <Image source={{ uri: item.image_url }} style={styles.cartItemImage} />
        <View style={styles.cartItemDetails}>
          <Text style={styles.cartItemName}>{item.name}</Text>
          {item.options && item.options.length > 0 && (
            <View style={styles.optionsContainer}>
              <Text style={styles.optionsTitle}>Options:</Text>
              {item.options.map((option, index) => (
                <Text key={index} style={styles.optionText}>
                  {option.name} (${option.price})
                </Text>
              ))}
            </View>
          )}
          {item.modifiers && item.modifiers.length > 0 && (
            <View style={styles.modifiersContainer}>
              <Text style={styles.modifiersTitle}>Modifiers:</Text>
              {item.modifiers.map((modifier, index) => (
                <Text key={index} style={styles.modifierText}>
                  {modifier.name} (${modifier.price})
                </Text>
              ))}
            </View>
          )}
          <Text style={styles.cartItemPrice}>${(item.price * item.quantity).toFixed(2)}</Text>
          <View style={styles.quantityContainer}>
            <TouchableOpacity onPress={() => handleDecreaseQuantity(item.id)} style={styles.quantityButton}>
              <Text style={styles.quantityButtonText}>-</Text>
            </TouchableOpacity>
            <Text style={styles.quantityText}>{item.quantity}</Text>
            <TouchableOpacity onPress={() => handleIncreaseQuantity(item.id)} style={styles.quantityButton}>
              <Text style={styles.quantityButtonText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>
        <TouchableOpacity onPress={() => removeFromCart(restaurantId, item.id)} style={styles.removeButton}>
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
              onPress={() => navigation.navigate('Checkout', { restaurantId, restaurants })}
            >
              <Text style={styles.checkoutButtonText}>Checkout</Text>
            </TouchableOpacity>
          </View>
        )}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#555',
  },
  cartItem: {
    flexDirection: 'row',
    marginBottom: 20,
    alignItems: 'center',
  },
  cartItemImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginRight: 15,
  },
  cartItemDetails: {
    flex: 1,
  },
  cartItemName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  cartItemPrice: {
    fontSize: 16,
    color: '#000',
    marginTop: 5,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  quantityButton: {
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 5,
  },
  quantityButtonText: {
    fontSize: 18,
  },
  quantityText: {
    fontSize: 18,
    marginHorizontal: 10,
  },
  removeButton: {
    backgroundColor: '#ff4444',
    padding: 10,
    borderRadius: 5,
  },
  removeButtonText: {
    color: '#fff',
    fontSize: 14,
  },
  optionsContainer: {
    marginTop: 10,
  },
  optionsTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#555',
  },
  optionText: {
    fontSize: 14,
    color: '#555',
  },
  modifiersContainer: {
    marginTop: 10,
  },
  modifiersTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#555',
  },
  modifierText: {
    fontSize: 14,
    color: '#555',
  },
  checkoutContainer: {
    marginTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    paddingTop: 20,
  },
  totalPrice: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  totalItems: {
    fontSize: 16,
    color: '#555',
    marginBottom: 20,
  },
  checkoutButton: {
    backgroundColor: '#000',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  checkoutButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  backButton: {
    backgroundColor: '#ccc',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  backButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default CartScreen;