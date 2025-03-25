import React, { useState, useEffect } from 'react';
import { Text, View, Image, StyleSheet } from 'react-native';
import { getDistance } from 'geolib';  
import axios from 'axios';
import * as Location from 'expo-location'; 

const Distance = ({ restaurant }) => {
    const [userLocation, setUserLocation] = useState(null);
    const [restaurantLocation, setRestaurantLocation] = useState(null);
    const [distance, setDistance] = useState(null);
    const [error, setError] = useState(null);  // Add state to track error

// 在 Distance 組件中修改位置權限請求方式

useEffect(() => {
  const getUserLocation = async () => {
    try {
      // 在 iOS 上，先檢查位置服務是否啟用
      const serviceEnabled = await Location.hasServicesEnabledAsync().catch(() => false);
      if (!serviceEnabled) {
        if (__DEV__) {
          console.log('[Distance] Location services are not enabled');
        }
        return;
      }

      // 安全地檢查當前權限
      const { status } = await Location.getForegroundPermissionsAsync().catch(() => ({ status: 'unknown' }));
      
      // 只有當權限未決定時才請求
      if (status !== 'granted') {
        // 在 iOS 上，確保在主線程上下文請求
        setTimeout(async () => {
          try {
            const { status: newStatus } = await Location.requestForegroundPermissionsAsync();
            if (newStatus !== 'granted') {
              return;
            }
            // 權限獲取後繼續獲取位置
            getLocationAfterPermission();
          } catch (permErr) {
            if (__DEV__) {
              console.error('[Distance] Error requesting permission:', permErr);
            }
          }
        }, 500);
      } else {
        // 已有權限，直接獲取位置
        getLocationAfterPermission();
      }
    } catch (e) {
      if (__DEV__) {
        console.error('[Distance] Unexpected error in location flow:', e);
      }
    }
  };

  const getLocationAfterPermission = async () => {
    try {
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
        timeout: 5000
      });
      
      setUserLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
    } catch (locErr) {
      if (__DEV__) {
        console.error('[Distance] Error getting location:', locErr);
      }
    }
  };

  getUserLocation();
}, []);

    useEffect(() => {
      if (restaurant && restaurant.formatted_address) {
        const fetchLatLng = async () => {
          let location = null;

          // First, try to extract and use the postal code
          const postalCode = extractPostalCode(restaurant.formatted_address);
          if (postalCode) {
            location = await getLatLngFromAddress(postalCode);
          }

          // If postal code lookup fails, try the full address
          if (!location) {
            if (__DEV__) {
              console.log('[Distance Calculator Log] Postal code lookup failed, trying full address...');
            }
            location = await getLatLngFromAddress(restaurant.formatted_address);
          }

          // If still no location found, try the restaurant name
          if (!location) {
            if (__DEV__) {
              console.log('[Distance Calculator Log] Address lookup failed, trying restaurant name...');
            }
            location = await getLatLngFromAddress(restaurant.name);
          }

          // If still no location found, set error
          if (!location) {
            setError('Unable to find location after all attempts.');
          } else {
            setRestaurantLocation(location);
          }
        };
        fetchLatLng();
      }
    }, [restaurant]);

    const extractPostalCode = (address) => {
      const postalCodeRegex = /[A-Z]\d[A-Z] \d[A-Z]\d$/;  // Canada postal code format
      const match = address.match(postalCodeRegex);
      if (match) {
        return match[0];  // Return the extracted postal code
      }
      return null;
    };

    const getLatLngFromAddress = async (address) => {
      const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`;
      if (__DEV__) {
        console.log('[Distance Calculator Log] Requesting geolocation for address:', address);
      }

      try {
        const response = await axios.get(url);
        const location = response.data[0];
        if (location) {
          return {
            lat: parseFloat(location.lat),
            lng: parseFloat(location.lon),
          };
        }
        return null;
      } catch (error) {
        return null; // Return null on error, don't log immediately
      }
    };

    useEffect(() => {
      if (userLocation && restaurantLocation) {
        const dist = getDistance(
          { latitude: userLocation.latitude, longitude: userLocation.longitude },
          { latitude: restaurantLocation.lat, longitude: restaurantLocation.lng }
        );
        setDistance(dist / 1000);  // Convert distance to kilometers
      }
    }, [userLocation, restaurantLocation]);

    if (distance === null) {
      return null;  // Don't display anything if distance is not calculated
    }

    return (
        <View style={styles.tag}>
          <Image source={require('../../assets/distance.png')} style={styles.icon} />
          <Text style={styles.tagText}>{`${distance.toFixed(1)} km`}</Text>
          {error && <Text style={styles.errorText}>{error}</Text>} 
        </View>
    );
};

const styles = StyleSheet.create({
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    width: 18,
    height: 18,
    marginRight: 5,
  },
  tagText: {
    fontSize: 16,
  },
  errorText: {
    color: 'red',
    fontSize: 14,
  },
});

export default Distance;