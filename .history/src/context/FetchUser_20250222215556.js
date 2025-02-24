import { useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import Constants from 'expo-constants'; 

const useUserFetcher = () => {
  const [userData, setUserData] = useState({
    name: '',
    phone: '',
    email: '',
    accountId: '', // Added accountId
    languagePreference: '', // Added languagePreference
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
        console.log('Fetched Data:', data);  // Log the raw data from the response

        if (response.ok) {
          const user = {
            name: `${data.data.given_name} ${data.data.family_name}` || '',
            phone: data.data.phone_number || '',
            email: data.data.email || '',
            accountId: data.data.sub || '', // Add accountId from the response
            languagePreference: data.data.language_preference || '', // Add languagePreference from the response
          };
          setUserData(user);
          console.log('Updated user data:', user);  // Log the updated user data
        } else {
          setError('Failed to fetch user data');
        }
      } catch (error) {
        setError(error.message);
        console.error('Error fetching data:', error);  // Log error if any
      }
    };

    fetchUserData();
  }, [API_URL]);  

  return { userData, setUserData, error };
};

export default useUserFetcher;
