import React from 'react';
import { TouchableOpacity, StyleSheet, Platform, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const BackButton = ({ onPress }) => {
  return (
    <TouchableOpacity 
      style={styles.backButtonTop}
      onPress={onPress}
    >
      <Ionicons name="arrow-back-circle" size={36} color="#2E8B57" />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  backButtonTop: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : StatusBar.currentHeight + 10,
    left: 20,
    zIndex: 10,
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 22,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
});

export default BackButton;