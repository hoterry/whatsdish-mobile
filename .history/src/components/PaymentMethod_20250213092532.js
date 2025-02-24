import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet } from 'react-native';
import { FontAwesome, Ionicons, MaterialIcons } from '@expo/vector-icons';

const PaymentMethod = ({ onClose }) => {
  const [savedCard, setSavedCard] = useState({
    type: 'Visa',
    last4: '1234',
  });

  const [isAddingCard, setIsAddingCard] = useState(false);
  const [creditCardNumber, setCreditCardNumber] = useState('');
  const [expirationDate, setExpirationDate] = useState('');
  const [cvv, setCvv] = useState('');

  const handleAddCard = () => {
    if (creditCardNumber.length >= 4) {
      setSavedCard({
        type: 'Visa', // 假設用戶輸入的是 Visa，你可以根據卡號前幾位決定類型
        last4: creditCardNumber.slice(-4),
      });
      setIsAddingCard(false);
      setCreditCardNumber('');
      setExpirationDate('');
      setCvv('');
    }
  };

  return (
    <View style={styles.container}>
      {/* 標題與關閉按鈕 */}
      <View style={styles.header}>
        <Text style={styles.sectionHeader}>Payment Methods</Text>
        <TouchableOpacity onPress={onClose}>
          <Ionicons name="close" size={28} color="black" />
        </TouchableOpacity>
      </View>

      {/* 已儲存的信用卡 */}
      {savedCard ? (
        <View style={styles.savedCardContainer}>
          <FontAwesome
            name={savedCard.type === 'Visa' ? 'cc-visa' : 'cc-mastercard'}
            size={40}
            color={savedCard.type === 'Visa' ? '#1a73e8' : '#f79e1b'}
          />
          <Text style={styles.savedCardText}>**** **** **** {savedCard.last4}</Text>
        </View>
      ) : null}

      {/* 加入新的支付方式 */}
      {!isAddingCard ? (
        <TouchableOpacity style={styles.addPaymentButton} onPress={() => setIsAddingCard(true)}>
          <MaterialIcons name="add" size={24} color="#000" />
          <Text style={styles.addPaymentText}>Add payment method</Text>
        </TouchableOpacity>
      ) : (
        <>
          {/* 信用卡輸入表單 */}
          <Text style={styles.sectionHeader}>Enter Card Details</Text>
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

          {/* 儲存按鈕 */}
          <TouchableOpacity style={styles.saveButton} onPress={handleAddCard}>
            <Text style={styles.saveButtonText}>Save Card</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    marginTop: 16,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10
  },
  savedCardContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    padding: 16,
    borderRadius: 8,
    marginBottom: 20,
  },
  savedCardText: {
    fontSize: 18,
    marginLeft: 12,
  },
  addPaymentButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    justifyContent: 'center',
    marginBottom: 20,
  },
  addPaymentText: {
    fontSize: 16,
    marginLeft: 8,
    fontWeight: 'bold',
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
  saveButton: {
    backgroundColor: '#000',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
});

export default PaymentMethod;
