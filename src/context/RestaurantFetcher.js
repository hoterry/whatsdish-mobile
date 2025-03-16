import React, { useEffect, useState, useCallback } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import Constants from 'expo-constants';
import LottieView from 'lottie-react-native';

const RestaurantFetcher = ({ onDataFetched }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const stableOnDataFetched = useCallback(onDataFetched, []);

  useEffect(() => {
    const fetchRestaurants = async () => {
      const { API_URL } = Constants.expoConfig.extra;

      try {
        const response = await fetch(`${API_URL}/api/restaurants`);

        if (!response.ok) {
          throw new Error('Failed to fetch restaurants');
        }

        const data = await response.json();
        stableOnDataFetched(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, [stableOnDataFetched]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <LottieView
          source={require('../../assets/loading-animation.json')}
          autoPlay
          loop
          style={styles.loadingAnimation}
        />
      </View>
    );
  }

  if (error) {
    return <Text style={styles.errorText}>Error: {error}</Text>;
  }

  return null;
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingAnimation: {
    width: 200,
    height: 200,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#000',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginTop: 16,
  },
});

export default RestaurantFetcher;