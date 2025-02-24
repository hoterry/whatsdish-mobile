import React, { useContext, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, ScrollView } from 'react-native';
import { useCart } from '../context/CartContext';
import { useNavigation, useRoute } from '@react-navigation/native';
import ScreenWrapper from '../components/ScreenWrapper';
import { LanguageContext } from '../context/LanguageContext';  // 引入 LanguageContext


function CartScreen() {
  const { cartItems, removeFromCart, addToCart, updateQuantity, getTotalItems, getTotalPrice } = useCart();
  const navigation = useNavigation();
  const route = useRoute();
  const { restaurantId, restaurants } = route.params;
  const { language } = useContext(LanguageContext);  // 获取当前语言

  const safeCart = cartItems[restaurantId] || [];

  // 使用 useEffect 监听语言变化
  useEffect(() => {
    // 可以选择在语言变化时执行某些操作，比如重新加载数据等
  }, [language]);  // 当语言变化时，触发重新渲染

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
          <Text style={styles.cartItemName}>
            {language === 'ZH' ? item.name_zh : item.name}  {/* Language conditional rendering for item name */}
          </Text>

          {item.selectedOption && (
            <View style={styles.selectedOptionContainer}>
              <Text style={styles.selectedOptionTitle}>
                {language === 'ZH' ? '尺寸' : 'Size'}:
              </Text>
              <Text style={styles.selectedOptionText}>
                {language === 'ZH' ? item.selectedOption.name_zh : item.selectedOption.name}
                (${item.selectedOption.price})
              </Text>
            </View>
          )}

          {item.selectedModifiers && item.selectedModifiers.length > 0 && (
            <View style={styles.modifiersContainer}>
              <Text style={styles.modifiersTitle}>{language === 'ZH' ? '附加项目' : 'Modifiers'}:</Text>
              {item.selectedModifiers.map((modifier, index) => (
                <Text key={index} style={styles.modifierText}>
                  {language === 'ZH' ? modifier.name_zh : modifier.name} 
                  (+${modifier.price})
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
          <Text style={styles.removeButtonText}>{language === 'ZH' ? '移除' : 'Remove'}</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <ScreenWrapper>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.header}>{language === 'ZH' ? '购物车' : 'Your Cart'}</Text>
        {safeCart.length === 0 ? (
          <Text style={styles.emptyText}>{language === 'ZH' ? '您的购物车为空' : 'Your cart is empty'}</Text>
        ) : (
          safeCart.map(item => renderCartItem(item))
        )}
        {safeCart.length > 0 && (
          <View style={styles.checkoutContainer}>
            <Text style={styles.totalPrice}>
              {language === 'ZH' ? '总计' : 'Total'}: ${getTotalPrice(restaurantId).toFixed(2)}
            </Text>
            <Text style={styles.totalItems}>
              {language === 'ZH' ? '总数' : 'Total Items'}: {getTotalItems(restaurantId)}
            </Text>
            <TouchableOpacity
              style={styles.checkoutButton}
              onPress={() => navigation.navigate('Checkout', { restaurantId, restaurants, cartItems: safeCart })}
            >
              <Text style={styles.checkoutButtonText}>{language === 'ZH' ? '结算' : 'Checkout'}</Text>
            </TouchableOpacity>
          </View>
        )}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>{language === 'ZH' ? '返回' : 'Go Back'}</Text>
        </TouchableOpacity>
      </ScrollView>
    </ScreenWrapper>
  );
}
以下是根據你的需求修改後的 CartScreen 代碼，實現了以下功能：

移除獨立的 Remove 按鈕

將數量控制按鈕（+/-）移動到原本 Remove 按鈕的位置

當數量為 1 時，左側按鈕顯示垃圾桶圖標，點擊後移除該商品

當數量大於 1 時，左側按鈕顯示 -，點擊後減少數量

以下是完整的修改後代碼：

修改後的 CartScreen 代碼
javascript
Copy
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
