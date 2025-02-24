import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import cardType from 'credit-card-type';

const PaymentScreen = ({ onClose }) => {
  const [cardNumber, setCardNumber] = useState('');
  const [cardTypeIcon, setCardTypeIcon] = useState(null);
  const [expirationDate, setExpirationDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [country, setCountry] = useState('Canada');
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
      switch (detectedCard.type) {
        case 'visa':
          setCardTypeIcon(require('./assets/visa.png'));
          break;
        case 'mastercard':
          setCardTypeIcon(require('./assets/mastercard.png'));
          break;
        case 'american-express':
          setCardTypeIcon(require('./assets/amex.png'));
          break;
        case 'unionpay':
          setCardTypeIcon(require('./assets/unionpay.png'));
          break;
        default:
          setCardTypeIcon(null);
          break;
      }
    } else {
      setCardTypeIcon(null);
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
          maxLength={19} // 16 位數字 + 3 個空格
        />
        {cardTypeIcon && <Image source={cardTypeIcon} style={styles.cardIcon} />}
      </View>

      {/* 有效期限與 CVV */}
      <View style={styles.row}>
        <View style={styles.column}>
          <Text style={styles.label}>Expiration date</Text>
          <TextInput
            style={styles.input}
            placeholder="MM / YY"
            keyboardType="numeric"
            value={expirationDate}
            onChangeText={setExpirationDate}
            maxLength={5} // MM/YY 格式
          />
        </View>
        <View style={styles.column}>
          <Text style={styles.label}>Security code</Text>
          <TextInput
            style={styles.input}
            placeholder="CVC"
            keyboardType="numeric"
            value={cvv}
            onChangeText={setCvv}
            maxLength={4} // CVC 最多 4 位
          />
        </View>
      </View>

      {/* 國家與郵遞區號 */}
      <Text style={styles.label}>Country</Text>
      <TextInput style={styles.input} value={country} editable={false} />

      <Text style={styles.label}>Postal code</Text>
      <TextInput
        style={styles.input}
        placeholder="M5T 1T4"
        value={postalCode}
        onChangeText={setPostalCode}
      />

      {/* 儲存按鈕 */}
      <TouchableOpacity style={styles.saveButton}>
        <Text style={styles.saveButtonText}>Save Card</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f5f5f5',
    padding: 20,
    borderRadius: 10,
    margin: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  cardInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    backgroundColor: '#fff',
  },
  input: {
    flex: 1,
    padding: 10,
    fontSize: 16,
  },
  cardIcon: {
    width: 40,
    height: 26,
    resizeMode: 'contain',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  column: {
    width: '48%',
  },
  saveButton: {
    backgroundColor: '#444',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
});

export default PaymentScreen;
