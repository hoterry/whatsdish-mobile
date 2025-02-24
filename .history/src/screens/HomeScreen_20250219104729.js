import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, SafeAreaView, Platform } from 'react-native';
import * as Font from 'expo-font';
import AdCarousel from '../data/AdCarousel';
import RestaurantList from '../components/RestaurantList';
import { menus } from '../data/menuRowData';
import RestaurantFetcher from '../context/RestaurantFetcher';
import LocationFetcher from '../context/LocationFetcher';
import { LanguageManager } from '../components/LanguageManager';
import NotificationComponent from '../components/NotificationComponent';
import SearchBar from '../components/SearchBar'; // 引入 SearchBar 組件

const HomeScreen = () => {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [restaurants, setRestaurants] = useState([]);
  const [location, setLocation] = useState(null);
  const [searchQuery, setSearchQuery] = useState(''); // 搜尋詞狀態

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

  const handleSearchChange = (text) => {
    setSearchQuery(text); // 更新搜尋詞
    // 這裡可以根據搜尋詞過濾餐廳列表
  };

  if (!fontsLoaded) {
    return <Text>Loading fonts...</Text>;
  }

  return (
    <LanguageManager>
      {({ t, language, showLanguageModal, setShowLanguageModal }) => (
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
                </TouchableOpacity>
              </View>

              {/* 使用拆分出來的 SearchBar 組件 */}
              <SearchBar
                onSearchChange={handleSearchChange}
                placeholder={t('searchPlaceholder')}
              />
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
  