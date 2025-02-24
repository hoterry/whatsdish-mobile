import React, { useState, useEffect } from 'react';
import { TextInput, TouchableOpacity, View, Text, StyleSheet, ScrollView, ActivityIndicator, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as SecureStore from 'expo-secure-store';

export default function LoginScreen({ setIsAuthenticated }) {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isCodeSent, setIsCodeSent] = useState(false);
  const navigation = useNavigation();

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
        setIsCodeSent(true);
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
    if (!phoneNumber || !code) {
      setErrorMessage('Please enter your phone number and verification code.');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('http://10.0.0.7:5000/api/verify-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phoneNumber, code }),
      });

      const data = await response.json();

      if (response.ok) {
        await SecureStore.setItemAsync('token', data.token);

        console.log('Stored userPhoneNumber:', phoneNumber);

        // 登录成功，更新 isAuthenticated 状态
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

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image source={require('../../assets/logo.png')} style={styles.logo} />
      <Text style={styles.header}>Welcome Back</Text>
      <Text style={styles.subHeader}>Login to your account</Text>

      <TextInput
        style={styles.input}
        placeholder="Phone Number"
        placeholderTextColor="#999"
        value={phoneNumber}
        onChangeText={setPhoneNumber}
        keyboardType="phone-pad"
      />

      {isCodeSent && (
        <TextInput
          style={styles.input}
          placeholder="Verification Code"
          placeholderTextColor="#999"
          value={code}
          onChangeText={setCode}
          keyboardType="number-pad"
        />
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
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subHeader: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  button: {
    width: '100%',
    height: 40,
    backgroundColor: '#007bff',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    marginBottom: 15,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  errorText: {
    color: 'red',
    marginBottom: 15,
  },
  footerText: {
    fontSize: 14,
    color: '#666',
  },
  link: {
    color: '#007bff',
    fontWeight: 'bold',
  },
});