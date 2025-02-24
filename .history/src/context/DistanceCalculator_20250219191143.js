import React, { useState, useEffect } from 'react';
import { Text, View, Image, StyleSheet } from 'react-native';
import { getDistance } from 'geolib';  // 引入 geolib 库来计算距离
import axios from 'axios';

const Distance = ({ userLocation, restaurant }) => {
  const [distance, setDistance] = useState(null);
  const [restaurantLocation, setRestaurantLocation] = useState(null);

  useEffect(() => {
    // 如果餐廳數據存在且有地址，進行 Geocoding 轉換
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
    const apiKey = 'YOUR_GOOGLE_MAPS_API_KEY';  // 替換為你的 Google Maps API Key
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`;

    try {
      const response = await axios.get(url);
      const location = response.data.results[0]?.geometry.location;
      return location;  // 返回經緯度 { lat, lng }
    } catch (error) {
      console.error("Geocoding error:", error);
      return null;
    }
  };

  useEffect(() => {
    if (userLocation && restaurantLocation) {
      const dist = getDistance(
        { latitude: userLocation.latitude, longitude: userLocation.longitude },
        { latitude: restaurantLocation.lat, longitude: restaurantLocation.lng }
      );
      setDistance(dist / 1000);  // 將距離轉換為公里
    }
  }, [userLocation, restaurantLocation]);

  if (distance === null) {
    return null; // 如果沒有計算出距離，什麼都不顯示
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
