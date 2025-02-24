import React, { useState, useEffect, useContext } from 'react';
import { StatusBar, Platform } from 'react-native';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, TextInput, ActivityIndicator, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as Font from 'expo-font';
import { Ionicons } from '@expo/vector-icons';
import AdCarousel from '../data/AdCarousel';
import RestaurantList from '../components/RestaurantList';
import { menus } from '../data/menuRowData';
import { LanguageContext } from '../context/LanguageContext';
import LanguageSelectorModal from '../components/LanguageSelectorModal';
import RestaurantFetcher from '../context/RestaurantFetcher'; // 引入新的组件

const translations = {
  EN: {
    welcome: "Welcome",
    searchPlaceholder: "Search menu, restaurant etc",
    featured: "Featured on Whatsdish",
    close: "Close",
    selectLanguage: "Select Language",
  },
  ZH: {
    welcome: "欢迎",
    searchPlaceholder: "搜索菜单、餐厅等",
    featured: "精选推荐",
    close: "关闭",
    selectLanguage: "选择语言",
  },
};

const HomeScreen = () => {
  const navigation = useNavigation();
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [restaurants, setRestaurants] = useState([]);
  const { language, changeLanguage } = useContext(LanguageContext);
  const [showLanguageModal, setShowLanguageModal] = useState(false);

  const t = (key) => translations[language][key] || key;

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

  const handleLanguageChange = (newLanguage) => {
    changeLanguage(newLanguage);
    setShowLanguageModal(false);
  };

  if (!fontsLoaded) {
    return <Text>Loading fonts...</Text>;
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <ScrollView contentContainerStyle={{ flexGrow: 1, paddingBottom: Platform.OS === 'android' ? 100 : 80 }}>
          <View style={styles.topBar}>
            <View style={styles.topBarRow}>
              <Image
                source={require('../../assets/whatsdish.png')}
                style={styles.logo}
                resizeMode="contain"
              />
              <View style={styles.iconContainer}>
                <TouchableOpacity style={styles.notificationIcon}>
                  <Ionicons name="notifications-outline" size={24} color="black" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setShowLanguageModal(true)} style={styles.languageContainer}>
                  <Text style={styles.languageText}>{language}</Text> 
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.topBarRow}>
              <TouchableOpacity style={styles.location}>
                <Text style={styles.locationText} numberOfLines={1}>8288 Lansdowne Road, Richmond, BC V6X 3M7</Text>
                <Ionicons name="chevron-down-outline" size={16} color="black" />
              </TouchableOpacity>
            </View>

            <View style={styles.searchBar}>
              <Ionicons name="search-outline" size={20} color="#aaa" />
              <TextInput placeholder={t('searchPlaceholder')} style={styles.searchInput} />
            </View>
          </View>
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
      </View>

      <LanguageSelectorModal
        visible={showLanguageModal}
        onClose={() => setShowLanguageModal(false)}
        onChangeLanguage={handleLanguageChange}
        translations={translations[language]}
      />
    </SafeAreaView>
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
  