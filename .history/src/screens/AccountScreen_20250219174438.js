import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import * as ImagePicker from 'expo-image-picker';
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
      <View style={styles.avatarContainer}>
        <TouchableOpacity onPress={pickImage}>
          <Image source={{ uri: avatar }} style={styles.avatar} />
        </TouchableOpacity>
      </View>

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

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};


const InfoRow = ({ label, value, field, editingField, setEditingField, setUserData, isEditable = true }) => (
  <View style={styles.infoItem}>
    <Text style={styles.label}>{label}</Text>
    {isEditable && editingField === field ? (
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={(text) => setUserData((prev) => ({ ...prev, [field]: text }))}
        autoFocus
      />
    ) : (
      <Text style={styles.infoText}>{value}</Text>
    )}
    {isEditable && (
      <TouchableOpacity onPress={() => (editingField === field ? setEditingField(null) : setEditingField(field))}>
        <Icon name={editingField === field ? 'check' : 'edit'} size={20} color={editingField === field ? '#4CAF50' : '#000'} />
      </TouchableOpacity>
    )}
  </View>
);

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 16,
    marginTop: 150
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
