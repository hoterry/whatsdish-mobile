// LanguageSelectionModal.js
import React, { useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Modal, 
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  FlatList
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

const translations = {
  en: {
    selectLanguage: "Select Language",
    close: "Close"
  },
  "zh-hant": {
    selectLanguage: "選擇語言",
    close: "關閉"
  },
  es: {
    selectLanguage: "Seleccionar Idioma",
    close: "Cerrar"
  },
  fr: {
    selectLanguage: "Sélectionner la Langue",
    close: "Fermer"
  }
};

// List of supported languages
const languages = [
  { code: 'en', name: 'English' },
  { code: 'zh-hant', name: '中文' },
];

const LanguageSelectionModal = ({ 
  visible, 
  onClose, 
  currentLanguage = "en",
  onSave
}) => {
  const texts = translations[currentLanguage] || translations["en"];

  const handleLanguageSelect = (langCode) => {
    // 提供觸覺反饋
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    // 立即應用選擇的語言
    onSave(langCode);
    
    // 關閉模態框
    onClose();
  };

  const renderLanguageItem = ({ item }) => (
    <TouchableOpacity 
      style={[
        styles.languageOption,
        currentLanguage === item.code && styles.languageOptionSelected
      ]} 
      onPress={() => handleLanguageSelect(item.code)}
    >
      <Text 
        style={[
          styles.languageText,
          currentLanguage === item.code && styles.languageTextSelected
        ]}
      >
        {item.name}
      </Text>
      {currentLanguage === item.code && (
        <Ionicons name="checkmark" size={20} color="#2E8B57" style={styles.checkIcon} />
      )}
    </TouchableOpacity>
  );

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{texts.selectLanguage}</Text>
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <Ionicons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.modalContent}>
              <FlatList
                data={languages}
                renderItem={renderLanguageItem}
                keyExtractor={(item) => item.code}
                style={styles.languageList}
              />
            </View>
          </View>
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
    width: '85%',
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
    padding: 16,
    maxHeight: 300
  },
  languageList: {
    width: '100%'
  },
  languageOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee'
  },
  languageOptionSelected: {
    backgroundColor: '#e6f7ef'
  },
  languageText: {
    fontSize: 16,
    color: '#333'
  },
  languageTextSelected: {
    color: '#2E8B57',
    fontWeight: '600'
  },
  checkIcon: {
    marginLeft: 8
  }
});

export default LanguageSelectionModal;