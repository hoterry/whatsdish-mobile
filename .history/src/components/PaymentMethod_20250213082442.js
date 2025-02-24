import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet } from 'react-native';
import { FontAwesome, Ionicons } from '@expo/vector-icons';

const PaymentMethod = ({ onSelectMethod, onClose }) => {
  const [creditCardNumber, setCreditCardNumber] = useState('');
  const [expirationDate, setExpirationDate] = useState('');
  const [cvv, setCvv] = useState('');

  return (
    <View>
      {/* 標題與關閉按鈕 */}
      <View style={styles.header}>
        <Text style={styles.sectionHeader}>Payment Methods</Text>
        <TouchableOpacity onPress={onClose}>
          <Ionicons name="close" size={28} color="black" />
        </TouchableOpacity>
      </View>

      {/* 信用卡選擇 */}
      <View style={styles.paymentOptions}>
        <TouchableOpacity style={styles.paymentOption} onPress={() => onSelectMethod('Visa')}>
          <FontAwesome name="cc-visa" size={40} color="#1a73e8" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.paymentOption} onPress={() => onSelectMethod('MasterCard')}>
          <FontAwesome name="cc-mastercard" size={40} color="#f79e1b" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.paymentOption} onPress={() => onSelectMethod('AE')}>
          <FontAwesome name="cc-amex" size={40} color="#016fd0" />
        </TouchableOpacity>
      </View>

      {/* 信用卡輸入表單 */}
      <Text style={styles.sectionHeader}>Credit Card Details</Text>
      <View style={styles.creditCardForm}>
        <TextInput
          style={[styles.input, styles.cardNumber]}
          placeholder="Credit Card Number"
          keyboardType="numeric"
          value={creditCardNumber}
          onChangeText={setCreditCardNumber}
        />
        <View style={styles.row}>
          <TextInput
            style={[styles.input, styles.smallInput]}
            placeholder="MM/YY"
            keyboardType="numeric"
            value={expirationDate}
            onChangeText={setExpirationDate}
          />
          <TextInput
            style={[styles.input, styles.smallInput]}
            placeholder="CVV"
            keyboardType="numeric"
            value={cvv}
            onChangeText={setCvv}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,

  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16
  },
  paymentOptions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  paymentOption: {
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    alignItems: 'center',
    justifyContent: 'center',
  },
  creditCardForm: {
    marginBottom: 24,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  cardNumber: {
    width: '100%',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  smallInput: {
    width: '48%',
  },
});

export default PaymentMethod;
