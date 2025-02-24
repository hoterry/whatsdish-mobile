import React, { useState, useContext, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { FontAwesome, Ionicons, MaterialIcons } from '@expo/vector-icons';
import { LanguageContext } from '../context/LanguageContext';
import PaymentScreen from './PaymentScreen';
import * as SecureStore from 'expo-secure-store';


const PaymentMethod = ({ onSelectMethod, onClose }) => {
  const { language } = useContext(LanguageContext);
  const [savedCards, setSavedCards] = useState([]);
  const [isAddingCard, setIsAddingCard] = useState(false);

  // 取得儲存的信用卡
  const fetchSavedCards = async () => {
    try {
      const token = await SecureStore.getItemAsync('token');
      if (!token) {
        console.error('No token found');
        return;
      }

      const response = await fetch('https://dev.whatsdish.com/api/profile/payment-methods', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        console.error('Failed to fetch saved cards');
        return;
      }

      const data = await response.json();
      setSavedCards(data?.cards || []);
    } catch (error) {
      console.error('Error fetching saved cards:', error);
    }
  };

  useEffect(() => {
    fetchSavedCards();
  }, []);

  const handleSelectCard = (card) => {
    onSelectMethod({
      type: card.data.bin.brand,
      last4: card.data.masked_pan.slice(-4),
    });
    onClose();
  };

  const handleRemoveCard = async (cardId) => {
    Alert.alert(
      language === 'ZH' ? '確認' : 'Confirm',
      language === 'ZH' ? '確定要移除這張卡片嗎?' : 'Are you sure you want to remove this card?',
      [
        { text: language === 'ZH' ? '取消' : 'Cancel', style: 'cancel' },
        {
          text: language === 'ZH' ? '確定' : 'OK',
          onPress: async () => {
            try {
              const token = await SecureStore.getItemAsync('token');
              if (!token) {
                console.error('No token found');
                return;
              }

              const response = await fetch(`https://dev.whatsdish.com/api/profile/payment-methods/${cardId}`, {
                method: 'DELETE',
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${token}`,
                },
              });

              if (response.ok) {
                setSavedCards(prevCards => prevCards.filter(card => card.id !== cardId));
                alert(language === 'ZH' ? '卡片已移除' : 'Card removed');
              } else {
                alert(language === 'ZH' ? '移除卡片失敗' : 'Failed to remove card');
              }
            } catch (error) {
              console.error('Error removing card:', error);
              alert(language === 'ZH' ? '移除卡片失敗' : 'Failed to remove card');
            }
          },
        },
      ]
    );
  };


  return (
    <View style={styles.container}>
      {isAddingCard ? (
        <PaymentScreen onClose={() => setIsAddingCard(false)} onSaveCard={onSaveCard} />
      ) : (
        <>
          <View style={styles.header}>
            <Text style={styles.sectionHeader}>
              {language === 'ZH' ? '選擇付款方式' : 'Select Payment Method'}
            </Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={30} color="black" />
            </TouchableOpacity>
          </View>

          {savedCards.length > 0 ? (
  savedCards.map((card, index) => {
    if (!card.data || !card.data.masked_pan) {
      return null; 
    }
    const cardType = getCardType(card.data.masked_pan);
    return (
      <View key={index} style={styles.savedCardContainer}>
        <TouchableOpacity
          style={styles.cardInfoContainer}
          onPress={() => {
            console.log('Card selected:', card);
            onSelectMethod(card);
            onClose();
          }}
                  >
                    <FontAwesome
                      name={cardType === 'Visa' ? 'cc-visa' : 'cc-mastercard'}
                      size={40}
                      color={cardType === 'Visa' ? '#1a73e8' : '#f79e1b'}
                    />
                    <Text style={styles.savedCardText}>
                      {cardType} **** {card.data.masked_pan.slice(-4)}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.removeButton}
                    onPress={() => {
                      console.log('Removing card with ID:', card._id);
                      handleRemoveCard(card._id);
                    }}
                  >
                    <MaterialIcons name="remove-circle" size={24} color="red" />
                  </TouchableOpacity>
                </View>
              );
            })
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
  savedCardContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  cardInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  savedCardText: {
    fontSize: 16,
    marginLeft: 10,
  },
  removeButton: {
    marginLeft: 10,
  },
  noSavedCardText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
  addPaymentButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
  },
  addPaymentText: {
    marginLeft: 10,
    fontSize: 16,
  },
});

export default PaymentMethod;
