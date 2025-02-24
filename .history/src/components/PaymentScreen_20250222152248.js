import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LanguageContext } from '../context/LanguageContext';

const PaymentScreen = ({ onClose, onSaveCard }) => {
  const { language } = useContext(LanguageContext);
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
    console.log('Card Number Changed:', formattedText);  // 記錄卡號變更
  };

  const handleSave = () => {
    console.log('Saving Card Information...');  // 記錄保存操作開始
    console.log('Card Number:', cardNumber);
    console.log('Expiration Date:', expirationDate);
    console.log('CVV:', cvv);
    console.log('Postal Code:', postalCode);

    if (cardNumber.length >= 19 && expirationDate.length === 5 && cvv.length >= 3) {
      const last4 = cardNumber.slice(-4);
      const [month, year] = expirationDate.split('/');
      const cardInfo = {
        cardNumber: cardNumber.replace(/\s/g, ''),  // 去除空格
        last4,
        expiry: `${month}/${year}`,
        cvv,
        postalCode,
      };
      console.log('Card Info Ready to Save:', cardInfo);
      onSaveCard(cardInfo); // 呼叫 onSaveCard 函數來儲存卡片資訊
    } else {
      console.log('Validation Failed: Please fill out all fields correctly.');
      alert('Please fill out all fields correctly.');
    }
  };
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 12,
    elevation: 2,
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
    borderColor: '#999',
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
    width: 40,
    height: 25,
    resizeMode: 'contain',
    marginLeft: -13,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  column: {
    width: '48%',
  },
  cvvIcon: {
    width: 40, 
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
    width: '100%',
  },
  saveButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
});

export default PaymentScreen;
