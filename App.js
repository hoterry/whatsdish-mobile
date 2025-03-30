import React, { useState, useEffect, useRef } from 'react';
import Constants from 'expo-constants';
import * as Sentry from 'sentry-expo';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { View, Text, Dimensions } from 'react-native';
import * as Font from 'expo-font';  
import * as SecureStore from 'expo-secure-store';
import { LoadingProvider, useLoading } from './src/context/LoadingContext';
import { CartProvider } from './src/context/CartContext';
import { LanguageProvider } from './src/context/LanguageContext';

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
import RegistrationScreen from './src/screens/LoginScreen/RegistrationScreen';
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
import CLArticleDetail from './src/ClScreens/CLExploreScreen/CLArticleDetail';

const Stack = createStackNavigator();
const FreezeContext = React.createContext({
  isFrozen: false,
  setIsFrozen: () => {},
});

const withFreeze = (Component) => {
  return (props) => {
    const { isFrozen } = React.useContext(FreezeContext);
    
    if (isFrozen) {
      return <View style={{ flex: 1, backgroundColor: 'transparent' }} pointerEvents="none" />;
    }
    
    return <Component {...props} />;
  };
};

const FreezableDetailsScreen = withFreeze(CLDetailsScreen);
const FreezableVideoDetailScreen = withFreeze(VideoDetailScreen);
const FreezableCLArticleDetail = withFreeze(CLArticleDetail);

// AppLoader component to handle initial loading
const AppLoader = ({ children }) => {
  const [initialized, setInitialized] = useState(false);
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [error, setError] = useState(null);
  const { setIsLoading } = useLoading();

  useEffect(() => {
    async function initialize() {
      setIsLoading(true);
      try {
        // Check environment variables in dev mode
        if (__DEV__) {
          try {
            console.log('Environment variables check:', Constants.expoConfig?.extra);
          } catch (err) {
            console.warn('Unable to read environment variables:', err);
          }
        }

        // Load fonts
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
          console.error("Initialization error:", error);
        }
        setError(`Initialization error: ${error.message}`);
      } finally {
        setInitialized(true);
        setIsLoading(false);
      }
    }

    initialize();
  }, [setIsLoading]);

  if (!initialized || !fontsLoaded) {
    return null; // Return null as LoadingContext will show the loading animation
  }

  if (error) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ marginTop: 10, color: 'red' }}>{error}</Text>
      </View>
    );
  }

  return children;
};

function MainStack({ isAuthenticated, setIsAuthenticated, navigationRef, isFrozen }) {
  const { setIsLoading } = useLoading();

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
        <>
          <Stack.Screen name="CLHomeTabs" options={{ headerShown: false }}>
            {props => <CLCustomTabNavigator {...props} setIsAuthenticated={setIsAuthenticated} />}
          </Stack.Screen>
          <Stack.Screen name="Login" options={{ headerShown: false }}>
            {props => <LoginScreen {...props} setIsAuthenticated={(val) => {
              if (val === true) {
                setIsLoading(true); // Show loading during transition
                setTimeout(() => {
                  setIsAuthenticated(true);
                  // Give time for navigation to reset before hiding loader
                  setTimeout(() => setIsLoading(false), 800);
                }, 300);
              } else {
                setIsAuthenticated(val);
              }
            }} />}
          </Stack.Screen>
          <Stack.Screen name="Registration" options={{ headerShown: false }}>
            {props => <RegistrationScreen {...props} setIsAuthenticated={(val) => {
              if (val === true) {
                setIsLoading(true); // Show loading during transition
                setTimeout(() => {
                  setIsAuthenticated(true);
                  // Give time for navigation to reset before hiding loader
                  setTimeout(() => setIsLoading(false), 800);
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
  const [error, setError] = useState(null);
  const navigationRef = useRef(null);
  const [previousAuthState, setPreviousAuthState] = useState(false);
  const [isFrozen, setIsFrozen] = useState(false);

  // Check authentication status
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = await SecureStore.getItemAsync('token');
        setIsAuthenticated(!!token);
      } catch (error) {
        if (__DEV__) {
          console.error("Auth check error:", error);
        }
        setError(`Authentication check error: ${error.message}`);
        setIsAuthenticated(false);
      }
    };

    checkAuth();
  }, []);

  // Handle navigation reset on authentication change
  useEffect(() => {
    if (isAuthenticated && !previousAuthState && navigationRef.current) {
      setTimeout(() => {
        if (navigationRef.current) {
          navigationRef.current.resetRoot({
            index: 0,
            routes: [{ name: 'HomeTabs' }],
          });
          
          if (__DEV__) {
            console.log('[Navigation] Successfully reset navigation to HomeTabs');
          }
        }
      }, 800);
    }
    
    setPreviousAuthState(isAuthenticated);
  }, [isAuthenticated, previousAuthState]);

  return (
    <ErrorBoundary>
      <LoadingProvider>
        <AppLoader>
          <LanguageProvider>
            <CartProvider>
              <FreezeContext.Provider value={{ isFrozen, setIsFrozen }}>
                <View style={{ flex: 1 }}>
                  <VideoPreloader isAuthenticated={isAuthenticated} />
                  <NavigationContainer 
                    ref={navigationRef}
                    onStateChange={(state) => {
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
                      isFrozen={isFrozen}
                    />
                  </NavigationContainer>
                </View>
              </FreezeContext.Provider>
            </CartProvider>
          </LanguageProvider>
        </AppLoader>
      </LoadingProvider>
    </ErrorBoundary>
  );
}