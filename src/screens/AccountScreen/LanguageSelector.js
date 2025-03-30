// components/LanguageSelectorModal.js
import React, { useState, useContext } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Modal, 
  Dimensions, 
  ActivityIndicator, 
  Alert 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { LanguageContext } from '../../context/LanguageContext';

const { width } = Dimensions.get('window');

const LanguageSelectorModal = ({ visible, onClose, translations }) => {
  const [isLoading, setIsLoading] = useState(false);
  const { language, changeLanguage } = useContext(LanguageContext);
  
  const handleLanguageSelect = async (newLanguage) => {
    try {
      setIsLoading(true);
      
      const token = await SecureStore.getItemAsync('token');
      
      if (!token) {
        Alert.alert(
          language === 'ZH' ? '錯誤' : 'Error', 
          language === 'ZH' ? '未找到授權信息，請重新登錄' : 'Authorization not found, please login again'
        );
        setIsLoading(false);
        return;
      }
      
      const languageCode = newLanguage === 'ZH' ? 'zh-hant' : 'en';
      
      await axios.put(
        'https://dev.whatsdish.com/api/profile', 
        { language_preference: languageCode },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      if (__DEV__) {
        console.log('[LanguageSelectorModal] Language preference updated successfully');
      }
      
      changeLanguage(newLanguage);
      onClose();
      
    } catch (error) {
      if (__DEV__) {
        console.error('[LanguageSelectorModal] Error updating language preference:', error);
      }
      
      const errorTitle = language === 'ZH' ? '錯誤' : 'Error';
      const errorMsg = language === 'ZH' ? '無法更新語言設置，請稍後再試' : 'Unable to update language settings, please try again later';
      const buttonText = language === 'ZH' ? '確定' : 'OK';
      
      Alert.alert(
        errorTitle,
        errorMsg,
        [{ text: buttonText, onPress: () => onClose() }]
      );
    } finally {
      setIsLoading(false);
    }
  };
  
  const modalTitle = language === 'ZH' ? '選擇語言' : 'Select Language';
  const englishText = 'English';
  const chineseText = '中文';
  
  return (
    <Modal
      transparent={true}
      animationType="slide"
      visible={visible}
      onRequestClose={onClose}
    >
      <BlurView intensity={80} style={styles.modalBlur}>
        <View style={styles.languageModal}>
          <View style={styles.languageModalHeader}>
            <Text style={styles.languageModalTitle}>{modalTitle}</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color="#000" />
            </TouchableOpacity>
          </View>
          
          <TouchableOpacity 
            style={[
              styles.languageOption,
              language === 'EN' ? styles.languageOptionSelected : null
            ]} 
            onPress={() => handleLanguageSelect('EN')}
          >
            <Text style={styles.languageOptionText}>{englishText}</Text>
            {language === 'EN' && (
              <Ionicons name="checkmark" size={24} color="#000" />
            )}
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[
              styles.languageOption,
              language === 'ZH' ? styles.languageOptionSelected : null
            ]} 
            onPress={() => handleLanguageSelect('ZH')}
          >
            <Text style={styles.languageOptionText}>{chineseText}</Text>
            {language === 'ZH' && (
              <Ionicons name="checkmark" size={24} color="#000" />
            )}
          </TouchableOpacity>
        </View>
        
        {isLoading && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color="#000" />
          </View>
        )}
      </BlurView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBlur: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  languageModal: {
    width: width * 0.85,
    backgroundColor: '#fff',
    borderRadius: 16,
    overflow: 'hidden',
    paddingBottom: 20,
  },
  languageModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  languageModalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
  closeButton: {
    padding: 4,
  },
  languageOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  languageOptionSelected: {
    backgroundColor: '#f8f8f8',
  },
  languageOptionText: {
    fontSize: 16,
    color: '#333',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 16,
  },
});

export default LanguageSelectorModal;