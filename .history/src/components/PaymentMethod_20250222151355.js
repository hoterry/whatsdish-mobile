import React, { useState, useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { FontAwesome, Ionicons, MaterialIcons } from '@expo/vector-icons';
import { LanguageContext } from '../context/LanguageContext';
import PaymentScreen from './PaymentScreen';
import * as SecureStore from 'expo-secure-store';

const PaymentMethod = ({ onSelectMethod, onClose }) => {
  const { language } = useContext(LanguageContext);
  const [savedCards, setSavedCards] = useState([]);
  const [isAddingCard, setIsAddingCard] = useState(false);

  const handleSaveCard = async (cardInfo) => {
    console.log('🔹 Starting card save process...');
    console.log('📋 Card Info:', cardInfo);
  
    try {
      const authToken = await SecureStore.getItemAsync('token');
      if (!authToken) {
        console.error('❌ No auth token found.');
        return;
      }
  
      console.log('🔑 Auth Token Retrieved:', authToken);
  
      // 1️⃣ 獲取用戶的 IP 地址
      const ipResponse = await fetch('https://checkip.amazonaws.com/');
      if (!ipResponse.ok) {
        throw new Error('Failed to fetch IP address');
      }
      const ip = await ipResponse.text();
      console.log('🌍 User IP Address:', ip);
  
      // 2️⃣ 儲存信用卡到 Moneris Vault
      console.log('⏳ Sending card info to Moneris Vault...');
      const monerisResponse = await fetch('https://dev.whatsdish.com/api/payments/m/cof', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          pan: cardInfo.cardNumber,
          ip: ip, // 使用獲取到的 IP
          expiry_date: cardInfo.expiry,
        }),
      });
  
      console.log('📡 Moneris Response Status:', monerisResponse.status);
  
      const monerisData = await monerisResponse.json();
      console.log('📨 Moneris Response Data:', monerisData);
  
      if (!monerisResponse.ok) {
        console.error('❌ Failed to save card to Moneris Vault:', monerisData);
        return;
      }
  
      const dataKey = monerisData.data_key;
      console.log('✅ Moneris Vault Data Key:', dataKey);
  
      // 3️⃣ 更新 UI
      setSavedCards([...savedCards, cardInfo]);
      setIsAddingCard(false);
      console.log('🎉 UI updated successfully.');
  
    } catch (error) {
      console.error('❌ Error saving card:', error);
      if (error.response) {
        console.error('📡 API Response Error:', error.response.status, error.response.data);
      }
      console.error('🛠 Error Stack:', error.stack);
    }
  };
  
  
  return (
    <View style={styles.container}>
      {isAddingCard ? (
        <PaymentScreen onClose={() => setIsAddingCard(false)} onSaveCard={handleSaveCard} />
      ) : (
        <>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.sectionHeader}>
              {language === 'ZH' ? '選擇付款方式' : 'Select Payment Method'}
            </Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={30} color="black" />
            </TouchableOpacity>
          </View>

          {/* 已儲存的信用卡列表 */}
          {savedCards.length > 0 ? (
            savedCards.map((card, index) => (
              <TouchableOpacity
                key={index}
                style={styles.savedCardContainer}
                onPress={() => {
                  onSelectMethod(card); 
                  onClose(); 
                }}
              >
                <FontAwesome
                  name={card.type === 'Visa' ? 'cc-visa' : 'cc-mastercard'}
                  size={40}
                  color={card.type === 'Visa' ? '#1a73e8' : '#f79e1b'}
                />
                <Text style={styles.savedCardText}>
                  {card.type} **** {card.last4}
                </Text>
              </TouchableOpacity>
            ))
          ) : (
            <Text style={styles.noSavedCardText}>
              {language === 'ZH' ? '沒有儲存的付款方式' : 'No saved payment methods.'} 
            </Text>
          )}

          <TouchableOpacity style={styles.addPaymentButton} onPress={() => setIsAddingCard(true)}>
            <MaterialIcons name="add" size={24} color="#000" />
            <Text style={styles.addPaymentText}>
              {language === 'ZH' ? '新增付款方式' : 'Add payment method'}
            </Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};


const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: '#fff', borderRadius: 10 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  sectionHeader: { fontSize: 20, fontWeight: 'bold' },
  savedCardContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    padding: 16,
    borderRadius: 8,
    marginBottom: 10,
    justifyContent: 'space-between',
  },
  savedCardText: { fontSize: 18, marginLeft: 12 },
  noSavedCardText: { fontSize: 16, color: 'gray', textAlign: 'center', marginVertical: 10 },
  addPaymentButton: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderWidth: 1, borderColor: '#ccc', borderRadius: 8, justifyContent: 'center', marginBottom: 20 },
  addPaymentText: { fontSize: 16, marginLeft: 8, fontWeight: 'bold' },
});

export default PaymentMethod;
