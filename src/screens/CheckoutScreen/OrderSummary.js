import React, { useContext } from 'react';
import { View, Text, StyleSheet, Image, ScrollView } from 'react-native';
import { LanguageContext } from '../../context/LanguageContext';
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
    
    if (item.selectedModifiers && item.selectedModifiers.length > 0) {
      modifiersPrice = item.selectedModifiers.reduce((total, modifier) => {
        return total + ((modifier.price || 0) / 100);
      }, 0);
    }
    
    const optionPrice = item.selectedOption ? (item.selectedOption.price || 0) : 0;
    const totalItemPrice = (itemPrice + modifiersPrice + optionPrice) * item.quantity;

    return (
      <View style={styles.orderItem} key={key}>
        <View style={styles.imageColumn}>
          <Image 
            source={{ 
              uri: item.image_url || 'https://res.cloudinary.com/dfbpwowvb/image/upload/v1740026601/WeChat_Screenshot_20250219204307_juhsxp.png'
            }} 
            style={styles.itemImage} 
            resizeMode="cover"
          />
        </View>

        <View style={styles.contentColumn}>
          <Text style={styles.itemName} numberOfLines={1}>{item.name}</Text>
          
          {item.selectedOption && (
            <Text style={styles.optionText} numberOfLines={1}>
              {item.selectedOption.name}
              {item.selectedOption.price > 0 && ` (+$${(item.selectedOption.price).toFixed(2)})`}
            </Text>
          )}
          
          {item.selectedModifiers && item.selectedModifiers.length > 0 && (
            <View>
              {item.selectedModifiers.map((modifier, index) => {
                const displayPrice = (modifier.price || 0) / 100;
                return (
                  <Text key={index} style={styles.modifierText} numberOfLines={1}>
                    {modifier.name}
                    {modifier.price > 0 && ` (+$${displayPrice.toFixed(2)})`}
                  </Text>
                );
              })}
            </View>
          )}
        </View>

        <View style={styles.quantityColumn}>
          <Text style={styles.itemQuantity}>{`x${item.quantity}`}</Text>
        </View>

        <View style={styles.priceColumn}>
          <Text style={styles.itemPrice}>${totalItemPrice.toFixed(2)}</Text>
        </View>
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
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  itemCount: {
    fontSize: 16,
    color: '#666',
  },

  tableHeader: {
    flexDirection: 'row',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    marginBottom: 8,
  },
  columnTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#777',
  },
  itemsContainer: {
    marginBottom: 24,
  },
  orderItem: {
    flexDirection: 'row',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },

  imageColumn: {
    width: 70,
    paddingRight: 10,
  },
  contentColumn: {
    flex: 1,
    paddingRight: 10,
    justifyContent: 'center',
  },
  quantityColumn: {
    width: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  priceColumn: {
    width: 80,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  itemImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
  },
  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  optionText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  modifierText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  itemQuantity: {
    fontSize: 16,
    color: '#555',
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: '500',
  },
  summaryContainer: {
    backgroundColor: '#f9f9f9',
    padding: 16,
    borderRadius: 8,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  priceLabel: {
    fontSize: 16,
    color: '#555',
  },
  priceValue: {
    fontSize: 16,
    textAlign: 'right',
    width: 80,
  },
  divider: {
    height: 1,
    backgroundColor: '#ddd',
    marginVertical: 12,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  totalPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'right',
    width: 80,
  },
});

export default OrderSummary;