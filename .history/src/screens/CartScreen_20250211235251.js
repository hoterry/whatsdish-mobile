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
            {language === 'ZH' ? item.name_zh : item.name} {/* 根據語言顯示商品名稱 */}
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

        {/* 數量控制按鈕 */}
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
              <Ionicons name="trash-outline" size={24} color="#ff4444" /> // 顯示垃圾桶圖標
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
