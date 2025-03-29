// ComingSoonModal.js
import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Modal, 
  TouchableOpacity,
  TouchableWithoutFeedback
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const translations = {
  EN: {
    close: "Close"
  },
  ZH: {
    close: "關閉"
  }
};

const ComingSoonModal = ({ 
  visible, 
  onClose, 
  title = "Coming Soon", 
  message = "This feature will be available in a future update.", 
  language = "EN" 
}) => {
  const texts = translations[language] || translations["EN"];

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.modalOverlay}>
          <TouchableWithoutFeedback onPress={e => e.stopPropagation()}>
            <View style={styles.modalContainer}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>{title}</Text>
                <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                  <Ionicons name="close" size={24} color="#000" />
                </TouchableOpacity>
              </View>
              
              <View style={styles.modalContent}>
                <Text style={styles.messageText}>{message}</Text>
              </View>
              
              <View style={styles.modalFooter}>
                <TouchableOpacity 
                  style={styles.closeButtonContainer} 
                  onPress={onClose}
                >
                  <Text style={styles.closeButtonText}>{texts.close}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  modalContainer: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee'
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333'
  },
  closeButton: {
    padding: 4
  },
  modalContent: {
    padding: 24,
    alignItems: 'center'
  },
  icon: {
    marginBottom: 20
  },
  messageText: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    lineHeight: 24
  },
  modalFooter: {
    padding: 16,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#eee'
  },
  closeButtonContainer: {
    backgroundColor: '#000',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    minWidth: 120,
    alignItems: 'center'
  },
  closeButtonText: {
    fontSize: 16,
    color: 'white',
    fontWeight: '500'
  }
});

export default ComingSoonModal;