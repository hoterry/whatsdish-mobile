import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import cardType from 'credit-card-type';

const PaymentScreen = ({ onClose, onSaveCard }) => {
  const [cardNumber, setCardNumber] = useState('');
  const [cardTypeIcon, setCardTypeIcon] = useState(null);
  const [cardTypeName, setCardTypeName] = useState('');
  const [expirationDate, setExpirationDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [postalCode, setPostalCode] = useState('');

  const handleCardNumberChange = (text) => {
    // 自動格式化信用卡號
    const formattedText = text
      .replace(/\D/g, '') // 只保留數字
      .replace(/(.{4})/g, '$1 ') // 每 4 位數插入一個空格
      .trim();

    setCardNumber(formattedText);

    // 自動辨識信用卡類型
    const detectedCard = cardType(text.replace(/\s/g, ''))[0];
    if (detectedCard) {
      setCardTypeName(detectedCard.niceType);
      switch (detectedCard.type) {
        case 'visa':
          setCardTypeIcon(require('../../assets/visa.png'));
          break;
        case 'mastercard':
          setCardTypeIcon(require('../../assets/mastercard.png'));
          break;
        case 'american-express':
          setCardTypeIcon(require('../../assets/amex.jpg'));
          break;
        case 'unionpay':
          setCardTypeIcon(require('../../assets/unionpay.png'));
          break;
        default:
          setCardTypeIcon(null);
          break;
      }
    } else {
      setCardTypeIcon(null);
      setCardTypeName('');
    }
  };

  const handleSave = () => {
    if (cardNumber.length >= 19) {
      const last4 = cardNumber.slice(-4);
      onSaveCard({ type: cardTypeName, last4 });
    }
  };

  return (
    <View style={styles.container}>
      {/* 返回按鈕與標題 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onClose}>
          <Ionicons name="arrow-back" size={28} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Checkout</Text>
      </View>

      {/* 卡號輸入 */}
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
        {cardTypeIcon && <Image source={cardTypeIcon} style={styles.cardIcon} />}
      </View>

      {/* 儲存按鈕 */}
      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Save Card</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { backgroundColor: '#f5f5f5', padding: 20, borderRadius: 10, margin: 10 },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  headerTitle: { fontSize: 22, fontWeight: 'bold', marginLeft: 10 },
  label: { fontSize: 14, fontWeight: 'bold', marginBottom: 5 },
  cardInputContainer: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 12, marginBottom: 16, backgroundColor: '#fff' },
  input: { flex: 1, padding: 10, fontSize: 16 },
  cardIcon: { width: 40, height: 26, resizeMode: 'contain' },
  saveButton: { backgroundColor: '#444', padding: 15, borderRadius: 8, alignItems: 'center', marginTop: 20 },
  saveButtonText: { fontSize: 16, fontWeight: 'bold', color: '#fff' },
});

export default PaymentScreen;
