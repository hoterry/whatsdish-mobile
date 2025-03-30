import React from 'react';
import { View, Text, TextInput, Image, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const PhoneInput = ({ 
  phoneNumber, 
  handlePhoneChange, 
  handleSendCode 
}) => {
  return (
    <>
      <View style={styles.inputLabel}>
        <MaterialIcons name="smartphone" size={20} color="#2E8B57" />
        <Text style={styles.labelText}>Mobile Number</Text>
      </View>
      <View style={styles.phoneInputContainer}>
        <View style={styles.countryCodeContainer}>
          <Image source={require('../../../assets/canada-flag.png')} style={styles.flag} />
          <Text style={styles.countryCode}>+1</Text>
        </View>
        <TextInput
          style={styles.phoneInput}
          placeholder="Enter your number"
          placeholderTextColor="rgba(0,0,0,0.4)"
          value={phoneNumber}
          onChangeText={handlePhoneChange}
          keyboardType="phone-pad"
          returnKeyType="send"
          onSubmitEditing={handleSendCode}
          maxLength={12}
          selectionColor="#2E8B57"
        />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  inputLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  labelText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 8,
    fontWeight: '500',
  },
  phoneInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 12,
    backgroundColor: '#f9f9f9',
    paddingHorizontal: 16,
    marginBottom: 10,
    height: 60,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  countryCodeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 16,
    borderRightWidth: 1,
    borderRightColor: '#e0e0e0',
    height: '100%',
  },
  flag: {
    width: 24,
    height: 24,
    marginRight: 8,
    borderRadius: 4,
  },
  countryCode: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  phoneInput: {
    flex: 1,
    height: 60,
    fontSize: 18,
    paddingLeft: 16,
    color: '#333',
    fontWeight: '500',
  },
});

export default PhoneInput;