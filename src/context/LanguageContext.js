import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('EN'); 

  useEffect(() => {
    const loadLanguage = async () => {
      try {
        const savedLanguage = await AsyncStorage.getItem('selectedLanguage');
        if (savedLanguage) {
          setLanguage(savedLanguage); 
        }
      } catch (error) {
        console.log('Error loading language from AsyncStorage', error);
      }
    };

    loadLanguage();
  }, []);

  const changeLanguage = async (newLanguage) => {
    try {
      await AsyncStorage.setItem('selectedLanguage', newLanguage);
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
