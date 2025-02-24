import React, { useContext } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { LanguageContext } from '../context/LanguageContext'; // 引入 LanguageContext

const translations = {
  EN: {
    orderSummary: "Order Summary",
    estimatedSubtotal: "Estimated Subtotal:",
    deliveryFee: "Delivery Fee:",
    taxes: "Taxes (GST):",
    estimatedTotal: "Estimated Total:",
  },
  ZH: {
    orderSummary: "訂單摘要",
    estimatedSubtotal: "預估小計:",
    deliveryFee: "配送費用:",
    taxes: "稅金 (GST):",
    estimatedTotal: "預估總計:",
  },
};

const OrderSummary = ({ cart, subtotal, showDeliveryFee, deliveryFee, taxes, totalPrice }) => {
  const { language } = useContext(LanguageContext); 

  const renderOrderItem = (item) => {
    const key = item.uniqueId || `${item.name}-${item.price}-${item.quantity}`;

    if (__DEV__) {  // Log in development mode only
      console.log('[Order Summary Log] Revceived Item:', item);
      console.log('[Order Summary Log] Selected Option:', item.selectedOption);
      console.log('[Order Summary Log] Selected Modifiers:', item.selectedModifiers);
    }

    const totalPrice = item.price * item.quantity;

  
    return (
      <View style={styles.orderItem} key={key}>
        <Image source={{ uri: item.image_url }} style={styles.itemImage} />
        <View style={styles.itemInfo}>
          <Text style={styles.itemName}>{language === 'ZH' ? item.name_zh : item.name}</Text>
          <Text style={styles.itemQuantity}>{`x${item.quantity}`}</Text>
  
          {item.selectedOption && (
            <View style={styles.optionContainer}>
              <Text style={styles.optionText}>{`${language === 'ZH' ? item.selectedOption.name_zh : item.selectedOption.name}`}</Text>
              {item.selectedOption.price && (
                <Text style={styles.optionText}>+${(item.selectedOption.price / 100).toFixed(2)}</Text>
              )}
            </View>
          )}
  
          {item.selectedModifiers && item.selectedModifiers.length > 0 && (
            <View style={styles.modifierContainer}>
              {item.selectedModifiers.map((modifier, index) => (
                <Text key={index} style={styles.modifierText}>
                  {language === 'ZH' ? modifier.name_zh : modifier.name} (+${(modifier.price / 100).toFixed(2)})
                </Text>
              ))}
            </View>
          )}
        </View>
        <Text style={styles.itemPrice}>${totalPrice.toFixed(2)}</Text>
      </View>
    );
  };
  

  return (
    <View>
      <Text style={styles.subheader}>{translations[language].orderSummary}</Text>
      {cart.map((item) => renderOrderItem(item))}
      
      <View style={styles.summaryContainer}>
        <View style={styles.summaryRow}>
          <View style={styles.priceContainer}>
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
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>{translations[language].taxes}</Text>
              <Text style={styles.priceValue}>${taxes.toFixed(2)}</Text>
            </View>

            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>{translations[language].estimatedTotal}</Text>
              <Text style={styles.totalPrice}>${totalPrice.toFixed(2)}</Text>
            </View>

            <View style={styles.divider} />
          </View>
        </View>
      </View>
    </View>
  );
};


const styles = StyleSheet.create({
  subheader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  summaryContainer: {
    marginTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    paddingTop: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  priceContainer: {
    width: '100%',
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  priceLabel: {
    fontSize: 16,
    color: '#666',
  },
  priceValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  totalPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  divider: {
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    marginBottom: 10
  },
  orderItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },
  itemImage: {
    width: 60,
    height: 60,
    marginRight: 10,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    maxWidth: 220,
  },
  itemQuantity: {
    fontSize: 18,
    color: '#777',
  },
  itemPrice: {
    fontSize: 16,
  },
});

export default OrderSummary;
