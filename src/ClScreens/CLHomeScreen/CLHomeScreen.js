import React, { useState, useEffect, useContext } from 'react';
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
  Dimensions,
  Alert
} from 'react-native';
import * as Font from 'expo-font';
import AdCarousel from '../../data/AdCarousel';
import { menus } from '../../data/menuRowData';
import RestaurantFetcher from '../../context/RestaurantFetcher';
import LocationFetcher from '../../context/LocationFetcher';
import SearchBar from '../../screens/HomeScreen/SearchBar'; 
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LanguageContext } from '../../context/LanguageContext';
import CLRestaurantList from './CLRestaurantList';

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

const CLHomeScreen = ({ navigation }) => {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [restaurants, setRestaurants] = useState([]);
  const [location, setLocation] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const { language, changeLanguage } = useContext(LanguageContext);
  const statusBarHeight = StatusBar.currentHeight || 0;

  // Force English as default language
  useEffect(() => {
    changeLanguage('EN');
  }, []);

  useEffect(() => {
    async function loadFonts() {
      await Font.loadAsync({
        CustomFont: require('../../../assets/fonts/Inter-SemiBold.ttf'),
      });
      setFontsLoaded(true);
    }
    loadFonts();
  }, []);

  const handleDataFetched = (data) => {
    setRestaurants(data);
  };

  const handleSearchChange = (text) => {
    setSearchQuery(text); 
  };

  const handleLoginPress = () => {
    navigation.navigate('Login');
  };

  const handleRestaurantPress = (restaurant) => {
    navigation.navigate('RestaurantDetail', { restaurant });
  };

  const promptLogin = () => {
    Alert.alert(
      language === 'EN' ? "Login Required" : "登入提示",
      language === 'EN' ? "You need to login to use more features" : "您需要登入才能使用更多功能",
      [
        { text: language === 'EN' ? "Cancel" : "取消", style: "cancel" },
        { text: language === 'EN' ? "Login Now" : "立即登入", onPress: handleLoginPress }
      ]
    );
  };

  if (!fontsLoaded) {
    return <Text> </Text>;
  }

  return (
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
                  {/* Login Button */}
                  <TouchableOpacity 
                    style={styles.loginButton} 
                    onPress={handleLoginPress}
                    >
                    <View style={styles.loginButtonInner}>
                        <MaterialCommunityIcons name="login-variant" size={wp(4)} color="#FFF" />
                        <Text style={styles.loginButtonText}>
                        {language === 'EN' ? 'LOGIN' : '登入'}
                        </Text>
                    </View>
                    </TouchableOpacity>
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
                    onPress={promptLogin}
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
              <CLRestaurantList 
                restaurants={restaurants} 
                onRestaurantPress={handleRestaurantPress}
              />
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
                  <TouchableOpacity 
                    style={styles.loginButton} 
                    onPress={handleLoginPress}
                  >
                    <Text style={styles.loginButtonText}>
                      {language === 'EN' ? 'Login' : '登入'}
                    </Text>
                  </TouchableOpacity>
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
                    onPress={promptLogin}
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
              <CLRestaurantList 
                restaurants={restaurants}
                onRestaurantPress={handleRestaurantPress}
              />
            </View>
          </ScrollView>
        </View>
      )}
    </View>
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
  loginButton: {
    backgroundColor: '#2E8B57', // 深綠色
    paddingHorizontal: wp(3),
    paddingVertical: hp(0.8),
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
  },
  loginButtonInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: wp(3.2),
    marginLeft: wp(1),
    letterSpacing: 0.5,
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
    paddingBottom: hp(8), // 為底部橫幅留出空間
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
  // 底部登入提示橫幅樣式
  loginBanner: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(250, 250, 250, 0.95)',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: wp(4),
    paddingVertical: hp(1.5),
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  bannerText: {
    fontSize: wp(3.5),
    fontWeight: '500',
    flex: 1,
    color: '#333333',
  },
  bannerButton: {
    backgroundColor: '#1E5631', // 深綠色
    paddingHorizontal: wp(3.5),
    paddingVertical: hp(1),
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
  },
  bannerButtonInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bannerButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: wp(3.2),
    marginLeft: wp(1),
    letterSpacing: 0.5,
  },  loginButtonTablet: {
    paddingHorizontal: wp(2.2),
    paddingVertical: hp(0.9),
  },
  bannerButtonTablet: {
    paddingHorizontal: wp(2.5),
    paddingVertical: hp(1.1),
  },
});
  
export default CLHomeScreen;