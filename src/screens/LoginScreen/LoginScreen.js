import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
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
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as SecureStore from 'expo-secure-store';
import Constants from 'expo-constants';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import useUserFetcher from '../../context/FetchUser';
import * as Haptics from 'expo-haptics';
import LoginHeader from './LoginHeader';
import BackButton from './BackButton';
import PhoneInput from './PhoneInput';
import VerificationCode from './VerificationCode';
import { useLoading } from '../../context/LoadingContext';

const { width, height } = Dimensions.get('window');

export default function LoginScreen({ setIsAuthenticated }) {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isCodeSent, setIsCodeSent] = useState(false);
  const navigation = useNavigation();
  const codeInputs = useRef([]);
  const [resendTimer, setResendTimer] = useState(0);
  const { API_URL } = Constants.expoConfig.extra; 
  const { fetchUserData } = useUserFetcher();
  const { setLoading: setGlobalLoading } = useLoading();
  
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  
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

  useEffect(() => {
    if (isCodeSent) {
      fadeAnim.setValue(0);
      slideAnim.setValue(50);
      
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
        })
      ]).start();
    }
  }, [isCodeSent]);

  useEffect(() => {
    let timer;
    if (isCodeSent && resendTimer > 0) {
      timer = setInterval(() => {
        setResendTimer((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isCodeSent, resendTimer]);

  const isValidPhoneNumber = useMemo(() => {
    return /^\d{10}$/.test(phoneNumber.replace(/\D/g, ''));
  }, [phoneNumber]);

  const formattedPhoneNumber = useCallback(() => {
    const cleanNumber = phoneNumber.replace(/\D/g, '');
    return `+1${cleanNumber}`;
  }, [phoneNumber]);

  const handleSendCode = useCallback(async () => {
    if (resendTimer > 0) return;
    
    setErrorMessage('');

    if (!phoneNumber) {
      setErrorMessage('Please enter your phone number.');
      return;
    }
    
    if (!isValidPhoneNumber) {
      setErrorMessage('Please enter a valid phone number.');
      return;
    }

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    Keyboard.dismiss();
    setLoading(true);

    try {
      const phoneWithCountryCode = formattedPhoneNumber();
      
      if (__DEV__) {
        console.log('[API URL Log] Sending code to:', `${API_URL}/api/send-code`);
        console.log('[Login Screen Log] Phone number with country code:', phoneWithCountryCode);
      }
      
      const response = await fetch(`${API_URL}/api/send-code`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phoneNumber: phoneWithCountryCode }),
      });

      const data = await response.json();

      if (response.ok) {
        setIsCodeSent(true);
        setResendTimer(20);
        
        setTimeout(() => {
          if (codeInputs.current[0]) {
            codeInputs.current[0].focus();
          }
        }, 100);
      } else {
        setErrorMessage(data.error || 'Failed to send verification code.');
      }
    } catch (err) {
      if (__DEV__) {
        console.error('[Login Screen Log] Send code error:', err);
      }
      setErrorMessage('Unexpected error during sending code.');
    } finally {
      setLoading(false);
    }
  }, [phoneNumber, resendTimer, API_URL, isValidPhoneNumber, formattedPhoneNumber]);

  const handleVerifyCode = useCallback(async () => {
    setErrorMessage('');
    
    if (code.some(digit => !digit)) {
      setErrorMessage('Please enter the complete verification code.');
      return;
    }
  
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    Keyboard.dismiss();
    setLoading(true);
    
    try {
      const phoneWithCountryCode = formattedPhoneNumber();
      
      if (__DEV__) {
        console.log('===================== PHONE NUMBER LOGGING =====================');
        console.log('[Phone Log] Raw phone input:', phoneNumber);
        console.log('[Phone Log] Phone with country code for API:', phoneWithCountryCode);
        console.log('================================================================');
      }
  
      const response = await fetch(`${API_URL}/api/verify-code`, { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          phoneNumber: phoneWithCountryCode, 
          code: code.join('') 
        }),
      });
  
      const data = await response.json();
  
      if (__DEV__) {
        console.log('[Login Screen Log] Response from verify-code:', data);
      }
  
      if (response.ok) {
        await SecureStore.setItemAsync('token', data.token);
        await SecureStore.setItemAsync('phoneNumber', phoneWithCountryCode);
        if (__DEV__) {
          console.log('[Phone Log] Stored token successfully');
        }
  
        try {
          const user = await fetchUserData();
          
          if (__DEV__) {
            console.log('[Phone Log] User data returned from fetchUserData:', user);
            
            if (user) {
              console.log('[Phone Log] User contains phone?', !!user.phone);
              console.log('[Phone Log] Phone from user data:', user.phone);
            }
          }
          
          if (user && user.phone) {
            if (__DEV__) {
              console.log('[Phone Log] USER EXISTS ✓ - Phone number found in user data');
              console.log('[Phone Log] User accountId:', user.accountId);
            }

            Animated.timing(fadeAnim, {
              toValue: 0,
              duration: 300,
              useNativeDriver: true,
            }).start(() => {
              setIsAuthenticated(true);
            });
  
            if (__DEV__) {
              console.log('[Login Screen Log] User authenticated successfully');
            }
          } else {
            if (__DEV__) {
              console.log('[Phone Log] USER DOES NOT EXIST ✗ - No valid phone found in user data');
              console.log('[Phone Log] Will navigate to Registration with phone:', phoneWithCountryCode);
            }
            
            navigation.navigate('Registration', { phoneNumber: phoneWithCountryCode });
          }
        } catch (userError) {
          if (__DEV__) {
            console.error('[Login Screen Log] Error fetching user data:', userError);
            console.error('[Phone Log] Error details:', userError.message);
          }
          
          navigation.navigate('Registration', { phoneNumber: phoneWithCountryCode });
        }
      } else {
        setErrorMessage(data.error || 'Invalid verification code.');
        
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        
        const shakeAnimation = new Animated.Value(0);
        Animated.sequence([
          Animated.timing(shakeAnimation, { toValue: 10, duration: 50, useNativeDriver: true }),
          Animated.timing(shakeAnimation, { toValue: -10, duration: 50, useNativeDriver: true }),
          Animated.timing(shakeAnimation, { toValue: 10, duration: 50, useNativeDriver: true }),
          Animated.timing(shakeAnimation, { toValue: 0, duration: 50, useNativeDriver: true })
        ]).start();
      }
    } catch (err) {
      if (__DEV__) {
        console.error('[Login Screen Log] Error during verify-code request:', err);
        console.error('[Phone Log] Error during verification with phone:', phoneWithCountryCode);
        console.error('[Phone Log] Error details:', err.message);
      }
      setErrorMessage('Unexpected error during verification.');
    } finally {
      setLoading(false);
    }
  }, [code, phoneNumber, API_URL, fetchUserData, setIsAuthenticated, formattedPhoneNumber, navigation, fadeAnim, setGlobalLoading]);


  const handleCodeChange = useCallback((text, index) => {
    const numericText = text.replace(/[^0-9]/g, '');
    
    if (numericText || text === '') {
      Haptics.selectionAsync();
      
      const newCode = [...code];
      newCode[index] = numericText;
      setCode(newCode);

      if (numericText && index < 5) {
        codeInputs.current[index + 1].focus();
      }
    }
  }, [code]);

  const handleKeyPress = useCallback(({ nativeEvent }, index) => {
    if (nativeEvent.key === 'Backspace') {
      const newCode = [...code];

      if (index > 0 && !newCode[index]) {
        newCode[index - 1] = '';
        setCode(newCode);
        codeInputs.current[index - 1].focus();
      } 
      else if (newCode[index]) {
        newCode[index] = '';
        setCode(newCode);
      }
    }
  }, [code]);

  const handlePhoneChange = useCallback((text) => {
    const cleaned = text.replace(/\D/g, '');
    let formatted = cleaned;
    
    if (cleaned.length > 0) {
      formatted = '';
      if (cleaned.length > 0) {
        formatted += cleaned.substring(0, Math.min(3, cleaned.length));
      }
      if (cleaned.length > 3) {
        formatted += ' ' + cleaned.substring(3, Math.min(6, cleaned.length));
      }
      if (cleaned.length > 6) {
        formatted += ' ' + cleaned.substring(6, Math.min(10, cleaned.length));
      }
    }
    
    setPhoneNumber(formatted);
  }, []);

  const handleBack = useCallback(() => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setIsCodeSent(false);
      setResendTimer(0);
      setCode(['', '', '', '', '', '']);
      setErrorMessage('');
      
      fadeAnim.setValue(0);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
    });
  }, [fadeAnim]);

  useEffect(() => {
    const allDigitsFilled = code.every(digit => digit !== '');
    if (allDigitsFilled && isCodeSent) {
      const timer = setTimeout(() => {
        handleVerifyCode();
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [code, isCodeSent, handleVerifyCode]);

  const buttonDisabled = !isCodeSent 
    ? loading || (!isValidPhoneNumber && phoneNumber.length > 0)
    : loading || code.some(digit => !digit);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      <BackButton onPress={() => navigation.goBack()} />
      
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoid}
      >
        <ScrollView 
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
        >
          <LinearGradient 
            colors={['#fff', '#f8f8f8']} 
            style={styles.backgroundGradient}
          />
          
          <LoginHeader 
            isCodeSent={isCodeSent}
            fadeAnim={fadeAnim}
            slideAnim={slideAnim}
          />

          <Animated.View 
            style={[
              styles.formContainer,
              { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }
            ]}
          >
            {!isCodeSent ? (
              <PhoneInput 
                phoneNumber={phoneNumber}
                handlePhoneChange={handlePhoneChange}
                handleSendCode={handleSendCode}
              />
            ) : (
              <VerificationCode 
                formattedPhoneNumber={formattedPhoneNumber}
                handleBack={handleBack}
                code={code}
                handleCodeChange={handleCodeChange}
                handleKeyPress={handleKeyPress}
                codeInputs={codeInputs}
                handleSendCode={handleSendCode}
                resendTimer={resendTimer}
              />
            )}

            {errorMessage ? (
              <Animated.View style={styles.errorContainer}>
                <MaterialIcons name="error-outline" size={14} color="#ff4d4d" />
                <Text style={styles.errorText}>{errorMessage}</Text>
              </Animated.View>
            ) : null}

            <TouchableOpacity 
              style={[
                styles.button,
                buttonDisabled ? styles.buttonDisabled : null
              ]} 
              onPress={!isCodeSent ? handleSendCode : handleVerifyCode} 
              disabled={buttonDisabled}
            >
              <LinearGradient
                colors={buttonDisabled ? ['#e0e0e0', '#d5d5d5'] : ['#2E8B57', '#3CB371']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.buttonGradient}
              >
                {loading ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={styles.buttonText}>
                    {!isCodeSent ? 'Send Verification Code' : 'Verify & Login'}
                  </Text>
                )}
              </LinearGradient>
            </TouchableOpacity>
            
            <View style={styles.footerTextContainer}>
              <Text style={styles.footerText}>
                By continuing, you agree to our{' '}
                <Text style={styles.linkText}>Terms</Text> and{' '}
                <Text style={styles.linkText}>Privacy Policy</Text>
              </Text>
            </View>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  keyboardAvoid: {
    flex: 1,
  },
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    paddingBottom: Platform.OS === 'ios' ? 30 : 14,
  },
  backgroundGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  formContainer: {
    width: '100%',
    maxWidth: 360,
    alignSelf: 'center',
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,77,77,0.07)',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    marginBottom: 6,
    borderWidth: 1,
    borderColor: 'rgba(255,77,77,0.2)',
  },
  errorText: {
    color: '#ff4d4d',
    fontSize: 11,
    marginLeft: 5,
    flex: 1,
  },
  button: {
    height: 42,
    borderRadius: 8,
    marginBottom: 6,
    overflow: 'hidden',
    shadowColor: '#2E8B57',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
  buttonGradient: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.7,
    shadowOpacity: 0.08,
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    letterSpacing: 0.2,
  },
  footerTextContainer: {
    marginTop: 14,
    alignItems: 'center', 
  },
  footerText: {
    color: '#777',
    fontSize: 10,
    textAlign: 'center',
  },
  linkText: {
    color: '#2E8B57',
    fontWeight: '600',
  },
});