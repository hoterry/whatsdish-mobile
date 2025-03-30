import React from 'react';
import { View, Text, Image, StyleSheet, Animated } from 'react-native';

const LoginHeader = ({ isCodeSent, fadeAnim, slideAnim }) => {
  return (
    <View style={styles.headerSection}>
      <Image 
        source={require('../../../assets/logo-green.png')} 
        style={styles.logo} 
        resizeMode="contain" 
      />
      <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
        <Text style={styles.header}>Welcome</Text>
        <Text style={styles.subHeader}>
          {!isCodeSent 
            ? 'Sign in to your secure account'
            : 'Enter the verification code'
          }
        </Text>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerSection: {
    alignItems: 'center',
    marginBottom: 15,
  },
  logo: {
    width: 70,
    height: 70,
    marginBottom: 5,
  },
  header: {
    fontSize: 34,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#000',
    marginBottom: 10,
    letterSpacing: 0.5,
  },
  subHeader: {
    fontSize: 18,
    textAlign: 'center',
    color: '#666',
    marginBottom: 5,
  },
});

export default LoginHeader;