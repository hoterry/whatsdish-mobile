import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { FontAwesome, Ionicons, MaterialIcons } from '@expo/vector-icons';
import PaymentScreen from './PaymentScreen'; // 引入 PaymentScreen

const PaymentMethod = ({ onClose }) => {
  const [savedCards, setSavedCards] = useState([]); // 支援多張卡
  const [isAddingCard, setIsAddingCard] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);

  // 儲存信用卡資訊
  const handleSaveCard = (cardInfo) => {
    setSavedCards([...savedCards, cardInfo]);
    setIsAddingCard(false); // 關閉 PaymentScreen
  };

  // 付款操作（可以連接到後端）
  const handlePayment = () => {
    if (!selectedCard) {
      alert('Please select a payment method.');
      return;
    }
    alert(`Payment processed using card ending in ${selectedCard.last4}`);
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
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={30} color="black" />
            </TouchableOpacity>
          </View>

          {/* 已儲存的信用卡（可選擇付款） */}
          {savedCards.length > 0 ? (
            savedCards.map((card, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.savedCardContainer,
                  selectedCard?.last4 === card.last4 && styles.selectedCard, // 被選取的卡片加強顯示
                ]}
                onPress={() => setSelectedCard(card)}
              >
                <FontAwesome
                  name={card.type === 'Visa' ? 'cc-visa' : 'cc-mastercard'}
                  size={40}
                  color={card.type === 'Visa' ? '#1a73e8' : '#f79e1b'}
                />
                <Text style={styles.savedCardText}>**** **** **** {card.last4}</Text>
                {selectedCard?.last4 === card.last4 && <Ionicons name="checkmark" size={24} color="green" />}
              </TouchableOpacity>
            ))
          ) : (
            <Text style={styles.noSavedCardText}>No saved payment methods.</Text>
          )}

          {/* 加入新的支付方式 */}
          <TouchableOpacity style={styles.addPaymentButton} onPress={() => setIsAddingCard(true)}>
            <MaterialIcons name="add" size={24} color="#000" />
            <Text style={styles.addPaymentText}>Add payment method</Text>
          </TouchableOpacity>

          {/* 確認付款按鈕 */}
          {savedCards.length > 0 && (
            <TouchableOpacity style={styles.payButton} onPress={handlePayment}>
              <Text style={styles.payButtonText}>Pay Now</Text>
            </TouchableOpacity>
          )}
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
  selectedCard: { borderColor: 'green', borderWidth: 2 },
  savedCardText: { fontSize: 18, marginLeft: 12 },
  noSavedCardText: { fontSize: 16, color: 'gray', textAlign: 'center', marginVertical: 10 },
  addPaymentButton: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderWidth: 1, borderColor: '#ccc', borderRadius: 8, justifyContent: 'center', marginBottom: 20 },
  addPaymentText: { fontSize: 16, marginLeft: 8, fontWeight: 'bold' },
  payButton: { backgroundColor: '#007AFF', padding: 15, borderRadius: 8, alignItems: 'center' },
  payButtonText: { fontSize: 18, fontWeight: 'bold', color: '#fff' },
});

export default PaymentMethod;
