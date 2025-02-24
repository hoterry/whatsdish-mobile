// screens/DetailsScreen.js
import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, FlatList ,TouchableOpacity } from 'react-native';
import { useCart } from '../context/CartContext';
import { Ionicons } from '@expo/vector-icons'; 
import RestaurantHeader from '../context/RestaurantHeader';  // 引入新的餐厅头部组件
import MenuSection from '../context/MenuSection';  // 引入新的菜单部分组件

function DetailsScreen({ route, navigation }) {
  const { restaurant, restaurants } = route.params;
  console.log('Received restaurant in DetailsScreen:', restaurant);
  const { addToCart } = useCart();
  const [menu, setMenu] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const scrollViewRef = useRef(null);

  
  useEffect(() => {
    console.log('Restaurant IDDDDDDDD:', restaurant.restaurant_id);  // 确认 restaurant.id
    const currentMenu = restaurant.menu || [];
    setMenu(currentMenu);
  }, [restaurant]);

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()} // 返回上一页
      >
        <Ionicons name="arrow-back" size={24} color="black" />
      </TouchableOpacity>

      {/* 渲染餐厅头部信息 */}
      <RestaurantHeader restaurant={restaurant} />

      {/* 渲染菜单部分 */}
      <MenuSection restaurantId={restaurant.restaurant_id} restaurants={restaurants} />


    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
  },
  backButton: {
    position: 'absolute', // 绝对定位
    top: 40, // 距离顶部的位置
    left: 16, // 距离左侧的位置
    zIndex: 1, // 确保按钮在最上层
    padding: 8, // 内边距
    backgroundColor: 'rgba(255, 255, 255, 0.8)', // 背景颜色
    borderRadius: 20, // 圆角
  }
});

export default DetailsScreen;
