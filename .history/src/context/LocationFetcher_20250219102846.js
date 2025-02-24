import React, { useState, useEffect } from 'react';

import * as Location from 'expo-location';

const LocationFetcher = ({ onLocationFetched }) => {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    const fetchLocation = async () => {
      // Request location permissions
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Location permission denied');
        return;
      }

      // Get current position
      let { coords } = await Location.getCurrentPositionAsync({});

      // Reverse geocode to get address
      const results = await Location.reverseGeocodeAsync({
        latitude: coords.latitude,
        longitude: coords.longitude,
      });

      if (results.length > 0) {
        const { city, region, country, street, name } = results[0];
        const userLocation = `${name ? name + ', ' : ''}${city}, ${region}, ${country}`;
        setLocation(userLocation);
        onLocationFetched(userLocation); // Pass the location back to the parent component
      } else {
        setErrorMsg('No address found');
      }
    };

    fetchLocation();
  }, [onLocationFetched]);

  return null; // This component doesn't render anything
};

export default LocationFetcher;