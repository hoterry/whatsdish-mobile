import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { ActivityIndicator, View, Platform } from 'react-native';
import * as Font from 'expo-font'; 
import * as SecureStore from 'expo-secure-store';

// Screens
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import HomeScreen from './src/screens/HomeScreen';
import OrderStatusScreen from './src/screens/OrderStatusScreen';
import DetailsScreen from './src/screens/DetailsScreen';
import CartScreen from './src/screens/CartScreen';
import ProductDetailsScreen from './src/screens/ProductDetailsScreen';
import CheckoutScreen from './src/screens/CheckoutScreen';
import OrderHistoryScreen from './src/screens/OrderHistoryScreen';
import ExploreScreen from './src/screens/ExploreScreen';
import AccountScreen from './src/screens/AccountScreen';
import HistoryDetailScreen from './src/screens/HistoryDetail';
import ArticleDetail from './src/components/ArticleDetail';
import VideoDetailScreen from './src/components/VideoDetailScreen';

// Context Providers
import { CartProvider } from './src/context/CartContext';
import { LanguageProvider } from './src/context/LanguageContext';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

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

function HomeTabs({ setIsAuthenticated }) {
  if (__DEV__) {
    console.log("[App.js Log] setIsAuthenticated in HomeTabs:", setIsAuthenticated);
  }
  
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Explore') {
            iconName = focused ? 'search' : 'search-outline';
          } else if (route.name === 'Orders') {
            iconName = focused ? 'list' : 'list-outline';
          } else if (route.name === 'Account') {
            iconName = focused ? 'person' : 'person-outline';
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: 'tomato',
        tabBarInactiveTintColor: 'gray',
        paddingBottom: Platform.OS === 'android' ? 10 : 0,
        paddingTop: 5,
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Explore" component={ExploreScreen} />
      <Tab.Screen name="Orders" component={OrderHistoryScreen} />
      <Tab.Screen name="Account">
        {props => {
          if (__DEV__) {
            console.log("[App.js Log] setIsAuthenticated in AccountScreen:", setIsAuthenticated);
          }
          return <AccountScreen {...props} setIsAuthenticated={setIsAuthenticated} />;
        }}
      </Tab.Screen>
    </Tab.Navigator>
  );
}

function AppStack({ setIsAuthenticated }) {
  return (
    <Stack.Navigator>
      <Stack.Screen name="HomeTabs" options={{ headerShown: false }}>
        {props => <HomeTabs {...props} setIsAuthenticated={setIsAuthenticated} />}
      </Stack.Screen>
      <Stack.Screen name="Details" component={DetailsScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Cart" component={CartScreen} options={{ headerShown: false }} />
      <Stack.Screen name="ProductDetail" component={ProductDetailsScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Checkout" component={CheckoutScreen} options={{ headerShown: false }} />
      <Stack.Screen name="OrderStatusScreen" component={OrderStatusScreen} options={{ headerShown: false }} />
      <Stack.Screen name="OrderHistory" component={OrderHistoryScreen} options={{ headerShown: false }} />
      <Stack.Screen name="HistoryDetail" component={HistoryDetailScreen} options={{ headerShown: false }} />
      <Stack.Screen name="ArticleDetail" component={ArticleDetail} options={{ headerShown: false }} />
      <Stack.Screen name="VideoDetailScreen" component={VideoDetailScreen} options={{  headerShown: false }} />


    </Stack.Navigator>
  );
}

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadFonts() {
      try {
        await Font.loadAsync({
          'Quicksand-Bold': require('./assets/fonts/Quicksand-Bold.ttf'),
        });
        setFontsLoaded(true);
      } catch (error) {
        if (__DEV__) {
          console.error("Font loading error:", error);
        }

        setFontsLoaded(true);
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
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);


  if (isLoading || !fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <LanguageProvider>
      <CartProvider>
        <NavigationContainer>
          {isAuthenticated ? (
            <AppStack setIsAuthenticated={setIsAuthenticated} />
          ) : (
            <AuthStack setIsAuthenticated={setIsAuthenticated} />
          )}
        </NavigationContainer>
      </CartProvider>
    </LanguageProvider>
  );
}