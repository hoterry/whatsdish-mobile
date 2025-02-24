import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, TextInput, ActivityIndicator, StatusBar, Platform, SafeAreaView, Modal, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import * as Font from 'expo-font';
import AdCarousel from '../data/AdCarousel';
import RestaurantList from '../components/RestaurantList';
import { menus } from '../data/menuRowData';

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
  const [language, setLanguage] = useState('EN'); // 当前语言状态
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
        console.log(data);
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
    setLanguage(newLanguage);
    setShowLanguageModal(false); // 关闭模态框
    Alert.alert(t('languageChanged'), `Language is now set to ${newLanguage}`); // 提示用户
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
                  <Text style={styles.menuTitle}>{item.title}</Text>
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

      <Modal
        visible={showLanguageModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowLanguageModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{t('selectLanguage')}</Text>
            <TouchableOpacity onPress={() => handleLanguageChange('EN')} style={styles.languageOption}>
              <Text style={styles.languageOptionText}>English (EN)</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleLanguageChange('ZH')} style={styles.languageOption}>
              <Text style={styles.languageOptionText}>中文 (ZH)</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setShowLanguageModal(false)} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>{t('close')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
    backgroundColor: "#FFF"
  },
  logo: {
    width: 200,
    height: 60,
  },
  topBar: {
    padding: 10,
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
    marginRight: 16,
  },
  languageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  languageText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  location: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    fontSize: 22,
    fontWeight: 'bold',
    marginRight: 5,
    marginLeft: 10,
    maxWidth: "90%",
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    paddingLeft: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 20,
    height: 45,
    backgroundColor: '#fff',
  },
  searchInput: {
    marginLeft: 10,
    flex: 1,
    height: '100%',
    fontSize: 16,
  },
  menuSection: { 
    padding: 10,
    marginBottom: -10,
  },
  menuRow: { 
    marginTop: 10,
  },
  menuItem: { 
    alignItems: 'center', 
    marginHorizontal: 10,
  },
  menuIcon: { 
    width: 55, 
    height: 55, 
    marginBottom: 5,
  },
  menuTitle: { 
    fontSize: 17, 
    textAlign: 'center',
  },
  sectionTitle:{
    fontSize: 23,
    fontWeight: 'bold',
    marginRight: 5,
    marginLeft: 10,
    maxWidth: "90%",
    marginTop:20
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  languageOption: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  languageOptionText: {
    fontSize: 16,
  },
  closeButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#ddd',
    borderRadius: 5,
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default HomeScreen;