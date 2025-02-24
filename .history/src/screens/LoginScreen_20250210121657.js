import React, { useState, useEffect } from 'react';
import { TextInput, TouchableOpacity, View, Text, StyleSheet, ScrollView, ActivityIndicator, Image } from 'react-native';
import { supabase } from '../../supabase'; 
import { useNavigation } from '@react-navigation/native';
import * as SecureStore from 'expo-secure-store'; 


export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const navigation = useNavigation();

  // Check if user is already logged in by looking for token and driver_id
  useEffect(() => {
    const checkLoginStatus = async () => {
      const token = await SecureStore.getItemAsync('token');
      const driverId = await SecureStore.getItemAsync('driver_id');
      console.log('Stored token:', token); // Log token
      console.log('Stored driver_id:', driverId); // Log driver_id
      if (token && driverId) {
        // If both token and driver_id exist, navigate directly to Home
        navigation.navigate('Home');
      }
    };

    checkLoginStatus();
  }, [navigation]);

  const handleLogin = async () => {
    setErrorMessage('');
    if (!email || !password) {
      setErrorMessage('Please fill in both email and password.');
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setErrorMessage(error.message);
        return;
      }

      const token = data.session.access_token;
      const session = data.session;
      const { data: userData, error: userError } = await supabase
        .from('drivers_status')
        .select('driver_id')
        .eq('email', email)
        .single();

      if (userError || !userData) {
        setErrorMessage('Failed to fetch driver data.');
        return;
      }

      const driverId = userData.driver_id;
      await SecureStore.setItemAsync('session', JSON.stringify(session));
      await SecureStore.setItemAsync('token', token);
      await SecureStore.setItemAsync('driver_id', driverId);
      const storedSession = await SecureStore.getItemAsync('session');
      const storedToken = await SecureStore.getItemAsync('token');
      const storedDriverId = await SecureStore.getItemAsync('driver_id');
      console.log('Stored session:', storedSession);
      console.log('Stored token:', storedToken);
      console.log('Stored driver_id:', storedDriverId);
      navigation.navigate('Home');
    } catch (err) {
      setErrorMessage('Unexpected error during login.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image 
        source={require('../../assets/logo.png')} 
        style={styles.logo}
      />
      <Text style={styles.header}>Welcome Back</Text>
      <Text style={styles.subHeader}>Login to your account</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#999"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#999"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}

      <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Login</Text>
        )}
      </TouchableOpacity>

      <Text style={styles.footerText}>
        Don't have an account?{' '}
        <Text style={styles.link} onPress={() => navigation.navigate('Register')}>
          Register
        </Text>
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#fff',
    marginBottom: 50
  },
  logo: {
    width: 100,  // Adjust width and height according to your logo size
    height: 100,
    alignSelf: 'center',  // Center the logo horizontally
    marginBottom: 30,  // Add margin to separate the logo from other elements
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#000',
    marginBottom: 10,
  },
  subHeader: {
    fontSize: 16,
    textAlign: 'center',
    color: '#bbb',
    marginBottom: 30,
  },
  input: {
    height: 50,
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 15,
    color: '#000',
    borderColor: '#333',
    borderWidth: 1,
    fontSize: 16,
  },
  errorText: {
    color: '#ff4d4d',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 15,
  },
  button: {
    height: 50,
    backgroundColor: '#000',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 5,
    elevation: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  footerText: {
    textAlign: 'center',
    color: '#000',
    marginTop: 20,
    fontSize: 16,
  },
  link: {
    color: '#000',
    textDecorationLine: 'underline',
  },
});
