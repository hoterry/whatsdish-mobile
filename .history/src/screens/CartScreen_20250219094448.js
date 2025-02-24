import React, { useContext, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, ScrollView } from 'react-native';
import { useCart } from '../context/CartContext';
import { useNavigation, useRoute } from '@react-navigation/native';
import { LanguageContext } from '../context/LanguageContext';
import { Ionicons } from '@expo/vector-icons'; // 引入圖標庫

function CartScreen({ route }) {
  const { cartItems, removeFromCart, addToCart, updateQuantity, getTotalItems, getTotalPrice } = useCart();
  const navigation = useNavigation();
  const { restaurantId, restaurants } = route.params;
  const { language } = useContext(LanguageContext);
  const safeCart = cartItems[restaurantId] || [];

  useEffect(() => {
  }, [language]);

  useEffect(() => {
    console.log("🏪 CartScreen restaurantId:", restaurantId); // 確認 restaurantId 是否傳遞過來
  }, [restaurantId]);

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
    console.log('Item:', item);
    console.log('Selected Option:', item.selectedOption);
    console.log('Selected Modifiers:', item.selectedModifiers);
  
    // 使用 item.price 作為最終價格
    const totalPrice = item.price * item.quantity; // 這裡直接使用 item.price，因為它已經包含了選項和修飾符的價格
  
    return (
      <View style={styles.cartItem} key={key}>
        <Image source={{ uri: item.image_url }} style={styles.cartItemImage} />
        <View style={styles.cartItemDetails}>
          <Text style={styles.cartItemName}>
            {language === 'ZH' ? item.name_zh : item.name}
          </Text>
  
          {item.selectedOption && (
            <View style={styles.selectedOptionContainer}>
              <Text style={styles.selectedOptionText}>
                {language === 'ZH'
                  ? (item.selectedOption.name_zh || item.selectedOption.name)
                  : item.selectedOption.name}
                {item.selectedOption.price ? ` ($${(item.selectedOption.price / 100).toFixed(2)})` : ''}
              </Text>
            </View>
          )}
  
          {item.selectedModifiers && item.selectedModifiers.length > 0 && (
            <View style={styles.modifiersContainer}>
              {item.selectedModifiers.map((modifier, index) => (
                <Text key={index} style={styles.modifierText}>
                  {language === 'ZH' ? modifier.name_zh : modifier.name} (+${(modifier.price / 100).toFixed(2)})
                </Text>
              ))}
            </View>
          )}
  
          <Text style={styles.cartItemPrice}>${totalPrice.toFixed(2)}</Text>
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
              <Ionicons name="trash-outline" size={16} color="#1238" /> // 顯示垃圾桶圖標
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
    <View style={styles.mainContainer}>
      {/* 返回按鈕 */}
      <TouchableOpacity
        style={styles.backIcon}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="arrow-back" size={24} color="#000" />
      </TouchableOpacity>

      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.header}>{language === 'ZH' ? '購物車' : 'Your Cart'}</Text>
        {safeCart.length === 0 ? (
          <Text style={styles.emptyText}>{language === 'ZH' ? '您的購物車為空' : 'Your cart is empty'}</Text>
        ) : (
          safeCart.map((item) => renderCartItem(item))
        )}
        {safeCart.length > 0 && (
          <View style={styles.checkoutContainer}>
            <View style={styles.subtotalContainer}>
              <Text style={styles.subtotalText}>
                {language === 'ZH' ? '小計' : 'Subtotal'}
              </Text>
              <Text style={styles.subtotalPrice}>
                ${getTotalPrice(restaurantId).toFixed(2)}
              </Text>
            </View>
            <TouchableOpacity
              style={styles.checkoutButton}
              onPress={() => navigation.navigate('Checkout', { restaurantId, restaurants, cartItems: safeCart })}
            >
              <Text style={styles.checkoutButtonText}>{language === 'ZH' ? '結算' : 'Checkout'}</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </View>
  );
}



const styles = StyleSheet.create({
  mainContainer: {
    flex: 1, // 確保填滿整個螢幕
    backgroundColor: '#fff',
    paddingTop: 50,
  },
  container: {
    flexGrow: 1, // 確保內容可以擴展
    padding: 16,
    paddingTop: 60, // 為返回圖標留出空間
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 36,
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
    fontSize: 16,
    fontWeight: 'bold',
    maxWidth: 200,
  },
  selectedOptionContainer: {
    marginTop: 4,
  },
  selectedOptionText: {
    fontSize: 14,
    color: '#666',
  },
  modifiersContainer: {
    marginTop: 4,
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
    paddingVertical: 0,
  },
  quantityButton: {
    padding: 8,
    minWidth: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantityButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  quantityText: {
    marginHorizontal: 5,
    fontSize: 16,
    fontWeight: '500',
  },
  checkoutContainer: {
    marginTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    paddingTop: 16,
  },
  subtotalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between', // 將文字和價格分開
    alignItems: 'center',
    marginBottom: 16,
  },
  subtotalText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  subtotalPrice: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  checkoutButton: {
    padding: 16,
    backgroundColor: '#000',
    borderRadius: 8,
    alignItems: 'center',
  },
  checkoutButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  backIcon: {
    position: 'absolute', // 絕對定位
    top:50, // 距離頂部的距離
    left: 20, // 距離左側的距離
    zIndex: 1, // 確保圖標在最上層
  },
});

export default CartScreen;