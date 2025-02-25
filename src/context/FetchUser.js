import { useState, useEffect } from 'react';
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

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = await SecureStore.getItemAsync('token');

        if (!token) {
          setError('Token not found');
          return;
        }

        const response = await fetch(`${API_URL}/api/user/profile`, {  
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

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

          setUserData(user);

          if (__DEV__) {
            console.log('[Fetch User Log] Updated user data:', user);
          }
        } else {
          setError('Failed to fetch user data');
        }
      } catch (error) {
        setError(error.message);

        if (__DEV__) {
          console.error('Error fetching data:', error);
        }
      }
    };

    fetchUserData();
  }, [API_URL]);

  return { userData, setUserData, error };
};

export default useUserFetcher;
