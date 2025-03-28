// components/DeleteAccountButton.js
import React from 'react';
import { Alert } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import ProfileItem from './ProfileItem';

const DeleteAccountButton = ({ setIsAuthenticated, language = 'EN' }) => {
  const texts = {
    EN: {
      deleteLabel: 'Delete Account',
      confirmTitle: 'Delete Account',
      confirmMessage: 'Are you sure you want to permanently delete your account? This action cannot be undone.',
      cancel: 'Cancel',
      confirm: 'Delete',
      error: 'Failed to delete account. Please try again later.'
    },
    ZH: {
      deleteLabel: '刪除帳戶',
      confirmTitle: '刪除帳戶',
      confirmMessage: '您確定要永久刪除帳戶嗎？此操作無法還原。',
      cancel: '取消',
      confirm: '刪除',
      error: '刪除帳戶失敗，請稍後再試。'
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
              const res = await fetch('https://your-backend.com/api/account', {
                method: 'DELETE',
                headers: {
                  Authorization: `Bearer ${token}`,
                  'Content-Type': 'application/json',
                },
              });

              if (res.ok) {
                await SecureStore.deleteItemAsync('token');
                await SecureStore.deleteItemAsync('accountId');
                setIsAuthenticated(false);
              } else {
                Alert.alert('Error', t.error);
              }
            } catch (err) {
              console.error('Delete account error:', err);
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
      isLast
    />
  );
};

export default DeleteAccountButton;