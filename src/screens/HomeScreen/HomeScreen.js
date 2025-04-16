import React, { useState, useEffect, useContext, useCallback, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Image, 
  ScrollView, 
  SafeAreaView, 
  Platform, 
  StatusBar,
  Dimensions
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import * as Font from 'expo-font';
import AdCarousel from '../../data/AdCarousel';
import RestaurantList from './RestaurantList';
import { menus } from '../../data/menuRowData';
import RestaurantFetcher from '../../context/RestaurantFetcher';
import LocationFetcher from '../../context/LocationFetcher';
import { LanguageManager } from '../../components/LanguageManager';
import NotificationComponent from './NotificationComponent';
import SearchBar from './SearchBar'; 
import { MaterialCommunityIcons } from '@expo/vector-icons';
import useUserFetcher from '../../context/FetchUser';
import { LanguageContext } from '../../context/LanguageContext';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
const isTablet = windowWidth >= 768;
const isSmallPad = windowWidth >= 768 && windowWidth <= 834;

const wp = (percentage) => {
  return windowWidth * (percentage / 100);
};

const hp = (percentage) => {
  return windowHeight * (percentage / 100);
};

const HomeScreen = () => {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [restaurants, setRestaurants] = useState([]);
  const [location, setLocation] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const { fetchUserData, userData } = useUserFetcher();
  const { changeLanguage } = useContext(LanguageContext);
  const statusBarHeight = StatusBar.currentHeight || 0;
  const isFetchingLanguage = useRef(false);
  
  useEffect(() => {
    async function loadFonts() {
      await Font.loadAsync({
        CustomFont: require('../../../assets/fonts/Inter-SemiBold.ttf'),
      });
      setFontsLoaded(true);
    }
    loadFonts();
  }, []);

  const fetchAndSetUserLanguage = useCallback(async () => {
    if (isFetchingLanguage.current) {
      return;
    }
    
    try {
      isFetchingLanguage.current = true;
      
      const userData = await fetchUserData();
      
      if (__DEV__) {
        console.log('[HomeScreen] Fetched user data result:', userData);
      }

      if (userData && userData.languagePreference) {
        const languageMapping = {
          '中文': 'ZH',
          'English': 'EN',
          'en': 'EN',
          'zh-hant': 'ZH'
        };
        
        const appLanguage = languageMapping[userData.languagePreference] || 'EN';
        
        if (__DEV__) {
          console.log('[HomeScreen] Setting language to:', appLanguage);
        }
        
        changeLanguage(appLanguage);
      }
    } catch (error) {
      if (__DEV__) {
        console.error('[HomeScreen] Error fetching user data:', error);
      }
    } finally {
      isFetchingLanguage.current = false;
    }
  }, [fetchUserData, changeLanguage]); 

  useEffect(() => {
    fetchAndSetUserLanguage();
  }, [fetchAndSetUserLanguage]);

  useFocusEffect(
    useCallback(() => {
      isFetchingLanguage.current = false;
      fetchAndSetUserLanguage();
      
      return () => {};
    }, [fetchAndSetUserLanguage])
  );

  const handleDataFetched = (data) => {
    setRestaurants(data);
  };

  const handleSearchChange = (text) => {
    setSearchQuery(text); 
  };

  if (!fontsLoaded) {
    return <Text> </Text>;
  }

  return (
    <LanguageManager>
      {({ t, language, showLanguageModal, setShowLanguageModal, handleLanguageChange }) => (
        <View style={styles.container}>
          <StatusBar 
            translucent={true}
            backgroundColor="transparent"
            barStyle="dark-content"
          />
          
          {Platform.OS === 'ios' ? (
            <SafeAreaView style={styles.safeArea}>
              <LocationFetcher onLocationFetched={(location) => setLocation(location)} />
              <View style={styles.fixedHeader}>
                <View style={[
                  styles.topBar, 
                  isTablet && styles.topBarTablet,
                ]}>
                  <View style={styles.topBarRow}>
                    <View style={styles.logoWrapper}>
                      <Image 
                        source={require('../../../assets/whatsdish.png')} 
                        style={[styles.logo, isTablet && styles.logoTablet]} 
                        resizeMode="contain" 
                      />
                    </View>
                    <View style={styles.iconContainer}>
                      <NotificationComponent />
                    </View>
                  </View>

                  <View style={styles.topBarRow}>
                    <TouchableOpacity style={styles.location}>
                      <Text style={[
                        styles.locationText, 
                        isTablet && styles.locationTextTablet
                      ]} numberOfLines={1}>
                        {location || ''}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>

              <ScrollView 
                contentContainerStyle={[
                  styles.scrollContent,
                  isTablet && styles.scrollContentTablet
                ]}
                showsVerticalScrollIndicator={false}
              >
                <View style={[
                  styles.menuSection,
                  isTablet && styles.menuSectionTablet
                ]}>
                  <ScrollView 
                    horizontal
                    showsHorizontalScrollIndicator={false} 
                    style={styles.menuRow}
                    contentContainerStyle={isTablet && styles.menuRowTablet}
                  >
                  </ScrollView>
                </View>

                <View style={[
                  styles.restaurantSection,
                  isTablet && styles.restaurantSectionTablet
                ]}>
                  <RestaurantFetcher onDataFetched={handleDataFetched} />
                  <RestaurantList restaurants={restaurants} />
                </View>
              </ScrollView>
            </SafeAreaView>
          ) : (
            <View style={[styles.safeArea, { paddingTop: statusBarHeight }]}>
              <LocationFetcher onLocationFetched={(location) => setLocation(location)} />
              <View style={styles.fixedHeader}>
                <View style={[
                  styles.topBar, 
                  isTablet && styles.topBarTablet,
                  styles.topBarAndroid
                ]}>
                  <View style={styles.topBarRow}>
                    <View style={styles.logoWrapper}>
                      <Image 
                        source={require('../../../assets/whatsdish.png')} 
                        style={[styles.logo, isTablet && styles.logoTablet]} 
                        resizeMode="contain" 
                      />
                    </View>
                    <View style={styles.iconContainer}>
                      <NotificationComponent />
                    </View>
                  </View>

                  <View style={styles.topBarRow}>
                    <TouchableOpacity style={styles.location}>
                      <Text style={[
                        styles.locationText, 
                        isTablet && styles.locationTextTablet
                      ]} numberOfLines={1}>
                        {location || ''}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>

              <ScrollView 
                contentContainerStyle={[
                  styles.scrollContent,
                  isTablet && styles.scrollContentTablet
                ]}
                showsVerticalScrollIndicator={false}
              >
                <View style={[
                  styles.menuSection,
                  isTablet && styles.menuSectionTablet
                ]}>
                  <ScrollView 
                    horizontal
                    showsHorizontalScrollIndicator={false} 
                    style={styles.menuRow}
                    contentContainerStyle={isTablet && styles.menuRowTablet}
                  >
                  </ScrollView>
                </View>

                <View style={[
                  styles.restaurantSection,
                  isTablet && styles.restaurantSectionTablet
                ]}>
                  <RestaurantFetcher onDataFetched={handleDataFetched} />
                  <RestaurantList restaurants={restaurants} />
                </View>
              </ScrollView>
            </View>
          )}
        </View>
      )}
    </LanguageManager>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
  },
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  logoWrapper: {
    paddingLeft: wp(isTablet ? 1.8 : 2.8),
    paddingRight: wp(isTablet ? 1.3 : 0.9),
    width: '40%', 
    justifyContent: 'flex-start',
  },
  logo: {
    width: wp(34), 
    height: hp(4.8),
    maxWidth: 170,
  },
  logoTablet: {
    width: wp(32),
    height: hp(6),
    maxWidth: 240,
  },
  topBar: {
    padding: wp(1.1),
    backgroundColor: '#fff',
    width: '100%',
  },
  topBarAndroid: {
    paddingTop: hp(1.2),
    marginTop: hp(0.4),
  },
  topBarTablet: {
    padding: wp(1.1),
    paddingHorizontal: wp(1.6),
  },
  fixedHeader: {
    backgroundColor: '#fff',
    width: '100%',
  },
  topBarRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: wp(isTablet ? 0.9 : 0.7),
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: wp(isTablet ? 1.8 : 0.9),
    width: '24%', 
    justifyContent: 'flex-end',
  },
  notificationIcon: {
    marginRight: wp(1.8),
  },
  languageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: wp(1.8),
  },
  languageText: {
    fontSize: wp(3.6),
    fontWeight: 'bold',
  },
  location: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: wp(isTablet ? 1.8 : 2.8),
    width: '95%',
  },
  locationText: {
    fontSize: wp(3.8),
    fontWeight: 'bold',
    marginRight: wp(0.8),
    width: '90%',
    marginBottom: hp(0.8)
  },
  locationTextTablet: {
    fontSize: wp(2.2), 
  },
  scrollContent: {
    paddingBottom: hp(2.2),
  },
  scrollContentTablet: {
    paddingBottom: hp(3),
  },
  menuSection: { 
    padding: wp(1.1),
    marginBottom: hp(-0.9),
    width: '100%',
  },
  menuSectionTablet: {
    padding: wp(0.9),
    marginBottom: hp(-0.5),
  },
  menuRow: { 
    marginTop: hp(0.9),
    width: '100%',
  },
  menuRowTablet: {
    paddingHorizontal: wp(0.5),
  },
  menuItem: { 
    alignItems: 'center',
    marginHorizontal: wp(2.2), 
    width: wp(9), 
  },
  menuItemTablet: {
    marginHorizontal: wp(isSmallPad ? 1.4 : 1.8),
    width: wp(isSmallPad ? 7 : 5.5),
  },
  menuIcon: {
    width: wp(10),
    height: wp(10), 
    marginBottom: hp(0.4),
  },
  menuIconTablet: {
    width: wp(6), 
    height: wp(6), 
    marginBottom: hp(0.5),
  },
  menuTitle: { 
    fontSize: wp(3),
    textAlign: 'center',
    width: wp(12), 
  },
  menuTitleTablet: {
    fontSize: wp(1.8),
    width: wp(8), 
  },
  restaurantSection: {
    paddingHorizontal: wp(0.9),
    width: '100%',
  },
  restaurantSectionTablet: {
    paddingHorizontal: wp(1.2),
  },
  sectionTitle: {
    fontSize: wp(4),
    fontWeight: 'bold',
    marginRight: wp(0.8),
    marginLeft: wp(0.8),
    width: '95%',
    marginTop: hp(1.8),
  },
});
  
export default HomeScreen;