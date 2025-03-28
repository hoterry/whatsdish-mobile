
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
import AdCarousel from '../data/AdCarousel';
import RestaurantList from '../components/RestaurantList';
import { menus } from '../data/menuRowData';
import RestaurantFetcher from '../context/RestaurantFetcher';
import LocationFetcher from '../context/LocationFetcher';
import { LanguageManager } from '../components/LanguageManager';
import NotificationComponent from '../components/NotificationComponent';
import SearchBar from '../components/SearchBar'; 
import { MaterialCommunityIcons } from '@expo/vector-icons';
import useUserFetcher from '../context/FetchUser';
import { LanguageContext } from '../context/LanguageContext';

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
  const languageCheckRef = useRef(false);
  const statusBarHeight = StatusBar.currentHeight || 0;

  useEffect(() => {
    async function loadFonts() {
      await Font.loadAsync({
        CustomFont: require('../../assets/fonts/Inter-SemiBold.ttf'),
      });
      setFontsLoaded(true);
    }
    loadFonts();
  }, []);

  useFocusEffect(
    useCallback(() => {
      languageCheckRef.current = false;
      
      const fetchAndSetUserLanguage = async () => {
        if (languageCheckRef.current) return;
        languageCheckRef.current = true;
        
        try {
          const accountId = await fetchUserData();
          
          if (accountId && userData.languagePreference) {
            const languageMapping = {
              '中文': 'ZH',
              'English': 'EN',
              'en': 'EN',
              'zh-hant': 'ZH'
            };
            
            const appLanguage = languageMapping[userData.languagePreference] || 'EN';
            changeLanguage(appLanguage);
          }
        } catch (error) {
          if (__DEV__) {
            console.error('[HomeScreen] Error:', error);
          }
        }
      };

      fetchAndSetUserLanguage();
      
      return () => {};
    }, [fetchUserData, changeLanguage])
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
                        source={require('../../assets/whatsdish.png')} 
                        style={[styles.logo, isTablet && styles.logoTablet]} 
                        resizeMode="contain" 
                      />
                    </View>
                    <View style={styles.iconContainer}>
                      <NotificationComponent />
                      {/* <TouchableOpacity onPress={() => setShowLanguageModal(true)} style={styles.languageContainer}>
                        <Text style={styles.languageText}>{language}</Text>
                      </TouchableOpacity> */}
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
                {/*<AdCarousel />*/}

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
                    {/*{menus.map((item) => (
                      <TouchableOpacity 
                        key={item.id} 
                        style={[
                          styles.menuItem, 
                          isTablet && styles.menuItemTablet
                        ]}
                      >
                        <Image 
                          source={item.icon} 
                          style={[
                            styles.menuIcon, 
                            isTablet && styles.menuIconTablet
                          ]} 
                        />
                        <Text style={[
                          styles.menuTitle,
                          isTablet && styles.menuTitleTablet
                        ]}>
                          {language === 'EN' ? item.title_en : item.title_zh}
                        </Text>
                      </TouchableOpacity>
                    ))}*/}
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
                        source={require('../../assets/whatsdish.png')} 
                        style={[styles.logo, isTablet && styles.logoTablet]} 
                        resizeMode="contain" 
                      />
                    </View>
                    <View style={styles.iconContainer}>
                      <NotificationComponent />
                      {/* <TouchableOpacity onPress={() => setShowLanguageModal(true)} style={styles.languageContainer}>
                        <Text style={styles.languageText}>{language}</Text>
                      </TouchableOpacity> */}
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
                {/*<AdCarousel />*/}

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
                    {/*{menus.map((item) => (
                      <TouchableOpacity 
                        key={item.id} 
                        style={[
                          styles.menuItem, 
                          isTablet && styles.menuItemTablet
                        ]}
                      >
                        <Image 
                          source={item.icon} 
                          style={[
                            styles.menuIcon, 
                            isTablet && styles.menuIconTablet
                          ]} 
                        />
                        <Text style={[
                          styles.menuTitle,
                          isTablet && styles.menuTitleTablet
                        ]}>
                          {language === 'EN' ? item.title_en : item.title_zh}
                        </Text>
                      </TouchableOpacity>
                    ))}*/}
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
    paddingLeft: wp(isTablet ? 2 : 3),
    paddingRight: wp(isTablet ? 1.5 : 1),
    width: '40%', 
    justifyContent: 'flex-start',
  },
  logo: {
    width: wp(40), 
    height: hp(5.5),
    maxWidth: 200,
  },
  logoTablet: {
    width: wp(40),
    height: hp(7),
    maxWidth: 300,
  },
  topBar: {
    padding: wp(1.2),
    backgroundColor: '#fff',
    width: '100%',
  },
  topBarAndroid: {
    paddingTop: hp(1.5),
    marginTop: hp(0.5),
  },
  topBarTablet: {
    padding: wp(1.2),
    paddingHorizontal: wp(1.8),
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
    paddingHorizontal: wp(isTablet ? 1 : 0.8),
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: wp(isTablet ? 2 : 1),
    width: '25%', 
    justifyContent: 'flex-end',
  },
  notificationIcon: {
    marginRight: wp(2),
  },
  languageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: wp(2),
  },
  languageText: {
    fontSize: wp(4),
    fontWeight: 'bold',
  },
  location: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: wp(isTablet ? 2 : 3),
    width: '95%',
  },
  locationText: {
    fontSize: wp(4.5),
    fontWeight: 'bold',
    marginRight: wp(1),
    width: '90%',
    marginBottom: hp(1)
  },
  locationTextTablet: {
    fontSize: wp(2.5), 
  },
  scrollContent: {
    paddingBottom: hp(2.5),
  },
  scrollContentTablet: {
    paddingBottom: hp(3.5),
  },
  menuSection: { 
    padding: wp(1.2),
    marginBottom: hp(-1),
    width: '100%',
  },
  menuSectionTablet: {
    padding: wp(1),
    marginBottom: hp(-0.5),
  },
  menuRow: { 
    marginTop: hp(1),
    width: '100%',
  },
  menuRowTablet: {
    paddingHorizontal: wp(0.5),
  },
  menuItem: { 
    alignItems: 'center',
    marginHorizontal: wp(2.5), 
    width: wp(10), 
  },
  menuItemTablet: {
    marginHorizontal: wp(isSmallPad ? 1.5 : 2),
    width: wp(isSmallPad ? 8 : 6),
  },
  menuIcon: {
    width: wp(12),
    height: wp(12), 
    marginBottom: hp(0.5),
  },
  menuIconTablet: {
    width: wp(7), 
    height: wp(7), 
    marginBottom: hp(0.7),
  },
  menuTitle: { 
    fontSize: wp(3.5),
    textAlign: 'center',
    width: wp(14), 
  },
  menuTitleTablet: {
    fontSize: wp(2),
    width: wp(10), 
  },
  restaurantSection: {
    paddingHorizontal: wp(1),
    width: '100%',
  },
  restaurantSectionTablet: {
    paddingHorizontal: wp(1.5),
  },
  sectionTitle: {
    fontSize: wp(4.5),
    fontWeight: 'bold',
    marginRight: wp(1),
    marginLeft: wp(1),
    width: '95%',
    marginTop: hp(2),
  },
});
  
export default HomeScreen;