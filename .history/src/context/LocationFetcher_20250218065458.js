import React, { useState, useEffect } from 'react';
import * as Location from 'expo-location';

const LocationFetcher = ({ onLocationFetched }) => {
  const [location, setLocation] = useState(null); // 保存地址信息
  const [loading, setLoading] = useState(true); // 显示加载状态

  useEffect(() => {
    const getLocation = async () => {
      // 请求权限
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        alert('Location permission denied');
        setLoading(false);
        return;
      }

      // 获取位置
      let { coords } = await Location.getCurrentPositionAsync({});
      
      // 使用经纬度反向解析成地址
      const results = await Location.reverseGeocodeAsync({
        latitude: coords.latitude,
        longitude: coords.longitude,
      });

      if (results.length > 0) {
        const { city, region, country, street, name } = results[0]; // 提取完整地址信息
        const userLocation = `${name ? name + ', ' : ''}${city}, ${region}, ${country}`;
        console.log('User location:', userLocation); // Log完整地址信息
        setLocation(userLocation);
        onLocationFetched(userLocation); // 回传地址到父组件
      } else {
        console.log('No address found');
      }

      setLoading(false); // 完成后关闭加载状态
    };

    getLocation();
  }, []);

  if (loading) {
    return <Text>Fetching location...</Text>;
  }

  return (
    <Text>{location || 'Location not found'}</Text>
  );
};

export default LocationFetcher;
