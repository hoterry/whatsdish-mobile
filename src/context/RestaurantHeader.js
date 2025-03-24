import React from 'react';
import { View, Text, StyleSheet, Image, Dimensions, Platform } from 'react-native';

function RestaurantHeader({ restaurant }) {
  return (
    <View style={styles.headerContainer}>
      <Image source={{ uri: restaurant.banner_url }} style={styles.restaurantImage} />
      <View style={styles.logoContainer}>
        {restaurant.logo_url && <Image source={{ uri: restaurant.logo_url }} style={styles.restaurantLogo} />}
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
      </View>
    </View>
  );
}

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  headerContainer: {
    alignItems: 'center',
    marginTop: -20,
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
    height: 200,
    borderRadius: 10,
    marginBottom: 10,
  },
  restaurantLogo: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginRight: 15,
    borderWidth: 1,
    borderColor: '#fff',
    marginTop: -50,
    backgroundColor: '#fff',
  },
  logoContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: -40,
  },
  centerAlignContainer: {
    width: '100%',
    alignItems: 'center',
    marginTop: 20,
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
});

export default RestaurantHeader;