// components/RestaurantHeader.js
import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

function RestaurantHeader({ restaurant }) {
  return (
    <View style={styles.headerContainer}>
      <Image source={{ uri: restaurant.image }} style={styles.restaurantImage} />
      <View style={styles.logoContainer}>
        {restaurant.logo && <Image source={{ uri: restaurant.logo }} style={styles.restaurantLogo} />}
      </View>
      <View style={styles.leftAlignContainer}>
      {restaurant.name && <Text style={styles.headerLeft}>{restaurant.name}</Text>}
      {restaurant.address && <Text style={styles.addressLeft}>{restaurant.address}</Text>}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    alignItems: 'center',
    marginBottom: -90,
  },
  headerLeft: {
    fontSize: 28,
    fontFamily: 'Quicksand-Bold',
    textAlign: 'left',
  },
  restaurantImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 20,
  },
  restaurantLogo: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginRight: 15,
    borderWidth: 2,
    borderColor: '#fff',
    top: -150,
  },
  logoContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 40,
  },
  leftAlignContainer: {
    marginTop: 10,
    alignItems: 'flex-start',
    width: '100%',
    paddingLeft: 20,
    top: "-30%",
  },
  addressLeft: {
    fontSize: 19,
    color: '#555',
    marginTop: 10,
    textAlign: 'left',
  },
});

export default RestaurantHeader;
