import React, { useState } from 'react';  ``
import { TextInput, TouchableOpacity, View, Text, StyleSheet, ScrollView, ActivityIndicator, Image } from 'react-native';
import { supabase } from '../../supabase'; 
import { useNavigation } from '@react-navigation/native';

export default function RegisterScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const navigation = useNavigation();

  const checkUserExists = async (email) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('email')
        .eq('email', email);
      if (error) {
        console.error('Error checking user:', error.message);
        return false;
      }
      return data.length > 0;
    } catch (err) {
      console.error('Unexpected error:', err);
      return false;
    }
  };

  const handleRegister = async () => {
    setLoading(true);
    setErrorMessage('');

    const userExists = await checkUserExists(email);
    if (userExists) {
      setErrorMessage('This email is already registered');
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase.auth.signUp({ email, password });

      if (error) {
        setErrorMessage(error.message);
        setLoading(false);
        return;
      }

      const { user } = data;
      if (!user?.id) {
        setErrorMessage('User ID not found during registration');
        setLoading(false);
        return;
      }

      const { error: insertUserError } = await supabase.from('users').insert([
        {
          id: user.id,
          name,
          phone,
          email,
        },
      ]);

      if (insertUserError) {
        setErrorMessage(insertUserError.message);
        setLoading(false);
        return;
      }

      if (insertDriverError) {
        setErrorMessage(insertDriverError.message);
      } else {
        navigation.navigate('VerificationScreen');
      }
    } catch (err) {
      setErrorMessage('Unexpected error during registration');
      console.error('Error during registration:', err);
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
      <Text style={styles.header}>Create an Account</Text>
      <Text style={styles.subHeader}>Register to get started</Text>

      <TextInput
        style={styles.input}
        placeholder="Full Name"
        placeholderTextColor="#999"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Phone Number"
        placeholderTextColor="#999"
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
      />
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

      <TouchableOpacity style={styles.button} onPress={handleRegister} disabled={loading}>
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Register</Text>
        )}
      </TouchableOpacity>

      <Text
        style={styles.footerText}
        onPress={() => navigation.navigate('Login')}
      >
        Already have an account? <Text style={styles.link}>Login</Text>
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#fff',
    
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
    fontSize: 20
  },
  link: {
    color: '#000',
    textDecorationLine: 'underline',
  },
});
