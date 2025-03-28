// components/LanguageManager.js
import React, { useState, useEffect, useContext } from 'react';
import { TouchableOpacity, Text, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LanguageContext } from '../context/LanguageContext';
import LanguageSelectorModal from './LanguageSelectorModal';

const translations = {
  EN: {
    welcome: "Welcome",
    searchPlaceholder: "Search menu, restaurant etc",
    featured: "Featured on Whatsdish",
    close: "Close",
    selectLanguage: "Select Language",
  },
  ZH: {
    welcome: "欢迎",
    searchPlaceholder: "搜索菜单、餐厅等",
    featured: "精选推荐",
    close: "关闭",
    selectLanguage: "选择语言",
  },
};

export const LanguageManager = ({ children }) => {
  const { language, changeLanguage } = useContext(LanguageContext);
  const [showLanguageModal, setShowLanguageModal] = useState(false);

  const t = (key) => translations[language][key] || key;

  useEffect(() => {
    const loadSavedLanguage = async () => {
      try {
        const savedLanguage = await AsyncStorage.getItem('selectedLanguage');
        if (savedLanguage) {
          changeLanguage(savedLanguage);
        } else {
          // Set default language to English if nothing saved
          await AsyncStorage.setItem('selectedLanguage', 'EN');
          changeLanguage('EN');
        }
      } catch (error) {
        console.log('Error loading language from AsyncStorage', error);
      }
    };

    loadSavedLanguage();
  }, [changeLanguage]);

  const handleLanguageChange = async (newLanguage) => {
    try {
      await AsyncStorage.setItem('selectedLanguage', newLanguage);
      changeLanguage(newLanguage);
      setShowLanguageModal(false);
    } catch (error) {
      console.log('Error saving language to AsyncStorage', error);
    }
  };

  return (
    <>
      {children({
        t,
        language,
        showLanguageModal,
        setShowLanguageModal,
        handleLanguageChange,
      })}
      <LanguageSelectorModal
        visible={showLanguageModal}
        onClose={() => setShowLanguageModal(false)}
        onChangeLanguage={handleLanguageChange}
        translations={translations[language]}
      />
    </>
  );
};