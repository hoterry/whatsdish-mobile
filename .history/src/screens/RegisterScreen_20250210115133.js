import React, { useState } from 'react';
import { TextInput, TouchableOpacity, View, Text, StyleSheet, ScrollView, ActivityIndicator, Image } from 'react-native';
import { supabase } from '../../supabase';
import { useNavigation } from '@react-navigation/native';

export default function RegisterScreen() {
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const navigation = useNavigation();

  // 检查用户是否已存在
  const checkUserExists = async (phone) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('phone')
        .eq('phone', phone);
      if (error) {
        console.error('Error checking user:', error.message);
        return false;
      }
      return data.length > 0;
    } catch (err) {
      console.error('Unexpected error:', err);
      return false;
    }
  };

  // 注册用户
  const handleRegister = async () => {
    setLoading(true);
    setErrorMessage('');

    // 检查用户是否已存在
    const userExists = await checkUserExists(phone);
    if (userExists) {
      setErrorMessage('This phone number is already registered');
      setLoading(false);
      return;
    }

    try {
      // 使用手机号进行注册，发送验证码
      const { data, error } = await supabase.auth.signUp({
        phone: phone,
      });

      if (error) {
        setErrorMessage(error.message);
        setLoading(false);
        return;
      }

      const { user } = data;
      if (!user?.id) {
        setErrorMessage('User ID not found during registration');
        setLoading(false);
        return;
      }

      // 向数据库插入用户数据
      const { error: insertUserError } = await supabase.from('users').insert([
        {
          id: user.id,
          phone,
        },
      ]);

      if (insertUserError) {
        setErrorMessage(insertUserError.message);
        setLoading(false);
        return;
      }

      // 向数据库插入司机状态数据
      const { error: insertDriverError } = await supabase.from('drivers_status').insert([
        {
          driver_id: user.id,
          phone,
          is_online: false,
          last_seen: null,
          location: null,
        },
      ]);

      if (insertDriverError) {
        setErrorMessage(insertDriverError.message);
      } else {
        navigation.navigate('VerificationScreen'); // 导航到验证页面
      }
    } catch (err) {
      setErrorMessage('Unexpected error during registration');
      console.error('Error during registration:', err);
    } finally {
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

      {/* 错误信息 */}
      {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}

      {/* 注册按钮 */}
      <TouchableOpacity style={styles.button} onPress={handleRegister} disabled={loading}>
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Register</Text>
        )}
      </TouchableOpacity>

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
