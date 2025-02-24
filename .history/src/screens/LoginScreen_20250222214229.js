import React, { useState, useRef, useEffect } from 'react';
import {
  TextInput,
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as SecureStore from 'expo-secure-store';
import Constants from 'expo-constants'; 

export default function LoginScreen({ setIsAuthenticated }) {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isCodeSent, setIsCodeSent] = useState(false);
  const navigation = useNavigation();
  const codeInputs = useRef([]);
  
  const { API_URL } = Constants.expoConfig.extra; 

  useEffect(() => {
    if (__DEV__) {
      console.log('__DEV__:', __DEV__);
      console.log('Current Environment:', process.env.NODE_ENV); 
      console.log('API URL:', API_URL);
    }
  }, []); // 空依赖数组，确保只在组件挂载时执行

  const handleSendCode = async () => {
    setErrorMessage('');
    if (!phoneNumber) {
      setErrorMessage('Please enter your phone number.');
      return;
    }

    setLoading(true);

    try {
      if (__DEV__) {
        console.log('Sending verification code for phone number:', phoneNumber);
      }

      const response = await fetch(`${API_URL}/api/send-code`, { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phoneNumber }),
      });

      const data = await response.json();

      if (__DEV__) {
        console.log('Response from send-code:', data);
      }

      if (response.ok) {
        setIsCodeSent(true);
        if (__DEV__) {
          console.log('Verification code sent successfully');
        }
      } else {
        setErrorMessage(data.error || 'Failed to send verification code.');
      }
    } catch (err) {
      if (__DEV__) {
        console.error('Error during send-code request:', err);
      }
      setErrorMessage('Unexpected error during sending code.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    setErrorMessage('');
    if (code.some(digit => !digit)) {
      setErrorMessage('Please enter the verification code.');
      return;
    }

    setLoading(true);
    try {
      if (__DEV__) {
        console.log('Verifying code:', code.join(''));
      }

      const response = await fetch(`${API_URL}/api/verify-code`, { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phoneNumber, code: code.join('') }),
      });

      const data = await response.json();

      if (__DEV__) {
        console.log('Response from verify-code:', data);
      }

      if (response.ok) {
        await SecureStore.setItemAsync('token', data.token);
        console.log('Stored userPhoneNumber:', phoneNumber);
        setIsAuthenticated(true);
        if (__DEV__) {
          console.log('User authenticated successfully');
        }
      } else {
        setErrorMessage(data.error || 'Invalid verification code.');
      }
    } catch (err) {
      if (__DEV__) {
        console.error('Error during verify-code request:', err);
      }
      setErrorMessage('Unexpected error during verification.');
    } finally {
      setLoading(false);
    }
  };

  const handleCodeChange = (text, index) => {
    const newCode = [...code];
    newCode[index] = text;
    setCode(newCode);

    if (text && index < 5) {
      codeInputs.current[index + 1].focus();
    }

    if (!text && index > 0) {
      codeInputs.current[index - 1].focus();
    }
  };

  useEffect(() => {
    if (code.every(digit => digit !== '') && isCodeSent) {
      handleVerifyCode();
    }
  }, [code]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
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
          />
        </View>
      ) : (
        <View style={styles.codeContainer}>
          {code.map((digit, index) => (
            <TextInput
              key={index}
              style={styles.codeInput}
              placeholder="•"
              placeholderTextColor="#999"
              value={digit}
              onChangeText={(text) => handleCodeChange(text, index)}
              keyboardType="number-pad"
              maxLength={1}
              ref={(ref) => (codeInputs.current[index] = ref)}
              textContentType="oneTimeCode"  // Ensures auto-fill works for the verification code
              onKeyPress={({ nativeEvent }) => {
                if (nativeEvent.key === 'Backspace' && !digit && index > 0) {
                  codeInputs.current[index - 1].focus();
                }
              }}
            />
          ))}
        </View>
      )}

      {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}

      {!isCodeSent ? (
        <TouchableOpacity style={styles.button} onPress={handleSendCode} disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Send Code</Text>
          )}
        </TouchableOpacity>
      ) : (
        <TouchableOpacity style={styles.button} onPress={handleVerifyCode} disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Verify Code</Text>
          )}
        </TouchableOpacity>
      )}

      <Text style={styles.footerText}>
        Don't have an account?{' '}
        <Text style={styles.link} onPress={() => navigation.navigate('Register')}>
          Register
        </Text>
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#fff',
    paddingBottom: 80,
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
    marginBottom: 10,
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
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  footerText: {
    textAlign: 'center',
    color: '#000',
    marginTop: 20,
    fontSize: 16,
  },
  link: {
    color: '#000',
    textDecorationLine: 'underline',
  },
  phoneInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    backgroundColor: '#fff',
    paddingHorizontal: 10,
    marginBottom: 10,
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
  },
});