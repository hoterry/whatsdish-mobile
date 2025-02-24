import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const AccountScreen = () => {
  const [name, setName] = useState('John Doe');
  const [phone, setPhone] = useState('123-456-7890');
  const [email, setEmail] = useState('john.doe@example.com');
  const [editingField, setEditingField] = useState(null);

  const handleSave = (field) => {
    setEditingField(null);
    console.log(`Saved ${field}:`, { name, phone, email });
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

      {/* Promotion */}
      <TouchableOpacity style={styles.menuItem}>
        <Icon name="local-offer" size={24} color="#666" />
        <Text style={styles.menuText}>Promotion</Text>
        <Icon name="chevron-right" size={24} color="#999" />
      </TouchableOpacity>

      {/* Help */}
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
    backgroundColor: '#fff',
  },
  topSpace: {
    height: 50,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#f9f9f9',
    padding: 15,
    borderRadius: 10,
    marginHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  infoText: {
    flex: 1,
    fontSize: 16,
    marginLeft: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    marginLeft: 10,
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#007BFF',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    marginTop: 10,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  menuText: {
    flex: 1,
    fontSize: 16,
    marginLeft: 10,
  },
});

export default AccountScreen;
