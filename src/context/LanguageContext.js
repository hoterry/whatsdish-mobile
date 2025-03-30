import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('EN'); 

  // 統一語言代碼格式處理
  const formatLanguage = (langCode) => {
    // 兼容處理 ZH 和 zh-hant
    if (langCode.toLowerCase() === 'zh-hant' || langCode.toUpperCase() === 'ZH') {
      return 'ZH';
    }
    return 'EN';
  };

  // 加載語言設置
  useEffect(() => {
    const loadLanguage = async () => {
      try {
        const savedLanguage = await AsyncStorage.getItem('selectedLanguage');
        if (savedLanguage) {
          setLanguage(formatLanguage(savedLanguage)); 
        }
      } catch (error) {
        console.log('Error loading language from AsyncStorage', error);
      }
    };

    loadLanguage();
  }, []);
  
  // 即時監控語言變更
  useEffect(() => {
    console.log('Current language in LanguageContext:', language);
  }, [language]);

  // 更改語言並存儲
  const changeLanguage = async (newLanguage) => {
    try {
      const formattedLanguage = formatLanguage(newLanguage);
      await AsyncStorage.setItem('selectedLanguage', formattedLanguage);
      setLanguage(formattedLanguage);
    } catch (error) {
      console.log('Error saving language to AsyncStorage', error);
    }
  };

  return (
    <LanguageContext.Provider value={{ language, changeLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};
