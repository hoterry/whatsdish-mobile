import { useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';

const useUserFetcher = () => {
  const [userData, setUserData] = useState({
    name: '',
    phone: '',
    email: '',
    accountId: '', // Added accountId
    languagePreference: '', // Added languagePreference
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      if (__DEV__) {
        console.log('DEV Environment: Fetching user data...');
      }

      try {
        const token = await SecureStore.getItemAsync('token');

        if (__DEV__) {
          console.log('Checking token: ', token ? 'Token found' : 'Token not found');
        }

        if (!token) {
          setError('Token not found');
          return;
        }

        const response = await fetch('http://10.0.0.7:5000/api/user/profile', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (__DEV__) {
          console.log('Response from fetch: ', data);
        }

        if (response.ok) {
          const user = {
            name: `${data.data.given_name} ${data.data.family_name}` || '',
            phone: data.data.phone_number || '',
            email: data.data.email || '',
            accountId: data.data.sub || '', // Add accountId from the response
            languagePreference: data.data.language_preference || '', // Add languagePreference from the response
          };
          setUserData(user);

          if (__DEV__) {
            console.log('Updated user data: ', user);
          }
        } else {
          setError('Failed to fetch user data');
          if (__DEV__) {
            console.error('Failed response: ', data);
          }
        }
      } catch (error) {
        setError(error.message);
        if (__DEV__) {
          console.error('Error fetching data: ', error);
        }
      }
    };

    fetchUserData();
  }, []); // Empty dependency array to run only once

  return { userData, setUserData, error };
};

export default useUserFetcher;
