import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet } from 'react-native';
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import PaymentMethod from './PaymentMethod'; // 引入支付管理視窗

const Payment = () => {
  const [selectedMethod, setSelectedMethod] = useState('Visa'); // 預設顯示 Visa
  const [modalVisible, setModalVisible] = useState(false);

  const handleSelectMethod = (method) => {
    setSelectedMethod(method);
    setModalVisible(false); // 關閉彈窗
  };

  return (
    <View style={styles.container}>
      {/* 標題 */}
      <Text style={styles.title}>Payment</Text>

      {/* 付款方式選擇區塊 */}
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

      {/* 彈出支付管理視窗 */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <PaymentMethod onSelectMethod={handleSelectMethod} onClose={() => setModalVisible(false)} />
          </View>
        </View>
      </Modal>
        <View style={styles.divider} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%', // 讓內容佔滿整個寬度
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
    paddingVertical: 12, // 調整內邊距

    width: '100%', // 讓這一行佔據整個可用寬度
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
    marginBottom: 10
  },
});

export default Payment;
