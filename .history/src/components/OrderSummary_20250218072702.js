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
  const { language } = useContext(LanguageContext); // 取得當前語言

  const renderOrderItem = (item) => (
    <View style={styles.orderItem} key={item.uniqueId}>
      <Image source={{ uri: item.image_url }} style={styles.itemImage} />
      <View style={styles.itemInfo}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemQuantity}>{`x${item.quantity}`}</Text>
      </View>
      <Text style={styles.itemPrice}>${item.price.toFixed(2)}</Text>
    </View>
  );

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

            {/* Estimated Total */}
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>{translations[language].estimatedTotal}</Text>
              <Text style={styles.totalPrice}>${totalPrice.toFixed(2)}</Text>
            </View>

            {/* 分隔線 */}
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
