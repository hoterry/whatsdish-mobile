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
            <View style={[styles.topBar, isTablet && styles.topBarTablet]}>
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
                    style={[styles.loginButton, isTablet && styles.loginButtonTablet]} 
                    onPress={handleLoginPress}
                  >
                    <View style={styles.loginButtonInner}>
                      <MaterialCommunityIcons name="login-variant" size={wp(4)} color="#222222" />
                      <Text style={styles.loginButtonText}>
                        {language === 'EN' ? 'Login' : '登入'}
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
                    style={[styles.loginButton, isTablet && styles.loginButtonTablet]} 
                    onPress={handleLoginPress}
                  >
                    <View style={styles.loginButtonInner}>
                      <MaterialCommunityIcons name="login-variant" size={wp(4)} color="#222222" />
                      <Text style={styles.loginButtonText}>
                        {language === 'EN' ? 'Login' : '登入'}
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
    width: wp(35), 
    height: hp(4.5),
    maxWidth: 180,
  },
  logoTablet: {
    width: wp(30),
    height: hp(5.5),
    maxWidth: 250,
  },
  topBar: {
    padding: wp(1),
    backgroundColor: '#fff',
    width: '100%',
  },
  topBarAndroid: {
    paddingTop: hp(1),
    marginTop: hp(0.3),
  },
  topBarTablet: {
    padding: wp(1),
    paddingHorizontal: wp(1.5),
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
    paddingHorizontal: wp(isTablet ? 0.8 : 0.6),
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: wp(isTablet ? 1.5 : 0.8),
    width: '25%', 
    justifyContent: 'flex-end',
  },
  loginButton: {
    backgroundColor: 'transparent',
    paddingHorizontal: wp(3),
    paddingVertical: hp(1),
    borderRadius: 0,
    elevation: 0,
    borderWidth: 0,
  },
  loginButtonInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginButtonText: {
    color: '#000000',
    fontWeight: '700',
    fontSize: wp(4),
    marginLeft: wp(0.8),
    letterSpacing: 0.5,
  },
  languageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: wp(1.5),
  },
  languageText: {
    fontSize: wp(3.5),
    fontWeight: 'bold',
  },
  location: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: wp(isTablet ? 1.5 : 2.5),
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
    paddingBottom: hp(2),
  },
  scrollContentTablet: {
    paddingBottom: hp(3),
  },
  menuSection: { 
    padding: wp(1),
    marginBottom: hp(-0.8),
    width: '100%',
  },
  menuSectionTablet: {
    padding: wp(0.8),
    marginBottom: hp(-0.4),
  },
  menuRow: { 
    marginTop: hp(0.8),
    width: '100%',
  },
  menuRowTablet: {
    paddingHorizontal: wp(0.4),
  },
  menuItem: { 
    alignItems: 'center',
    marginHorizontal: wp(2), 
    width: wp(9), 
  },
  menuItemTablet: {
    marginHorizontal: wp(isSmallPad ? 1.2 : 1.6),
    width: wp(isSmallPad ? 7 : 5),
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
    paddingHorizontal: wp(0.8),
    width: '100%',
    paddingBottom: hp(6), // 為底部橫幅留出空間
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
    marginTop: hp(1.5),
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
    paddingHorizontal: wp(3),
    paddingVertical: hp(1.2),
    borderTopWidth: 1,
    borderTopColor: 'rgba(224, 224, 224, 0.5)',
  },
  bannerText: {
    fontSize: wp(3),
    fontWeight: '500',
    flex: 1,
    color: '#333333',
  },
  bannerButton: {
    backgroundColor: 'transparent',
    paddingHorizontal: wp(3),
    paddingVertical: hp(0.8),
    borderRadius: 0,
    borderWidth: 0,
    borderBottomWidth: 1,
    borderBottomColor: '#222222',
  },
  bannerButtonInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bannerButtonText: {
    color: '#222222',
    fontWeight: '700',
    fontSize: wp(3),
    marginLeft: wp(0.8),
    letterSpacing: 0.5,
  },  
  loginButtonTablet: {
    paddingHorizontal: wp(2.5),
    paddingVertical: hp(1),
  },
  bannerButtonTablet: {
    paddingHorizontal: wp(2),
    paddingVertical: hp(0.9),
  },
});
  
export default CLHomeScreen;