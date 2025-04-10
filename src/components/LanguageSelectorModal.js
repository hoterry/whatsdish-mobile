import React from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const LanguageSelectorModal = ({ visible, onClose, onChangeLanguage, translations }) => {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>{translations.selectLanguage}</Text>
          <TouchableOpacity onPress={() => onChangeLanguage('EN')} style={styles.languageOption}>
            <Text style={styles.languageOptionText}>English (EN)</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => onChangeLanguage('ZH')} style={styles.languageOption}>
            <Text style={styles.languageOptionText}>中文 (ZH)</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>{translations.close}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  languageOption: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  languageOptionText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#333',
  },
  closeButton: {
    marginTop: 20,
    paddingVertical: 12,
    backgroundColor: 'black', // Black button
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  closeButtonText: {
    fontSize: 16,
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

export default LanguageSelectorModal;
