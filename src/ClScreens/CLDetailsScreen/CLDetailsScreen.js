
import React, { useState, useEffect, useContext, useRef } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { LanguageContext } from '../../context/LanguageContext';
import CLRestaurantHeader from './CLRestaurnatHeader';
import CLMenuSection from './CLMenuSection';
import Constants from 'expo-constants';

const { API_URL } = Constants.expoConfig.extra;

const translations = {
  EN: {

    loginRequired: "Login Required",
    loginMessage: "Please login to access this feature",
    cancel: "Cancel",
    login: "Login"
  },
  ZH: {

    loginRequired: "需要登入",
    loginMessage: "請登入以使用此功能",
    cancel: "取消",
    login: "登入"
  }
};

const CustomBackButton = ({ navigation }) => {
  const handleBackPress = () => {
    if (navigation.canGoBack()) {
      try {
        navigation.goBack();
      } catch (error) {
        console.error('[Navigation] Go back failed:', error);
        navigation.navigate('CLHome');
      }
    } else {
      navigation.navigate('CLHome');
    }
  };
  
  return (
    <TouchableOpacity
      style={styles.backButton}
      onPress={handleBackPress}
    >
      <Ionicons name="arrow-back" size={24} color="black" />
    </TouchableOpacity>
  );
};

function CLDetailsScreen({ route, navigation }) {
  const { restaurant, restaurants } = route.params;
  const { language } = useContext(LanguageContext);
  const [isLoading, setIsLoading] = useState(false);
  const t = (key) => translations[language][key] || key;

  const promptLogin = () => {
    Alert.alert(
      language === 'EN' ? "Login Required" : "登入提示",
      language === 'EN' ? "You need to login to use more features" : "您需要登入才能使用更多功能",
      [
        { text: language === 'EN' ? "Cancel" : "取消", style: "cancel" },
        { text: language === 'EN' ? "Login Now" : "立即登入", onPress: handleLoginPress }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <CustomBackButton navigation={navigation} />
      <CLRestaurantHeader restaurant={restaurant} />
      <CLMenuSection
        restaurantId={restaurant.gid}
        restaurants={restaurants}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    zIndex: 1,
    padding: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 20,
  },
  guestModeContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#F8F8F8',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  guestModeText: {
    flex: 1,
    fontSize: 13,
    color: '#666',
  },
  loginButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginLeft: 10,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  }
});

export default CLDetailsScreen;