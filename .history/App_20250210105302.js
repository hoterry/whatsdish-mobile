import React from 'react';
import { NavigationContainer } from '@react-navigation/native';  // 确保从这个路径导入
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './screens/HomeScreen';  // 替换为你的屏幕
import RegisterScreen from './screens/RegisterScreen';  // 替换为你的注册页面

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Register">
        <Stack.Screen name="Register" component={RegisterScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
