import * as SecureStore from 'expo-secure-store';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';

const handleSaveCard = async (cardInfo) => {
  try {
    const authToken = await SecureStore.getItemAsync('token');
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
