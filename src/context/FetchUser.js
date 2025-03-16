import { useState, useCallback } from 'react'; // Add useCallback
import * as SecureStore from 'expo-secure-store';
import Constants from 'expo-constants'; 

const useUserFetcher = () => {
  const [userData, setUserData] = useState({
    name: '',
    phone: '',
    email: '',
    accountId: '',
    languagePreference: '',
  });
  const [error, setError] = useState(null);

  const { API_URL } = Constants.expoConfig.extra; 

  // Memoize fetchUserData using useCallback
  const fetchUserData = useCallback(async () => {
    try {
      if (__DEV__) {
        console.log('[Fetch User Log] Fetching user data...');
      }

      const token = await SecureStore.getItemAsync('token');

      if (!token) {
        if (__DEV__) {
          console.log('[Fetch User Log] Token not found in SecureStore');
        }
        setError('Token not found');
        return null;
      }

      if (__DEV__) {
        console.log('[Fetch User Log] Token found:', token);
      }

      const response = await fetch(`${API_URL}/api/user/profile`, {  
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (__DEV__) {
        console.log('[Fetch User Log] Response status:', response.status);
      }

      const data = await response.json();

      if (__DEV__) {
        console.log('[Fetch User Log] Fetched Data:', data);
      }

      if (response.ok) {
        const languageMapping = {
          'zh-hant': '中文',
          'en': 'English'
        };

        const user = {
          name: `${data.data.given_name} ${data.data.family_name}` || '',
          phone: data.data.phone_number || '',
          email: data.data.email || '',
          accountId: data.data.sub || '',
          languagePreference: languageMapping[data.data.language_preference] || 'Unknown', 
        };

        if (__DEV__) {
          console.log('[Fetch User Log] Parsed user data:', user);
        }

        setUserData(user);

        if (__DEV__) {
          console.log('[Fetch User Log] Updated user data in state:', user);
        }

        return user.accountId; 
      } else {
        if (__DEV__) {
          console.log('[Fetch User Log] Failed to fetch user data:', data);
        }
        setError('Failed to fetch user data');
        return null;
      }
    } catch (error) {
      if (__DEV__) {
        console.error('[Fetch User Log] Error fetching data:', error);
      }
      setError(error.message);
      return null;
    }
  }, [API_URL]); // Add API_URL as a dependency

  return { userData, setUserData, error, fetchUserData };
};

export default useUserFetcher;