import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { supabase } from './supabase'; // 确保你正确引入 supabase 实例
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import HomeScreen from './src/screens/HomeScreen';
import { ActivityIndicator, View } from 'react-native';

import OrderStatusScreen from './src/screens/OrderStatusScreen'; 
import DetailsScreen from './src/screens/DetailsScreen';
import CartScreen from './src/screens/CartScreen';
import ProductDetailsScreen from './src/screens/ProductDetailsScreen';
import CheckoutScreen from './src/screens/CheckoutScreen';

import OrderHistoryScreen from './src/screens/OrderHistoryScreen'; 
import AddressPicker from './src/screens/AddressPicker'; // 导入 AddressPicker
import { CartProvider } from './context/CartContext'; // 引入 CartProvider

const Stack = createStackNavigator();

// 👇 未登录用户的导航
function AuthStack() {
  return (
    <Stack.Navigator initialRouteName="Login">
      <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
}

// 👇 已登录用户的导航
function AppStack() {
  return (
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
      <Stack.Screen
        name="Details"
        component={DetailsScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Cart"
        component={CartScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ProductDetails"
        component={ProductDetailsScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Checkout"
        component={CheckoutScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="OrderStatusScreen"
        component={OrderStatusScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen name="OrderHistory" component={OrderHistoryScreen} options={{ headerShown: false }}/> 
      <Stack.Screen name="AddressPicker" component={AddressPicker}  options={{ headerShown: false }}/> 
    </Stack.Navigator>
  );
}

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      setIsAuthenticated(data?.session ? true : false);
    };

    checkAuth();

    // 监听登录状态变化
    const { data: { subscription: authListener } } = supabase.auth.onAuthStateChange((event, session) => {
      setIsAuthenticated(session ? true : false);
    });

    return () => {
      if (authListener) {
        authListener.unsubscribe(); // 直接调用 unsubscribe
      }
    };
  }, []);

  // 👇 让用户看到加载状态，避免闪屏问题
  if (isAuthenticated === null) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <CartProvider> {/* 使用 CartProvider 包裹整个应用 */}
      <NavigationContainer>
        {isAuthenticated ? <AppStack /> : <AuthStack />}
      </NavigationContainer>
    </CartProvider>
  );
}