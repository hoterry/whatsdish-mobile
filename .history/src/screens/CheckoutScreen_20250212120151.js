import React, { useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useCart } from '../context/CartContext';
import { useNavigation, useRoute } from '@react-navigation/native';
import { LanguageContext } from '../context/LanguageContext';
import { Ionicons } from '@expo/vector-icons';

function CheckoutScreen() {
  const { cartItems, getTotalPrice, getTotalItems, removeFromCart } = useCart();
  const navigation = useNavigation();
  const route = useRoute();
  const { restaurantId, restaurants, cartItems: safeCart } = route.params;
  const { language } = useContext(LanguageContext);

  const totalPrice = getTotalPrice(restaurantId);
  const totalItems = getTotalItems(restaurantId);

  const handleConfirmOrder = () => {
    // 在這裡處理訂單確認邏輯，比如提交到服務器等
    alert(language === 'ZH' ? '訂單已確認！' : 'Order Confirmed!');
    navigation.goBack(); // 返回到上一頁
  };

  return (
    <View style={styles.mainContainer}>
      <TouchableOpacity
        style={styles.backIcon}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="arrow-back" size={24} color="#000" />
      </TouchableOpacity>

      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.header}>
          {language === 'ZH' ? '結算' : 'Checkout'}
        </Text>

        {safeCart.length === 0 ? (
          <Text style={styles.emptyText}>
            {language === 'ZH' ? '您的購物車為空' : 'Your cart is empty'}
          </Text>
        ) : (
          <>
            <View style={styles.cartDetails}>
              <Text style={styles.cartSummary}>
                {language === 'ZH' ? '訂單詳情' : 'Order Details'}
              </Text>
              {safeCart.map((item) => (
                <View key={item.uniqueId} style={styles.cartItem}>
                  <Text style={styles.cartItemName}>
                    {language === 'ZH' ? item.name_zh : item.name}
                  </Text>
                  <Text style={styles.cartItemQuantity}>
                    {item.quantity} x ${item.price.toFixed(2)}
                  </Text>
                  {item.selectedOption && (
                    <Text style={styles.selectedOptionText}>
                      {language === 'ZH' ? item.selectedOption.name_zh : item.selectedOption.name} 
                      (${item.selectedOption.price})
                    </Text>
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
                </View>
              ))}
            </View>

            <View style={styles.totalContainer}>
              <Text style={styles.totalText}>
                {language === 'ZH' ? '總計' : 'Total'}
              </Text>
              <Text style={styles.totalPrice}>${totalPrice.toFixed(2)}</Text>
            </View>

            <TouchableOpacity
              style={styles.confirmButton}
              onPress={handleConfirmOrder}
            >
              <Text style={styles.confirmButtonText}>
                {language === 'ZH' ? '確認訂單' : 'Confirm Order'}
              </Text>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  backIcon: {
    padding: 10,
    marginTop: 20,
    marginLeft: 10,
  },
  container: {
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 18,
    color: '#888',
  },
  cartDetails: {
    marginBottom: 20,
  },
  cartSummary: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  cartItem: {
    marginBottom: 15,
  },
  cartItemName: {
    fontSize: 16,
  },
  cartItemQuantity: {
    fontSize: 14,
    color: '#555',
  },
  selectedOptionText: {
    fontSize: 14,
    color: '#555',
  },
  modifiersContainer: {
    marginLeft: 10,
  },
  modifierText: {
    fontSize: 12,
    color: '#555',
  },
  totalContainer: {
    marginTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    paddingTop: 10,
  },
  totalText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  totalPrice: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#000',
    marginTop: 10,
  },
  confirmButton: {
    backgroundColor: '#28a745',
    paddingVertical: 15,
    borderRadius: 5,
    marginTop: 30,
    alignItems: 'center',
  },
  confirmButtonText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default CheckoutScreen;
