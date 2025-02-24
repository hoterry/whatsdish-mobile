// PaymentMethod.js
import React from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet } from 'react-native';
import { FontAwesome } from 'react-native-vector-icons';

const PaymentMethod = ({
  creditCardNumber,
  setCreditCardNumber,
  expirationDate,
  setExpirationDate,
  cvv,
  setCvv,
}) => {
  return (
    <View>
      <Text style={styles.sectionHeader}>Payment Method</Text>
      <View style={styles.paymentMethodContainer}>
        <View style={styles.paymentOptions}>
          <TouchableOpacity style={styles.paymentOption}>
            <FontAwesome name="cc-visa" size={40} color="#1a73e8" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.paymentOption}>
            <FontAwesome name="cc-mastercard" size={40} color="#f79e1b" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.paymentOption}>
            <FontAwesome name="cc-paypal" size={40} color="#003087" />
          </TouchableOpacity>
        </View>
      </View>

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
  sectionHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  paymentMethodContainer: {
    marginBottom: 24,
  },
  paymentOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  paymentOption: {
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    marginHorizontal: 4,
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