// HelpCenterModal.js
import React, { useState } from 'react';
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
  ActivityIndicator,
  ScrollView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as SecureStore from 'expo-secure-store';

const translations = {
  EN: {
    helpCenter: "Help Center",
    contactUs: "Contact Us",
    description: "Have a question or need assistance? Fill out the form below and our team will get back to you as soon as possible.",
    name: "Your Name",
    email: "Your Email",
    subject: "Subject",
    message: "Message",
    namePlaceholder: "Enter your name",
    emailPlaceholder: "Enter your email address",
    subjectPlaceholder: "What is this regarding?",
    messagePlaceholder: "How can we help you?",
    send: "Send Message",
    cancel: "Cancel",
    errorTitle: "Error",
    success: "Success",
    successMessage: "Your message has been sent successfully. We'll get back to you shortly.",
    requiredFields: "Please fill in all required fields.",
    invalidEmail: "Please enter a valid email address.",
    sendError: "Failed to send message. Please try again.",
  },
  ZH: {
    helpCenter: "幫助中心",
    contactUs: "聯絡我們",
    description: "有問題或需要協助？填寫以下表格，我們的團隊將盡快回覆您。",
    name: "您的姓名",
    email: "您的電子郵件",
    subject: "主題",
    message: "訊息",
    namePlaceholder: "輸入您的姓名",
    emailPlaceholder: "輸入您的電子郵件",
    subjectPlaceholder: "關於什麼事情？",
    messagePlaceholder: "我們如何幫助您？",
    send: "發送訊息",
    cancel: "取消",
    errorTitle: "錯誤",
    success: "成功",
    successMessage: "您的訊息已成功發送。我們會盡快回覆您。",
    requiredFields: "請填寫所有必填欄位。",
    invalidEmail: "請輸入有效的電子郵件地址。",
    sendError: "訊息發送失敗。請重試。",
  }
};

const HelpCenterModal = ({ 
  visible, 
  onClose, 
  language = "EN"
}) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  
  const texts = translations[language] || translations["EN"];

  const resetForm = () => {
    setName("");
    setEmail("");
    setSubject("");
    setMessage("");
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async () => {
    // Validate form
    if (!name.trim() || !email.trim() || !subject.trim() || !message.trim()) {
      Alert.alert(texts.errorTitle, texts.requiredFields);
      return;
    }

    if (!validateEmail(email)) {
      Alert.alert(texts.errorTitle, texts.invalidEmail);
      return;
    }

    setLoading(true);

    try {
      // Get token for authorization
      const token = await SecureStore.getItemAsync('token');
      
      // Simulating API call - in a real app, replace with actual API endpoint
      // const response = await fetch('https://dev.whatsdish.com/api/help', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'Authorization': `Bearer ${token}`
      //   },
      //   body: JSON.stringify({
      //     name,
      //     email,
      //     subject,
      //     message
      //   })
      // });
      
      // if (!response.ok) {
      //   throw new Error(`API error: ${response.status}`);
      // }
      
      // Simulating successful response
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Success alert
      Alert.alert(
        texts.success, 
        texts.successMessage,
        [{ text: 'OK', onPress: () => {
          resetForm();
          onClose();
        }}]
      );
    } catch (error) {
      if (__DEV__) {
        console.error('[HelpCenterModal] Error submitting form:', error);
      }
      Alert.alert(texts.errorTitle, texts.sendError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{texts.helpCenter}</Text>
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <Ionicons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.scrollView}>
              <View style={styles.modalContent}>
                <Text style={styles.sectionTitle}>{texts.contactUs}</Text>
                <Text style={styles.description}>{texts.description}</Text>
                
                <Text style={styles.inputLabel}>{texts.name} *</Text>
                <TextInput
                  style={styles.input}
                  value={name}
                  onChangeText={setName}
                  placeholder={texts.namePlaceholder}
                  autoCapitalize="words"
                />
                
                <Text style={styles.inputLabel}>{texts.email} *</Text>
                <TextInput
                  style={styles.input}
                  value={email}
                  onChangeText={setEmail}
                  placeholder={texts.emailPlaceholder}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
                
                <Text style={styles.inputLabel}>{texts.subject} *</Text>
                <TextInput
                  style={styles.input}
                  value={subject}
                  onChangeText={setSubject}
                  placeholder={texts.subjectPlaceholder}
                />
                
                <Text style={styles.inputLabel}>{texts.message} *</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  value={message}
                  onChangeText={setMessage}
                  placeholder={texts.messagePlaceholder}
                  multiline
                  numberOfLines={6}
                  textAlignVertical="top"
                />
              </View>
            </ScrollView>
            
            <View style={styles.modalFooter}>
              <TouchableOpacity 
                style={[styles.button, styles.cancelButton]} 
                onPress={onClose}
                disabled={loading}
              >
                <Text style={styles.cancelButtonText}>{texts.cancel}</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.button, styles.sendButton]} 
                onPress={handleSubmit}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={styles.sendButtonText}>{texts.send}</Text>
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
    width: '90%',
    maxHeight: '80%',
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
  scrollView: {
    maxHeight: 500
  },
  modalContent: {
    padding: 16
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
    lineHeight: 20
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#555',
    marginBottom: 6
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 16,
    backgroundColor: '#f9f9f9'
  },
  textArea: {
    height: 120,
    textAlignVertical: 'top'
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
    paddingHorizontal: 16,
    borderRadius: 8,
    minWidth: 100,
    justifyContent: 'center',
    alignItems: 'center'
  },
  cancelButton: {
    backgroundColor: '#f2f2f2',
    marginRight: 12
  },
  sendButton: {
    backgroundColor: '#00000'
  },
  cancelButtonText: {
    fontSize: 16,
    color: '#333'
  },
  sendButtonText: {
    fontSize: 16,
    color: 'white',
    fontWeight: '500'
  }
});

export default HelpCenterModal;