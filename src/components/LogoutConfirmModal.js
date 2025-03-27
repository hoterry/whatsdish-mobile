// components/LogoutConfirmModal.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Dimensions } from 'react-native';
import { BlurView } from 'expo-blur';

const { width } = Dimensions.get('window');

const LogoutConfirmModal = ({ visible, onCancel, onConfirm }) => (
  <Modal
    visible={visible}
    transparent={true}
    animationType="fade"
    onRequestClose={onCancel}
  >
    <BlurView intensity={80} style={styles.modalBlur}>
      <View style={styles.confirmModal}>
        <Text style={styles.confirmTitle}>Logout</Text>
        <Text style={styles.confirmText}>
          Are you sure you want to logout from your account?
        </Text>
        <View style={styles.confirmButtons}>
          <TouchableOpacity 
            style={[styles.confirmButton, styles.cancelButton]} 
            onPress={onCancel}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.confirmButton, styles.logoutConfirmButton]} 
            onPress={onConfirm}
          >
            <Text style={styles.logoutConfirmText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </View>
    </BlurView>
  </Modal>
);

const styles = StyleSheet.create({
  modalBlur: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  confirmModal: {
    width: width * 0.85,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
  },
  confirmTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    marginBottom: 12,
  },
  confirmText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  confirmButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  confirmButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    backgroundColor: '#f1f1f1',
    marginRight: 10,
  },
  cancelButtonText: {
    color: '#333',
    fontSize: 16,
    fontWeight: '500',
  },
  logoutConfirmButton: {
    backgroundColor: '#000000',
  },
  logoutConfirmText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default LogoutConfirmModal;