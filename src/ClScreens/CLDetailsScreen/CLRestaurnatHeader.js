import React from 'react';
import { View, Text, StyleSheet, Image, Dimensions, Platform } from 'react-native';

function CLRestaurantHeader({ restaurant }) {
  return (
    <View style={styles.headerContainer}>
      <Image 
        source={{ uri: restaurant.banner_url || 'https://via.placeholder.com/800x400' }} 
        style={styles.restaurantImage} 
      />
      <View style={styles.logoContainer}>
        {restaurant.logo_url && (
          <Image 
            source={{ uri: restaurant.logo_url }} 
            style={styles.restaurantLogo} 
          />
        )}
      </View>
      <View style={styles.centerAlignContainer}>
        <View style={styles.textContainer}>
          {restaurant.name && (
            <Text 
              style={styles.headerName} 
              numberOfLines={1} 
              adjustsFontSizeToFit={Platform.OS === 'ios'}
              minimumFontScale={0.7}
            >
              {restaurant.name}
            </Text>
          )}
          {restaurant.formatted_address && (
            <Text 
              style={styles.address} 
              numberOfLines={2} 
              ellipsizeMode="tail"
            >
              {restaurant.formatted_address}
            </Text>
          )}
        </View>
        <View style={styles.guestModeTag}>
          <Text style={styles.guestModeText}>
            {Platform.OS === 'ios' ? 'Guest Mode' : 'Guest Mode'}
          </Text>
        </View>
      </View>
    </View>
  );
}

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  headerContainer: {
    alignItems: 'center',
    marginTop: -20, // Updated from -16 to -20 to match non-CL
    width: '100%',
  },
  headerName: {
    fontSize: 24,
    fontFamily: 'Inter-SemiBold', 
    marginTop: 5,
    textAlign: 'center',
    paddingHorizontal: 10,
    width: width * 0.9,
    color: '#333',
  },
  restaurantImage: {
    width: '100%',
    height: 200, // Updated from 170 to 200 to match non-CL
    borderRadius: 10, // Updated from 8 to 10 to match non-CL
    marginBottom: 10, // Updated from 8 to 10 to match non-CL
  },
  restaurantLogo: {
    width: 70, // Updated from 60 to 70 to match non-CL
    height: 70, // Updated from 60 to 70 to match non-CL
    borderRadius: 35, // Updated from 30 to 35 to match non-CL
    marginRight: 15, // Updated from 12 to 15 to match non-CL
    borderWidth: 1,
    borderColor: '#fff',
    marginTop: -50, // Updated from -40 to -50 to match non-CL
    backgroundColor: '#fff',
  },
  logoContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: -40, // Updated from -35 to -40 to match non-CL
  },
  centerAlignContainer: {
    width: '100%',
    alignItems: 'center',
    marginTop: 20, // Updated from 16 to 20 to match non-CL
  },
  textContainer: {
    alignItems: 'center',
    width: '90%',
  },
  address: {
    fontSize: 16,
    fontFamily: 'Montserrat',
    color: '#666',
    marginTop: 8,
    textAlign: 'center',
    paddingHorizontal: 10,
    width: width * 0.9,
  },
  // 訪客模式標籤樣式
  guestModeTag: {
    backgroundColor: 'rgba(247, 247, 247, 0.9)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 16,
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  guestModeText: {
    fontSize: 12,
    fontFamily: 'Montserrat-Medium',
    color: '#666',
  }
});

export default CLRestaurantHeader;