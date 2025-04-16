import React, { useState, useEffect, useRef, useContext, useCallback } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  StyleSheet, 
  Image, 
  TouchableOpacity, 
  ScrollView, 
  SafeAreaView, 
  Dimensions,
  Platform,
  PixelRatio 
} from 'react-native';
import { useCart } from '../../context/CartContext';
import { useNavigation } from '@react-navigation/native';
import MenuFetcher from '../../context/MenuFetcher';
import FetchCartItems from '../../context/FetchCartItems';
import { LanguageContext } from '../../context/LanguageContext';
import { useLoading } from '../../context/LoadingContext'; 

const { width, height } = Dimensions.get('window');
// Reduced scaling factors for overall smaller UI
const scaleWidth = width / 400; // Increased base width for smaller elements
const scaleHeight = height / 850; // Increased base height for smaller elements
const fontScale = Math.min(PixelRatio.getFontScale(), 1.1); // Reduced max font scale

const MenuSection = ({ restaurantId, restaurants }) => {

  const [menu, setMenu] = useState([]);
  const [groupedMenu, setGroupedMenu] = useState([]);
  const [categoryHeights, setCategoryHeights] = useState({});
  const [categoryWidths, setCategoryWidths] = useState({});
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [menuLoaded, setMenuLoaded] = useState(false);
  const [isManualScroll, setIsManualScroll] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [categoryOffsets, setCategoryOffsets] = useState({});

  // 使用全局的加載狀態控制
  const { setIsLoading } = useLoading();

  const menuListRef = useRef(null);
  const categoryScrollRef = useRef(null);
  const categoryMeasurements = useRef({}).current;
  const menuMeasurements = useRef({}).current;
  const timeoutRef = useRef(null);
  const isScrollingRef = useRef(false);

  const navigation = useNavigation();
  const { addToCart, getTotalItems, syncCartToContext } = useCart();
  const { language } = useContext(LanguageContext);

  useEffect(() => {
    if (Object.keys(categoryWidths).length > 0 && groupedMenu.length > 0) {
      const offsets = {};
      let currentOffset = 0;
      
      groupedMenu.forEach((category) => {
        const categoryId = category.category_name;
        offsets[categoryId] = currentOffset;
        currentOffset += (categoryWidths[categoryId] || 90) + 16 * scaleWidth; // Reduced margin
      });
      
      // Only update if offsets are actually different
      if (JSON.stringify(offsets) !== JSON.stringify(categoryOffsets)) {
        setCategoryOffsets(offsets);
      }
    }
  }, [categoryWidths, groupedMenu, categoryOffsets]);


  const handleCategoryPress = useCallback((categoryId, index) => {
    setSelectedCategory(categoryId);
    setIsManualScroll(true);

    if (menuListRef.current) {
      try {
        menuListRef.current.scrollToIndex({
          index,
          animated: true,
          viewPosition: 0,
        });
      } catch (error) {
        console.warn("[MenuSection] Scroll to index failed:", error);

        let offset = 0;
        for (let i = 0; i < index; i++) {
          const catId = groupedMenu[i]?.category_name;
          offset += categoryHeights[catId] || 0;
        }
        
        menuListRef.current.scrollToOffset({
          offset,
          animated: true,
        });
      }
    }

    if (categoryScrollRef.current) {
      const offset = categoryOffsets[categoryId] || 0;
      const itemWidth = categoryWidths[categoryId] || 90;
      const centerPosition = offset - (width / 2) + (itemWidth / 2);

      const scrollTo = Math.max(0, centerPosition);
      
      categoryScrollRef.current.scrollTo({
        x: scrollTo,
        animated: true,
      });
    }

    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setIsManualScroll(false);
    }, 800);
  }, [groupedMenu, categoryHeights, categoryWidths, categoryOffsets]);

  const handleMenuScroll = useCallback((event) => {
    if (isManualScroll || !groupedMenu.length) return;
    
    const yOffset = event.nativeEvent.contentOffset.y;
    setScrollPosition(yOffset);

    if (isScrollingRef.current) return;
    isScrollingRef.current = true;

    requestAnimationFrame(() => {

      let accumulatedHeight = 0;
      let currentCategoryIndex = 0;
      
      for (let i = 0; i < groupedMenu.length; i++) {
        const categoryId = groupedMenu[i].category_name;
        const categoryHeight = categoryHeights[categoryId] || 0;
        
        if (yOffset < accumulatedHeight + categoryHeight) {
          currentCategoryIndex = i;
          break;
        }
        
        accumulatedHeight += categoryHeight;
      }
      
      const currentCategoryId = groupedMenu[currentCategoryIndex]?.category_name;

      if (currentCategoryId && currentCategoryId !== selectedCategory) {
        setSelectedCategory(currentCategoryId);

        if (categoryScrollRef.current && categoryOffsets[currentCategoryId] !== undefined) {
          const offset = categoryOffsets[currentCategoryId] || 0;
          const itemWidth = categoryWidths[currentCategoryId] || 90;
          const centerPosition = offset - (width / 2) + (itemWidth / 2);

          const scrollTo = Math.max(0, centerPosition);
          
          categoryScrollRef.current.scrollTo({
            x: scrollTo,
            animated: true,
          });
        }
      }
      
      isScrollingRef.current = false;
    });
  }, [isManualScroll, groupedMenu, categoryHeights, selectedCategory, categoryOffsets, categoryWidths]);


