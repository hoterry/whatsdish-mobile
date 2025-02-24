import React, { useState, useEffect } from 'react';
import * as Location from 'expo-location';

const LocationFetcher = ({ onLocationFetched }) => {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    const fetchLocation = async () => {
      if (__DEV__) {
        console.log('[Location Fetcher Log] DEV Environment: Requesting location permissions...');
      }

      // Request location permissions
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Location permission denied');
        if (__DEV__) {
          console.error('Location permission denied');
        }
        return;
      }

      if (__DEV__) {
        console.log('[Location Fetcher Log] Location permission granted, fetching current position...');
      }

      // Get current position
      let { coords } = await Location.getCurrentPositionAsync({});
      if (__DEV__) {
        console.log('[Location Fetcher Log] Current coordinates:', coords);
      }

      // Reverse geocode to get address
      const results = await Location.reverseGeocodeAsync({
        latitude: coords.latitude,
        longitude: coords.longitude,
      });

      if (__DEV__) {
        console.log('[Location Fetcher Log] Reverse geocode results:', results);
      }

      if (results.length > 0) {
        const { city, region, country, street, name } = results[0];
        const userLocation = `${name ? name + ', ' : ''}${city}, ${region}, ${country}`;
        setLocation(userLocation);
        onLocationFetched(userLocation); // Pass the location back to the parent component

        if (__DEV__) {
          console.log('[Location Fetcher Log] Location fetched:', userLocation);
        }
      } else {
        setErrorMsg('No address found');
        if (__DEV__) {
          console.error('No address found from geocode results');
        }
      }
    };

    fetchLocation();
  }, [onLocationFetched]);

  return null; // This component doesn't render anything
};

export default LocationFetcher;
