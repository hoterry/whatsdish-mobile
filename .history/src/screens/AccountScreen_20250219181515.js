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
  const [avatar, setAvatar] = useState(userData.avatar || 'https://res.cloudinary.com/dfbpwowvb/image/upload/v1740016738/icon_green_CMYK-01_gtijo1.jpg');
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

  // Function to format the Account ID to show only last 4 characters
  const formatAccountId = (accountId) => {
    if (!accountId) return 'N/A';
    const length = accountId.length;
    return `${'*'.repeat(length - 4)}${accountId.slice(-4)}`;
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
        <InfoRow label="Account ID" icon="account-box" value={formatAccountId(userData.accountId)} isEditable={false} />
        <InfoRow label="Name" icon="person" value={userData.name} field="name" editingField={editingField} setEditingField={setEditingField} setUserData={setUserData} />
        <InfoRow label="Phone" icon="phone" value={userData.phone} field="phone" editingField={editingField} setEditingField={setEditingField} setUserData={setUserData} />
        <InfoRow label="Email" icon="email" value={userData.email} field="email" editingField={editingField} setEditingField={setEditingField} setUserData={setUserData} />
      </View>

      {/* Language Preference Card */}
      <View style={styles.menuItem}>
        <Icon name="language" size={24} color="#666" />
        <Text style={styles.menuText}>Language Preference</Text>
        <Text style={styles.menuRightText}>{userData.languagePreference || 'N/A'}</Text>
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

const InfoRow = ({ label, icon, value, field, editingField, setEditingField, setUserData, isEditable = true }) => (
  <TouchableOpacity style={styles.infoItem} onPress={() => isEditable && setEditingField(field)}>
    <View style={styles.iconContainer}>
      <Icon name={icon} size={24} color="#666" />
    </View>
    <Text style={styles.label}>{label}</Text>
    <View style={styles.infoRight}>
      <Text style={styles.infoText}>{value}</Text>
      {isEditable && <Icon name="chevron-right" size={20} color="#999" />}
    </View>
  </TouchableOpacity>
);


const styles = StyleSheet.create({
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', paddingHorizontal: 16, paddingTop: 60 },
  backButton: { position: 'absolute', top: 20, left: 16, zIndex: 10 },
  avatarContainer: { alignItems: 'center', marginVertical: 20, paddingTop: 60, paddingBottom: 30 },
  avatarWrapper: { position: 'relative' },
  avatar: { width: 90, height: 90, borderRadius: 45, borderWidth: 2, borderColor: '#ddd' },
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
  iconContainer: { marginRight: 8 },  // Reduced margin for icon
  label: { fontSize: 16, color: '#555', marginRight: 10 }, // Reduced right margin for label
  infoRight: { flexDirection: 'row', alignItems: 'center' },
  infoText: { fontSize: 16, color: '#333', marginRight: 10 },
  logoutButton: { marginTop: 30, paddingVertical: 15, backgroundColor: '#000', borderRadius: 5, alignItems: 'center' },
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
  menuText: { fontSize: 16, color: '#333', flex: 1 },
  menuRightText: { fontSize: 16, color: '#666' },
});

export default AccountScreen;
