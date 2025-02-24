import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet, ScrollView } from 'react-native';
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import PaymentMethod from './PaymentMethod';
import PaymentDisclaimer from './PaymentDisclaimer';

const Payment = () => {
  const [selectedMethod, setSelectedMethod] = useState('Visa');
  const [modalVisible, setModalVisible] = useState(false);

  const handleSelectMethod = (method) => {
    setSelectedMethod(method);
    setModalVisible(false);
  };

  const handlePlaceOrder = () => {
    console.log('Order Placed');
    // 在這裡添加下單邏輯
  };

  return (
    <View style={styles.container}>
      {/* 主要內容區域，確保不被按鈕遮住 */}
      <ScrollView contentContainerStyle={styles.scrollContainer}>
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

        <View style={styles.divider} />

        {/* 付款安全提示與免責聲明 */}
        <PaymentDisclaimer />
      </ScrollView>

      {/* 固定在底部的 Place Order 按鈕 */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.placeOrderButton} onPress={handlePlaceOrder}>
          <Text style={styles.placeOrderText}>Place Order</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    paddingBottom: 70, // 確保內容不會被按鈕遮住
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
  buttonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff', // 背景顏色避免擋住內容
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  placeOrderButton: {
    backgroundColor: '#ff6600', // 醒目的顏色
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  placeOrderText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
});

export default Payment;
