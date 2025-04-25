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
    marginTop: -18,
    width: '100%',
  },
  headerName: {
    fontSize: 22,
    fontFamily: 'Inter-SemiBold', 
    marginTop: 5,
    textAlign: 'center',
    paddingHorizontal: 10,
    width: width * 0.88,
    color: '#333',
  },
  restaurantImage: {
    width: '100%',
    height: 180,
    borderRadius: 10,
    marginBottom: 10,
  },
  restaurantLogo: {
    width: 62,
    height: 62,
    borderRadius: 31,
    marginRight: 14,
    borderWidth: 1,
    borderColor: '#fff',
    marginTop: -45,
    backgroundColor: '#fff',
  },
  logoContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: -35,
  },
  centerAlignContainer: {
    width: '100%',
    alignItems: 'center',
    marginTop: 18,
  },
  textContainer: {
    alignItems: 'center',
    width: '88%',
  },
  address: {
    fontSize: 15,
    fontFamily: 'Montserrat',
    color: '#666',
    marginTop: 7,
    textAlign: 'center',
    paddingHorizontal: 10,
    width: width * 0.88,
  },
  guestModeTag: {
    backgroundColor: 'rgba(247, 247, 247, 0.9)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 15,
    marginTop: 7,
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