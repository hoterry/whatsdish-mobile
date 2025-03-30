// components/DeleteAccountButton.js
import React from 'react';
import { Alert } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import Constants from 'expo-constants';
import ProfileItem from './ProfileItem';

const { API_URL } = Constants.expoConfig.extra;

const DeleteAccountButton = ({ setIsAuthenticated, language = 'EN', isLast }) => {
  const texts = {
    EN: {
      deleteLabel: 'Delete Account',
      confirmTitle: 'Delete Account',
      confirmMessage: 'Are you sure you want to permanently delete your account? This action cannot be undone.',
      cancel: 'Cancel',
      confirm: 'Delete',
      error: 'Failed to delete account. Please try again later.',
      success: 'Account Deleted',
      successMessage: 'Your account has been successfully deleted.'
    },
    ZH: {
      deleteLabel: '刪除帳戶',
      confirmTitle: '刪除帳戶',
      confirmMessage: '您確定要永久刪除帳戶嗎？此操作無法還原。',
      cancel: '取消',
      confirm: '刪除',
      error: '刪除帳戶失敗，請稍後再試。',
      success: '帳戶已刪除',
      successMessage: '您的帳戶已成功刪除。'
    }
  };

  const t = texts[language] || texts.EN;

  const handleDeleteAccount = async () => {
    Alert.alert(
      t.confirmTitle,
      t.confirmMessage,
      [
        { text: t.cancel, style: 'cancel' },
        {
          text: t.confirm,
          style: 'destructive',
          onPress: async () => {
            try {
              const token = await SecureStore.getItemAsync('token');
              
              const response = await fetch('https://dev.whatsdish.com/api/profile', {
                method: 'DELETE',
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${token}`,
                },
              });
              
              if (__DEV__) {
                const responseData = await response.json().catch(() => ({}));
                console.log('[DeleteAccountButton] API Response:', response.status, responseData);
              }

              if (response.ok) {
                Alert.alert(
                  t.success,
                  t.successMessage,
                  [
                    {
                      text: 'OK',
                      onPress: async () => {
                        try {
                          await SecureStore.deleteItemAsync('token');
                          await SecureStore.deleteItemAsync('accountId');
                          await SecureStore.setItemAsync('needs_clean_start', 'true');
                          setIsAuthenticated(false);
                        } catch (error) {
                          if (__DEV__) {
                            console.error('Error during cleanup:', error);
                          }
                          setIsAuthenticated(false);
                        }
                      }
                    }
                  ]
                );
              } else {
                Alert.alert('Error', t.error);
              }
            } catch (err) {
              if (__DEV__) {
                console.error('Delete account error:', err);
              }
              Alert.alert('Error', t.error);
            }
          },
        },
      ]
    );
  };

  return (
    <ProfileItem
      icon="trash"
      label={t.deleteLabel}
      value=""
      onPress={handleDeleteAccount}
      isLast={isLast}
    />
  );
};

export default DeleteAccountButton;