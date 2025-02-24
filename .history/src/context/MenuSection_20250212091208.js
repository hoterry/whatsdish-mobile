import React, { useState, useEffect, useRef, useContext } from 'react';
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import { useCart } from './CartContext';
import { useNavigation } from '@react-navigation/native';
import ScrollHandler from './ScrollHandler';
import MenuFetcher from './MenuFetcher';
import { LanguageContext } from '../context/LanguageContext';
import { Dimensions, PixelRatio } from 'react-native';
const { width, height } = Dimensions.get('window');
const fontScale = PixelRatio.getFontScale();

const MenuSection = ({ restaurantId, restaurants }) => {
  const [menu, setMenu] = useState([]);
  const [groupedMenu, setGroupedMenu] = useState([]);
  const [categoryHeights, setCategoryHeights] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const navigation = useNavigation();
  const flatListRef = useRef();
  const categoryListRef = useRef();
  const { addToCart, getTotalItems } = useCart();
  const { language } = useContext(LanguageContext);
  const { handleScroll, handleCategoryClick } = ScrollHandler({
    groupedMenu,
    categoryHeights,
    setSelectedCategory,
    categoryListRef,
    flatListRef,
  });

  const handleDataFetched = (data) => {
    setMenu(data);
    const grouped = data.reduce((acc, item) => {
      const category = acc.find((c) => c.category_name === item.category_name);
      if (category) {
        category.items.push(item);
      } else {
        acc.push({
          category_name: item.category_name,
          category_name_zh: item.category_name_zh,
          items: [item],
        });
      }
      return acc;
    }, []);
    setGroupedMenu(grouped);
  };

  useEffect(() => {
    if (groupedMenu.length > 0) {
      const firstCategory = groupedMenu[0].category_name;
      setSelectedCategory(firstCategory);
      flatListRef.current.scrollToIndex({
        index: 0,
        animated: true,
      });
    }
  }, [groupedMenu]);

  const handleCategoryLayout = (event, index) => {
    const { height } = event.nativeEvent.layout;
    setCategoryHeights((prevHeights) => {
      const newHeights = [...prevHeights];
      newHeights[index] = height;
      return newHeights;
    });
  };

  const handleAddToCart = (item) => {
    const uniqueId = `${restaurantId}-${item.id}`;
    const updatedItem = { ...item, uniqueId };
    addToCart(restaurantId, updatedItem);
  };

  const handleViewCart = () => {
    navigation.navigate('Cart', { restaurantId, restaurants });
  };

  const cartItemCount = getTotalItems(restaurantId);

  const renderCategory = ({ item: category, index }) => (
    <View
      style={styles.categorySection}
      key={category.category_name}
      onLayout={(event) => handleCategoryLayout(event, index)}
    >
      <Text style={styles.categoryHeader}>{language === 'ZH' ? category.category_name_zh : category.category_name}</Text>
      <View style={styles.separator} />
      {category.items.map((menuItem) => {
        const hasOptions = (menuItem.modifier_groups && menuItem.modifier_groups.length > 0) || 
        (menuItem.option_groups && menuItem.option_groups.length > 0);  

        return (
          <TouchableOpacity
            key={menuItem.id}
            style={styles.menuItem}
            onPress={() => navigation.navigate('ProductDetail', { menuItem, restaurantId })}
          >
            <View style={styles.info}>
              <Text style={styles.name}>{language === 'ZH' ? menuItem.name_zh : menuItem.name}</Text>
              <Text style={styles.description} numberOfLines={2} ellipsizeMode="tail">
                {language === 'ZH' ? menuItem.description_zh : menuItem.description}
              </Text>
              <Text style={styles.price}>${menuItem.price}</Text>
            </View>

            <Image source={{ uri: menuItem.image_url }} style={styles.image} />
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => {
                if (hasOptions) {
                  navigation.navigate('ProductDetail', { menuItem, restaurantId });
                } else {
                  handleAddToCart(menuItem);
                }
              }}
            >
              <Text style={styles.addButtonText}>
                {hasOptions ? (language === 'ZH' ? '+' : '+') : '+'}
              </Text>
            </TouchableOpacity>
          </TouchableOpacity>
        );
      })}
    </View>
  );
  
  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        style={styles.categoryList}
        ref={categoryListRef}
        showsHorizontalScrollIndicator={false}
      >
        {groupedMenu.map((category, index) => (
          <TouchableOpacity
            key={category.category_name}
            style={[styles.categoryItem, selectedCategory === category.category_name && styles.selectedCategory]}
            onPress={() => handleCategoryClick(category.category_name, index)}
          >
            <Text style={styles.categoryText}>
              {language === 'ZH' ? category.category_name_zh : category.category_name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <FlatList
        ref={flatListRef}
        data={groupedMenu}
        keyExtractor={(item) => item.category_name}
        renderItem={renderCategory}
        style={styles.flatList}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        contentContainerStyle={{ paddingBottom: 800 }}
      />

      {cartItemCount > 0 && (
        <TouchableOpacity style={styles.viewCartButton} onPress={handleViewCart}>
          <Text style={styles.viewCartButtonText}>
            View Cart ({cartItemCount})
          </Text>
        </TouchableOpacity>
      )}

      <MenuFetcher restaurantId={restaurantId} onDataFetched={handleDataFetched} />
    </View>
  );
};


const styles = StyleSheet.create({  categoryHeader: {
  fontSize: width * 0.05, // 字體根據螢幕寬度調整
  fontFamily: 'Urbanist-ExtraBold',
  fontWeight: 'bold',
  marginVertical: height * 0.02,
  paddingHorizontal: width * 0.04,
},
separator: {
  height: 1,
  backgroundColor: '#ddd',
},
name: {
  fontSize: 18 / fontScale, // 根據系統字體縮放
  fontFamily: 'Quicksand-Bold',
  marginBottom: 5,
  maxWidth: width * 0.6, // 限制最大寬度
},
description: {
  fontSize: 16 / fontScale,
  color: '#555',
  marginBottom: 5,
  lineHeight: 20,
  maxHeight: 48, 
  maxWidth: width * 0.6,
  overflow: 'hidden',
},
price: {
  fontSize: 16 / fontScale,
  color: '#000',
  marginBottom: 10,
},
menuItem: {
  flexDirection: 'row',
  padding: width * 0.04,
  backgroundColor: '#fff',
  borderRadius: 10,
  alignItems: 'center',
  borderBottomWidth: 1,
  borderBottomColor: '#ccc',
  height: height * 0.15,
  justifyContent: 'space-between',
  width: '100%',
},
info: {
  flex: 1,
  marginRight: width * 0.04,
  justifyContent: 'center',
},
image: {
  width: width * 0.25,
  height: width * 0.25,
  borderRadius: 10,
  resizeMode: 'cover',
},
addButton: {
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  width: width * 0.08,
  height: width * 0.08,
  borderRadius: 50,
  justifyContent: 'center',
  alignItems: 'center',
},
addButtonText: {
  color: '#fff',
  fontSize: width * 0.05,
  fontWeight: 'bold',
},
viewCartButton: {
  position: 'absolute',
  top: '43%',
  left: width * 0.05,
  backgroundColor: '#000',
  padding: height * 0.01,
  borderRadius: 5,
  zIndex: 999,
  width: '90%',
  height: height * 0.04,
  justifyContent: 'center',
  alignItems: 'center',
  flexDirection: 'row',
},
viewCartButtonText: {
  color: '#fff',
  fontSize: 16 / fontScale,
  textAlign: 'center',
},
});


  
export default MenuSection;
