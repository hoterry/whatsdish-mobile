import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { FontAwesome, Ionicons, MaterialIcons } from '@expo/vector-icons';
import PaymentScreen from './PaymentScreen';

const PaymentMethod = ({ onSelectMethod, onClose }) => {
  const [savedCards, setSavedCards] = useState([]);
  const [isAddingCard, setIsAddingCard] = useState(false);

  // 儲存信用卡資訊
  const handleSaveCard = (cardInfo) => {
    setSavedCards([...savedCards, cardInfo]);
    setIsAddingCard(false);
  };

  return (
    <View style={styles.container}>
      {isAddingCard ? (
        <PaymentScreen onClose={() => setIsAddingCard(false)} onSaveCard={handleSaveCard} />
      ) : (
        <>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.sectionHeader}>Select Payment Method</Text>
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
                  onSelectMethod(card); // 回傳完整信用卡資訊
                  onClose(); // 關閉選擇頁面
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
            <Text style={styles.noSavedCardText}>No saved payment methods.</Text>
          )}

          {/* 新增付款方式按鈕 */}
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
