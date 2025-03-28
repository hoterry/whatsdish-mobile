import React from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

export default function NameModal({
  visible,
  firstName,
  setFirstName,
  lastName,
  setLastName,
  onSubmit,
  error,
  loading,
}) {
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={() => {}}
    >
      <KeyboardAvoidingView
        style={styles.overlay}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.modalContent}>
          <Text style={styles.title}>Welcome to WhatsDish 👋</Text>
          <Text style={styles.subtitle}>We need your name to complete your profile</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>First Name</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. John"
              value={firstName}
              onChangeText={setFirstName}
              autoCapitalize="words"
              returnKeyType="next"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Last Name</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Doe"
              value={lastName}
              onChangeText={setLastName}
              autoCapitalize="words"
              returnKeyType="done"
            />
          </View>

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <TouchableOpacity
            style={styles.button}
            onPress={onSubmit}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Continue</Text>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    width: '90%',
    padding: 24,
    borderRadius: 16,
    elevation: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 6,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 24,
    textAlign: 'center',
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 13,
    marginBottom: 6,
    color: '#444',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    borderRadius: 10,
    fontSize: 15,
  },
  error: {
    color: '#e53935',
    marginBottom: 16,
    fontSize: 13,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#00aa66',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});
