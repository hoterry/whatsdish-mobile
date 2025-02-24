import React, { useState } from 'react';
import { TextInput, TouchableOpacity, View, Text, StyleSheet, ScrollView, ActivityIndicator, Image } from 'react-native';

export default function LoginScreen({ setIsAuthenticated }) {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isCodeSent, setIsCodeSent] = useState(false);

  // ✅ 发送验证码
  const handleSendCode = async () => {
    setErrorMessage('');
    if (!phoneNumber) {
      setErrorMessage('Please enter your phone number.');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/send-code', {
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
      const response = await fetch('http://your-backend-url/api/verify-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phoneNumber, code }),
      });

      const data = await response.json();

      if (response.ok) {
        await SecureStore.setItemAsync('token', data.token);
        await SecureStore.setItemAsync('userId', data.userId);
        await SecureStore.setItemAsync('userPhoneNumber', phoneNumber);

        console.log('Stored token:', data.token);
        console.log('Stored userId:', data.userId);
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
    <View style={styles.container}>
      <View style={styles.card}>
        <Image source={require('../../assets/logo.png')} style={styles.logo} />
        <Text style={styles.title}>WhatsDish Driver</Text>

        {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}

        {!isCodeSent ? (
          <View>
            <TextInput
              style={styles.input}
              placeholder="Phone Number"
              placeholderTextColor="#999"
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              keyboardType="phone-pad"
            />
            <TouchableOpacity style={styles.button} onPress={handleSendCode} disabled={loading}>
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Send Code</Text>
              )}
            </TouchableOpacity>
          </View>
        ) : (
          <View>
            <TextInput
              style={styles.input}
              placeholder="Verification Code"
              placeholderTextColor="#999"
              value={code}
              onChangeText={setCode}
              keyboardType="number-pad"
            />
            <TouchableOpacity style={styles.button} onPress={handleVerifyCode} disabled={loading}>
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Verify Code</Text>
              )}
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f2f5', // 背景颜色
  },
  card: {
    width: '90%',
    maxWidth: 400,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5, // Android 阴影效果
  },
  logo: {
    width: 60,
    height: 60,
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  input: {
    width: '100%',
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 16,
    fontSize: 16,
  },
  button: {
    width: '100%',
    height: 50,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  errorText: {
    color: '#e74c3c',
    marginBottom: 16,
    fontSize: 14,
    textAlign: 'center',
  },
});