import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

const OrderSummary = ({ cart, subtotal, showDeliveryFee, deliveryFee, taxes, totalPrice }) => {
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
      <Text style={styles.subheader}>Order Summary</Text>
      {cart.map((item) => renderOrderItem(item))}
      
      <View style={styles.summaryContainer}>
        <View style={styles.summaryRow}>
          <View style={styles.priceContainer}>
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>Estimated Subtotal:</Text>
              <Text style={styles.priceValue}>${subtotal.toFixed(2)}</Text>
            </View>
            {showDeliveryFee && (
              <View style={styles.priceRow}>
                <Text style={styles.priceLabel}>Delivery Fee:</Text>
                <Text style={styles.priceValue}>${deliveryFee.toFixed(2)}</Text>
              </View>
            )}
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>Taxes (GST):</Text>
              <Text style={styles.priceValue}>${taxes.toFixed(2)}</Text>
            </View>

            {/* Estimated Total */}
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>Estimated Total:</Text>
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
