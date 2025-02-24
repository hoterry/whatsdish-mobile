import React, { useState, useContext, useEffect } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import * as SecureStore from 'expo-secure-store';
import PaymentMethod from './PaymentMethod';
import PaymentDisclaimer from './PaymentDisclaimer';
import { LanguageContext } from '../context/LanguageContext'; 

const Payment = () => {
  const { language } = useContext(LanguageContext);
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSavedCards = async () => {
      try {
        const token = await SecureStore.getItemAsync('token');
        if (!token) {
          console.error('No token found in SecureStore');
          setLoading(false);
          return;
        }

        console.log('Fetching payment methods with token:', token);

        const response = await fetch('https://dev.whatsdish.com/api/profile/payment-methods', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        console.log('Response status:', response.status);
        const data = await response.json();
        console.log('Response data:', JSON.stringify(data, null, 2));

        if (data?.cards?.length > 0) {
          console.log(`Found ${data.cards.length} saved cards.`);
          const defaultCard = data.cards.find(card => card.data.is_default) || data.cards[0];
          console.log('Default selected card:', defaultCard);
          
          setSelectedMethod({
            type: defaultCard.data.bin.brand,
            last4: defaultCard.data.masked_pan.slice(-4),
          });
        } else {
          console.log('No saved cards found.');
        }
      } catch (error) {
        console.error('Error fetching payment methods:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSavedCards();
  }, []);

  const handleSelectMethod = (method) => {
    console.log('User selected payment method:', method);
    setSelectedMethod(method);
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>{language === 'ZH' ? '付款' : 'Payment'}</Text>

        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" />
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
              <PaymentMethod onSelectMethod={handleSelectMethod} onClose={() => setModalVisible(false)} />
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
  buttonContainer: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: '#fff', paddingVertical: 12, paddingHorizontal: 20, borderTopWidth: 1, borderTopColor: '#ddd' },
  placeOrderButton: { backgroundColor: '#ff6600', paddingVertical: 14, borderRadius: 8, alignItems: 'center' },
  placeOrderText: { fontSize: 16, fontWeight: 'bold', color: '#fff' },
});

export default Payment;

