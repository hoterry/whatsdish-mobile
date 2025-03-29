// ProfileEditModal.js
import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Modal, 
  TextInput, 
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
  ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as SecureStore from 'expo-secure-store';

const translations = {
  EN: {
    editName: "Edit Name",
    editEmail: "Edit Email",
    firstName: "First Name",
    lastName: "Last Name",
    email: "Email",
    save: "Save Changes",
    cancel: "Cancel",
    firstNameRequired: "First name is required",
    invalidEmail: "Please enter a valid email address",
    updateSuccess: "Updated successfully",
    updateError: "Update failed. Please try again.",
    enterEmail: "Enter your email address"
  },
  ZH: {
    editName: "編輯姓名",
    editEmail: "編輯電郵",
    firstName: "名字",
    lastName: "姓氏",
    email: "電子郵件",
    save: "保存更改",
    cancel: "取消",
    firstNameRequired: "名字為必填項",
    invalidEmail: "請輸入有效的電子郵件地址",
    updateSuccess: "更新成功",
    updateError: "更新失敗，請重試。",
    enterEmail: "輸入您的電子郵件地址"
  }
};

const ProfileEditModal = ({ 
  visible, 
  onClose, 
  fieldType, 
  currentValue = "", 
  language = "EN",
  onSave
}) => {
  const [loading, setLoading] = useState(false);
  const [givenName, setGivenName] = useState("");
  const [familyName, setFamilyName] = useState("");
  const [email, setEmail] = useState("");
  const texts = translations[language] || translations["EN"];

  useEffect(() => {
    if (fieldType === 'name' && currentValue) {
      const nameParts = currentValue.split(' ');
      setGivenName(nameParts[0] || "");
      setFamilyName(nameParts.slice(1).join(' ') || "");
    } else if (fieldType === 'email') {
      setEmail(currentValue || "");
    }
  }, [fieldType, currentValue, visible]);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSave = async () => {
    try {
      // Validation
      if (fieldType === 'name' && !givenName.trim()) {
        Alert.alert('', texts.firstNameRequired);
        return;
      }
      if (fieldType === 'email' && !validateEmail(email)) {
        Alert.alert('', texts.invalidEmail);
        return;
      }

      setLoading(true);
      
      // Prepare data based on field type
      let data = {};
      if (fieldType === 'name') {
        data = {
          given_name: givenName.trim(), 
          family_name: familyName.trim()
        };
      } else if (fieldType === 'email') {
        data = { email: email.trim() };
      }

      // Get token for authorization
      const token = await SecureStore.getItemAsync('token');
      if (!token) {
        throw new Error('Authentication token not found');
      }

      // Make API request
      const response = await fetch('https://dev.whatsdish.com/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const result = await response.json();
      
      if (__DEV__) {
        console.log('[ProfileEditModal] API response:', result);
      }

      // Update UI with new value
      if (fieldType === 'name') {
        const fullName = [givenName, familyName].filter(Boolean).join(' ');
        onSave(fieldType, fullName);
      } else {
        onSave(fieldType, email);
      }

      Alert.alert('', texts.updateSuccess);
      onClose();
    } catch (error) {
      if (__DEV__) {
        console.error('[ProfileEditModal] Error updating profile:', error);
      }
      Alert.alert('', texts.updateError);
    } finally {
      setLoading(false);
    }
  };

  const renderNameInputs = () => (
    <>
      <Text style={styles.inputLabel}>{texts.firstName}</Text>
      <TextInput
        style={styles.input}
        value={givenName}
        onChangeText={setGivenName}
        placeholder={texts.firstName}
        autoFocus
        autoCapitalize="words"
      />
      <Text style={styles.inputLabel}>{texts.lastName}</Text>
      <TextInput
        style={styles.input}
        value={familyName}
        onChangeText={setFamilyName}
        placeholder={texts.lastName}
        autoCapitalize="words"
      />
    </>
  );

  const renderEmailInput = () => (
    <>
      <Text style={styles.inputLabel}>{texts.email}</Text>
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        placeholder={texts.enterEmail}
        autoFocus
        keyboardType="email-address"
        autoCapitalize="none"
      />
    </>
  );

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {fieldType === 'name' ? texts.editName : texts.editEmail}
              </Text>
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <Ionicons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.modalContent}>
              {fieldType === 'name' ? renderNameInputs() : renderEmailInput()}
            </View>
            
            <View style={styles.modalFooter}>
              <TouchableOpacity 
                style={[styles.button, styles.cancelButton]} 
                onPress={onClose}
                disabled={loading}
              >
                <Text style={styles.cancelButtonText}>{texts.cancel}</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.button, styles.saveButton]} 
                onPress={handleSave}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={styles.saveButtonText}>{texts.save}</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  modalContainer: {
    width: '85%',
    backgroundColor: 'white',
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee'
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333'
  },
  closeButton: {
    padding: 4
  },
  modalContent: {
    padding: 16
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
    marginBottom: 6
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 16
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee'
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 100
  },
  cancelButton: {
    backgroundColor: '#f2f2f2',
    marginRight: 12
  },
  saveButton: {
    backgroundColor: '#000000'
  },
  cancelButtonText: {
    fontSize: 16,
    color: '#333'
  },
  saveButtonText: {
    fontSize: 16,
    color: 'white',
    fontWeight: '500'
  }
});

export default ProfileEditModal;