import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, TextInput, SafeAreaView, Platform  } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Font from 'expo-font';
import AdCarousel from '../data/AdCarousel';
import RestaurantList from '../components/RestaurantList';
import { menus } from '../data/menuRowData';
import RestaurantFetcher from '../context/RestaurantFetcher';
import LocationFetcher from '../context/LocationFetcher';
import * as SecureStore from 'expo-secure-store';
import { LanguageManager } from '../components/LanguageManager';
import NotificationComponent from '../components/NotificationComponent';

const HomeScreen = () => {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [restaurants, setRestaurants] = useState([]);
  const [location, setLocation] = useState(null);

  useEffect(() => {
    async function loadFonts() {
      await Font.loadAsync({
        CustomFont: require('../../assets/fonts/Inter-SemiBold.ttf'),
      });
      setFontsLoaded(true);
    }
    loadFonts();
  }, []);

  const handleDataFetched = (data) => {
    setRestaurants(data);
  };

  if (!fontsLoaded) {
    return <Text>Loading fonts...</Text>;
  }

  return (
    <LanguageManager>
      {({ t, language, showLanguageModal, setShowLanguageModal, handleLanguageChange }) => (
        <SafeAreaView style={styles.safeArea}>
          <LocationFetcher onLocationFetched={(location) => setLocation(location)} />
          <View style={styles.fixedHeader}>
            <View style={styles.topBar}>
              <View style={styles.topBarRow}>
                <Image source={require('../../assets/whatsdish.png')} style={styles.logo} resizeMode="contain" />
                <View style={styles.iconContainer}>
                  <NotificationComponent />
                  <TouchableOpacity onPress={() => setShowLanguageModal(true)} style={styles.languageContainer}>
                    <Text style={styles.languageText}>{language}</Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.topBarRow}>
                <TouchableOpacity style={styles.location}>
                  <Text style={styles.locationText} numberOfLines={1}>
                    {location || 'Fetching location...'}
                  </Text>
                  <Ionicons name="chevron-down-outline" size={16} color="black" />
                </TouchableOpacity>
              </View>

              <View style={styles.searchBar}>
                <Ionicons name="search-outline" size={20} color="#aaa" />
                <TextInput placeholder={t('searchPlaceholder')} style={styles.searchInput} />
              </View>
            </View>
          </View>

          <ScrollView contentContainerStyle={styles.scrollContent}>
            <AdCarousel />

            <View style={styles.menuSection}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.menuRow}>
                {menus.map((item) => (
                  <TouchableOpacity key={item.id} style={styles.menuItem}>
                    <Image source={item.icon} style={styles.menuIcon} />
                    <Text style={styles.menuTitle}>{language === 'EN' ? item.title_en : item.title_zh}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            <View style={styles.restaurantSection}>
              <Text style={styles.sectionTitle}>{t('featured')}</Text>
              <RestaurantFetcher onDataFetched={handleDataFetched} />
              <RestaurantList restaurants={restaurants} />
            </View>
          </ScrollView>
        </SafeAreaView>
      )}
    </LanguageManager>
  );
};

const styles = StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: '#fff',
      paddingTop: Platform.OS === 'ios' ? 0 : StatusBar.currentHeight,
    },
    container: {
      flex: 1,
      backgroundColor: "#FFF",
    },
    logo: {
      width: 160,
      height: 50,
    },
    topBar: {
      padding: 8,
      backgroundColor: '#fff',
    },
    topBarRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      width: '100%',
    },
    iconContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    notificationIcon: {
      marginRight: 12,
    },
    languageContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginRight: 12,
    },
    languageText: {
      fontSize: 16,
      fontWeight: 'bold',
    },
    location: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    locationText: {
      fontSize: 18,
      fontWeight: 'bold',
      marginRight: 5,
      marginLeft: 8,
      maxWidth: "90%",
    },
    searchBar: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 8,
      paddingLeft: 8,
      borderWidth: 1,
      borderColor: '#ddd',
      borderRadius: 18,
      height: 40,
      backgroundColor: '#fff',
    },
    searchInput: {
      marginLeft: 8,
      flex: 1,
      height: '100%',
      fontSize: 14,
    },
    menuSection: { 
      padding: 8,
      marginBottom: -8,
    },
    menuRow: { 
      marginTop: 8,
    },
    menuItem: { 
      alignItems: 'center', 
      marginHorizontal: 8,
    },
    menuIcon: { 
      width: 45,
      height: 45,
      marginBottom: 4,
    },
    menuTitle: { 
      fontSize: 14,
      textAlign: 'center',
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      marginRight: 5,
      marginLeft: 8,
      maxWidth: "90%",
      marginTop: 16,
    },
  });
  
  
  export default HomeScreen;
  