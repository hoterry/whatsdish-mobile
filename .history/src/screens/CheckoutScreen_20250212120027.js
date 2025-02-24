import React, { useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, ScrollView } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { LanguageContext } from '../context/LanguageContext';
import { Ionicons } from '@expo/vector-icons'; // 引入圖標庫

function CheckoutScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { restaurantId, restaurants, cartItems } = route.params;
  const { language } = useContext(LanguageContext);

  // 計算總金額
  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);
  };

  // 渲染購物車商品
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
              <Text style={styles.selectedOptionText}>
                {language === 'ZH' ? item.selectedOption.name_zh : item.selectedOption.name} (${item.selectedOption.price})
              </Text>
            </View>
          )}

          {item.selectedModifiers && item.selectedModifiers.length > 0 && (
            <View style={styles.modifiersContainer}>
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
          <Text style={styles.quantityText}>{item.quantity}</Text>
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
        <Text style={styles.header}>{language === 'ZH' ? '結算' : 'Checkout'}</Text>

        {/* 購物車商品列表 */}
        {cartItems.length === 0 ? (
          <Text style={styles.emptyText}>{language === 'ZH' ? '您的購物車為空' : 'Your cart is empty'}</Text>
        ) : (
          cartItems.map((item) => renderCartItem(item))
        )}

        {/* 總金額 */}
        {cartItems.length > 0 && (
          <View style={styles.checkoutContainer}>
            <View style={styles.subtotalContainer}>
              <Text style={styles.subtotalText}>
                {language === 'ZH' ? '總計' : 'Total'}
              </Text>
              <Text style={styles.subtotalPrice}>
                ${getTotalPrice()}
              </Text>
            </View>

            {/* 結算按鈕 */}
            <TouchableOpacity
              style={styles.checkoutButton}
              onPress={() => {
                // 這裡可以添加結算邏輯，例如跳轉到付款頁面
                alert(language === 'ZH' ? '結算成功！' : 'Checkout successful!');
                navigation.navigate('Home'); // 結算後返回首頁
              }}
            >
              <Text style={styles.checkoutButtonText}>{language === 'ZH' ? '確認結算' : 'Confirm Checkout'}</Text>
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
    paddingTop: 70,
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
    textAlign: 'center', // 標題居中
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center', // 文字居中
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
    top: 80, // 距離頂部的距離
    left: 16, // 距離左側的距離
    zIndex: 1, // 確保圖標在最上層
  },
});

export default CheckoutScreen;