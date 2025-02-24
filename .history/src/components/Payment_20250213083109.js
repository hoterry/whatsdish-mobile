import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet } from 'react-native';
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import PaymentMethod from './PaymentMethod';
import PaymentDisclaimer from './PaymentDisclaimer'; // 引入免責聲明組件

const Payment = () => {
  const [selectedMethod, setSelectedMethod] = useState('Visa');
  const [modalVisible, setModalVisible] = useState(false);

  const handleSelectMethod = (method) => {
    setSelectedMethod(method);
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Payment</Text>

      <TouchableOpacity style={styles.paymentContainer} onPress={() => setModalVisible(true)}>
        <View style={styles.paymentInfo}>
          <FontAwesome
            name={selectedMethod === 'Visa' ? 'cc-visa' : selectedMethod === 'MasterCard' ? 'cc-mastercard' : 'cc-amex'}
            size={32}
            color={selectedMethod === 'Visa' ? '#1a73e8' : selectedMethod === 'MasterCard' ? '#f79e1b' : '#016fd0'}
          />
          <Text style={styles.paymentText}>{selectedMethod}</Text>
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

      {/* 分隔線 */}
      <View style={styles.divider} />

      {/* 付款安全提示與免責聲明 */}
      <PaymentDisclaimer />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  paymentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    width: '100%',
  },
  paymentInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  paymentText: {
    fontSize: 18,
    marginLeft: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    marginHorizontal: 20,
  },
  divider: {
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    marginBottom: 10,
  },
});

export default Payment;
