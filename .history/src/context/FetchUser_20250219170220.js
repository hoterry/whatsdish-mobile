import { useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';

const useUserFetcher = () => {
  const [userData, setUserData] = useState({
    name: '',
    phone: '',
    email: ''
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = await SecureStore.getItemAsync('token');

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

        if (response.ok) {
          setUserData({
            name: `${data.data.given_name} ${data.data.family_name}` || '',
            phone: data.data.phone_number || '',
            email: data.data.email || '',
          });
        } else {
          setError('Failed to fetch user data');
        }
      } catch (error) {
        setError(error.message);
      }
    };

    fetchUserData();
  }, []);

  return { userData, setUserData, error };
};

export default useUserFetcher;
