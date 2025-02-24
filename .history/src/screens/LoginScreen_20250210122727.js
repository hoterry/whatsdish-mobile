import React, { useState, useEffect } from 'react';
import { TextInput, TouchableOpacity, View, Text, StyleSheet, ScrollView, ActivityIndicator, Image } from 'react-native';
import { supabase } from '../../supabase'; 
import { useNavigation } from '@react-navigation/native';
import * as SecureStore from 'expo-secure-store'; 
import { useForm, Controller } from 'react-hook-form';

export default function LoginScreen() {
    const { control, handleSubmit, formState: { errors } } = useForm();
    const [loading, setLoading] = useState(false);
    const navigation = useNavigation();
  
    const onLogin = async (data) => {
      setLoading(true);
  
      const { email, password } = data;
      const { error } = await supabase.auth.signInWithPassword({ email, password });
  
      setLoading(false);
  
      if (error) {
        Alert.alert('登入失敗', error.message);
      } else {
        Alert.alert('登入成功', '歡迎回來！');
        navigation.navigate('Home'); // 跳轉到主頁
      }
    };
  
    return (
      <View style={styles.container}>
        <Text style={styles.header}>登入</Text>
  
        {/* Email 輸入框 */}
        <Controller
          control={control}
          name="email"
          rules={{
            required: '請輸入電子郵件',
            pattern: { value: /^\S+@\S+$/i, message: '電子郵件格式錯誤' },
          }}
          render={({ field: { onChange, value } }) => (
            <TextInput
              style={styles.input}
              placeholder="電子郵件"
              keyboardType="email-address"
              autoCapitalize="none"
              onChangeText={onChange}
              value={value}
            />
          )}
        />
        {errors.email && <Text style={styles.error}>{errors.email.message}</Text>}
  
        {/* Password 輸入框 */}
        <Controller
          control={control}
          name="password"
          rules={{ required: '請輸入密碼' }}
          render={({ field: { onChange, value } }) => (
            <TextInput
              style={styles.input}
              placeholder="密碼"
              secureTextEntry
              onChangeText={onChange}
              value={value}
            />
          )}
        />
        {errors.password && <Text style={styles.error}>{errors.password.message}</Text>}
  
        {/* 登入按鈕 */}
        <TouchableOpacity style={styles.button} onPress={handleSubmit(onLogin)} disabled={loading}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>登入</Text>}
        </TouchableOpacity>
  
        {/* 註冊按鈕 */}
        <TouchableOpacity onPress={() => navigation.navigate('Register')}>
          <Text style={styles.registerText}>還沒有帳號？點此註冊</Text>
        </TouchableOpacity>
      </View>
    );
  }
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      padding: 20,
      backgroundColor: '#fff',
    },
    header: {
      fontSize: 28,
      fontWeight: 'bold',
      textAlign: 'center',
      marginBottom: 20,
    },
    input: {
      width: '100%',
      padding: 15,
      borderWidth: 1,
      borderColor: '#ccc',
      borderRadius: 8,
      marginBottom: 10,
    },
    error: {
      color: 'red',
      fontSize: 14,
      marginBottom: 10,
    },
    button: {
      backgroundColor: '#ff6f00',
      padding: 15,
      borderRadius: 8,
      alignItems: 'center',
      marginTop: 10,
    },
    buttonText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: 'bold',
    },
    registerText: {
      textAlign: 'center',
      color: '#007bff',
      marginTop: 15,
    },
  });