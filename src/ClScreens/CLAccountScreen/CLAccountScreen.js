import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const CLAccountScreen = ({ navigation, setIsAuthenticated }) => {
  const handlePress = () => {
    navigation.navigate('Login');
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity style={styles.content} onPress={handlePress} activeOpacity={0.7}>
        <View style={styles.contentBox}>
          <Ionicons name="person-circle-outline" size={60} color="#E53935" style={styles.icon} />
          <Text style={styles.title}>My Account</Text>
          <Text style={styles.subtitle}>Tap to login</Text>
        </View>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  contentBox: {
    alignItems: 'center',
    padding: 20,
    borderRadius: 10,
    backgroundColor: '#f8f8f8',
    width: '100%',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
  },
  icon: {
    marginBottom: 15,
  },
  title: {
    fontSize: 24,
    fontFamily: 'Quicksand-Bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    fontFamily: 'Poppins-Regular',
  },
});

export default CLAccountScreen;