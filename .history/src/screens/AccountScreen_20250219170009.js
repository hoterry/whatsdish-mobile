import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../../supabase'; // 引入supabase
import Icon from 'react-native-vector-icons/MaterialIcons';
import { CommonActions } from '@react-navigation/native';
import * as SecureStore from 'expo-secure-store'; // 引入 SecureStore

const AccountScreen = () => {
  // 狀態管理
  const [userData, setUserData] = useState({
    nickname: '*****80968',
    birthday: '未填寫',
    phone: '604-418-0968',
    email: 'fc.ho@hotmail.com',
    password: '******',
  });
  const [editingField, setEditingField] = useState(null); // 當前正在編輯的字段
  const navigation = useNavigation();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = await SecureStore.getItemAsync('token'); // 取得 token
  
        if (!token) {
          console.error('Token not found');
          return;
        }
  
        // 發送請求到你的後端 API，而不是直接到外部 API
        const response = await fetch('http://10.0.0.7:5000/api/user/profile', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`, // 傳送 token
          },
        });
  
        const data = await response.json();
        console.log('Fetched user data in account setting:', data); // Log the response
  
        if (response.ok) {
          setUserData({
            nickname: data.data.nickname || '*****80968',
            birthday: data.data.birthday || '未填寫',
            phone: data.data.phone_number || '604-418-0968',
            email: data.data.email || 'fc.ho@hotmail.com',
            password: '******',
          });
        } else {
          console.error('Failed to fetch user data:', data);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
  
    fetchUserData();
  }, []);
  

  // 保存更改
  const handleSave = (field) => {
    setEditingField(null); // 退出編輯模式
    // 這裡可以添加保存邏輯，例如將數據發送到伺服器
    console.log(`Saved ${field}:`, userData);
  };

  // 登出函式
  const handleLogout = async () => {
    await SecureStore.deleteItemAsync('session'); // 清除 session 資料
    await SecureStore.deleteItemAsync('token'); // 清除 token
    await SecureStore.deleteItemAsync('userId'); // 清除 userId
    navigation.navigate('Login');
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.topSpace} />
      <Text style={styles.title}>個人信息</Text>

      <View style={styles.card}>
        {/* 昵稱 */}
        <View style={styles.infoItem}>
          <Text style={styles.label}>昵稱</Text>
          {editingField === 'nickname' ? (
            <TextInput
              style={styles.input}
              value={userData.nickname}
              onChangeText={(text) => setUserData({ ...userData, nickname: text })}
              placeholder="昵稱"
              autoFocus
            />
          ) : (
            <Text style={styles.infoText}>{userData.nickname}</Text>
          )}
          <TouchableOpacity
            onPress={() =>
              editingField === 'nickname' ? handleSave('nickname') : setEditingField('nickname')
            }
          >
            <Icon
              name={editingField === 'nickname' ? 'check' : 'edit'}
              size={20}
              color={editingField === 'nickname' ? '#4CAF50' : '#000'}
            />
          </TouchableOpacity>
        </View>

        {/* 生日 */}
        <View style={styles.infoItem}>
          <Text style={styles.label}>生日</Text>
          {editingField === 'birthday' ? (
            <TextInput
              style={styles.input}
              value={userData.birthday}
              onChangeText={(text) => setUserData({ ...userData, birthday: text })}
              placeholder="生日"
              autoFocus
            />
          ) : (
            <Text style={styles.infoText}>{userData.birthday}</Text>
          )}
          <TouchableOpacity
            onPress={() =>
              editingField === 'birthday' ? handleSave('birthday') : setEditingField('birthday')
            }
          >
            <Icon
              name={editingField === 'birthday' ? 'check' : 'edit'}
              size={20}
              color={editingField === 'birthday' ? '#4CAF50' : '#000'}
            />
          </TouchableOpacity>
        </View>

        {/* 手機號 */}
        <View style={styles.infoItem}>
          <Text style={styles.label}>手機號</Text>
          {editingField === 'phone' ? (
            <TextInput
              style={styles.input}
              value={userData.phone}
              onChangeText={(text) => setUserData({ ...userData, phone: text })}
              placeholder="手機號"
              keyboardType="phone-pad"
              autoFocus
            />
          ) : (
            <Text style={styles.infoText}>{userData.phone}</Text>
          )}
          <TouchableOpacity
            onPress={() =>
              editingField === 'phone' ? handleSave('phone') : setEditingField('phone')
            }
          >
            <Icon
              name={editingField === 'phone' ? 'check' : 'edit'}
              size={20}
              color={editingField === 'phone' ? '#4CAF50' : '#000'}
            />
          </TouchableOpacity>
        </View>

        {/* 密碼 */}
        <View style={styles.infoItem}>
          <Text style={styles.label}>密碼</Text>
          {editingField === 'password' ? (
            <TextInput
              style={styles.input}
              value={userData.password}
              onChangeText={(text) => setUserData({ ...userData, password: text })}
              placeholder="密碼"
              secureTextEntry
              autoFocus
            />
          ) : (
            <Text style={styles.infoText}>{userData.password}</Text>
          )}
          <TouchableOpacity
            onPress={() =>
              editingField === 'password' ? handleSave('password') : setEditingField('password')
            }
          >
            <Icon
              name={editingField === 'password' ? 'check' : 'edit'}
              size={20}
              color={editingField === 'password' ? '#4CAF50' : '#000'}
            />
          </TouchableOpacity>
        </View>

        {/* 郵箱 */}
        <View style={styles.infoItem}>
          <Text style={styles.label}>郵箱</Text>
          {editingField === 'email' ? (
            <TextInput
              style={styles.input}
              value={userData.email}
              onChangeText={(text) => setUserData({ ...userData, email: text })}
              placeholder="郵箱"
              keyboardType="email-address"
              autoFocus
            />
          ) : (
            <Text style={styles.infoText}>{userData.email}</Text>
          )}
          <TouchableOpacity
            onPress={() =>
              editingField === 'email' ? handleSave('email') : setEditingField('email')
            }
          >
            <Icon
              name={editingField === 'email' ? 'check' : 'edit'}
              size={20}
              color={editingField === 'email' ? '#4CAF50' : '#000'}
            />
          </TouchableOpacity>
        </View>

        {/* 身份驗證 */}
        <View style={styles.infoItem}>
          <Text style={styles.label}>身份驗證</Text>
          <Text style={styles.infoText}>上傳個人ID或護照首頁</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>登出</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 16,
    marginTop: 20
  },
  topSpace: {
    height: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    color: '#666',
  },
  infoText: {
    fontSize: 16,
    color: '#333',
  },
  input: {
    fontSize: 16,
    color: '#333',
    flex: 1,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingVertical: 5,
    marginLeft: 10,
  },
  logoutButton: {
    marginTop: 30,
    paddingVertical: 15,
    backgroundColor: '#000',
    borderRadius: 5,
    alignItems: 'center',
  },
  logoutText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default AccountScreen;