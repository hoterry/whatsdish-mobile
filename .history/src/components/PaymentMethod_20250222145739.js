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
    try {
      const authToken = await SecureStore.getItemAsync('auth_token');
      if (!authToken) {
        console.error('No auth token found');
        return;
      }
  
      console.log('Saving card to Moneris Vault:', cardInfo);
  
      // 1️⃣ 先將信用卡資訊儲存到 Moneris Vault
      const monerisResponse = await fetch('https://dev.whatsdish.com/api/payments/m/cof', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          pan: cardInfo.cardNumber, // 16 位數信用卡號
          ip: '192.168.1.1', // 需從後端或設備獲取用戶 IP
          expiry_date: cardInfo.expiry, // 格式: YYMM
        }),
      });
  
      const monerisData = await monerisResponse.json();
      if (!monerisResponse.ok) {
        console.error('Failed to save card to Moneris:', monerisData);
        return;
      }
  
      console.log('Moneris response:', monerisData);
      const dataKey = monerisData.data_key; // 取得 Moneris Vault 的 data_key
  
      // 2️⃣ 再將 `data_key` 存入應用的後端
      const appResponse = await fetch('https://dev.whatsdish.com/api/profile/payment-methods', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          type: cardInfo.type, // 卡片類型 (Visa, MasterCard, AMEX)
          data_key: dataKey, // 來自 Moneris Vault
          masked_pan: `**** **** **** ${cardInfo.last4}`, // 屏蔽的信用卡號
          expdate: cardInfo.expiry, // YYMM 格式
          is_default: false,
        }),
      });
  
      const appData = await appResponse.json();
      if (!appResponse.ok) {
        console.error('Failed to save card to app database:', appData);
        return;
      }
  
      console.log('Card saved successfully:', appData);
  
      // 3️⃣ 更新 UI
      setSavedCards([...savedCards, cardInfo]); 
      setIsAddingCard(false);
    } catch (error) {
      console.error('Error saving card:', error);
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
