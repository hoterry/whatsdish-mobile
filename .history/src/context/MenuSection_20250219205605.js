import React, { useState, useEffect, useRef, useContext } from 'react';
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import { useCart } from './CartContext';
import { useNavigation } from '@react-navigation/native';
import ScrollHandler from './ScrollHandler';
import MenuFetcher from './MenuFetcher';
import { LanguageContext } from '../context/LanguageContext';
import { Dimensions, PixelRatio } from 'react-native';
const { width, height } = Dimensions.get('window'); // 获取屏幕宽度和高度
const scaleWidth = width / 375; // 以 iPhone 11 (375px) 作为基准
const scaleHeight = height / 812; // 以 iPhone 11 (812px) 作为基准
const fontScale = PixelRatio.getFontScale(); // 获取字体缩放比例

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
    console.log('Fetched Data in MenuSection:', JSON.stringify(data, null, 2)); // 讓 data 結構清晰可見
  
    if (!data || !data.data || !data.data.menu || !Array.isArray(data.data.menu.categories) || !Array.isArray(data.data.menu.groupedItems)) {
      console.error('Invalid menu data structure:', data);
      return;
    }
  
    const categories = data.data.menu.categories;
    const groupedItems = data.data.menu.groupedItems;
  
    // 轉換 groupedItems 成 Map，加速查找
    const groupedItemsMap = new Map(groupedItems.map(item => [item.id, item]));
  
    // 根據 categories.items 的 id 從 groupedItems 匹配完整數據
    const grouped = categories.map(category => ({
      category_name: category.name,
      category_name_zh: category.alternate_name || category.name, // 使用 alternate_name 作為中文名（如果有）
      items: category.items
        .map(item => groupedItemsMap.get(item.id)) // 根據 id 匹配完整的 menuItem
        .filter(item => item), // 過濾掉找不到的
    }));
  
    setGroupedMenu(grouped);
  };

  const getItemLayout = (data, index) => {
    let offset = 0;
    for (let i = 0; i < index; i++) {
      offset += categoryHeights[i] || 0; // 使用 categoryHeights 中的高度
    }
    return {
      length: categoryHeights[index] || 0, // 當前項目的高度
      offset, // 當前項目的偏移量
      index,
    };
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
      <Text style={styles.categoryHeader}>
        {language === 'ZH' ? category.category_name_zh : category.category_name}
      </Text>
      <View style={styles.separator} />
  
      {category.items.map((menuItem, itemIndex) => {
      // 只 log 第一個 menuItem
      if (index === 30 && itemIndex === 30) {
        console.log('✅ First Menu Item:', menuItem);

        if (menuItem.option_groups && menuItem.option_groups.length > 0) {
          console.log('🛠 Option Groups:', menuItem.option_groups);
        }

        if (menuItem.modifier_groups && menuItem.modifier_groups.length > 0) {
          console.log('🍕 Modifier Groups:', menuItem.modifier_groups);
        }
      }
        
  
        const hasOptions = 
          (menuItem.modifier_groups && menuItem.modifier_groups.length > 0) || 
          (menuItem.option_groups && menuItem.option_groups.length > 0);

        return (
          <TouchableOpacity
            key={menuItem.id}
            style={styles.menuItem}
            onPress={() => navigation.navigate('ProductDetail', { menuItem, restaurantId, restaurants  })}
          >
            <View style={styles.info}>
              <Text style={styles.name}>{language === 'ZH' ? menuItem.name_zh : menuItem.name}</Text>
              <Text style={styles.description} numberOfLines={1} ellipsizeMode="tail">
                {language === 'ZH' ? menuItem.description_zh : menuItem.description}
              </Text>
              <Text style={styles.price}>{menuItem.price_formatted}</Text>
            </View>

            <Image source={{ uri: menuItem.image_url || 'https://res.cloudinary.com/dfbpwowvb/image/upload/v1740026601/WeChat_Screenshot_20250219204307_juhsxp.png' }} style={styles.image} />
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => {
                if (hasOptions) {
                  navigation.navigate('ProductDetail', { menuItem, restaurantId, restaurants  });
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
        contentContainerStyle={{ paddingBottom: 750 * scaleHeight }}
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        windowSize={5}
        removeClippedSubviews={true}
        getItemLayout={getItemLayout} // 添加 getItemLayout
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

const styles = StyleSheet.create({
  categoryHeader: {
    fontSize: 28 * fontScale, // 加大字體
    fontFamily: 'Urbanist-ExtraBold',
    fontWeight: 'bold',
    marginVertical: 20 * scaleHeight,
    paddingHorizontal: 18 * scaleWidth,
  },
  separator: {
    height: 1 * scaleHeight,
    backgroundColor: '#ddd',
  },
  name: {
    fontSize: 24 * fontScale, // 字體加大
    fontFamily: 'Quicksand-Bold',
    marginBottom: 6 * scaleHeight,
    maxWidth: 260 * scaleWidth,
  },
  description: {
    fontSize: 20 * fontScale, // 加大字體
    color: '#555',
    marginBottom: 6 * scaleHeight,
    lineHeight: 22 * scaleHeight,
    maxHeight: 50 * scaleHeight,
    maxWidth: 260 * scaleWidth,
    overflow: 'hidden',
  },
  price: {
    fontSize: 24 * fontScale,
    color: '#000',
  },
  menuItem: {
    flexDirection: 'row',
    padding: 16 * scaleWidth,
    backgroundColor: '#fff',
    borderRadius: 12 * scaleWidth,
    alignItems: 'center',
    borderBottomWidth: 1 * scaleHeight,
    borderBottomColor: '#ccc',
    height: 120 * scaleHeight,
    justifyContent: 'space-between',
    width: '100%',
  },
  info: {
    flex: 1,
    marginRight: 18 * scaleWidth,
    justifyContent: 'center',
  },
  image: {
    width: 100 * scaleWidth,
    height: 100 * scaleHeight,
    borderRadius: 12 * scaleWidth,
    resizeMode: 'cover',
  },
  categoryList: {
    paddingHorizontal: 12 * scaleWidth,
  },
  categoryItem: {
    marginRight: 20 * scaleWidth,
    paddingVertical: 12 * scaleHeight,
    paddingHorizontal: 18 * scaleWidth,
  },
  selectedCategory: {
    borderBottomWidth: 3 * scaleHeight,
    borderBottomColor: 'black',
  },
  categoryText: {
    fontSize: 24* fontScale, // 字體加大
    color: '#333',
    lineHeight: 32 * scaleHeight,
    textAlignVertical: 'center',
  },
  addButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    width: 34 * scaleWidth,
    height: 34 * scaleHeight,
    borderRadius: 50,
    position: 'absolute',
    bottom: 18 * scaleHeight,
    right: 18 * scaleWidth,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 22 * fontScale, // 字體加大
    fontWeight: 'bold',
  },
  viewCartButton: {
    position: 'absolute',
    top: height * 0.6,  // 這裡使用螢幕高度的 42% 來確保相對定位
    left: width * 0.05,  // 根據屏幕寬度設置邊距
    backgroundColor: '#000',
    padding: 12 * scaleWidth,
    borderRadius: 6 * scaleWidth,
    zIndex: 999,
    width: '90%',
    height: '4%',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  viewCartButtonText: {
    color: '#fff',
    fontSize: 18 * fontScale, // 字體加大
    textAlign: 'center',
  },
});

  
export default MenuSection;
