import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import * as ImagePicker from 'expo-image-picker';
import * as SecureStore from 'expo-secure-store';
import useUserFetcher from '../context/FetchUser';

const AccountScreen = () => {
  const { userData, setUserData } = useUserFetcher();
  const [editingField, setEditingField] = useState(null);
  const [avatar, setAvatar] = useState(userData.avatar || 'https://res.cloudinary.com/dfbpwowvb/image/upload/v1733740837/lt0esmxwsjamjq8ydmgv.png');
  const navigation = useNavigation();

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
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Icon name="arrow-back" size={28} color="#000" />
      </TouchableOpacity>

      {/* 頭像區域 */}
      <View style={styles.avatarContainer}>
        <TouchableOpacity onPress={pickImage} style={styles.avatarWrapper}>
          <Image source={{ uri: avatar }} style={styles.avatar} />
          <View style={styles.editIconContainer}>
            <Icon name="edit" size={16} color="#fff" />
          </View>
        </TouchableOpacity>
      </View>

      {/* 用戶資訊 */}
      <View style={styles.card}>
        <InfoRow label="Account ID" value={userData.id} isEditable={false} />
        <InfoRow label="Name" value={userData.name} field="name" editingField={editingField} setEditingField={setEditingField} setUserData={setUserData} />
        <InfoRow label="Phone" value={userData.phone} field="phone" editingField={editingField} setEditingField={setEditingField} setUserData={setUserData} />
        <InfoRow label="Email" value={userData.email} field="email" editingField={editingField} setEditingField={setEditingField} setUserData={setUserData} />
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

      {/* 登出按鈕 */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const InfoRow = ({ label, value, field, editingField, setEditingField, setUserData, isEditable = true }) => (
  <TouchableOpacity style={styles.infoItem} onPress={() => isEditable && setEditingField(field)}>
    <Text style={styles.label}>{label}</Text>
    <View style={styles.infoRight}>
      <Text style={styles.infoText}>{value}</Text>
      {isEditable && <Icon name="chevron-right" size={20} color="#999" />}
    </View>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', paddingHorizontal: 16, paddingTop: 60 },
  backButton: { position: 'absolute', top: 20, left: 16, zIndex: 10 },
  avatarContainer: { alignItems: 'center', marginVertical: 20 , paddingTop: 60, paddingBottom: 30 },
  avatarWrapper: { position: 'relative' },
  avatar: { width: 90, height: 90, borderRadius: 45, borderWidth: 3, borderColor: '#ddd' },
  editIconContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#000',
    borderRadius: 10,
    padding: 4,
  },
  card: { backgroundColor: '#fff', borderRadius: 10, padding: 16, marginBottom: 20, elevation: 3 },
  infoItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#eee' },
  label: { fontSize: 16, color: '#555' },
  infoRight: { flexDirection: 'row', alignItems: 'center' },
  infoText: { fontSize: 16, color: '#333', marginRight: 10 },
  logoutButton: { marginTop: 30, paddingVertical: 15, backgroundColor: '#000', borderRadius: 5, alignItems: 'center' },
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
  logoutText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
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
});

export default AccountScreen;
