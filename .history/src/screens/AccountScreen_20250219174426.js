import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import * as SecureStore from 'expo-secure-store';
import useUserFetcher from '../context/FetchUser';

const AccountScreen = () => {
  const { userData, setUserData, error } = useUserFetcher();
  const [editingField, setEditingField] = useState(null);
  const [avatar, setAvatar] = useState(userData.avatar || 'https://res.cloudinary.com/dfbpwowvb/image/upload/v1733878243/logo.png_hvfbfa.png');
  const navigation = useNavigation();

  const handleSave = (field) => {
    setEditingField(null);
  };

  const handleLogout = async () => {
    await SecureStore.deleteItemAsync('session');
    await SecureStore.deleteItemAsync('token');
    await SecureStore.deleteItemAsync('userId');
    navigation.navigate('Login');
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setAvatar(result.assets[0].uri);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.profileContainer}>
        <Image source={{ uri: userData.avatar }} style={styles.avatar} />
      </View>
      <Text style={styles.title}>個人信息</Text>

      <View style={styles.card}>
        {/* 帳號 ID */}
        <View style={styles.infoItem}>
          <Text style={styles.label}>帳號 ID</Text>
          <Text style={styles.infoText}>{userData.id}</Text>
        </View>

        {/* 姓名 */}
        <View style={styles.infoItem}>
          <Text style={styles.label}>姓名</Text>
          {editingField === 'name' ? (
            <TextInput
              style={styles.input}
              value={userData.name}
              onChangeText={(text) => setUserData({ ...userData, name: text })}
              autoFocus
            />
          ) : (
            <Text style={styles.infoText}>{userData.name}</Text>
          )}
          <TouchableOpacity onPress={() => editingField === 'name' ? handleSave('name') : setEditingField('name')}>
            <Icon name={editingField === 'name' ? 'check' : 'edit'} size={20} color={editingField === 'name' ? '#4CAF50' : '#000'} />
          </TouchableOpacity>
        </View>

        {/* 電話 */}
        <View style={styles.infoItem}>
          <Text style={styles.label}>電話</Text>
          {editingField === 'phone' ? (
            <TextInput
              style={styles.input}
              value={userData.phone}
              onChangeText={(text) => setUserData({ ...userData, phone: text })}
              keyboardType="phone-pad"
              autoFocus
            />
          ) : (
            <Text style={styles.infoText}>{userData.phone}</Text>
          )}
          <TouchableOpacity onPress={() => editingField === 'phone' ? handleSave('phone') : setEditingField('phone')}>
            <Icon name={editingField === 'phone' ? 'check' : 'edit'} size={20} color={editingField === 'phone' ? '#4CAF50' : '#000'} />
          </TouchableOpacity>
        </View>

        {/* Email */}
        <View style={styles.infoItem}>
          <Text style={styles.label}>郵箱</Text>
          {editingField === 'email' ? (
            <TextInput
              style={styles.input}
              value={userData.email}
              onChangeText={(text) => setUserData({ ...userData, email: text })}
              keyboardType="email-address"
              autoFocus
            />
          ) : (
            <Text style={styles.infoText}>{userData.email}</Text>
          )}
          <TouchableOpacity onPress={() => editingField === 'email' ? handleSave('email') : setEditingField('email')}>
            <Icon name={editingField === 'email' ? 'check' : 'edit'} size={20} color={editingField === 'email' ? '#4CAF50' : '#000'} />
          </TouchableOpacity>
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
  },
  
  profileContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,
    marginBottom: 20,
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
    flex: 1,
    marginLeft: 10,
  },
  input: {
    fontSize: 16,
    color: '#333',
    flex: 1,
    marginLeft: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingVertical: 5,
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
