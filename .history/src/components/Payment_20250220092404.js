import React, { useState, useContext } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet, ScrollView } from 'react-native';
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import PaymentMethod from './PaymentMethod';
import PaymentDisclaimer from './PaymentDisclaimer';
import { LanguageContext } from '../context/LanguageContext'; 

const Payment = () => {
  const { language } = useContext(LanguageContext);  
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const handleSelectMethod = (method) => {
    setSelectedMethod(method);
    setModalVisible(false);
  };

  const handlePlaceOrder = () => {
    if (!selectedMethod) {
      alert(language === 'ZH' ? '請選擇付款方式' : 'Please select a payment method');
      return;
    }
    alert(`${language === 'ZH' ? '訂單已提交，使用' : 'Order placed using'} ${selectedMethod.type} **** ${selectedMethod.last4}`);
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>
          {language === 'ZH' ? '付款' : 'Payment'} 
        </Text>

        <TouchableOpacity style={styles.paymentContainer} onPress={() => setModalVisible(true)}>
          <View style={styles.paymentInfo}>
            {selectedMethod ? (
              <>
                <FontAwesome
                  name={selectedMethod.type === 'Visa' ? 'cc-visa' : 'cc-mastercard'}
                  size={32}
                  color={selectedMethod.type === 'Visa' ? '#1a73e8' : '#f79e1b'}
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

