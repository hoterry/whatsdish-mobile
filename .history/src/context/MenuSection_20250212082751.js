import React, { useState, useEffect, useRef, useContext } from 'react';
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import { useCart } from './CartContext';
import { useNavigation } from '@react-navigation/native';
import ScrollHandler from './ScrollHandler';
import MenuFetcher from './MenuFetcher';
import { LanguageContext } from '../context/LanguageContext';

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
    // Create a unique ID based on restaurant and item ID
    const uniqueId = `${restaurantId}-${item.id}`;
    const updatedItem = { ...item, uniqueId };
    addToCart(restaurantId, updatedItem);
  };

  const handleViewCart = () => {
    navigation.navigate('Cart', { restaurantId, restaurants });
  };

  const cartItemCount = getTotalItems(restaurantId); // Get current restaurant cart item count

  const renderCategory = ({ item: category, index }) => (
    <View
      style={styles.categorySection}
      key={category.category_name}
      onLayout={(event) => handleCategoryLayout(event, index)}
    >
      <Text style={styles.categoryHeader}>{language === 'ZH' ? category.category_name_zh : category.category_name}</Text>
      <View style={styles.separator} />
      {category.items.map((menuItem) => {
        // Check if the menu item has modifiers or options
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
                  // Navigate to product detail page if options exist
                  navigation.navigate('ProductDetail', { menuItem, restaurantId });
                } else {
                  // Add to cart if no options
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
    {/* 分類菜單 (Horizontal ScrollView) */}
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

    {/* 食物菜單 (FlatList) */}
    <FlatList
      ref={flatListRef}
      data={groupedMenu}
      keyExtractor={(item) => item.category_name}
      renderItem={renderCategory}
      style={styles.flatList}
      onScroll={handleScroll}
      scrollEventThrottle={16}
      contentContainerStyle={styles.flatListContent} // 為按鈕預留空間
    />

    {/* View Cart 按鈕 (條件渲染) */}
    {cartItemCount > 0 && (
      <TouchableOpacity style={styles.viewCartButton} onPress={handleViewCart}>
        <Text style={styles.viewCartButtonText}>
          View Cart ({cartItemCount})
        </Text>
      </TouchableOpacity>
    )}

    {/* 菜單數據獲取組件 */}
    <MenuFetcher restaurantId={restaurantId} onDataFetched={handleDataFetched} />
  </View>
);
};

const styles = StyleSheet.create({
  categoryHeader: {
    fontSize: 20,
    fontFamily: 'Urbanist-ExtraBold',
    fontWeight: 'bold',
    marginVertical: 30,
    paddingHorizontal: 15,
  },
  separator: {
    height: 1,
    backgroundColor: '#ddd',
  },
  name: {
    fontSize: 18,
    fontFamily: 'Quicksand-Bold',
    marginBottom: 5,
    maxWidth: 240,
  },
  description: {
    fontSize: 16,
    color: '#555',
    marginBottom: 5,
    lineHeight: 20,
    maxHeight: 48, // 限制最大高度，防止过长的描述
    maxWidth: 240,
    overflow: 'hidden', // 超出部分隐藏
    textOverflow: 'ellipsis', // 添加省略号
    whiteSpace: 'nowrap', // 防止换行，保持单行显示
  },
  price: {
    fontSize: 16,
    color: '#000',
    marginBottom: 10,
  },
  menuItem: {
    flexDirection: 'row',  // 保持左右排布
    padding: 15,
    marginBottom: 0,
    backgroundColor: '#fff',
    borderRadius: 10,
    alignItems: 'center', // 确保内容垂直居中
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    height: 130,  // 固定高度，确保图片和文字在同一高度
    justifyContent: 'space-between',  // 让内容分布在两端
    width: '100%',  // 确保占满屏幕宽度
  },
  info: {
    flex: 1,  // 让文本占用剩余空间
    marginRight: 15,  // 保持与图片的间距
    justifyContent: 'center',  // 确保文本垂直居中
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: 10,
    resizeMode: 'cover',
  },
  categoryList: {
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  categoryItem: {
    marginRight: 20,
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  selectedCategory: {
    borderBottomWidth: 2.5,
    borderBottomColor: 'black',
  },
  categoryText: {
    fontSize: 18,
    color: '#333',
    lineHeight: 29,
    textAlignVertical: 'center',
  },
  flatList: {

  },
  addButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',  // 半透明的黑色背景
    width: 30,  // 按钮宽度
    height: 30, // 按钮高度
    borderRadius: 50,  // 圆形按钮
    position: 'absolute',
    bottom: 15,
    right: 15,
    justifyContent: 'center',  // 垂直居中
    alignItems: 'center',  // 水平居中
  },
  addButtonText: {
    color: '#fff',
    fontSize: 20,  // 增大“+”符号的字体大小
    fontWeight: 'bold', // 加粗
  },
  viewCartButton: {
    position: 'absolute',
    top: '38%',
    left: 20,
    backgroundColor: '#000',
    padding: 10,
    borderRadius: 5,
    zIndex: 999,
    width: '90%',
    height: '4%',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  viewCartButtonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
});

  
export default MenuSection;
