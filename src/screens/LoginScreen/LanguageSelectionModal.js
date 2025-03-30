// LanguageSelectionModal.js
import React, { useState, useEffect } from 'react';
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
    save: "Save",
    cancel: "Cancel"
  },
  "zh-hant": {
    selectLanguage: "選擇語言",
    save: "保存",
    cancel: "取消"
  },
  es: {
    selectLanguage: "Seleccionar Idioma",
    save: "Guardar",
    cancel: "Cancelar"
  },
  fr: {
    selectLanguage: "Sélectionner la Langue",
    save: "Enregistrer",
    cancel: "Annuler"
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
  const [selectedLanguage, setSelectedLanguage] = useState(currentLanguage);
  const texts = translations[currentLanguage] || translations["en"];

  useEffect(() => {
    setSelectedLanguage(currentLanguage);
  }, [currentLanguage, visible]);

  const handleLanguageSelect = (langCode) => {
    setSelectedLanguage(langCode);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handleSave = () => {
    onSave(selectedLanguage);
    onClose();
  };

  const renderLanguageItem = ({ item }) => (
    <TouchableOpacity 
      style={[
        styles.languageOption,
        selectedLanguage === item.code && styles.languageOptionSelected
      ]} 
      onPress={() => handleLanguageSelect(item.code)}
    >
      <Text 
        style={[
          styles.languageText,
          selectedLanguage === item.code && styles.languageTextSelected
        ]}
      >
        {item.name}
      </Text>
      {selectedLanguage === item.code && (
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
            
            <View style={styles.modalFooter}>
              <TouchableOpacity 
                style={[styles.button, styles.cancelButton]} 
                onPress={onClose}
              >
                <Text style={styles.cancelButtonText}>{texts.cancel}</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.button, styles.saveButton]} 
                onPress={handleSave}
              >
                <Text style={styles.saveButtonText}>{texts.save}</Text>
              </TouchableOpacity>
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
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee'
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 100
  },
  cancelButton: {
    backgroundColor: '#f2f2f2',
    marginRight: 12
  },
  saveButton: {
    backgroundColor: '#2E8B57'
  },
  cancelButtonText: {
    fontSize: 16,
    color: '#333'
  },
  saveButtonText: {
    fontSize: 16,
    color: 'white',
    fontWeight: '500'
  }
});

export default LanguageSelectionModal;