import React, { useState, useEffect, useContext, useRef } from 'react';
import { View, Text, ScrollView, Pressable, Image, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LanguageContext } from '../context/LanguageContext';
import Distance from '../context/DistanceCalculator';
import Constants from 'expo-constants';
import { LinearGradient } from 'expo-linear-gradient';
import * as Font from 'expo-font';
import LottieView from 'lottie-react-native'; // 確保導入LottieView

const { API_URL } = Constants.expoConfig.extra;

const GREEN_COLOR = '#4CD964';
const GREEN_COLOR_DARK = '#3CB371';

const translations = {
  EN: {
    pickUp: "Pick Up",
    delivery: "Delivery",
    distance: "Distance",
    unavailable: "Currently Not Available",
    pricePledge: "Dine-in Price Guarantee",
    loginRequired: "Login Required",
    loginMessage: "Please login to use this feature",
    cancel: "Cancel",
    login: "Login"
  },
  ZH: {
    pickUp: "自取",
    delivery: "外送",
    distance: "距離",
    unavailable: "暫時無法提供服務",
    pricePledge: "堂食同價保證",
    loginRequired: "需要登入",
    loginMessage: "請登入以使用此功能",
    cancel: "取消",
    login: "登入"
  },
};

const CLRestaurantList = ({ restaurants, userLocation }) => {
  const navigation = useNavigation();
  const { language } = useContext(LanguageContext);
  const [loadingRestaurantId, setLoadingRestaurantId] = useState(null);
  const [fontsLoaded, setFontsLoaded] = useState(false);

  const t = (key) => translations[language][key] || key;

  useEffect(() => {
    const loadFonts = async () => {
      await Font.loadAsync({
        'Montserrat': require('../../assets/fonts/Montserrat-Regular.ttf'),
        'Montserrat-Bold': require('../../assets/fonts/Montserrat-Bold.ttf'),
        'Montserrat-SemiBold': require('../../assets/fonts/Montserrat-SemiBold.ttf'),
        'Montserrat-Medium': require('../../assets/fonts/Montserrat-Medium.ttf'),
        'Inter-SemiBold': require('../../assets/fonts/Inter-SemiBold.ttf'),
      });
      setFontsLoaded(true);
    };

    loadFonts();
  }, []);

  if (!restaurants || !Array.isArray(restaurants.data)) {
    return <Text> </Text>;
  }

  // 使用Lottie動畫替換原來的ActivityIndicator
  if (!fontsLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <LottieView
          source={require('../../assets/wd-loading-animation.json')} 
          autoPlay
          loop={true}
          style={styles.lottieAnimation}
        />
      </View>
    );
  }

  const promptLogin = () => {
    Alert.alert(
      t('loginRequired'),
      t('loginMessage'),
      [
        { text: t('cancel'), style: "cancel" },
        { text: t('login'), onPress: () => navigation.navigate('Login') }
      ]
    );
  };

  const handlePressRestaurant = async (restaurant) => {
    if (!restaurant.is_active) return;
    
    // 修正: 使用 Details 而不是 RestaurantDetail 導航名稱
    // 這需要與 App.js 中 GuestStack 定義的路由名稱一致
    navigation.navigate('Details', { 
      restaurant, 
      restaurants
    });
    
    // 如果您確定要使用 RestaurantDetail 名稱，則需要在 App.js 中保持一致
    // navigation.navigate('RestaurantDetail', { 
    //   restaurant, 
    //   restaurants
    // });
  };

  return (
    <ScrollView 
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
    <Text style={styles.Featured}>{t('Featured Restaurants')}</Text>
      {restaurants.data
        .filter((item) => item.is_shown) 
        .map((item) => (
          <View key={item.gid} style={styles.restaurantCard}>

            <Pressable 
              onPress={() => handlePressRestaurant(item)}
              android_ripple={{ color: 'rgba(0, 0, 0, 0.1)' }}
              style={({pressed}) => [
                pressed && styles.pressedCard
              ]}
            >
              <View style={styles.imageContainer}>
                <Image
                  source={{ uri: item.banner_url }}
                  style={[styles.restaurantImage, !item.is_active && styles.inactiveBanner]}
                />

                <LinearGradient
                  colors={['transparent', 'rgba(0,0,0,0.3)', 'rgba(0,0,0,0.7)']}
                  style={styles.imageGradient}
                />
                
                {!item.is_active && (
                  <View style={styles.unavailableOverlay}>
                    <Text style={styles.unavailableText}>{t('unavailable')}</Text>
                  </View>
                )}

                <View style={styles.priceGuaranteeContainer}>
                  <View style={styles.priceGuaranteeBadge}>
                    <Text style={styles.priceGuaranteeText}>{t('pricePledge')}</Text>
                  </View>
                </View>

                <View style={styles.premiumTagsContainer}>
                  {item.is_delivery && (
                    <View style={styles.premiumTag}>
                      <Text style={styles.premiumTagText}>{t('delivery')}</Text>
                    </View>
                  )}
                  
                  {item.is_pickup && (
                    <View style={styles.premiumTag}>
                      <Text style={styles.premiumTagText}>{t('pickUp')}</Text>
                    </View>
                  )}
                </View>
              </View>
              
              <View style={styles.restaurantInfo}>
                <Image 
                  source={{ uri: item.logo_url }} 
                  style={styles.restaurantLogo} 
                />
                <View style={styles.textContainer}>
                  <Text style={styles.restaurantName} numberOfLines={1} ellipsizeMode="tail">
                    {item.name}
                  </Text>
                  <Text style={styles.restaurantAddress} numberOfLines={1} ellipsizeMode="tail">
                    {item.formatted_address}
                  </Text>

                  <View style={styles.extraInfoRow}>
                    {userLocation && (
                      <View style={styles.distanceInfo}>
                        <Text style={styles.distanceText}>
                          {Math.round(Distance(
                            userLocation.latitude, 
                            userLocation.longitude, 
                            item.latitude, 
                            item.longitude
                          ) * 10) / 10} km
                        </Text>
                      </View>
                    )}
                  </View>
                </View>
              </View>
            </Pressable>
            
            {/* 收藏按鈕 - 點擊提示登入 */}
            {/*<Pressable 
              onPress={promptLogin} 
              style={styles.bookmarkIcon}
            >
              <Image
                source={require('../../assets/unmark.png')}
                style={styles.bookmarkIconImage}
              />
            </Pressable>*/}
          </View>
        ))}
        
        {/* 訪客模式提示橫幅 */}
        <View style={styles.guestModeBanner}>
          <Text style={styles.guestModeBannerText}>
            {language === 'EN' 
              ? 'Login for more features and to place orders'
              : '登入以獲取更多功能及下單'}
          </Text>
        </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  lottieAnimation: {
    width: 200,
    height: 200,
  },
  container: {
    paddingHorizontal: 8,
    paddingVertical: 15,
    marginBottom: 20,
  },
  restaurantCard: {
    marginBottom: 12,
    backgroundColor: '#fff',
    borderRadius: 8,
    overflow: 'hidden',
  },
  pressedCard: {
    opacity: 0.9,
  },
  imageContainer: {
    position: 'relative',
  },
  restaurantImage: {
    width: '100%',
    height: 150,
    resizeMode: 'cover',
  },
  imageGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 80,
  },
  inactiveBanner: {
    opacity: 0.4,
  },
  unavailableOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  unavailableText: {
    color: '#fff',
    fontSize: 18,
    fontFamily: 'Montserrat-Bold',
    backgroundColor: 'rgba(0, 0, 0, 0.7)', 
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },

  priceGuaranteeContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 10,
  },
  priceGuaranteeBadge: {
    backgroundColor: '#2E8B57',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderBottomRightRadius: 16,
    borderWidth: 0.5,
    borderColor: 'rgba(255, 255, 255, 0.5)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 5,
  },
  priceGuaranteeText: {
    color: '#FFF',
    fontSize: 13,
    fontFamily: 'Montserrat-SemiBold',
  },
  premiumTagsContainer: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    flexDirection: 'row',
  },
  premiumTag: {
    backgroundColor: 'rgba(46, 139, 87, 0.85)', 
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 0.5,
    borderColor: '#E8F5E9',
  },
  premiumTagText: {
    color: '#fff',
    fontSize: 12,
    fontFamily: 'Montserrat-SemiBold',
  },
  loadingIndicator: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: `rgba(76, 217, 100, 0.85)`,
    padding: 8,
    borderRadius: 20,
  },
  restaurantInfo: {
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  restaurantLogo: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#E8F5E9', 
  },
  textContainer: {
    flex: 1,
    marginRight: 10,
  },
  restaurantName: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    color: '#333',
    marginBottom: 4,
  },
  restaurantAddress: {
    fontSize: 14,
    fontFamily: 'Montserrat',
    color: '#666',
    marginBottom: 8,
  },
  extraInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  distanceInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  distanceText: {
    fontSize: 13,
    fontFamily: 'Montserrat-Medium',
    color: GREEN_COLOR,
  },
  bookmarkIcon: {
    position: 'absolute',
    top: 14,
    right: 14,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  bookmarkIconImage: {
    width: 20,
    height: 20,
  },
  Featured: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    color: '#333',
    marginBottom: 10,
  },

  guestModeBanner: {
    backgroundColor: 'rgba(247, 247, 247, 0.95)',
    padding: 15,
    borderRadius: 8,
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#E8E8E8',
    marginHorizontal: 8,
  },
  guestModeBannerText: {
    textAlign: 'center',
    fontFamily: 'Montserrat-Medium',
    fontSize: 14,
    color: '#555'
  }
});

export default CLRestaurantList;