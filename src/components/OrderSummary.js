import React, { useContext } from 'react';
import { View, Text, StyleSheet, Image, ScrollView } from 'react-native';
import { LanguageContext } from '../context/LanguageContext';
import { Ionicons } from '@expo/vector-icons';

const translations = {
  EN: {
    orderSummary: "Order Summary",
    estimatedSubtotal: "Subtotal",
    deliveryFee: "Delivery Fee",
    taxes: "Taxes (GST)",
    estimatedTotal: "Total",
    items: "items",
  },
  ZH: {
    orderSummary: "訂單摘要",
    estimatedSubtotal: "小計",
    deliveryFee: "配送費用",
    taxes: "稅金 (GST)",
    estimatedTotal: "總計",
    items: "項目",
  },
};

const OrderSummary = ({ 
  cart, 
  subtotal, 
  showDeliveryFee, 
  deliveryFee, 
  taxes, 
  totalPrice,
  tip = 0 
}) => {
  const { language } = useContext(LanguageContext);

  const renderOrderItem = (item) => {
    const key = item.uniqueId || `${item.name}-${item.price}-${item.quantity}`;

    if (__DEV__) {
      console.log('[Order Summary Log] Received Item:', item);
      console.log('[Order Summary Log] Received Item Selected Option:', item.selectedOption);
      console.log('[Order Summary Log] Received Item Selected Modifiers:', item.selectedModifiers);
    }

    const itemPrice = item.price || 0;
    let modifiersPrice = 0;
    
    // 計算修飾符的總價
    if (item.selectedModifiers && item.selectedModifiers.length > 0) {
      modifiersPrice = item.selectedModifiers.reduce((total, modifier) => 
        total + (modifier.price || 0), 0);
    }
    
    // 計算選項的額外價格
    const optionPrice = item.selectedOption ? (item.selectedOption.price || 0) : 0;
    
    // 計算商品總價 (基本價 + 修飾符價格 + 選項價格) × 數量
    const totalItemPrice = (itemPrice + modifiersPrice + optionPrice) * item.quantity;

    return (
      <View style={styles.orderItem} key={key}>
        <Image 
          source={{ 
            uri: item.image_url || 'https://res.cloudinary.com/dfbpwowvb/image/upload/v1740026601/WeChat_Screenshot_20250219204307_juhsxp.png'
          }} 
          style={styles.itemImage} 
          resizeMode="cover"
        />
        <View style={styles.itemInfo}>
          <View style={styles.itemNameContainer}>
            <Text style={styles.itemName} numberOfLines={1}>{item.name}</Text>
            <Text style={styles.itemQuantity}>{`x${item.quantity}`}</Text>
          </View>
  
          {item.selectedOption && (
            <View style={styles.optionContainer}>
              <Text style={styles.optionText} numberOfLines={1}>
                {item.selectedOption.name}
                {item.selectedOption.price > 0 && ` (+$${(item.selectedOption.price).toFixed(2)})`}
              </Text>
            </View>
          )}
  
          {item.selectedModifiers && item.selectedModifiers.length > 0 && (
            <View style={styles.modifierContainer}>
              {item.selectedModifiers.map((modifier, index) => (
                <Text key={index} style={styles.modifierText} numberOfLines={1}>
                  {modifier.name}
                  {modifier.price > 0 && ` (+$${(modifier.price).toFixed(2)})`}
                </Text>
              ))}
            </View>
          )}
        </View>
        <Text style={styles.itemPrice}>${totalItemPrice.toFixed(2)}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.header}>{translations[language].orderSummary}</Text>
        <Text style={styles.itemCount}>{cart.length} {translations[language].items}</Text>
      </View>

      <View style={styles.itemsContainer}>
        {cart.map((item) => renderOrderItem(item))}
      </View>
      
      <View style={styles.summaryContainer}>
        <View style={styles.priceRow}>
          <Text style={styles.priceLabel}>{translations[language].estimatedSubtotal}</Text>
          <Text style={styles.priceValue}>${subtotal.toFixed(2)}</Text>
        </View>
        
        {showDeliveryFee && (
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>{translations[language].deliveryFee}</Text>
            <Text style={styles.priceValue}>${deliveryFee.toFixed(2)}</Text>
          </View>
        )}
        
        {tip > 0 && (
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Tip</Text>
            <Text style={styles.priceValue}>${tip.toFixed(2)}</Text>
          </View>
        )}
        
        <View style={styles.priceRow}>
          <Text style={styles.priceLabel}>{translations[language].taxes}</Text>
          <Text style={styles.priceValue}>${taxes.toFixed(2)}</Text>
        </View>

        <View style={styles.divider} />
        
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>{translations[language].estimatedTotal}</Text>
          <Text style={styles.totalPrice}>${totalPrice.toFixed(2)}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  header: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333333',
  },
  itemCount: {
    fontSize: 14,
    color: '#777777',
  },
  itemsContainer: {
    marginBottom: 20,
  },
  orderItem: {
    flexDirection: 'row',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  itemImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
    backgroundColor: '#F5F5F5',
  },
  itemInfo: {
    flex: 1,
    justifyContent: 'center',
    marginRight: 8,
  },
  itemNameContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333333',
    flex: 1,
    marginRight: 8,
  },
  itemQuantity: {
    fontSize: 16,
    fontWeight: '500',
    color: '#555555',
  },
  optionContainer: {
    marginTop: 2,
  },
  optionText: {
    fontSize: 14,
    color: '#666666',
  },
  modifierContainer: {
    marginTop: 2,
  },
  modifierText: {
    fontSize: 14,
    color: '#666666',
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    minWidth: 50,
    textAlign: 'right',
    alignSelf: 'center',
  },
  summaryContainer: {
    paddingTop: 16,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  priceLabel: {
    fontSize: 15,
    color: '#666666',
  },
  priceValue: {
    fontSize: 15,
    fontWeight: '500',
    color: '#333333',
  },
  divider: {
    height: 1,
    backgroundColor: '#EEEEEE',
    marginVertical: 12,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
  },
  totalPrice: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000000',
  },
});

export default OrderSummary;