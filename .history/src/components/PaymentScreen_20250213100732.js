import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const PaymentScreen = ({ onClose, onSaveCard }) => {
  const [cardNumber, setCardNumber] = useState('');
  const [expirationDate, setExpirationDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [postalCode, setPostalCode] = useState('');

  const handleCardNumberChange = (text) => {
    const formattedText = text
      .replace(/\D/g, '')
      .replace(/(.{4})/g, '$1 ')
      .trim();
    setCardNumber(formattedText);
  };

  const handleSave = () => {
    if (cardNumber.length >= 19) {
      const last4 = cardNumber.slice(-4);
      onSaveCard({ last4 });
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onClose}>
          <Ionicons name="arrow-back" size={32} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add a Payment Method</Text>
      </View>

      {/* Card Number */}
      <Text style={styles.label}>Card number</Text>
      <View style={styles.cardInputContainer}>
        <TextInput
          style={styles.input}
          placeholder="1234 1234 1234 1234"
          keyboardType="numeric"
          value={cardNumber}
          onChangeText={handleCardNumberChange}
          maxLength={19}
        />
        {/* 支援的卡片圖示 */}
        <View style={styles.cardIconsContainer}>
          <Image source={require('../../assets/visa.png')} style={styles.cardIcon} />
          <Image source={require('../../assets/mastercard.png')} style={styles.cardIcon} />
          <Image source={require('../../assets/amex.jpg')} style={styles.cardIcon} />
          <Image source={require('../../assets/unionpay.png')} style={styles.cardIcon} />
        </View>
      </View>

      {/* Expiration Date & CVV */}
      <View style={styles.row}>
        <View style={styles.column}>
          <Text style={styles.label}>Expiration date</Text>
          <View style={styles.cardInputContainer}>
            <TextInput
              style={styles.input}
              placeholder="MM / YY"
              keyboardType="numeric"
              value={expirationDate}
              onChangeText={setExpirationDate}
              maxLength={5}
            />
          </View>
        </View>
        <View style={styles.column}>
          <Text style={styles.label}>Security code</Text>
          <View style={styles.cardInputContainer}>
            <TextInput
              style={styles.input}
              placeholder="CVC"
              keyboardType="numeric"
              value={cvv}
              onChangeText={setCvv}
              maxLength={4}
            />
            {/* CVV 圖示 */}
            <Image source={require('../../assets/cvv.png')} style={styles.cvvIcon} />
          </View>
        </View>
      </View>

      {/* Country */}
      <Text style={styles.label}>Country</Text>
      <View style={styles.cardInputContainer}>
        <TextInput style={styles.input} value="Canada" editable={false} />
        {/* 下拉箭頭 */}
        <Ionicons name="chevron-down" size={28} color="gray" />
      </View>

      {/* Postal Code */}
      <Text style={styles.label}>Postal code</Text>
      <View style={styles.cardInputContainer}>
        <TextInput
          style={styles.input}
          placeholder="M5T 1T4"
          value={postalCode}
          onChangeText={setPostalCode}
        />
      </View>

      {/* 說明文字 */}
      <Text style={styles.infoText}>
        By providing your card information, you allow WhatsDish Enterprises to charge your card for
        future payments in accordance with their terms.
      </Text>

      {/* Save Button */}
      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Save Card</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 12,
    elevation: 2, // 陰影效果
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginLeft: 12,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  cardInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#666',
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
    backgroundColor: '#fff',
  },
  input: {
    flex: 1,
    padding: 5,
    fontSize: 18,
  },
  cardIconsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardIcon: {
    width: 40, // 圖示變大
    height: 25,
    resizeMode: 'contain',
    marginLeft: -10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  column: {
    width: '48%',
  },
  cvvIcon: {
    width: 40, // CVV 圖示放大
    height: 25,
    resizeMode: 'contain',
    marginLeft: 7,
  },
  infoText: {
    fontSize: 14,
    color: 'gray',
    textAlign: 'center',
    marginTop: 12,
    marginBottom: 24,
  },
  saveButton: {
    backgroundColor: '#444',
    padding: 18,
    borderRadius: 10,
    alignItems: 'center',
    width: '100%', // 讓按鈕全寬
  },
  saveButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
});

export default PaymentScreen;
