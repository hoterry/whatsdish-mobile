// components/ProfileItem.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const ProfileItem = ({ icon, label, value, onPress, editable = true, isLast = false }) => (
  <TouchableOpacity 
    style={[
      styles.profileItem, 
      isLast ? null : styles.profileItemBorder
    ]} 
    onPress={editable ? onPress : null}
    disabled={!editable}
  >
    <View style={styles.profileItemLeft}>
      <View style={styles.iconContainer}>
        <Ionicons name={icon} size={18} color="#000" />
      </View>
      <Text style={styles.profileLabel}>{label}</Text>
    </View>
    
    <View style={styles.profileItemRight}>
      <Text 
        style={[
          styles.profileValue,
          editable ? null : styles.profileValueDisabled
        ]}
        numberOfLines={1}
      >
        {value}
      </Text>
      {editable && (
        <Ionicons name="chevron-forward" size={18} color="#999" />
      )}
    </View>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  profileItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  profileItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  profileItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  profileLabel: {
    fontSize: 16,
    color: '#333',
  },
  profileItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
    maxWidth: '50%',
  },
  profileValue: {
    fontSize: 16,
    color: '#999',
    marginRight: 8,
    textAlign: 'right',
  },
  profileValueDisabled: {
    color: '#666',
  },
});

export default ProfileItem;