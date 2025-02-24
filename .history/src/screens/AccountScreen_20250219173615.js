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
        <InfoRow label="帳號 ID" value={userData.id} isEditable={false} />
        <InfoRow label="姓名" value={userData.name} field="name" editingField={editingField} setEditingField={setEditingField} setUserData={setUserData} />
        <InfoRow label="電話" value={userData.phone} field="phone" editingField={editingField} setEditingField={setEditingField} setUserData={setUserData} />
        <InfoRow label="郵箱" value={userData.email} field="email" editingField={editingField} setEditingField={setEditingField} setUserData={setUserData} />
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>登出</Text>
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
    marginTop: 100
  },
  avatarContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
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
    flex: 1,
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
