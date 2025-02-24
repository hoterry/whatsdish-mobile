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
    name: '',
    phone: '',
    email: ''
  });
  const [editingField, setEditingField] = useState(null); // 當前正在編輯的字段
  const navigation = useNavigation();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = await SecureStore.getItemAsync('token'); // 取得 token
        console.log('Token:', token); // 檢查 token 是否正確
    
        if (!token) {
          console.error('Token not found');
          return;
        }
    
        // 發送請求到你的後端 API
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
          // 使用返回的字段來更新 userData
          setUserData({
            name: `${data.data.given_name} ${data.data.family_name}` || '',  // 拼接名字
            phone: data.data.phone_number || '',  // 設置電話號碼
            email: data.data.email || '',  // 這裡你可以添加 email 字段，如果後端有提供
          });
        } else {
          console.error('Failed to fetch user data:', data);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
    

  // 保存更改
  const handleSave = (field) => {
    setEditingField(null); // 退出編輯模式
    // 這裡可以添加保存邏輯，例如將數據發送到伺服器
    console.log(`Saved ${field}:`, userData);
  };

  // 登出函式
  const handleLogout = async () => {
    await supabase.auth.signOut();
    await SecureStore.deleteItemAsync('session'); // 清除 session 資料
    await SecureStore.deleteItemAsync('token'); // 清除 token
    await SecureStore.deleteItemAsync('userId'); // 清除 userId
    navigation.navigate('Login');
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.topSpace} />
      <Text style={styles.title}>Account Info</Text>
  
      <View style={styles.card}>
        {/* Name */}
        <View style={styles.infoItem}>
          <Icon name="person" size={24} color="#666" />
          {editingField === 'name' ? (
            <TextInput
              style={styles.input}
              value={userData.name}
              onChangeText={(text) => setUserData({ ...userData, name: text })}
              placeholder="Name"
              autoFocus
            />
          ) : (
            <Text style={styles.infoText}>{userData.name}</Text>
          )}
          <TouchableOpacity
            onPress={() =>
              editingField === 'name' ? handleSave('name') : setEditingField('name')
            }
          >
            <Icon
              name={editingField === 'name' ? 'check' : 'edit'}
              size={20}
              color={editingField === 'name' ? '#4CAF50' : '#000'}
            />
          </TouchableOpacity>
        </View>
  
        {/* Phone */}
        <View style={styles.infoItem}>
          <Icon name="phone" size={24} color="#666" />
          {editingField === 'phone' ? (
            <TextInput
              style={styles.input}
              value={userData.phone}
              onChangeText={(text) => setUserData({ ...userData, phone: text })}
              placeholder="Phone"
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
  
        {/* Email */}
        <View style={styles.infoItem}>
          <Icon name="email" size={24} color="#666" />
          {editingField === 'email' ? (
            <TextInput
              style={styles.input}
              value={userData.email}
              onChangeText={(text) => setUserData({ ...userData, email: text })}
              placeholder="Email"
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
      </View>
  
      <TouchableOpacity style={styles.menuItem}>
        <Icon name="local-offer" size={24} color="#666" />
        <Text style={styles.menuText}>Promotion</Text>
        <Icon name="chevron-right" size={24} color="#999" />
      </TouchableOpacity>
  
      <TouchableOpacity style={styles.menuItem}>
        <Icon name="help-outline" size={24} color="#666" />
        <Text style={styles.menuText}>Help</Text>
        <Icon name="chevron-right" size={24} color="#999" />
      </TouchableOpacity>
  
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}  

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 16,
  },
  topSpace: {
    height: 100,
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
    marginBottom: 15,
  },
  infoText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 10,
    flex: 1,
  },
  input: {
    fontSize: 16,
    color: '#333',
    marginLeft: 10,
    flex: 1,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingVertical: 5,
  },
  editText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  menuText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 10,
    flex: 1,
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