import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('EN'); // 默認語言為 'EN'

  // 加載語言設定
  useEffect(() => {
    const loadLanguage = async () => {
      try {
        const savedLanguage = await AsyncStorage.getItem('selectedLanguage');
        if (savedLanguage) {
          setLanguage(savedLanguage); // 如果有保存的語言，則設置為該語言
        }
      } catch (error) {
        console.log('Error loading language from AsyncStorage', error);
      }
    };

    loadLanguage();
  }, []);

  // 改變語言並保存
  const changeLanguage = async (newLanguage) => {
    try {
      await AsyncStorage.setItem('selectedLanguage', newLanguage); // 保存新語言設定
      setLanguage(newLanguage);
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
