// screens/DetailsScreen.js
import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { useCart } from '../context/CartContext';
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
});

export default DetailsScreen;
