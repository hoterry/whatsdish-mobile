import React, { useState, useEffect, useContext } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LanguageContext } from '../context/LanguageContext';
import RestaurantHeader from '../context/RestaurantHeader';
import MenuSection from '../context/MenuSection';

function DetailsScreen({ route, navigation }) {
  const { restaurant, restaurants } = route.params;
  const { language } = useContext(LanguageContext); // 獲取當前語言狀態
  const [menu, setMenu] = useState([]);

  useEffect(() => {
    const currentMenu = restaurant.menu || [];
    setMenu(currentMenu);
  }, [restaurant]);

  useEffect(() => {
    console.log('Restaurant Data IN detail screen:', restaurant);
    console.log('Restaurants Data IN detail screen:', restaurants);

    const currentMenu = restaurant.menu || [];
    setMenu(currentMenu);
  }, [restaurant]);

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="arrow-back" size={24} color="black" />
      </TouchableOpacity>

      <RestaurantHeader restaurant={restaurant} />
      <MenuSection
        restaurantId={restaurant.restaurant_id}
        restaurants={restaurants}
        language={language} // 傳遞語言狀態
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    zIndex: 1,
    padding: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 20,
  },
});

export default DetailsScreen;