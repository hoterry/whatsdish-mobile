import React, { useState } from 'react'; 
import { TextInput, TouchableOpacity, View, Text, StyleSheet, ScrollView, ActivityIndicator, Image } from 'react-native'; 
import { supabase } from '../../supabase'; 
import { useNavigation } from '@react-navigation/native';

export default function RegisterScreen() {
  const [phone, setPhone] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isCodeSent, setIsCodeSent] = useState(false);

  const navigation = useNavigation();

  // 发送验证码到手机
  const sendVerificationCode = async () => {
    setLoading(true);
    setErrorMessage('');
    try {
      const { data, error } = await supabase.auth.signUp(
        { phone: phone }, // 使用手机号注册
        { redirectTo: 'your_redirect_url' } // 如果需要跳转，可以设置 redirect URL
      );
      
      if (error) {
        setErrorMessage(error.message);
        setLoading(false);
        return;
      }

      // 发送成功，设置状态为验证码已发送
      setIsCodeSent(true);
      setLoading(false);
    } catch (err) {
      setErrorMessage('Unexpected error while sending verification code');
      console.error(err);
      setLoading(false);
    }
  };

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

      // 成功验证，跳转到验证后页面或登录
      navigation.navigate('Home'); // 你可以根据需求修改导航目标

      setLoading(false);
    } catch (err) {
      setErrorMessage('Unexpected error during verification');
      console.error(err);
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image 
        source={require('../../assets/logo.png')} 
        style={styles.logo}
      />
      <Text style={styles.header}>Create an Account</Text>
      <Text style={styles.subHeader}>Register to get started</Text>

      {/* 输入框组件 */}
      <TextInput
        style={styles.input}
        placeholder="Phone Number"
        placeholderTextColor="#999"
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
      />

      {/* 如果验证码已发送，显示输入验证码 */}
      {isCodeSent && (
        <>
          <TextInput
            style={styles.input}
            placeholder="Enter Verification Code"
            placeholderTextColor="#999"
            value={verificationCode}
            onChangeText={setVerificationCode}
            keyboardType="numeric"
          />
        </>
      )}

      {/* 错误信息 */}
      {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}

      {/* 发送验证码按钮 */}
      {!isCodeSent ? (
        <TouchableOpacity style={styles.button} onPress={sendVerificationCode} disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Send Verification Code</Text>
          )}
        </TouchableOpacity>
      ) : (
        <TouchableOpacity style={styles.button} onPress={verifyCode} disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Verify Code</Text>
          )}
        </TouchableOpacity>
      )}

      {/* 登录链接 */}
      <Text
        style={styles.footerText}
        onPress={() => navigation.navigate('Login')}
      >
        Already have an account? <Text style={styles.link}>Login</Text>
      </Text>
    </ScrollView>
  );
}

// 样式
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#f9f9f9',
  },
  logo: {
    width: 150,
    height: 150,
    alignSelf: 'center',
    marginBottom: 20,
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
  footerText: {
    textAlign: 'center',
    fontSize: 16,
  },
  link: {
    color: '#3b82f6',
    fontWeight: 'bold',
  },
});
