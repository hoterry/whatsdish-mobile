import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, TextInput, ActivityIndicator, StatusBar, Platform, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as Font from 'expo-font';
import { Ionicons } from '@expo/vector-icons';
import AdCarousel from '../data/AdCarousel';
import RestaurantList from '../components/RestaurantList';
import { menus } from '../data/menuRowData';
import { LanguageContext } from '../context/LanguageContext';
import LanguageSelectorModal from '../components/LanguageSelectorModal'; // Import the new component

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
  const [loading, setLoading] = useState(true);
  const [restaurants, setRestaurants] = useState([]);
  const { language, changeLanguage } = useContext(LanguageContext);
  const [showLanguageModal, setShowLanguageModal] = useState(false); // 控制语言选择模态框

  // 获取当前语言的翻译内容
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

  useEffect(() => {
    const loadRestaurants = async () => {
      setLoading(true);
      try {
        const response = await fetch('http://10.0.0.7:5000/restaurant');
        if (!response.ok) {
          throw new Error('Failed to fetch restaurants');
        }
        const data = await response.json();
        setRestaurants(data);
      } catch (error) {
        console.error('Error fetching restaurants:', error);
      } finally {
        setLoading(false);
      }
    };
    loadRestaurants();
  }, []);

  // 切换语言
  const handleLanguageChange = (newLanguage) => {
    changeLanguage(newLanguage); // 使用上下文中的 changeLanguage
    setShowLanguageModal(false);
  };

  if (!fontsLoaded) {
    return <Text>Loading fonts...</Text>;
  }

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
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
            <RestaurantList restaurants={restaurants} />
          </View>
        </ScrollView>
      </View>

      <LanguageSelectorModal
        visible={showLanguageModal}
        onClose={() => setShowLanguageModal(false)}
        onChangeLanguage={handleLanguageChange}
        translations={translations[language]} // Passing translations for dynamic text
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
      width: 160,  // 调小logo尺寸
      height: 50,  // 调小logo高度
    },
    topBar: {
      padding: 8,  // 调小顶部栏的内边距
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
      marginRight: 12,  // 缩小右边距
    },
    languageContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    languageText: {
      fontSize: 16,  // 调小字体大小
      fontWeight: 'bold',
    },
    location: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    locationText: {
      fontSize: 18,  // 调小字体大小
      fontWeight: 'bold',
      marginRight: 5,
      marginLeft: 8,  // 调小左边距
      maxWidth: "90%",
    },
    searchBar: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 8,  // 调小顶部外边距
      paddingLeft: 8,  // 调小左内边距
      borderWidth: 1,
      borderColor: '#ddd',
      borderRadius: 18,  // 调小圆角
      height: 40,  // 调小高度
      backgroundColor: '#fff',
    },
    searchInput: {
      marginLeft: 8,  // 调小左边距
      flex: 1,
      height: '100%',
      fontSize: 14,  // 调小字体大小
    },
    menuSection: { 
      padding: 8,  // 调小内边距
      marginBottom: -8,  // 调小底部外边距
    },
    menuRow: { 
      marginTop: 8,  // 调小顶部外边距
    },
    menuItem: { 
      alignItems: 'center', 
      marginHorizontal: 8,  // 调小水平外边距
    },
    menuIcon: { 
      width: 45,  // 调小图标宽度
      height: 45,  // 调小图标高度
      marginBottom: 4,  // 调小底部外边距
    },
    menuTitle: { 
      fontSize: 14,  // 调小字体大小
      textAlign: 'center',
    },
    sectionTitle: {
      fontSize: 18,  // 调小字体大小
      fontWeight: 'bold',
      marginRight: 5,
      marginLeft: 8,  // 调小左边距
      maxWidth: "90%",
      marginTop: 16,  // 调小顶部外边距
    },
    modalContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
      width: '70%',  // 调小宽度
      backgroundColor: '#fff',
      borderRadius: 8,  // 调小圆角
      padding: 16,  // 调小内边距
    },
    modalTitle: {
      fontSize: 16,  // 调小字体大小
      fontWeight: 'bold',
      marginBottom: 16,  // 调小底部外边距
      textAlign: 'center',
    },
    languageOption: {
      padding: 8,  // 调小内边距
      borderBottomWidth: 1,
      borderBottomColor: '#ddd',
    },
    languageOptionText: {
      fontSize: 14,  // 调小字体大小
    },
    closeButton: {
      marginTop: 16,  // 调小顶部外边距
      padding: 8,  // 调小内边距
      backgroundColor: '#ddd',
      borderRadius: 5,
      alignItems: 'center',
    },
    closeButtonText: {
      fontSize: 14,  // 调小字体大小
      fontWeight: 'bold',
    },
  });
  
  export default HomeScreen;
  