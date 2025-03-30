import React, { useState, useEffect, useRef } from 'react';
import Constants from 'expo-constants';
import * as Sentry from 'sentry-expo';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { ActivityIndicator, View, Text, Animated, StyleSheet, Dimensions } from 'react-native';
import * as Font from 'expo-font';  
import * as SecureStore from 'expo-secure-store';
import { LoadingProvider } from './src/context/LoadingContext';
import LottieView from 'lottie-react-native';

Sentry.init({
  dsn: Constants.expoConfig?.extra?.sentryDsn,
  enableInExpoDevelopment: true,
  debug: true,
});

const { width, height } = Dimensions.get('window');

class ErrorBoundary extends React.Component {
  state = { hasError: false, error: null };
  
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  
  render() {
    if (this.state.hasError) {
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
          <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>Application Error</Text>
          <Text style={{ color: 'red', marginBottom: 10 }}>{this.state.error?.toString()}</Text>
          <Text>Please restart the application</Text>
        </View>
      );
    }
    return this.props.children;
  }
}

import LoginScreen from './src/screens/LoginScreen/LoginScreen';
import RegistrationScreen from './src/screens/LoginScreen/RegistrationScreen'; // Import the Registration screen
import DetailsScreen from './src/screens/DetailScreen/DetailsScreen';
import ProductDetailsScreen from './src/screens/ProductDetailsScreen/ProductDetailsScreen';
import CheckoutScreen from './src/screens/CheckoutScreen/CheckoutScreen';
import ExploreScreen from './src/screens/ExploreScreen/ExploreScreen';
import AccountScreen from './src/screens/AccountScreen/AccountScreen';
import HistoryDetailScreen from './src/screens/HistoryDetail/HistoryDetail';
import ArticleDetail from './src/screens/ExploreScreen/ArticleDetail';
import VideoDetailScreen from './src/components/VideoDetailScreen';
import VideoPreloader from './src/components/App.js/VideoPreloader';
import CartScreen from './src/screens/CartScreen/CartScreen';
import CustomTabNavigator from './src/components/App.js/CustomTabNavigator';
import CLCustomTabNavigator from './src/components/App.js/CLCustomTabNavigator';
import CLHomeScreen from './src/ClScreens/CLHomeScreen/CLHomeScreen';
import CLDetailsScreen from './src/ClScreens/CLDetailsScreen/CLDetailsScreen';
import { CartProvider } from './src/context/CartContext';
import { LanguageProvider } from './src/context/LanguageContext';
import CLArticleDetail from './src/ClScreens/CLExploreScreen/CLArticleDetail';

// 創建一個使用 Lottie 動畫的轉場加載組件
const LottieTransition = ({ visible }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const lottieRef = useRef(null);
  
  useEffect(() => {
    if (visible) {
      // 立即顯示沒有淡入效果，確保瞬間覆蓋整個屏幕
      fadeAnim.setValue(1);
      
      // 播放 Lottie 動畫
      if (lottieRef.current) {
        lottieRef.current.play();
      }
    } else {
      // 隱藏時使用淡出效果
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
      
      // 停止 Lottie 動畫
      if (lottieRef.current) {
        lottieRef.current.pause();
      }
    }
  }, [visible, fadeAnim]);

  if (!visible) return null;

  return (
    <Animated.View style={[styles.lottieContainer, { opacity: fadeAnim }]}>
      <View style={styles.lottieInnerContainer}>
        <LottieView
          ref={lottieRef}
          source={require('./assets/wd-loading-animation.json')}
          autoPlay
          loop
          style={styles.lottieAnimation}
        />
      </View>
    </Animated.View>
  );
};

const Stack = createStackNavigator();

// 全局狀態管理 - 用於控制頁面凍結
const FreezeContext = React.createContext({
  isFrozen: false,
  setIsFrozen: () => {},
});

// 提供一個 HOC 來凍結頁面
const withFreeze = (Component) => {
  return (props) => {
    const { isFrozen } = React.useContext(FreezeContext);
    
    if (isFrozen) {
      return <View style={{ flex: 1, backgroundColor: 'transparent' }} pointerEvents="none" />;
    }
    
    return <Component {...props} />;
  };
};

