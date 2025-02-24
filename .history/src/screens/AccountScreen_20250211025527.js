// src/screens/AccountScreen.js
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const AccountScreen = () => {
  const userInfo = {
    name: 'John Doe',
    phone: '123-456-7890',
    email: 'john.doe@example.com',
  };

  return (
    <ScrollView style={styles.container}>
      {/* 頂部空間 */}
      <View style={styles.topSpace} />

      {/* 標題 */}
      <Text style={styles.title}>Account Info</Text>

      {/* 用戶信息卡片 */}
      <View style={styles.card}>
        <View style={styles.infoItem}>
          <Icon name="person" size={24} color="#666" />
          <Text style={styles.infoText}>{userInfo.name}</Text>
        </View>
        <View style={styles.infoItem}>
          <Icon name="phone" size={24} color="#666" />
          <Text style={styles.infoText}>{userInfo.phone}</Text>
        </View>
        <View style={styles.infoItem}>
          <Icon name="email" size={24} color="#666" />
          <Text style={styles.infoText}>{userInfo.email}</Text>
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
});

export default AccountScreen;