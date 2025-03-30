import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Keyboard,
  Platform,
  Dimensions,
  StatusBar,
  SafeAreaView,
  KeyboardAvoidingView,
  Animated,
  TextInput,
  Alert,
  useWindowDimensions,
} from 'react-native';
import * as SecureStore from 'expo-secure-store';
import Constants from 'expo-constants';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import BackButton from './BackButton';
import LanguageSelectionModal from './LanguageSelectionModal';

const isTablet = () => {
  const { width, height } = Dimensions.get('window');
  const aspectRatio = height / width;
  return aspectRatio <= 1.6;
};

export default function RegistrationScreen({ navigation, route, setIsAuthenticated }) {
  const { phoneNumber } = route.params;
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [language, setLanguage] = useState('en');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [languageModalVisible, setLanguageModalVisible] = useState(false);
  const { API_URL } = Constants.expoConfig.extra;
  
  const { width, height } = useWindowDimensions();
  const isTabletDevice = isTablet();
  const isAndroid = Platform.OS === 'android';
  
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  
  const languages = [
    { code: 'en', name: 'English' },
    { code: 'zh-hant', name: '中文' },
  ];
  
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      })
    ]).start();
  }, []);

  const getLanguageName = (langCode) => {
    const lang = languages.find(l => l.code === langCode);
    return lang ? lang.name : 'English';
  };
  
  const handleRegister = useCallback(async () => {
    setErrorMessage('');
  
    if (!firstName.trim()) {
      setErrorMessage('Please enter your first name.');
      return;
    }
  
    if (!lastName.trim()) {
      setErrorMessage('Please enter your last name.');
      return;
    }
  
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    Keyboard.dismiss();
    setLoading(true);
  
    try {
      const token = await SecureStore.getItemAsync('token');
      
      if (!token) {
        setErrorMessage('Authentication token not found. Please log in again.');
        return;
      }
      
      const userData = {
        given_name: firstName.trim(),
        family_name: lastName.trim(),
        phone_number: phoneNumber,
        language_preference: language
      };
      
      if (__DEV__) {
        console.log('===== REGISTRATION API REQUEST LOGGING =====');
        console.log('[API Log] API URL:', `https://dev.whatsdish.com/api/profile`);
        console.log('[API Log] Request Method: PUT');
        console.log('[API Log] Request Headers:', {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token.slice(0, 10)}...`
        });
        console.log('[API Log] Request Payload:');
        console.log(JSON.stringify(userData, null, 2));
        console.log('============================================');
      }
  
      const response = await fetch(`https://dev.whatsdish.com/api/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(userData)
      });
  
      if (__DEV__) {
        console.log('===== REGISTRATION API RESPONSE LOGGING =====');
        console.log('[API Log] Response Status:', response.status);
        console.log('[API Log] Response Status Text:', response.statusText);
      }
  
      const data = await response.json();
  
      if (__DEV__) {
        console.log('[API Log] Response Body:');
        console.log(JSON.stringify(data, null, 2));
        console.log('=============================================');
      }
  
      if (response.ok) {
        if (__DEV__) {
          console.log('[Registration Screen Log] Registration successful!');
          if (data.data) {
            console.log('[Registration Screen Log] User data received:');
            console.log(JSON.stringify(data.data, null, 2));
          }
        }
        
        if (data.data && data.data.sub) {
          await SecureStore.setItemAsync('accountId', data.data.sub);
          if (__DEV__) {
            console.log('[Registration Screen Log] Stored accountId:', data.data.sub);
          }
        }
        
        setIsAuthenticated(true);
        
      } else {
        setErrorMessage(data.error || data.message || 'Failed to register user.');
        
        if (__DEV__) {
          console.error('[API Log] Registration failed with error:');
          console.error(data.error || data.message || 'No specific error message returned');
        }
      }
    } catch (err) {
      if (__DEV__) {
        console.error('===== REGISTRATION API ERROR LOGGING =====');
        console.error('[API Log] Error Type:', err.name);
        console.error('[API Log] Error Message:', err.message);
        console.error('[API Log] Error Stack:', err.stack);
        console.error('===========================================');
      }
      setErrorMessage('Unexpected error during registration. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [firstName, lastName, language, phoneNumber, navigation]);

  const handleLanguageSave = (langCode) => {
    setLanguage(langCode);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar 
        barStyle="dark-content" 
        backgroundColor="#fff" 
        translucent={false}
      />
      
      <View style={styles.backButtonContainer}>
        <BackButton onPress={() => navigation.goBack()} />
      </View>
      
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardAvoid}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollView 
          contentContainerStyle={[
            styles.container,
            isTabletDevice && styles.tabletContainer,
            isAndroid && styles.androidContainer
          ]}
          keyboardShouldPersistTaps="handled"
        >
          <LinearGradient 
            colors={['#fff', '#f8f8f8']} 
            style={styles.backgroundGradient}
          />
          
          <View style={[
            isTabletDevice ? styles.tabletContentContainer : styles.mobileContentContainer
          ]}>
            <Animated.View 
              style={[
                styles.headerContainer,
                isTabletDevice && styles.tabletHeaderContainer,
                { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }
              ]}
            >
              <Text style={[styles.title, isTabletDevice && styles.tabletTitle]}>Complete Your Profile</Text>
              <Text style={[styles.subtitle, isTabletDevice && styles.tabletSubtitle]}>Please enter your details to continue</Text>
            </Animated.View>

            <Animated.View 
              style={[
                styles.formContainer,
                { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }
              ]}
            >
              <View style={styles.inputContainer}>
                <Text style={[styles.inputLabel, isTabletDevice && styles.tabletInputLabel]}>First Name</Text>
                <TextInput
                  style={[styles.input, isTabletDevice && styles.tabletInput]}
                  placeholder="Enter your first name"
                  value={firstName}
                  onChangeText={setFirstName}
                  autoCapitalize="words"
                  autoCorrect={false}
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={[styles.inputLabel, isTabletDevice && styles.tabletInputLabel]}>Last Name</Text>
                <TextInput
                  style={[styles.input, isTabletDevice && styles.tabletInput]}
                  placeholder="Enter your last name"
                  value={lastName}
                  onChangeText={setLastName}
                  autoCapitalize="words"
                  autoCorrect={false}
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={[styles.inputLabel, isTabletDevice && styles.tabletInputLabel]}>Preferred Language</Text>
                <TouchableOpacity 
                  style={[styles.languageSelector, isTabletDevice && styles.tabletLanguageSelector]}
                  onPress={() => setLanguageModalVisible(true)}
                >
                  <Text style={[styles.languageSelectorText, isTabletDevice && styles.tabletLanguageSelectorText]}>
                    {getLanguageName(language)}
                  </Text>
                  <Ionicons name="chevron-forward" size={isTabletDevice ? 24 : 20} color="#666" />
                </TouchableOpacity>
              </View>

              <View style={[styles.phoneInfoContainer, isTabletDevice && styles.tabletPhoneInfoContainer]}>
                <Text style={[styles.phoneInfoLabel, isTabletDevice && styles.tabletPhoneInfoLabel]}>Phone Number</Text>
                <Text style={[styles.phoneInfoValue, isTabletDevice && styles.tabletPhoneInfoValue]}>{phoneNumber}</Text>
              </View>

              {errorMessage ? (
                <View style={styles.errorContainer}>
                  <MaterialIcons name="error-outline" size={isTabletDevice ? 24 : 20} color="#ff4d4d" />
                  <Text style={[styles.errorText, isTabletDevice && styles.tabletErrorText]}>{errorMessage}</Text>
                </View>
              ) : null}

              <TouchableOpacity 
                style={[
                  styles.button,
                  isTabletDevice && styles.tabletButton,
                  (loading || !firstName.trim() || !lastName.trim()) ? styles.buttonDisabled : null
                ]} 
                onPress={handleRegister} 
                disabled={loading || !firstName.trim() || !lastName.trim()}
              >
                <LinearGradient
                  colors={(loading || !firstName.trim() || !lastName.trim()) ? ['#e0e0e0', '#d5d5d5'] : ['#2E8B57', '#3CB371']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.buttonGradient}
                >
                  {loading ? (
                    <ActivityIndicator color="#fff" size={isTabletDevice ? "large" : "small"} />
                  ) : (
                    <Text style={[styles.buttonText, isTabletDevice && styles.tabletButtonText]}>
                      Complete Registration
                    </Text>
                  )}
                </LinearGradient>
              </TouchableOpacity>
              
              <View style={styles.footerTextContainer}>
                <Text style={[styles.footerText, isTabletDevice && styles.tabletFooterText]}>
                  By continuing, you agree to our{' '}
                  <Text style={styles.linkText}>Terms</Text> and{' '}
                  <Text style={styles.linkText}>Privacy Policy</Text>
                </Text>
              </View>
            </Animated.View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <LanguageSelectionModal
        visible={languageModalVisible}
        onClose={() => setLanguageModalVisible(false)}
        currentLanguage={language}
        onSave={handleLanguageSave}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  backButtonContainer: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 10 : -30,
    left: 10,
    zIndex: 10,
    width: 40,
    height: 40,
  },
  keyboardAvoid: {
    flex: 1,
  },
  container: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: Platform.OS === 'ios' ? 60 : 60,
    paddingBottom: 40,
  },
  androidContainer: {
    paddingTop: 80,
  },
  tabletContainer: {
    paddingHorizontal: 40,
    paddingTop: 60,
    paddingBottom: 60,
  },
  mobileContentContainer: {
    width: '100%',
  },
  tabletContentContainer: {
    width: '100%',
    maxWidth: 600,
    alignSelf: 'center',
  },
  backgroundGradient: {
    ...StyleSheet.absoluteFillObject,
  },
  headerContainer: {
    marginBottom: 30,
    marginTop: 0,
  },
  tabletHeaderContainer: {
    marginBottom: 40,
    marginTop: 10,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#333',
    marginBottom: 10,
  },
  tabletTitle: {
    fontSize: 34,
    marginBottom: 15,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    lineHeight: 22,
  },
  tabletSubtitle: {
    fontSize: 18,
    lineHeight: 26,
  },
  formContainer: {
    width: '100%',
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#555',
    marginBottom: 8,
  },
  tabletInputLabel: {
    fontSize: 16,
    marginBottom: 10,
  },
  input: {
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  tabletInput: {
    padding: 18,
    fontSize: 18,
    borderRadius: 14,
  },
  languageSelector: {
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tabletLanguageSelector: {
    padding: 18,
    borderRadius: 14,
  },
  languageSelectorText: {
    fontSize: 16,
    color: '#333',
  },
  tabletLanguageSelectorText: {
    fontSize: 18,
  },
  phoneInfoContainer: {
    marginBottom: 20,
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  tabletPhoneInfoContainer: {
    padding: 18,
    borderRadius: 14,
  },
  phoneInfoLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#555',
    marginBottom: 8,
  },
  tabletPhoneInfoLabel: {
    fontSize: 16,
    marginBottom: 10,
  },
  phoneInfoValue: {
    fontSize: 16,
    color: '#333',
  },
  tabletPhoneInfoValue: {
    fontSize: 18,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    padding: 12,
    backgroundColor: '#fff2f2',
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#ff4d4d',
  },
  errorText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#ff4d4d',
    flex: 1,
  },
  tabletErrorText: {
    fontSize: 16,
    marginLeft: 10,
  },
  button: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  tabletButton: {
    borderRadius: 14,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    marginTop: 10,
    marginBottom: 30,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonGradient: {
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  tabletButtonText: {
    fontSize: 18,
    paddingVertical: 4,
  },
  footerTextContainer: {
    marginTop: 10,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: '#777',
    textAlign: 'center',
    lineHeight: 20,
  },
  tabletFooterText: {
    fontSize: 16,
    lineHeight: 24,
  },
  linkText: {
    color: '#2E8B57',
    fontWeight: '500',
  },
});