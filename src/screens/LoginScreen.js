import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import {
  TextInput,
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Image,
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
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import useUserFetcher from '../context/FetchUser';
import * as Haptics from 'expo-haptics';

// Get screen dimensions
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
  
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  
  // Run entrance animation on mount
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
      // Reset and run animations when switching to code input
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

  // Format phone number
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

    // Haptic feedback
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

    // Haptic feedback
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    Keyboard.dismiss();
    setLoading(true);
    
    try {
      const phoneWithCountryCode = formattedPhoneNumber();
      
      if (__DEV__) {
        console.log('[Login Screen Log] Verifying code:', code.join(''));
        console.log('[Login Screen Log] Phone number with country code:', phoneWithCountryCode);
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
        
        if (__DEV__) {
          console.log('[Login Screen Log] Stored userPhoneNumber:', phoneWithCountryCode);
        }

        try {
          const accountId = await fetchUserData();
          if (accountId) {
            await SecureStore.setItemAsync('accountId', accountId);
            if (__DEV__) {
              console.log('[Login Screen Log] Stored accountId:', accountId);
            }
          }
        } catch (userError) {
          if (__DEV__) {
            console.error('[Login Screen Log] Error fetching user data:', userError);
          }
        }

        // Success animation before setting authenticated
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }).start(() => {
          // Set authenticated state after fade out
          setIsAuthenticated(true);
        });

        if (__DEV__) {
          console.log('[Login Screen Log] User authenticated successfully');
        }
      } else {
        setErrorMessage(data.error || 'Invalid verification code.');
        
        // Error shake animation for invalid code
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
      }
      setErrorMessage('Unexpected error during verification.');
    } finally {
      setLoading(false);
    }
  }, [code, phoneNumber, API_URL, fetchUserData, setIsAuthenticated, formattedPhoneNumber]);

  const handleCodeChange = useCallback((text, index) => {
    const numericText = text.replace(/[^0-9]/g, '');
    
    if (numericText || text === '') {
      // Provide subtle haptic feedback on each digit
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
    // Format the phone number as user types (XXX) XXX-XXXX
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
    // Animation for going back
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setIsCodeSent(false);
      setResendTimer(0);
      setCode(['', '', '', '', '', '']);
      setErrorMessage('');
      
      // Fade back in the phone input
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
          
          <View style={styles.headerSection}>
            <Image 
              source={require('../../assets/logo-green.png')} 
              style={styles.logo} 
              resizeMode="contain" 
            />
            <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
              <Text style={styles.header}>Welcome</Text>
              <Text style={styles.subHeader}>
                {!isCodeSent 
                  ? 'Sign in to your secure account'
                  : 'Enter the verification code'
                }
              </Text>
            </Animated.View>
          </View>

          <Animated.View 
            style={[
              styles.formContainer,
              { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }
            ]}
          >
            {!isCodeSent ? (
              <>
                <View style={styles.inputLabel}>
                  <MaterialIcons name="smartphone" size={20} color="#2E8B57" />
                  <Text style={styles.labelText}>Mobile Number</Text>
                </View>
                <View style={styles.phoneInputContainer}>
                  <View style={styles.countryCodeContainer}>
                    <Image source={require('../../assets/canada-flag.png')} style={styles.flag} />
                    <Text style={styles.countryCode}>+1</Text>
                  </View>
                  <TextInput
                    style={styles.phoneInput}
                    placeholder="Enter your number"
                    placeholderTextColor="rgba(0,0,0,0.4)"
                    value={phoneNumber}
                    onChangeText={handlePhoneChange}
                    keyboardType="phone-pad"
                    returnKeyType="send"
                    onSubmitEditing={handleSendCode}
                    maxLength={12}
                    selectionColor="#2E8B57"
                  />
                </View>
              </>
            ) : (
              <View style={styles.codeSection}>
                <TouchableOpacity 
                  onPress={handleBack} 
                  style={styles.backButton}
                  accessibilityLabel="Go back to phone number"
                >
                  <Ionicons name="arrow-back-circle" size={30} color="#2E8B57" />
                </TouchableOpacity>
                
                <Text style={styles.codeSentText}>
                  Code sent to {formattedPhoneNumber()}
                </Text>
                
                <View style={styles.codeContainer}>
                  {code.map((digit, index) => (
                    <TextInput
                      key={index}
                      style={[
                        styles.codeInput,
                        digit ? styles.codeInputFilled : null
                      ]}
                      placeholder="•"
                      placeholderTextColor="rgba(255,255,255,0.5)"
                      value={digit}
                      onChangeText={(text) => handleCodeChange(text, index)}
                      keyboardType="number-pad"
                      maxLength={1}
                      ref={(ref) => (codeInputs.current[index] = ref)}
                      textContentType="oneTimeCode"
                      onKeyPress={(e) => handleKeyPress(e, index)}
                      accessibilityLabel={`Verification code digit ${index + 1}`}
                      selectionColor="#2E8B57"
                    />
                  ))}
                </View>
                
                <TouchableOpacity 
                  onPress={handleSendCode} 
                  style={styles.resendButton} 
                  disabled={resendTimer > 0}
                >
                  <Text style={[
                    styles.resendButtonText,
                    resendTimer > 0 ? styles.resendButtonTextDisabled : null
                  ]}>
                    {resendTimer > 0 ? `Resend Code (${resendTimer}s)` : 'Resend Code'}
                  </Text>
                </TouchableOpacity>
              </View>
            )}

            {errorMessage ? (
              <Animated.View style={styles.errorContainer}>
                <MaterialIcons name="error-outline" size={20} color="#ff4d4d" />
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
                  <ActivityIndicator color="#fff" />
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
    paddingHorizontal: 24,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    paddingBottom: Platform.OS === 'ios' ? 40 : 20,
  },
  backgroundGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  headerSection: {
    alignItems: 'center',
    marginBottom: 15,
  },
  logo: {
    width: 70,
    height: 70,
    marginBottom: 5,
  },
  header: {
    fontSize: 34,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#000',
    marginBottom: 10,
    letterSpacing: 0.5,
  },
  subHeader: {
    fontSize: 18,
    textAlign: 'center',
    color: '#666',
    marginBottom: 5,
  },
  formContainer: {
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
  },
  inputLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  labelText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 8,
    fontWeight: '500',
  },
  phoneInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 12,
    backgroundColor: '#f9f9f9',
    paddingHorizontal: 16,
    marginBottom: 10,
    height: 60,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  countryCodeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 16,
    borderRightWidth: 1,
    borderRightColor: '#e0e0e0',
    height: '100%',
  },
  flag: {
    width: 24,
    height: 24,
    marginRight: 8,
    borderRadius: 4,
  },
  countryCode: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  phoneInput: {
    flex: 1,
    height: 60,
    fontSize: 18,
    paddingLeft: 16,
    color: '#333',
    fontWeight: '500',
  },
  codeSection: {
    marginTop: 10,
    marginBottom: 10,
    width: '100%',
  },
  codeSentText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  codeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  codeInput: {
    width: 52,
    height: 64,
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    textAlign: 'center',
    color: '#333',
    borderColor: '#e0e0e0',
    borderWidth: 1,
    fontSize: 24,
    fontWeight: 'bold',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 5,
    elevation: 2,
  },
  codeInputFilled: {
    backgroundColor: 'rgba(46,139,87,0.1)',
    borderColor: '#2E8B57',
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,77,77,0.07)',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,77,77,0.2)',
  },
  errorText: {
    color: '#ff4d4d',
    fontSize: 14,
    marginLeft: 8,
    flex: 1,
  },
  button: {
    height: 56,
    borderRadius: 12,
    marginBottom: 10,
    overflow: 'hidden',
    shadowColor: '#2E8B57',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonGradient: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.7,
    shadowOpacity: 0.1,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  backButton: {
    position: 'absolute',
    top: -10,
    left: 0,
    zIndex: 1,
    padding: 8,
  },
  resendButton: {
    alignSelf: 'center',
    marginTop: 5,
    marginBottom: 5,
    padding: 10,
  },
  resendButtonText: {
    color: '#2E8B57',
    fontSize: 16,
    fontWeight: '600',
  },
  resendButtonTextDisabled: {
    color: '#999',
  },
  footerTextContainer: {
    marginTop: 20,
    alignItems: 'center', 
  },
  footerText: {
    color: '#777',
    fontSize: 14,
    textAlign: 'center',
  },
  linkText: {
    color: '#2E8B57',
    fontWeight: '600',
  },
});