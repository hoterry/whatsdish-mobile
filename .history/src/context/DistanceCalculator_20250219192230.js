import React, { useState, useEffect } from 'react';
import { Text, View, Image, StyleSheet } from 'react-native';
import { getDistance } from 'geolib';  // 引入 geolib 库来计算距离
import axios from 'axios';
import * as Location from 'expo-location';  // 导入 expo-location

const Distance = ({ restaurant }) => {
  const [userLocation, setUserLocation] = useState(null);
  const [restaurantLocation, setRestaurantLocation] = useState(null);
  const [distance, setDistance] = useState(null);

  // 获取用户当前位置
  useEffect(() => {
    const getUserLocation = async () => {
      // 请求位置权限
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('Permission to access location was denied');
        return;
      }

      // 获取当前位置
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
        const location = await getLatLngFromAddress(restaurant.formatted_address);
        if (location) {
          setRestaurantLocation(location);
        }
      };
      fetchLatLng();
    }
  }, [restaurant]);

  const getLatLngFromAddress = async (address) => {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`;
    
    console.log('Requesting geolocation for address:', address);  // 打印请求的地址

    try {
      const response = await axios.get(url);
      console.log('Geolocation response:', response.data);  // 打印返回的地理编码数据
      const location = response.data[0];
      if (location) {
        return {
          lat: parseFloat(location.lat),
          lng: parseFloat(location.lon),
        };
      } else {
        console.error('Location not found');
        return null;
      }
    } catch (error) {
      console.error("Geocoding error:", error);
      return null;
    }
  };

  useEffect(() => {
    if (userLocation && restaurantLocation) {
      console.log('User Location:', userLocation);  // 打印用户位置
      console.log('Restaurant Location:', restaurantLocation);  // 打印餐厅位置
      const dist = getDistance(
        { latitude: userLocation.latitude, longitude: userLocation.longitude },
        { latitude: restaurantLocation.lat, longitude: restaurantLocation.lng }
      );
      setDistance(dist / 1000);  // 将距离转换为公里
    }
  }, [userLocation, restaurantLocation]);

  if (distance === null) {
    return null; // 如果没有计算出距离，什么都不显示
  }

  return (
    <View style={styles.tag}>
      <Image source={require('../../assets/distance.png')} style={styles.icon} />
      <Text style={styles.tagText}>{`${distance.toFixed(1)} km`}</Text>
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
    minWidth: 80,  // Set a fixed width to ensure consistent size
    justifyContent: 'center', // Centers content inside the tag
  },
  icon: {
    width: 18,  // 图标的宽度
    height: 18, // 图标的高度
    marginRight: 5,  // 图标与文字之间的间距
  },
  tagText: {
    fontSize: 18,
    color: 'black',
  },
});

export default Distance;
