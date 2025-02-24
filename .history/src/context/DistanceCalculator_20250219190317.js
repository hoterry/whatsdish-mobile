import React, { useState, useEffect } from 'react';
import { Text, View, Image, StyleSheet } from 'react-native';
import { getDistance } from 'geolib';  // 引入 geolib 库来计算距离

const Distance = ({ userLocation, restaurantLocation }) => {
  const [distance, setDistance] = useState(null);

  useEffect(() => {
    if (userLocation && restaurantLocation) {
      const dist = getDistance(
        { latitude: userLocation.latitude, longitude: userLocation.longitude },
        { latitude: restaurantLocation.latitude, longitude: restaurantLocation.longitude }
      );
      setDistance(dist / 1000);  // 将距离从米转换为公里
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
    backgroundColor: '#e0f7e0', // Light green background
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 20,
    minWidth: 80,  // Set a fixed width to ensure consistent size
    justifyContent: 'center', // Centers content inside the tag
  },
  icon: {
    width: 16,  // 图标的宽度
    height: 16, // 图标的高度
    marginRight: 5,  // 图标与文字之间的间距
  },
  tagText: {
    fontSize: 14,
    color: 'black',
  },
});

export default Distance;
