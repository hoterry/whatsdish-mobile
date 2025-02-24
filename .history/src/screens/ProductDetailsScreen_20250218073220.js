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

  const renderOrderItem = (item) => {
    // 處理 options 和 modifiers 的中文或英文顯示
    const options = item.option_groups
      ? item.option_groups.flatMap(group =>
          group.options.map(option => ({
            id: option.id,
            name: language === 'ZH' ? option.name_zh : option.name,
            price: option.price,
          }))
        )
      : [];

    const modifiers = (item.modifier_groups || []).flatMap(group =>
      group.modifier_items
        ? group.modifier_items.map(modifier => ({
            id: modifier.id,
            name: language === 'ZH' ? modifier.name_zh : modifier.name,
            price: modifier.price,
          }))
        : []
    );

    return (
      <View style={styles.orderItem} key={item.uniqueId}>
        <Image source={{ uri: item.image_url }} style={styles.itemImage} />
        <View style={styles.itemInfo}>
          <Text style={styles.itemName}>{item.name}</Text>
          <Text style={styles.itemQuantity}>{`x${item.quantity}`}</Text>
          {/* 渲染選項和修飾符 */}
          {options.length > 0 && (
            <View style={styles.optionContainer}>
              {options.map(option => (
                <Text key={option.id} style={styles.optionText}>{`${option.name}: $${option.price.toFixed(2)}`}</Text>
              ))}
            </View>
          )}
          {modifiers.length > 0 && (
            <View style={styles.modifierContainer}>
              {modifiers.map(modifier => (
                <Text key={modifier.id} style={styles.modifierText}>{`${modifier.name}: $${modifier.price.toFixed(2)}`}</Text>
              ))}
            </View>
          )}
        </View>
        <Text style={styles.itemPrice}>${item.price.toFixed(2)}</Text>
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
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: "#fff",
    paddingTop: 50,
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 10,
  },
  largeImage: {
    width: '100%',
    height: 300,
    borderRadius: 10,
    marginBottom: 30,
    padding: 20,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: '#555',
    marginBottom: 20,
  },
  price: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  separator: {
    borderBottomWidth: 1, // 設置為 2 讓它更粗
    borderBottomColor: '#999', // 設置顏色，可以根據需求改變
    marginVertical: 15, // 調整上下間距
  },
  optionsContainer: {
    marginBottom: 30,
  },
  noteInput: {
    height: 80,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    marginTop: 12,
    marginBottom: 24,
    backgroundColor: '#fff',
    textAlignVertical: 'top', 
  },  
  optionsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  optionText: {
    fontSize: 16,
    flex: 1, // Ensures text is aligned to the left
    maxWidth: 350
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#888',
    backgroundColor: 'white',
  },
  selectedRadio: {
    backgroundColor: '#000', // Green when selected
  },
  selectedOption: {
   
  },
  modifiersContainer: {
    marginBottom: 30,
  },
  modifiersTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  specialInstructionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  addToCartButton: {
    padding: 15,
    backgroundColor: '#000',
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 50
  },
  addToCartButtonText: {
    fontSize: 18,
    color: 'white',
    fontWeight: 'bold',
  },
});

export default ProductDetailScreen;
