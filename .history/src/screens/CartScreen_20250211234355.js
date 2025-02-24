import React, { useContext, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, ScrollView } from 'react-native';
import { useCart } from '../context/CartContext';
import { useNavigation, useRoute } from '@react-navigation/native';
import ScreenWrapper from '../components/ScreenWrapper';
import { LanguageContext } from '../context/LanguageContext';
import { Ionicons } from '@expo/vector-icons'; // 引入圖標庫

function CartScreen() {
  const { cartItems, removeFromCart, addToCart, updateQuantity, getTotalItems, getTotalPrice } = useCart();
  const navigation = useNavigation();
  const route = useRoute();
  const { restaurantId, restaurants } = route.params;
  const { language } = useContext(LanguageContext); // 獲取當前語言

  const safeCart = cartItems[restaurantId] || [];

  // 使用 useEffect 監聽語言變化
  useEffect(() => {
    // 可以選擇在語言變化時執行某些操作，比如重新加載數據等
  }, [language]); // 當語言變化時，觸發重新渲染

  const handleIncreaseQuantity = (uniqueId) => {
    const item = safeCart.find((item) => item.uniqueId === uniqueId);
    if (item) {
      addToCart(restaurantId, item, 1);
    }
  };

  const handleDecreaseQuantity = (uniqueId) => {
    const item = safeCart.find((item) => item.uniqueId === uniqueId);
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
          <Text style={styles.cartItemName}>
            {language === 'ZH' ? item.name_zh : item.name} 
          </Text>

          {item.selectedOption && (
            <View style={styles.selectedOptionContainer}>
              <Text style={styles.selectedOptionTitle}>
                {language === 'ZH' ? '尺寸' : 'Size'}:
              </Text>
              <Text style={styles.selectedOptionText}>
                {language === 'ZH' ? item.selectedOption.name_zh : item.selectedOption.name} (${item.selectedOption.price})
              </Text>
            </View>
          )}

          {item.selectedModifiers && item.selectedModifiers.length > 0 && (
            <View style={styles.modifiersContainer}>
              <Text style={styles.modifiersTitle}>{language === 'ZH' ? '附加項目' : 'Modifiers'}:</Text>
              {item.selectedModifiers.map((modifier, index) => (
                <Text key={index} style={styles.modifierText}>
                  {language === 'ZH' ? modifier.name_zh : modifier.name} (+${modifier.price})
                </Text>
              ))}
            </View>
          )}

          <Text style={styles.cartItemPrice}>${(item.price * item.quantity).toFixed(2)}</Text>
        </View>

        <View style={styles.quantityContainer}>
          <TouchableOpacity
            onPress={() => {
              if (item.quantity > 1) {
                handleDecreaseQuantity(item.uniqueId); // 減少數量
              } else {
                removeFromCart(restaurantId, item.uniqueId); // 移除商品
              }
            }}
            style={styles.quantityButton}
          >
            {item.quantity > 1 ? (
              <Text style={styles.quantityButtonText}>-</Text> // 顯示減號
            ) : (
              <Ionicons name="trash-outline" size={16} color="#ff4444" /> // 顯示垃圾桶圖標
            )}
          </TouchableOpacity>

          <Text style={styles.quantityText}>{item.quantity}</Text>

          <TouchableOpacity
            onPress={() => handleIncreaseQuantity(item.uniqueId)}
            style={styles.quantityButton}
          >
            <Text style={styles.quantityButtonText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <ScreenWrapper>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.header}>{language === 'ZH' ? '購物車' : 'Your Cart'}</Text>
        {safeCart.length === 0 ? (
          <Text style={styles.emptyText}>{language === 'ZH' ? '您的購物車為空' : 'Your cart is empty'}</Text>
        ) : (
          safeCart.map((item) => renderCartItem(item))
        )}
        {safeCart.length > 0 && (
          <View style={styles.checkoutContainer}>
            <Text style={styles.totalPrice}>
              {language === 'ZH' ? '總計' : 'Total'}: ${getTotalPrice(restaurantId).toFixed(2)}
            </Text>
            <Text style={styles.totalItems}>
              {language === 'ZH' ? '總數' : 'Total Items'}: {getTotalItems(restaurantId)}
            </Text>
            <TouchableOpacity
              style={styles.checkoutButton}
              onPress={() => navigation.navigate('Checkout', { restaurantId, restaurants, cartItems: safeCart })}
            >
              <Text style={styles.checkoutButtonText}>{language === 'ZH' ? '結算' : 'Checkout'}</Text>
            </TouchableOpacity>
          </View>
        )}
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>{language === 'ZH' ? '返回' : 'Go Back'}</Text>
        </TouchableOpacity>
      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
  },
  cartItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  cartItemImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  cartItemDetails: {
    flex: 1,
    marginLeft: 16,
  },
  cartItemName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  selectedOptionContainer: {
    marginTop: 4,
  },
  selectedOptionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  selectedOptionText: {
    fontSize: 14,
    color: '#666',
  },
  modifiersContainer: {
    marginTop: 4,
  },
  modifiersTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  modifierText: {
    fontSize: 14,
    color: '#666',
  },
  cartItemPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 8,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  quantityButton: {
    padding: 8,
    minWidth: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantityButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  quantityText: {
    marginHorizontal: 12,
    fontSize: 16,
    fontWeight: '500',
  },
  checkoutContainer: {
    marginTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    paddingTop: 16,
  },
  totalPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'right',
  },
  totalItems: {
    fontSize: 16,
    color: '#666',
    textAlign: 'right',
  },
  checkoutButton: {
    marginTop: 16,
    padding: 16,
    backgroundColor: '#28a745',
    borderRadius: 8,
    alignItems: 'center',
  },
  checkoutButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  backButton: {
    marginTop: 16,
    padding: 16,
    backgroundColor: '#007bff',
    borderRadius: 8,
    alignItems: 'center',
  },
  backButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default CartScreen;