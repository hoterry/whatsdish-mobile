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
  Modal,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as SecureStore from 'expo-secure-store';
import Constants from 'expo-constants';
import { Ionicons } from '@expo/vector-icons';
import useUserFetcher from '../context/FetchUser';
import NameModal from '../components/NameModal'; 

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
  
  // Add state for name modal
  const [showNameModal, setShowNameModal] = useState(false);
  const [userName, setUserName] = useState('');
  const [nameError, setNameError] = useState('');
  const [savingName, setSavingName] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

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

    Keyboard.dismiss();
    setLoading(true);

    try {
      // Add +1 prefix to the phone number
      const formattedPhoneNumber = `+1${phoneNumber.replace(/\D/g, '')}`;
      
      console.log('[API URL Log] Sending code to:', `${API_URL}/api/send-code`)
      const response = await fetch(`${API_URL}/api/send-code`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phoneNumber: formattedPhoneNumber }),
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
  }, [phoneNumber, resendTimer, API_URL, isValidPhoneNumber]);

  const handleVerifyCode = useCallback(async () => {
    setErrorMessage('');
    
    if (code.some(digit => !digit)) {
      setErrorMessage('Please enter the complete verification code.');
      return;
    }
  
    Keyboard.dismiss();
    setLoading(true);
    
    try {
      if (__DEV__) {
        console.log('[Login Screen Log] Verifying code:', code.join(''));
      }
      
      // Add +1 prefix to the phone number
      const formattedPhoneNumber = `+1${phoneNumber.replace(/\D/g, '')}`;
  
      const response = await fetch(`${API_URL}/api/verify-code`, { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          phoneNumber: formattedPhoneNumber, 
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
          console.log('[Login Screen Log] Stored userPhoneNumber:', formattedPhoneNumber);
        }
  
        try {
          const user = await fetchUserData();
  
          const isMissingProfile =
            !user?.phone || user.phone.trim() === '' ||
            !user?.name || user.name.trim() === '';
  
          if (__DEV__) {
            console.log('[Login Screen Log] Fetched user:', user);
            console.log('[Login Screen Log] Missing profile:', isMissingProfile);
          }
  
          if (isMissingProfile) {
            setShowNameModal(true); // ✅ 顯示輸入名字的 Modal
          } else {
            await SecureStore.setItemAsync('accountId', user.accountId);
            setIsAuthenticated(true);
          }
        } catch (userError) {
          if (__DEV__) {
            console.error('[Login Screen Log] Error fetching user data:', userError);
          }

          setShowNameModal(true);
        }
      } else {
        setErrorMessage(data.error || 'Invalid verification code.');
      }
    } catch (err) {
      if (__DEV__) {
        console.error('[Login Screen Log] Error during verify-code request:', err);
      }
      setErrorMessage('Unexpected error during verification.');
    } finally {
      setLoading(false);
    }
  }, [code, phoneNumber, API_URL, fetchUserData, setIsAuthenticated]);

  const handleSaveName = useCallback(() => {
    //if (!userName.trim()) {
 //    setNameError('Please enter your name');
    //  return;
  //  }
  
    setNameError('');
    setShowNameModal(false);
    setIsAuthenticated(true); // 直接完成登入
  }, [userName, setIsAuthenticated]);
  

  const handleCodeChange = useCallback((text, index) => {
    const numericText = text.replace(/[^0-9]/g, '');
    
    if (numericText || text === '') {
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

  const handleBack = useCallback(() => {
    setIsCodeSent(false);
    setResendTimer(0);
    setCode(['', '', '', '', '', '']);
    setErrorMessage('');
  }, []);

  useEffect(() => {
    const allDigitsFilled = code.every(digit => digit !== '');
    if (allDigitsFilled && isCodeSent) {
      const timer = setTimeout(() => {
        handleVerifyCode();
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [code, isCodeSent, handleVerifyCode]);

  return (
    <ScrollView 
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
    >
      <Image source={require('../../assets/logo.png')} style={styles.logo} />
      <Text style={styles.header}>Welcome Back</Text>
      <Text style={styles.subHeader}>Login to your account</Text>

      {!isCodeSent ? (
        <View style={styles.phoneInputContainer}>
          <View style={styles.countryCodeContainer}>
            <Image source={require('../../assets/canada-flag.png')} style={styles.flag} />
            <Text style={styles.countryCode}>+1</Text>
          </View>
          <TextInput
            style={styles.phoneInput}
            placeholder="Enter your number"
            placeholderTextColor="#999"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            keyboardType="phone-pad"
            returnKeyType="send"
            onSubmitEditing={handleSendCode}
            maxLength={12}
          />
        </View>
      ) : (
        <View>
          <TouchableOpacity 
            onPress={handleBack} 
            style={styles.backButton}
            accessibilityLabel="Go back to phone number"
          >
            <Ionicons name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
          
          <View style={styles.codeContainer}>
            {code.map((digit, index) => (
              <TextInput
                key={index}
                style={[
                  styles.codeInput,
                  digit ? styles.codeInputFilled : null
                ]}
                placeholder="•"
                placeholderTextColor="#999"
                value={digit}
                onChangeText={(text) => handleCodeChange(text, index)}
                keyboardType="number-pad"
                maxLength={1}
                ref={(ref) => (codeInputs.current[index] = ref)}
                textContentType="oneTimeCode"
                onKeyPress={(e) => handleKeyPress(e, index)}
                accessibilityLabel={`Verification code digit ${index + 1}`}
              />
            ))}
          </View>
          
          {isCodeSent && (
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
          )}
        </View>
      )}

      {errorMessage ? (
        <Text style={styles.errorText}>{errorMessage}</Text>
      ) : null}

      {!isCodeSent ? (
        <TouchableOpacity 
          style={[
            styles. button,
            !isValidPhoneNumber && phoneNumber ? styles.buttonDisabled : null
          ]} 
          onPress={handleSendCode} 
          disabled={loading || (!isValidPhoneNumber && phoneNumber.length > 0)}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Send Code</Text>
          )}
        </TouchableOpacity>
      ) : (
        <TouchableOpacity 
          style={styles.button} 
          onPress={handleVerifyCode} 
          disabled={loading || code.some(digit => !digit)}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Verify Code</Text>
          )}
        </TouchableOpacity>
      )}
        <NameModal
          visible={showNameModal}
          firstName={firstName}
          lastName={lastName}
          setFirstName={setFirstName}
          setLastName={setLastName}
          onSubmit={handleSaveName}
          error={nameError}
          loading={savingName}
        />

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#fff',
    paddingBottom: Platform.OS === 'ios' ? 80 : 60,
  },
  logo: {
    width: 80,
    height: 80,
    alignSelf: 'center',
    marginBottom: 10,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#000',
    marginBottom: 10,
  },
  subHeader: {
    fontSize: 16,
    textAlign: 'center',
    color: '#bbb',
    marginBottom: 30,
  },
  input: {
    height: 50,
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 15,
    color: '#000',
    borderColor: '#333',
    borderWidth: 1,
    fontSize: 16,
  },
  codeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  codeInput: {
    width: 50,
    height: 60,
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    textAlign: 'center',
    color: '#000',
    borderColor: '#ddd',
    borderWidth: 1,
    fontSize: 20,
    fontWeight: 'bold',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  codeInputFilled: {
    backgroundColor: '#f0f8ff',
    borderColor: '#007bff',
  },
  errorText: {
    color: '#ff4d4d',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 15,
  },
  button: {
    height: 50,
    backgroundColor: '#000',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 5,
    elevation: 5,
  },
  buttonDisabled: {
    backgroundColor: '#666',
    shadowOpacity: 0.4,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  phoneInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    backgroundColor: '#fff',
    paddingHorizontal: 10,
    marginBottom: 30,
  },
  countryCodeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 10,
    borderRightWidth: 1,
    borderRightColor: '#ccc',
  },
  flag: {
    width: 24,
    height: 24,
    marginRight: 5,
  },
  countryCode: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  phoneInput: {
    flex: 1,
    height: 50,
    fontSize: 16,
    paddingLeft: 10,
    color: '#000',
  },
  backButton: {
    position: 'absolute',
    top: -200,
    left: 10,
    zIndex: 1,
    padding: 10, 
  },
  resendButton: {
    alignSelf: 'center',
    marginTop: 10,
    marginBottom: 30,
    padding: 8, 
  },
  resendButtonText: {
    color: '#000',
    fontSize: 18,
    textDecorationLine: 'underline',
  },
  resendButtonTextDisabled: {
    color: '#999',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '85%',
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  modalSubHeader: {
    fontSize: 14,
    color: '#666',
    marginBottom: 24,
    textAlign: 'center',
  },
  nameInput: {
    width: '100%',
    padding: 14,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginBottom: 16,
  },
});