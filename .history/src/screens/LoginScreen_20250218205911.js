import React, { useState, useRef } from 'react';
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

export default function LoginScreen({ setIsAuthenticated }) {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isCodeSent, setIsCodeSent] = useState(false);
  const navigation = useNavigation();
  const codeInputs = useRef([]);

  // ✅ 发送验证码
  const handleSendCode = async () => {
    setErrorMessage('');
    if (!phoneNumber) {
      setErrorMessage('Please enter your phone number.');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('http://10.0.0.7:5000/api/send-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phoneNumber }),
      });

      const data = await response.json();

      if (response.ok) {
        setIsCodeSent(true); // 切换到验证码输入
      } else {
        setErrorMessage(data.error || 'Failed to send verification code.');
      }
    } catch (err) {
      setErrorMessage('Unexpected error during sending code.');
    } finally {
      setLoading(false);
    }
  };

  // ✅ 验证验证码
  const handleVerifyCode = async () => {
    setErrorMessage('');
    if (code.some(digit => !digit)) {
      setErrorMessage('Please enter the verification code.');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('http://10.0.0.7:5000/api/verify-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phoneNumber, code: code.join('') }),
      });

      const data = await response.json();

      if (response.ok) {
        await SecureStore.setItemAsync('token', data.token);
        console.log('Stored userPhoneNumber:', phoneNumber);
        setIsAuthenticated(true);
      } else {
        setErrorMessage(data.error || 'Invalid verification code.');
      }
    } catch (err) {
      setErrorMessage('Unexpected error during verification.');
    } finally {
      setLoading(false);
    }
  };

  // 处理验证码输入变化
  const handleCodeChange = (text, index) => {
    const newCode = [...code];
    newCode[index] = text;
    setCode(newCode);

    // 自动聚焦到下一个输入框
    if (text && index < 5) {
      codeInputs.current[index + 1].focus();
    }

    // 如果删除内容，则聚焦到前一个输入框
    if (!text && index > 0) {
      codeInputs.current[index - 1].focus();
    }
  };

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
    marginBottom: 50,
  },
  logo: {
    width: 100,
    height: 100,
    alignSelf: 'center',
    marginBottom: 30,
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
  errorText: {
    color: '#ff4d4d',
    fontSize: 14,
    textAlign: 'center',

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