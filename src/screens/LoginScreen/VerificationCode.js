import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const VerificationCode = ({ 
  formattedPhoneNumber, 
  handleBack,
  code,
  handleCodeChange,
  handleKeyPress,
  codeInputs,
  handleSendCode,
  resendTimer
}) => {
  return (
    <View style={styles.codeSection}>
      <TouchableOpacity 
        onPress={handleBack} 
        style={styles.backButton}
      >
        <Ionicons name="arrow-back-circle" size={30} color="#2E8B57" />
      </TouchableOpacity>
      
      <Text style={styles.codeSentText}>
        Code sent to {formattedPhoneNumber()}
      </Text>
      
      <View style={styles.codeContainer}>
        {code.map((digit, index) => (
          <TextInput
            key={index}
            style={[
              styles.codeInput,
              digit ? styles.codeInputFilled : null
            ]}
            placeholder="•"
            placeholderTextColor="rgba(255,255,255,0.5)"
            value={digit}
            onChangeText={(text) => handleCodeChange(text, index)}
            keyboardType="number-pad"
            maxLength={1}
            ref={(ref) => (codeInputs.current[index] = ref)}
            textContentType="oneTimeCode"
            onKeyPress={(e) => handleKeyPress(e, index)}
            selectionColor="#2E8B57"
          />
        ))}
      </View>
      
      <TouchableOpacity 
        onPress={handleSendCode} 
        style={styles.resendButton} 
        disabled={resendTimer > 0}
      >
        <Text style={[
          styles.resendButtonText,
          resendTimer > 0 ? styles.resendButtonTextDisabled : null
        ]}>
          {resendTimer > 0 ? `Resend Code (${resendTimer}s)` : 'Resend Code'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  codeSection: {
    marginTop: 10,
    marginBottom: 10,
    width: '100%',
  },
  codeSentText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  codeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  codeInput: {
    width: 52,
    height: 64,
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    textAlign: 'center',
    color: '#333',
    borderColor: '#e0e0e0',
    borderWidth: 1,
    fontSize: 24,
    fontWeight: 'bold',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 5,
    elevation: 2,
  },
  codeInputFilled: {
    backgroundColor: 'rgba(46,139,87,0.1)',
    borderColor: '#2E8B57',
  },
  backButton: {
    position: 'absolute',
    top: -10,
    left: 0,
    zIndex: 1,
    padding: 8,
  },
  resendButton: {
    alignSelf: 'center',
    marginTop: 5,
    marginBottom: 5,
    padding: 10,
  },
  resendButtonText: {
    color: '#2E8B57',
    fontSize: 16,
    fontWeight: '600',
  },
  resendButtonTextDisabled: {
    color: '#999',
  },
});

export default VerificationCode;