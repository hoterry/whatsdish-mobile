import React, { useState, useEffect } from 'react';
import { Text, View, Image, StyleSheet } from 'react-native';
import { getDistance } from 'geolib';  // 引入 geolib 库来计算距离
import axios from 'axios';
import * as Location from 'expo-location';  // 导入 expo-location


const Distance = ({ restaurant }) => {
    const [userLocation, setUserLocation] = useState(null);
    const [restaurantLocation, setRestaurantLocation] = useState(null);
    const [distance, setDistance] = useState(null);
    const [error, setError] = useState(null);  // Add state to track error
  
    // 获取用户当前位置
    useEffect(() => {
      const getUserLocation = async () => {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          console.log('Permission to access location was denied');
          return;
        }
  
        const location = await Location.getCurrentPositionAsync({});
        setUserLocation({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });
      };
  
      getUserLocation();
    }, []);
  
    // 获取餐厅的经纬度
    useEffect(() => {
      if (restaurant && restaurant.formatted_address) {
        const fetchLatLng = async () => {
          let location = await getLatLngFromAddress(restaurant.formatted_address);
  
          // 如果第一次查询失败，尝试使用邮政编码查询
          if (!location) {
            console.log('Address lookup failed, trying postal code...');
            const postalCode = extractPostalCode(restaurant.formatted_address);
            if (postalCode) {
              location = await getLatLngFromAddress(postalCode);
            }
          }
  
          // 如果邮政编码也找不到，尝试餐厅名称
          if (!location) {
            console.log('Postal code lookup failed, trying restaurant name...');
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
      console.log('Requesting geolocation for address:', address);
  
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
      paddingVertical: 4,
      paddingHorizontal: 10,
      borderRadius: 20,
      minWidth: 80,
      justifyContent: 'center',
    },
    icon: {
      width: 18,
      height: 18,
      marginRight: 5,
    },
    tagText: {
      fontSize: 18,
      color: 'black',
    },
    errorText: {
      color: 'red',  // Style the error message
      marginTop: 10,
      fontSize: 14,
    },
  });
  
  export default Distance;
  