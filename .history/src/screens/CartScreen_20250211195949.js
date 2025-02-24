import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, ScrollView } from 'react-native';
import { useCart } from '../context/CartContext';
import { useNavigation, useRoute } from '@react-navigation/native';
import ScreenWrapper from '../components/ScreenWrapper';
import { useLanguage } from '../context/LanguageContext';  // 引入语言上下文

function CartScreen() {
  const { cartItems, removeFromCart, addToCart, updateQuantity, getTotalItems, getTotalPrice } = useCart();
  const { language } = useLanguage();  // 获取当前语言
  const navigation = useNavigation();
  const route = useRoute();
  const { restaurantId, restaurants } = route.params;

  const safeCart = cartItems[restaurantId] || [];

  const handleIncreaseQuantity = (uniqueId) => {
    const item = safeCart.find(item => item.uniqueId === uniqueId);
    if (item) {
      addToCart(restaurantId, item, 1);
    }
  };

  const handleDecreaseQuantity = (uniqueId) => {
    const item = safeCart.find(item => item.uniqueId === uniqueId);
    if (item && item.quantity > 1) {
      updateQuantity(restaurantId, item.uniqueId, item.quantity - 1);
    }
  };

  const renderCartItem = (item) => {
    const key = item.uniqueId || `${item.name}-${item.price}-${item.quantity}`;
  
    return (
      <View style={styles.cartItem} key={key}>
        <Image source={{ uri: item.image_url }} style={styles.cartItemImage} />
        <View style={styles.cartItemDetails}>
          <Text style={styles.cartItemName}>{item.name}</Text>

          {item.selectedOption && (
            <View style={styles.selectedOptionContainer}>
              <Text style={styles.selectedOptionTitle}>{language === 'en' ? 'Size:' : '尺寸:'}</Text>
              <Text style={styles.selectedOptionText}>
                {item.selectedOption.name} (${item.selectedOption.price})
              </Text>
            </View>
          )}

          {item.selectedModifiers && item.selectedModifiers.length > 0 && (
            <View style={styles.modifiersContainer}>
              <Text style={styles.modifiersTitle}>{language === 'en' ? 'Modifiers:' : '附加选项:'}</Text>
              {item.selectedModifiers.map((modifier, index) => (
                <Text key={index} style={styles.modifierText}>
                  {modifier.name} (+${modifier.price})
                </Text>
              ))}
            </View>
          )}

          <Text style={styles.cartItemPrice}>${(item.price * item.quantity).toFixed(2)}</Text>

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

        <TouchableOpacity onPress={() => removeFromCart(restaurantId, item.uniqueId)} style={styles.removeButton}>
          <Text style={styles.removeButtonText}>{language === 'en' ? 'Remove' : '移除'}</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <ScreenWrapper>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.header}>{language === 'en' ? 'Your Cart' : '购物车'}</Text>
        {safeCart.length === 0 ? (
          <Text style={styles.emptyText}>{language === 'en' ? 'Your cart is empty' : '购物车为空'}</Text>
        ) : (
          safeCart.map(item => renderCartItem(item))
        )}
        {safeCart.length > 0 && (
          <View style={styles.checkoutContainer}>
            <Text style={styles.totalPrice}>
              {language === 'en' ? 'Total: ' : '总计: '}${getTotalPrice(restaurantId).toFixed(2)}
            </Text>
            <Text style={styles.totalItems}>
              {language === 'en' ? 'Total Items: ' : '总商品数: '}{getTotalItems(restaurantId)}
            </Text>
            <TouchableOpacity
              style={styles.checkoutButton}
              onPress={() => navigation.navigate('Checkout', { restaurantId, restaurants, cartItems: safeCart })}
            >
              <Text style={styles.checkoutButtonText}>{language === 'en' ? 'Checkout' : '结账'}</Text>
            </TouchableOpacity>
          </View>
        )}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>{language === 'en' ? 'Go Back' : '返回'}</Text>
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
    backgroundColor: '#fff',
    borderRadius: 10,
    alignSelf: 'stretch',
  },
  cartItemImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginRight: 15,
    marginLeft: -12
  },
  cartItemDetails: {
    flex: 1,
    justifyContent: 'center',
  },
  cartItemName: {
    fontSize: 12,
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
  optionsContainer: {
    marginTop: 8,
  },
  optionsTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  optionText: {
    fontSize: 12,
    color: '#666',
  },
  modifiersContainer: {
    marginTop: 8,
  },
  modifiersTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  modifierText: {
    fontSize: 12,
    color: '#666',
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
