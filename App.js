import React, { useState, useEffect } from 'react';
import Constants from 'expo-constants';
import * as Sentry from 'sentry-expo';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { ActivityIndicator, View, Platform, Text } from 'react-native';
import * as Font from 'expo-font';  
import * as SecureStore from 'expo-secure-store';
import { Button } from 'react-native';
import { LoadingProvider } from './src/context/LoadingContext';



Sentry.init({
  dsn: Constants.expoConfig?.extra?.sentryDsn,
  enableInExpoDevelopment: true,
  debug: true,
});


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

import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import DetailsScreen from './src/screens/DetailsScreen';
import ProductDetailsScreen from './src/screens/ProductDetailsScreen';
import CheckoutScreen from './src/screens/CheckoutScreen';
import ExploreScreen from './src/screens/ExploreScreen';
import AccountScreen from './src/screens/AccountScreen';
import OrderStatusScreen from './src/screens/OrderStatusScreen';
import HistoryDetailScreen from './src/screens/HistoryDetail';
import ArticleDetail from './src/components/ArticleDetail';
import VideoDetailScreen from './src/components/VideoDetailScreen';
import VideoPreloader from './src/components/VideoPreloader'; // 引入新創建的VideoPreloader組件
import CartScreen from './src/screens/CartScreen';
import CustomTabNavigator from './CustomTabNavigator';
import CLCustomTabNavigator from './CLCustomTabNavigator';
import CLHomeScreen from './src/screens/CLHomeScreen';
import CLDetailsScreen from './src/components/CLDetailsScreen';
import { CartProvider } from './src/context/CartContext';
import { LanguageProvider } from './src/context/LanguageContext';
import CLArticleDetail from './src/components/CLArticleDetail';

const Stack = createStackNavigator();

// 無需登入的頁面堆疊
function GuestStack({ setIsAuthenticated }) {
  return (
    <Stack.Navigator initialRouteName="CLHomeTabs">
      <Stack.Screen name="CLHomeTabs" options={{ headerShown: false }}>
        {props => <CLCustomTabNavigator {...props} setIsAuthenticated={setIsAuthenticated} />}
      </Stack.Screen>
      <Stack.Screen name="Login" options={{ headerShown: false }}>
        {props => <LoginScreen {...props} setIsAuthenticated={setIsAuthenticated} />}
      </Stack.Screen>
      <Stack.Screen name="Details" component={CLDetailsScreen} options={{ headerShown: false }} />
      <Stack.Screen name="VideoDetailScreen" component={VideoDetailScreen} options={{ headerShown: false }} />
      <Stack.Screen name="CLArticleDetail" component={CLArticleDetail} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
}

function AuthStack({ setIsAuthenticated }) {
  return (
    <Stack.Navigator initialRouteName="Login">
      <Stack.Screen name="Login" options={{ headerShown: false }}>
        {props => <LoginScreen {...props} setIsAuthenticated={setIsAuthenticated} />}
      </Stack.Screen>
      <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
}

function AppStack({ setIsAuthenticated }) {
  return (
    <Stack.Navigator>
      <Stack.Screen name="HomeTabs" options={{ headerShown: false }}>
        {props => <CustomTabNavigator {...props} setIsAuthenticated={setIsAuthenticated} />}
      </Stack.Screen>
      <Stack.Screen name="Details" component={DetailsScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Cart" component={CartScreen} options={{ headerShown: false }} />
      <Stack.Screen name="ProductDetail" component={ProductDetailsScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Checkout" component={CheckoutScreen} options={{ headerShown: false }} />
      <Stack.Screen name="OrderStatusScreen" component={OrderStatusScreen} options={{ headerShown: false }} />
      <Stack.Screen name="HistoryDetail" component={HistoryDetailScreen} options={{ headerShown: false }} />
      <Stack.Screen name="ArticleDetail" component={ArticleDetail} options={{ headerShown: false }} />
      <Stack.Screen name="VideoDetailScreen" component={VideoDetailScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Video" component={VideoDetailScreen} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
}

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [navigationState, setNavigationState] = useState(null);
  // 新增狀態控制是否跳過登入驗證直接使用訪客模式
  const [useGuestMode, setUseGuestMode] = useState(true); // 預設啟用訪客模式

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

  useEffect(() => {
    if (!navigationState || !navigationState.routes || navigationState.routes.length < 2) return;
    
    const currentRoute = navigationState.routes[navigationState.routes.length - 1];
    const prevRoute = navigationState.routes[navigationState.routes.length - 2];
  
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
  }, [navigationState]);

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

          <VideoPreloader isAuthenticated={isAuthenticated} isLoading={isLoading} />
          
          <NavigationContainer 
            fallback={<ActivityIndicator size="large" />}
            onStateChange={(state) => {
              setNavigationState(state);
            }}
          >
            {isAuthenticated ? (
              <AppStack setIsAuthenticated={setIsAuthenticated} />
            ) : (
              useGuestMode ? (
                <GuestStack setIsAuthenticated={setIsAuthenticated} />
              ) : (
                <AuthStack setIsAuthenticated={setIsAuthenticated} />
              )
            )}
          </NavigationContainer>
        </CartProvider>
      </LanguageProvider>
    </ErrorBoundary>
    </LoadingProvider>
  );
}