const handleDataFetched = useCallback((data) => {
  if (!data || !data.categories || !data.groupedItems) {
    console.error('[Menu Section Error] Invalid data received:', data);
    return;
  }

    const categories = data.categories;
    const groupedItems = data.groupedItems;

    const variantGroups = new Map();
    
    groupedItems.forEach(item => {
      if (item.variant_group && item.variant_group !== '') {
        if (!variantGroups.has(item.variant_group)) {
          variantGroups.set(item.variant_group, []);
        }
        variantGroups.get(item.variant_group).push(item);
      }
    });

    const dedupedItemsMap = new Map();
    
    groupedItems.forEach(item => {
      if (item.variant_group && item.variant_group !== '' && item.is_variant) {
        return;
      }
      
      dedupedItemsMap.set(item.id, item);
    });

    const grouped = categories.map(category => ({
      category_name: category.name,
      category_name_zh: category.name || category.name,
      items: category.items
        .map(item => dedupedItemsMap.get(item.id))
        .filter(item => item),
    }));

    setGroupedMenu(grouped);
    setMenu(data.groupedItems);


    if (!menuLoaded) {
      const initialHeights = {};
      const initialWidths = {};
      
      grouped.forEach(category => {
        initialHeights[category.category_name] = 0;
        initialWidths[category.category_name] = 0;
      });
      
      setCategoryHeights(initialHeights);
      setCategoryWidths(initialWidths);
  
      if (grouped.length > 0) {
        setSelectedCategory(grouped[0].category_name);
      }
      
      setMenuLoaded(true);
    }
  }, [menuLoaded]);

  const handleCartFetched = useCallback((fetchedCartItems) => {
    syncCartToContext(restaurantId, fetchedCartItems);
    
    // 在所有數據加載完成後關閉加載狀態，並添加1秒延遲確保動畫顯示足夠時間
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, [restaurantId, syncCartToContext, setIsLoading]);

  const handleLoading = useCallback((isLoading) => {
    // 透過全局 LoadingContext 控制加載狀態
    setIsLoading(isLoading);
  }, [setIsLoading]);

  const handleCategoryLayout = useCallback((event, categoryId) => {
    const { height } = event.nativeEvent.layout;
    
    setCategoryHeights(prev => ({
      ...prev,
      [categoryId]: height
    }));
    
    menuMeasurements[categoryId] = { height };
  }, [menuMeasurements]);


  const handleCategoryItemLayout = useCallback((event, categoryId) => {
    const { width } = event.nativeEvent.layout;
    
    setCategoryWidths(prev => ({
      ...prev,
      [categoryId]: width
    }));
    
    categoryMeasurements[categoryId] = { width };
  }, [categoryMeasurements]);

  const handleAddToCart = useCallback((item) => {
    const price = item.price || 
                 (item.price_formatted ? parseFloat(item.price_formatted.replace('$', '')) : null) || 
                 (item.fee_in_cents ? item.fee_in_cents / 100 : 0);
    
    const uniqueId = `${restaurantId}-${item.id}-no-modifiers-${Date.now()}`;
    
    const updatedItem = {
      ...item,
      uniqueId,
      price,
      selectedModifiers: [],
    };
    
    addToCart(restaurantId, updatedItem);
  }, [restaurantId, addToCart]);

  const handleViewCart = useCallback(() => {
    navigation.navigate('Cart', { 
      restaurantId, 
      restaurants, 
      menuData: menu,
    });
  }, [restaurantId, restaurants, menu, navigation]);

  const handleProductPress = useCallback((menuItem) => {
    navigation.navigate('ProductDetail', { 
      menuItem, 
      restaurantId, 
      restaurants 
    });
  }, [restaurantId, restaurants, navigation]);

  const getItemLayout = useCallback((data, index) => {
    if (!data || !groupedMenu[index]) return { length: 0, offset: 0, index };
    
    const categoryId = groupedMenu[index].category_name;
    const height = categoryHeights[categoryId] || 0;
    
    let offset = 0;
    for (let i = 0; i < index; i++) {
      const catId = groupedMenu[i]?.category_name;
      offset += categoryHeights[catId] || 0;
    }
    
    return {
      length: height,
      offset,
      index,
    };
  }, [groupedMenu, categoryHeights]);

  const getViewCartText = useCallback(() => {
    const cartItemCount = getTotalItems(restaurantId);
    return language === 'ZH' 
      ? `查看購物車 (${cartItemCount})` 
      : `View Cart (${cartItemCount})`;
  }, [language, getTotalItems, restaurantId]);

  const renderCategory = useCallback(({ item: category, index }) => {
    if (!category) return null;
    
    const categoryId = category.category_name;
    
    return (
      <View
        style={styles.categorySection}
        key={categoryId}
        onLayout={(event) => handleCategoryLayout(event, categoryId)}
      >
        <Text style={styles.categoryHeader} numberOfLines={1} ellipsizeMode="tail">
          {language === 'ZH' ? category.category_name_zh : category.category_name}
        </Text>
        <View style={styles.separator} />

        {category.items.map((menuItem) => {
          if (!menuItem) return null;

          const hasOptions =
            (menuItem.modifier_groups && menuItem.modifier_groups.length > 0) ||
            (menuItem.option_groups && menuItem.option_groups.length > 0) ||
            (menuItem.items && menuItem.items.length > 0) ||
            menuItem.variant_group ||
            menuItem.min_max_display;

          return (
            <TouchableOpacity
              key={menuItem.id}
              style={styles.menuItem}
              onPress={() => handleProductPress(menuItem)}
            >
              <View style={styles.info}>
                <Text style={styles.name} numberOfLines={1} ellipsizeMode="tail">
                  {language === 'ZH' ? menuItem.name_zh || menuItem.name : menuItem.name}
                </Text>
                <Text style={styles.description} numberOfLines={1} ellipsizeMode="tail">
                  {language === 'ZH' ? menuItem.description_zh || menuItem.description : menuItem.description}
                </Text>
                
                {menuItem.min_max_display && menuItem.min && menuItem.max ? (
                  <Text style={styles.price}>
                    ${(menuItem.min.fee_min / 100).toFixed(2)} - ${(menuItem.max.fee_max / 100).toFixed(2)}
                  </Text>
                ) : (
                  <Text style={styles.price}>${(menuItem.fee_in_cents / 100).toFixed(2)}</Text>
                )}
              </View>

              <Image
                source={{ uri: menuItem.image_url || 'https://res.cloudinary.com/dfbpwowvb/image/upload/v1740026601/WeChat_Screenshot_20250219204307_juhsxp.png' }}
                style={styles.image}
              />
              <TouchableOpacity
                style={styles.addButton}
                onPress={() => {
                  if (hasOptions) {
                    handleProductPress(menuItem);
                  } else {
                    handleAddToCart(menuItem);
                  }
                }}
              >
                <Text style={styles.addButtonText}>+</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          );
        })}
      </View>
    );
  }, [language, handleCategoryLayout, handleProductPress, handleAddToCart]);


  const renderCategoryItem = useCallback((category, index) => {
    const categoryId = category.category_name;
    const isSelected = selectedCategory === categoryId;
    
    return (
      <TouchableOpacity
        key={categoryId}
        style={[
          styles.categoryItem, 
          isSelected && styles.selectedCategory
        ]}
        onPress={() => handleCategoryPress(categoryId, index)}
        onLayout={(event) => handleCategoryItemLayout(event, categoryId)}
      >
        <Text 
          style={[
            styles.categoryText,
            isSelected && styles.selectedCategoryText
          ]}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {language === 'ZH' ? category.category_name_zh : category.category_name}
        </Text>
      </TouchableOpacity>
    );
  }, [selectedCategory, handleCategoryPress, handleCategoryItemLayout, language]);

  const renderCartButton = useCallback(() => {
    const cartItemCount = getTotalItems(restaurantId);
    if (menuLoaded && cartItemCount > 0) {
      return (
        <View style={styles.viewCartContainer}>
          <TouchableOpacity style={styles.viewCartButton} onPress={handleViewCart}>
            <Text style={styles.viewCartButtonText} numberOfLines={1} ellipsizeMode="tail">
              {getViewCartText()}
            </Text>
          </TouchableOpacity>
        </View>
      );
    }
    return null;
  }, [menuLoaded, getTotalItems, restaurantId, handleViewCart, getViewCartText]);

  // 在組件卸載時清除加載狀態
  useEffect(() => {
    return () => {
      setIsLoading(false);
    };
  }, [setIsLoading]);

  return (
    <SafeAreaView style={styles.container}>

      <MenuFetcher
        restaurantId={restaurantId}
        onDataFetched={handleDataFetched}
        onLoading={handleLoading}
      />

      {menuLoaded && (
        <FetchCartItems
          restaurantId={restaurantId}
          onCartFetched={handleCartFetched}
        />
      )}

      {!menuLoaded ? (
        // 載入中顯示空白，實際載入畫面由 LoadingContext 處理
        <View style={styles.emptyContainer} />
      ) : groupedMenu.length > 0 ? (
        <>
          <View style={styles.categoryWrapper}>
            <ScrollView
              horizontal
              ref={categoryScrollRef}
              style={styles.categoryList}
              showsHorizontalScrollIndicator={false}
              scrollEventThrottle={16}
              contentContainerStyle={styles.categoryListContent}
              keyboardShouldPersistTaps="handled"
            >
              {groupedMenu.map((category, index) => (
                renderCategoryItem(category, index)
              ))}
            </ScrollView>
          </View>

          <FlatList
            ref={menuListRef}
            data={groupedMenu}
            keyExtractor={(item) => item.category_name}
            renderItem={renderCategory}
            style={styles.flatList}
            onScroll={handleMenuScroll}
            scrollEventThrottle={16}
            contentContainerStyle={styles.flatListContent}
            initialNumToRender={5}
            maxToRenderPerBatch={5}
            windowSize={5}
            removeClippedSubviews={Platform.OS === 'android'}
            getItemLayout={getItemLayout}
            onMomentumScrollEnd={() => setIsManualScroll(false)}
            keyboardShouldPersistTaps="handled"
          />
        </>
      ) : (
        <Text style={styles.emptyMessage}>
        </Text>
      )}

      {renderCartButton()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  emptyContainer: {
    flex: 1,
  },
  categoryWrapper: {
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    backgroundColor: '#fff',
    zIndex: 10,
  },
  categoryHeader: {
    fontSize: 20 * fontScale, // Reduced from 24
    fontFamily: 'Inter-SemiBold', 
    fontWeight: 'bold',
    marginVertical: 10 * scaleHeight, // Reduced from 12
    paddingHorizontal: 16 * scaleWidth, // Reduced from 18
  },
  separator: {
    height: 1 * scaleHeight,
    backgroundColor: '#ddd',
  },
  name: {
    fontSize: 20 * fontScale, // Reduced from 24
    fontFamily: 'Inter-SemiBold',
    marginBottom: 5 * scaleHeight, // Reduced from 6
    maxWidth: 230 * scaleWidth, // Reduced from 260
  },
  description: {
    fontSize: 16 * fontScale, // Reduced from 20
    fontFamily: 'Inter-Regular',
    color: '#555',
    marginBottom: 5 * scaleHeight, // Reduced from 6
    lineHeight: 18 * scaleHeight, // Reduced from 22
    maxHeight: 40 * scaleHeight, // Reduced from 50
    maxWidth: 230 * scaleWidth, // Reduced from 260
    overflow: 'hidden',
  },
  price: {
    fontSize: 18 * fontScale, // Reduced from 24
    color: '#000',
  },
  menuItem: {
    flexDirection: 'row',
    padding: 14 * scaleWidth, // Reduced from 16
    backgroundColor: '#fff',
    borderRadius: 10 * scaleWidth, // Reduced from 12
    alignItems: 'center',
    borderBottomWidth: 1 * scaleHeight,
    borderBottomColor: '#ccc',
    height: 100 * scaleHeight, // Reduced from 120
    justifyContent: 'space-between',
    width: '100%',
  },
  info: {
    flex: 1,
    marginRight: 16 * scaleWidth, // Reduced from 18
    justifyContent: 'center',
  },
  image: {
    width: 85 * scaleWidth, // Reduced from 100
    height: 85 * scaleHeight, // Reduced from 100
    borderRadius: 10 * scaleWidth, // Reduced from 12
    resizeMode: 'cover',
  },
  categoryList: {
    paddingHorizontal: 10 * scaleWidth, // Reduced from 12
    height: 48, // Reduced from 56
  },
  categoryListContent: {
    alignItems: 'center',
    paddingRight: 16 * scaleWidth, // Reduced from 20
  },
  categoryItem: {
    marginRight: 16 * scaleWidth, // Reduced from 20
    paddingVertical: 10 * scaleHeight, // Reduced from 12
    paddingHorizontal: 14 * scaleWidth, // Reduced from 18
    height: 48, // Reduced from 56
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedCategory: {
    borderBottomWidth: 2 * scaleHeight, // Reduced from 3
    borderBottomColor: 'black',
  },
  categoryText: {
    fontSize: 18 * fontScale, // Reduced from 24
    color: '#333',
    textAlignVertical: 'center',
    textAlign: 'center',
  },
  selectedCategoryText: {
    fontWeight: 'bold',
  },
  addButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    width: 28 * scaleWidth, // Reduced from 34
    height: 28 * scaleHeight, // Reduced from 34
    borderRadius: 50,
    position: 'absolute',
    bottom: 14 * scaleHeight, // Reduced from 18
    right: 14 * scaleWidth, // Reduced from 18
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 18 * fontScale, // Reduced from 22
    fontWeight: 'bold',
  },
  flatListContent: {
    paddingBottom: 90 * scaleHeight, // Reduced from 100
  },
  viewCartContainer: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 40 : 25, // Reduced from 50/30
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16, // Reduced from 20
  },
  viewCartButton: {
    backgroundColor: '#000',
    borderRadius: 8, // Reduced from 10
    width: '90%',
    height: 42, // Reduced from 50
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  viewCartButtonText: {
    color: '#fff',
    fontSize: 16 * fontScale, // Reduced from 20
    fontWeight: 'bold',
    textAlign: 'center',
  },
  emptyMessage: {
    textAlign: 'center',
    marginTop: 16, // Reduced from 20
    fontSize: 14 * fontScale, // Reduced from 16
    color: '#666',
  },
  flatList: {
    flex: 1,
  },
  categorySection: {
    backgroundColor: '#fff',
  }
});
  
export default MenuSection;