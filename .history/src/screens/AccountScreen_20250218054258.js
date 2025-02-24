import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../../supabase'; // 引入supabase
import Icon from 'react-native-vector-icons/MaterialIcons';

const AccountScreen = ({ navigation }) => {
  // 狀態管理
  const [name, setName] = useState('John Doe');
  const [phone, setPhone] = useState('123-456-7890');
  const [email, setEmail] = useState('john.doe@example.com');
  const [editingField, setEditingField] = useState(null); // 當前正在編輯的字段
  const navigation = useNavigation(); 
  // 保存更改
  const handleSave = (field) => {
    setEditingField(null); // 退出編輯模式
    // 這裡可以添加保存邏輯，例如將數據發送到伺服器
    console.log(`Saved ${field}:`, { name, phone, email });
  };

  // 登出功能
  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      navigation.replace('Login'); // 登出後導航回登錄頁面
    } catch (error) {
      console.error('Logout Error:', error.message);
    }
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
              value={name}
              onChangeText={setName}
              placeholder="Name"
              autoFocus
            />
          ) : (
            <Text style={styles.infoText}>{name}</Text>
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
              value={phone}
              onChangeText={setPhone}
              placeholder="Phone"
              keyboardType="phone-pad"
              autoFocus
            />
          ) : (
            <Text style={styles.infoText}>{phone}</Text>
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
              value={email}
              onChangeText={setEmail}
              placeholder="Email"
              keyboardType="email-address"
              autoFocus
            />
          ) : (
            <Text style={styles.infoText}>{email}</Text>
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

      {/* Promotion 選項 */}
      <TouchableOpacity style={styles.menuItem}>
        <Icon name="local-offer" size={24} color="#666" />
        <Text style={styles.menuText}>Promotion</Text>
        <Icon name="chevron-right" size={24} color="#999" />
      </TouchableOpacity>

      {/* Help 選項 */}
      <TouchableOpacity style={styles.menuItem}>
        <Icon name="help-outline" size={24} color="#666" />
        <Text style={styles.menuText}>Help</Text>
        <Icon name="chevron-right" size={24} color="#999" />
      </TouchableOpacity>

      {/* 登出按鈕 */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

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