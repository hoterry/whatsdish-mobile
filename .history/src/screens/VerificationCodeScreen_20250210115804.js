import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { supabase } from '../../supabase'; // 导入 supabase 配置
import { useNavigation } from '@react-navigation/native';

export default function VerificationCodeScreen({ route }) {
  const [verificationCode, setVerificationCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const navigation = useNavigation();

  const { phone } = route.params; // 获取传递的手机号

  // 验证验证码
  const verifyCode = async () => {
    setLoading(true);
    setErrorMessage('');
    try {
      const { data, error } = await supabase.auth.verifyOtp({
        phone: phone,
        token: verificationCode,
        type: 'signup' // 使用 'signup' 类型进行注册
      });

      if (error) {
        setErrorMessage('Invalid verification code');
        setLoading(false);
        return;
      }

      // 成功验证，跳转到应用首页或其他页面
      navigation.navigate('Home'); // 你可以根据需求修改导航目标

      setLoading(false);
    } catch (err) {
      setErrorMessage('Unexpected error during verification');
      console.error(err);
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Enter Verification Code</Text>
      <Text style={styles.subHeader}>We sent a verification code to your phone number</Text>

      {/* 输入验证码 */}
      <TextInput
        style={styles.input}
        placeholder="Enter Code"
        placeholderTextColor="#999"
        value={verificationCode}
        onChangeText={setVerificationCode}
        keyboardType="numeric"
      />

      {/* 错误信息 */}
      {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}

      {/* 验证按钮 */}
      <TouchableOpacity style={styles.button} onPress={verifyCode} disabled={loading}>
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Verify Code</Text>
        )}
      </TouchableOpacity>

      {/* 返回按钮 */}
      <TouchableOpacity
        style={styles.footerTextContainer}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.footerText}>Back</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#f9f9f9',
  },
  header: {
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  subHeader: {
    fontSize: 18,
    textAlign: 'center',
    color: '#666',
    marginBottom: 20,
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15,
    paddingLeft: 15,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  button: {
    height: 50,
    backgroundColor: '#3b82f6',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    fontSize: 14,
    marginBottom: 20,
  },
  footerTextContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  footerText: {
    fontSize: 16,
    color: '#3b82f6',
    fontWeight: 'bold',
  },
});
