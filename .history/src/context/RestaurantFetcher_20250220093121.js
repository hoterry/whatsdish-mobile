import React, { useEffect, useState, useCallback } from 'react';
import { ActivityIndicator, Text } from 'react-native';

const RestaurantFetcher = ({ onDataFetched }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const stableOnDataFetched = useCallback(onDataFetched, []);

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const response = await fetch('https://dev.whatsdish.com/api/rn/merchants');
        if (!response.ok) {
          throw new Error('Failed to fetch restaurants');
        }
        const data = await response.json();
        
        console.log('Fetched data:', data); 
        
        stableOnDataFetched(data); 
      } catch (err) {
        setError(err.message);
        console.error('Error fetching restaurants:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, [stableOnDataFetched]); 

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (error) {
    return <Text>Error: {error}</Text>;
  }

  return null;
};

export default RestaurantFetcher;