// 包裝需要可能凍結的組件
const FreezableDetailsScreen = withFreeze(CLDetailsScreen);
const FreezableVideoDetailScreen = withFreeze(VideoDetailScreen);
const FreezableCLArticleDetail = withFreeze(CLArticleDetail);

function MainStack({ isAuthenticated, setIsAuthenticated, navigationRef, showTransition, setShowTransition, isFrozen }) {
  return (
    <Stack.Navigator>
      {isAuthenticated ? (
        <>
          <Stack.Screen name="HomeTabs" options={{ headerShown: false }}>
            {props => <CustomTabNavigator {...props} setIsAuthenticated={setIsAuthenticated} />}
          </Stack.Screen>
          <Stack.Screen name="Details" component={DetailsScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Cart" component={CartScreen} options={{ headerShown: false }} />
          <Stack.Screen name="ProductDetail" component={ProductDetailsScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Checkout" component={CheckoutScreen} options={{ headerShown: false }} />
          <Stack.Screen name="HistoryDetail" component={HistoryDetailScreen} options={{ headerShown: false }} />
          <Stack.Screen name="ArticleDetail" component={ArticleDetail} options={{ headerShown: false }} />
          <Stack.Screen name="VideoDetailScreen" component={VideoDetailScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Video" component={VideoDetailScreen} options={{ headerShown: false }} />
        </>
      ) : (
        // 未登入用戶的路由
        <>
          <Stack.Screen name="CLHomeTabs" options={{ headerShown: false }}>
            {props => <CLCustomTabNavigator {...props} setIsAuthenticated={setIsAuthenticated} />}
          </Stack.Screen>
          <Stack.Screen name="Login" options={{ headerShown: false }}>
            {props => <LoginScreen {...props} setIsAuthenticated={(val) => {
              if (val === true) {
                // 登入成功時，先顯示轉場動畫並立即凍結頁面
                setShowTransition(true);
                // 然後再更新認證狀態
                setTimeout(() => {
                  setIsAuthenticated(true);
                }, 300);
              } else {
                setIsAuthenticated(val);
              }
            }} />}
          </Stack.Screen>
          <Stack.Screen name="Registration" options={{ headerShown: false }}>
            {props => <RegistrationScreen {...props} setIsAuthenticated={(val) => {
              if (val === true) {
                // 註冊成功時，先顯示轉場動畫並立即凍結頁面
                setShowTransition(true);
                // 然後再更新認證狀態
                setTimeout(() => {
                  setIsAuthenticated(true);
                }, 300);
              } else {
                setIsAuthenticated(val);
              }
            }} />}
          </Stack.Screen>
          <Stack.Screen name="Details" component={FreezableDetailsScreen} options={{ headerShown: false }} />
          <Stack.Screen name="VideoDetailScreen" component={FreezableVideoDetailScreen} options={{ headerShown: false }} />
          <Stack.Screen name="CLArticleDetail" component={FreezableCLArticleDetail} options={{ headerShown: false }} />
        </>
      )}
    </Stack.Navigator>
  );
}

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigationRef = useRef(null);
  const [previousAuthState, setPreviousAuthState] = useState(false);
  const [showTransition, setShowTransition] = useState(false);
  const [isFrozen, setIsFrozen] = useState(false);

  useEffect(() => {
    if (__DEV__) {
      try {
        console.log('Environment variables check:', Constants.expoConfig?.extra);
      } catch (err) {
        console.warn('Unable to read environment variables:', err);
      }
    }
  }, []);

  useEffect(() => {
    async function loadFonts() {
      try {
        await Font.loadAsync({
          'Quicksand-Bold': require('./assets/fonts/Quicksand-Bold.ttf'),
          'Poppins-Regular': require('./assets/fonts/Poppins-Regular.ttf'),
          'Poppins-Medium': require('./assets/fonts/Poppins-Medium.ttf'),
          'Poppins-SemiBold': require('./assets/fonts/Poppins-SemiBold.ttf'),
          'Poppins-Bold': require('./assets/fonts/Poppins-Bold.ttf'),
        });
        setFontsLoaded(true);
      } catch (error) {
        if (__DEV__) {
          console.error("Font loading error:", error);
        }
        setFontsLoaded(true);
        setError(`Font loading error: ${error.message}`);
      }
    }
    loadFonts();
  }, []);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = await SecureStore.getItemAsync('token');
        setIsAuthenticated(!!token);
      } catch (error) {
        if (__DEV__) {
          console.error("Auth check error:", error);
        }
        setIsAuthenticated(false);
        setError(`Authentication check error: ${error.message}`);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  // 監聽轉場動畫狀態，控制頁面凍結
  useEffect(() => {
    setIsFrozen(showTransition);
  }, [showTransition]);

  useEffect(() => {
    if (isAuthenticated && !previousAuthState && navigationRef.current) {
      // 確保導航在轉場動畫顯示一段時間後進行
      setTimeout(() => {
        if (navigationRef.current) {
          navigationRef.current.resetRoot({
            index: 0,
            routes: [{ name: 'HomeTabs' }],
          });
          
          if (__DEV__) {
            console.log('[Navigation] Successfully reset navigation to HomeTabs');
          }
          
          // 在導航完成後，再等一會兒再隱藏轉場動畫，讓用戶有更流暢的體驗
          setTimeout(() => {
            setShowTransition(false);
          }, 500);
        }
      }, 800); // 延長動畫顯示時間，讓用戶能夠看到完整的 Lottie 動畫
    }
    
    // 更新上一個認證狀態
    setPreviousAuthState(isAuthenticated);
  }, [isAuthenticated, previousAuthState]);

  if (isLoading || !fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
        {error && <Text style={{ marginTop: 10, color: 'red' }}>{error}</Text>}
      </View>
    );
  }

  return (
    <LoadingProvider>
      <ErrorBoundary>
        <LanguageProvider>
          <CartProvider>
            <FreezeContext.Provider value={{ isFrozen, setIsFrozen }}>
              <View style={{ flex: 1 }}>
                <VideoPreloader isAuthenticated={isAuthenticated} isLoading={isLoading} />
                <NavigationContainer 
                  ref={navigationRef}
                  fallback={<ActivityIndicator size="large" />}
                  onStateChange={(state) => {
                    // 處理導航狀態的變化
                    if (!state || !state.routes || state.routes.length < 2) return;
                    
                    const currentRoute = state.routes[state.routes.length - 1];
                    const prevRoute = state.routes[state.routes.length - 2];
                  
                    if (__DEV__) {
                      console.log('[Navigation] Previous route:', prevRoute.name);
                      console.log('[Navigation] Current route:', currentRoute.name);
                    }

                    if (prevRoute.name === 'HistoryDetail' && prevRoute.params?.resetOrderState === true) {
                      if (__DEV__) {
                        console.log('[Navigation] Will clear order_id after order completion');
                      }

                      SecureStore.deleteItemAsync('order_id')
                        .then(() => {
                          if (__DEV__) {
                            console.log('[Navigation] Successfully cleared order_id');
                          }
                        })
                        .catch(error => {
                          console.error('[Navigation] Error clearing order_id:', error);
                        });
                    }
                  }}
                >
                  <MainStack 
                    isAuthenticated={isAuthenticated} 
                    setIsAuthenticated={setIsAuthenticated}
                    navigationRef={navigationRef}
                    showTransition={showTransition}
                    setShowTransition={setShowTransition}
                    isFrozen={isFrozen}
                  />
                </NavigationContainer>
                
                {/* 使用 Lottie 過渡動畫 */}
                <LottieTransition visible={showTransition} />
              </View>
            </FreezeContext.Provider>
          </CartProvider>
        </LanguageProvider>
      </ErrorBoundary>
    </LoadingProvider>
  );
}

const styles = StyleSheet.create({
  lottieContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.98)', // 更高的不透明度
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  lottieInnerContainer: {
    width: width * 0.6,
    height: width * 0.6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  lottieAnimation: {
    width: '100%',
    height: '100%',
  }
});