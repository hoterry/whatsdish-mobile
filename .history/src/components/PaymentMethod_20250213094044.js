import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { FontAwesome, Ionicons, MaterialIcons } from '@expo/vector-icons';
import PaymentScreen from './PaymentScreen'; // 引入 PaymentScreen

const PaymentMethod = () => {
  const [savedCard, setSavedCard] = useState(null);
  const [isAddingCard, setIsAddingCard] = useState(false);

  // 儲存信用卡資訊
  const handleSaveCard = (cardInfo) => {
    setSavedCard(cardInfo);
    setIsAddingCard(false); // 關閉 PaymentScreen
  };

  return (
    <View style={styles.container}>
      {isAddingCard ? (
        // 顯示 PaymentScreen，並傳入 onClose 方法
        <PaymentScreen onClose={() => setIsAddingCard(false)} onSaveCard={handleSaveCard} />
      ) : (
        <>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.sectionHeader}>Payment Methods</Text>
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
          <TouchableOpacity style={styles.addPaymentButton} onPress={() => setIsAddingCard(true)}>
            <MaterialIcons name="add" size={24} color="#000" />
            <Text style={styles.addPaymentText}>Add payment method</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, marginTop: 16 },
  sectionHeader: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  savedCardContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f8f8f8', padding: 16, borderRadius: 8, marginBottom: 20 },
  savedCardText: { fontSize: 18, marginLeft: 12 },
  addPaymentButton: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderWidth: 1, borderColor: '#ccc', borderRadius: 8, justifyContent: 'center', marginBottom: 20 },
  addPaymentText: { fontSize: 16, marginLeft: 8, fontWeight: 'bold' },
});

export default PaymentMethod;
