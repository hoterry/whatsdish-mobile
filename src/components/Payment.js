import React, { useState, useContext, useEffect } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet, ScrollView } from 'react-native';
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import * as SecureStore from 'expo-secure-store';
import PaymentMethod from './PaymentMethod';
import PaymentDisclaimer from './PaymentDisclaimer';
import { LanguageContext } from '../context/LanguageContext'; 
import Constants from 'expo-constants';
import LottieView from 'lottie-react-native'; // Import your custom animation component

const Payment = () => {
  const { language } = useContext(LanguageContext);
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [savedCards, setSavedCards] = useState([]); 
  const { API_URL } = Constants.expoConfig.extra; 

  const fetchSavedCards = async () => {
    try {
      setLoading(true);
      const token = await SecureStore.getItemAsync('token');
      if (!token) {
        console.error('No token found in SecureStore');
        setLoading(false);
        return;
      }
      const response = await fetch(`${API_URL}/api/profile/payment-methods`,  {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (data?.cards?.length > 0) {
        setSavedCards(data.cards);
        const defaultCard = data.cards.find(card => card.data.is_default) || data.cards[0];
        setSelectedMethod({
          type: defaultCard.data.bin.brand,
          last4: defaultCard.data.masked_pan.slice(-4),
        });
      } else {
        setSavedCards([]);
        setSelectedMethod(null);
      }
    } catch (error) {
      console.error('Error fetching payment methods:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSavedCards();
  }, []);

  const handleSelectMethod = (method) => {
    setSelectedMethod({
      type: method.data.bin.brand,
      last4: method.data.masked_pan.slice(-4),
    });
    setModalVisible(false);
  };

  const handleRemoveCard = async () => {
    await fetchSavedCards(); 
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>{language === 'ZH' ? '付款' : 'Payment'}</Text>

        {loading ? (
          // Replace ActivityIndicator with your custom animation
          <LottieView
            source={require('../../assets/loading-animation.json')} // Path to your animation file
            autoPlay
            loop
            style={styles.loadingAnimation}
          />
        ) : (
          <TouchableOpacity style={styles.paymentContainer} onPress={() => setModalVisible(true)}>
            <View style={styles.paymentInfo}>
              {selectedMethod ? (
                <>
                  <FontAwesome
                    name={
                      selectedMethod.type.includes('VISA')
                        ? 'cc-visa'
                        : selectedMethod.type.includes('MASTER')
                        ? 'cc-mastercard'
                        : selectedMethod.type.includes('AMERICAN EXPRESS')
                        ? 'cc-amex'
                        : 'credit-card'
                    }
                    size={32}
                    color={
                      selectedMethod.type.includes('VISA')
                        ? '#1a73e8'
                        : selectedMethod.type.includes('MASTER')
                        ? '#f79e1b'
                        : selectedMethod.type.includes('AMERICAN EXPRESS')
                        ? '#002663'
                        : 'gray'
                    }
                  />
                  <Text style={styles.paymentText}>
                    {selectedMethod.type} **** {selectedMethod.last4}
                  </Text>
                </>
              ) : (
                <Text style={styles.paymentText}>
                  {language === 'ZH' ? '選擇付款方式' : 'Select Payment Method'}
                </Text>
              )}
            </View>
            <Ionicons name="chevron-forward" size={24} color="black" />
          </TouchableOpacity>
        )}

        <Modal visible={modalVisible} transparent animationType="slide">
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <PaymentMethod
                onSelectMethod={handleSelectMethod}
                onClose={() => setModalVisible(false)}
                onRemoveCard={handleRemoveCard} 
              />
            </View>
          </View>
        </Modal>

        <View style={styles.divider} />

        <PaymentDisclaimer />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContainer: {},
  title: { fontSize: 18, fontWeight: 'bold', marginBottom: 8 },
  paymentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    width: '100%',
  },
  paymentInfo: { flexDirection: 'row', alignItems: 'center' },
  paymentText: { fontSize: 18, marginLeft: 10 },
  modalContainer: { flex: 1, justifyContent: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' },
  modalContent: { backgroundColor: '#fff', borderRadius: 10, padding: 20, marginHorizontal: 20 },
  divider: { marginTop: 10, borderBottomWidth: 1, borderBottomColor: '#ccc', marginBottom: 10 },
  loadingAnimation: {
    width: 100, // Adjust size as needed
    height: 100, // Adjust size as needed
    alignSelf: 'center',
  },
});

export default Payment;