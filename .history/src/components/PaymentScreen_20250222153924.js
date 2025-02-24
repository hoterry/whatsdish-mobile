import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LanguageContext } from '../context/LanguageContext';

const PaymentScreen = ({ navigation, onSaveCard }) => { // 接收 navigation
  const { language } = useContext(LanguageContext);
  const [cardNumber, setCardNumber] = useState('');
  const [expirationDate, setExpirationDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [postalCode, setPostalCode] = useState('');

  // Format card number with spaces every 4 digits
  const handleCardNumberChange = (text) => {
    const formattedText = text
      .replace(/\D/g, '') // Remove non-numeric characters
      .replace(/(.{4})/g, '$1 ') // Add space every 4 digits
      .trim(); // Remove any trailing spaces
    setCardNumber(formattedText);
  };

  // Format expiration date as MM / YY
  const handleExpirationDateChange = (text) => {
    const formattedText = text
      .replace(/\D/g, '') // Remove non-numeric characters
      .replace(/(.{2})/g, '$1 ') // Add space after the month part (MM)
      .trim(); // Remove any trailing spaces
    setExpirationDate(formattedText);
  };

  // Handle saving card information
  const handleSave = () => {
    const formattedCardNumber = cardNumber.replace(/\s/g, ''); // Remove spaces
    const [month, year] = expirationDate.split(' '); // Split by space
    const formattedExpirationDate = `${year}${month}`; // Convert to YYMM format
    const ip = '50.64.173.103';  // Replace with dynamic IP if needed
  
    const cardInfo = {
      pan: formattedCardNumber,  // Ensure pan is 16 digits only
      ip: ip.trim(), // Remove any newline or extra spaces from IP
      expiry_date: formattedExpirationDate,  // Send in YYMM format
    };
    console.log('Card Info Ready to Save:', cardInfo);
    onSaveCard(cardInfo); // Call onSaveCard to save the card information
    
    // 成功儲存後返回上一頁
    navigation.goBack(); // 返回上一頁
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}> {/* 返回上一頁 */}
          <Ionicons name="arrow-back" size={32} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {language === 'ZH' ? '新增付款方式' : 'Add a Payment Method'} 
        </Text>
      </View>

      <Text style={styles.label}>
        {language === 'ZH' ? '卡號' : 'Card number'}
      </Text>
      <View style={styles.cardInputContainer}>
        <TextInput
          style={styles.input}
          placeholder={language === 'ZH' ? '1234 1234 1234 1234' : '1234 1234 1234 1234'} 
          keyboardType="numeric"
          value={cardNumber}
          onChangeText={handleCardNumberChange}
          maxLength={19} // 16 digits + 3 spaces
        />
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
          <Text style={styles.label}>
            {language === 'ZH' ? '過期日期' : 'Expiration date'} 
          </Text>
          <View style={styles.cardInputContainer}>
            <TextInput
              style={styles.input}
              placeholder="MM / YY"
              keyboardType="numeric"
              value={expirationDate}
              onChangeText={handleExpirationDateChange}
              maxLength={5} // Format MM / YY
            />
          </View>
        </View>
        <View style={styles.column}>
          <Text style={styles.label}>
            {language === 'ZH' ? '安全代碼' : 'Security code'}
          </Text>
          <View style={styles.cardInputContainer}>
            <TextInput
              style={styles.input}
              placeholder="CVC"
              keyboardType="numeric"
              value={cvv}
              onChangeText={setCvv}
              maxLength={3} // Limit to 3 digits
            />
            <Image source={require('../../assets/cvv.png')} style={styles.cvvIcon} />
          </View>
        </View>
      </View>

      <Text style={styles.label}>
        {language === 'ZH' ? '郵政編碼' : 'Postal code'}
      </Text>
      <View style={styles.cardInputContainer}>
        <TextInput
          style={styles.input}
          placeholder={language === 'ZH' ? 'M5T 1T4' : 'M5T 1T4'}
          value={postalCode}
          onChangeText={setPostalCode}
        />
      </View>

      <Text style={styles.infoText}>
        {'By providing your card information, you allow WhatsDish Enterprises to charge your card for future payments in accordance with their terms.'}
      </Text>

      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>
          {language === 'ZH' ? '儲存卡片' : 'Save Card'} 
        </Text>
      </TouchableOpacity>
    </View>
  );
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
