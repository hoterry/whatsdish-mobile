// components/RestaurantHeader.js
import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

function RestaurantHeader({ restaurant }) {
  return (
    <View style={styles.headerContainer}>
      <Image source={{ uri: restaurant.banner_url }} style={styles.restaurantImage} />
      <View style={styles.logoContainer}>
        {restaurant.logo_url && <Image source={{ uri: restaurant.logo_url }} style={styles.restaurantLogo} />}
      </View>
      <View style={styles.centerAlignContainer}>
        <View style={styles.textContainer}>
          {restaurant.name && <Text style={styles.headerName}>{restaurant.name}</Text>}
          {restaurant.formatted_address && <Text style={styles.address}>{restaurant.formatted_address}</Text>}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    alignItems: 'center',
    marginTop: -20,
  },
  headerName: {
    fontSize: 28,
    fontFamily: 'Quicksand-Bold',
    marginTop: 10, 
  },
  restaurantImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 10, 
  },
  restaurantLogo: {
    width: 30,
    height: 30,
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
  },
  address: {
    fontSize: 19,
    color: '#555',
    marginTop: 10,
  },
});

export default RestaurantHeader;
