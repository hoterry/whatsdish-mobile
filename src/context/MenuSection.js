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
import { useCart } from './CartContext';
import { useNavigation } from '@react-navigation/native';
import MenuFetcher from './MenuFetcher';
import FetchCartItems from './FetchCartItems';
import { LanguageContext } from '../context/LanguageContext';
import { useLoading } from '../context/LoadingContext';

const { width, height } = Dimensions.get('window');
const scaleWidth = width / 375;
const scaleHeight = height / 812;
const fontScale = Math.min(PixelRatio.getFontScale(), 1.3);

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

  const { setIsLoading } = useLoading();

  const mountedRef = useRef(false);
  const loadingSetRef = useRef(false);
  const menuListRef = useRef(null);
  const categoryScrollRef = useRef(null);
  const categoryMeasurements = useRef({}).current;
  const menuMeasurements = useRef({}).current;
  const timeoutRef = useRef(null);
  const isScrollingRef = useRef(false);
  const layoutUpdateTimeoutRef = useRef(null);

  const navigation = useNavigation();
  const { addToCart, getTotalItems, syncCartToContext } = useCart();
  const { language } = useContext(LanguageContext);

  useEffect(() => {
    mountedRef.current = true;
    
    return () => {
      mountedRef.current = false;
      clearTimeout(timeoutRef.current);
      clearTimeout(layoutUpdateTimeoutRef.current);
      setIsLoading(false);
    };
  }, [setIsLoading]);

  useEffect(() => {
    if (Object.keys(categoryWidths).length > 0 && groupedMenu.length > 0) {
      const prevOffsets = {...categoryOffsets};
      const newOffsets = {};
      let currentOffset = 0;
      
      groupedMenu.forEach((category) => {
        const categoryId = category.category_name;
        newOffsets[categoryId] = currentOffset;
        currentOffset += (categoryWidths[categoryId] || 100) + 20 * scaleWidth;
      });
      
      const hasChanged = Object.keys(newOffsets).some(key => 
        newOffsets[key] !== prevOffsets[key]
      );
      
      if (hasChanged) {
        setCategoryOffsets(newOffsets);
      }
    }
  }, [categoryWidths, groupedMenu, scaleWidth]);

  useEffect(() => {
    if (menuLoaded && groupedMenu.length > 0 && !selectedCategory) {
      setSelectedCategory(groupedMenu[0].category_name);
      
      if (menuListRef.current) {
        menuListRef.current.scrollToOffset({
          offset: 0,
          animated: false
        });
      }
      
      if (categoryScrollRef.current) {
        categoryScrollRef.current.scrollTo({
          x: 0,
          animated: false
        });
      }
    }
  }, [menuLoaded, groupedMenu, selectedCategory]);

  const handleCategoryPress = useCallback((categoryId, index) => {
    setSelectedCategory(categoryId);
    setIsManualScroll(true);

    if (menuListRef.current && index >= 0 && index < groupedMenu.length) {
      try {
        menuListRef.current.scrollToIndex({
          index,
          animated: true,
          viewPosition: 0,
        });
      } catch (error) {
        let offset = 0;
        for (let i = 0; i < index; i++) {
          const catId = groupedMenu[i]?.category_name;
          offset += menuMeasurements[catId]?.height || categoryHeights[catId] || 0;
        }
        
        menuListRef.current.scrollToOffset({
          offset,
          animated: true,
        });
      }
    }

    if (categoryScrollRef.current && categoryOffsets[categoryId] !== undefined) {
      try {
        const offset = categoryOffsets[categoryId] || 0;
        const itemWidth = categoryWidths[categoryId] || 100;
        const centerPosition = offset - (width / 2) + (itemWidth / 2);
        const scrollTo = Math.max(0, centerPosition);
        
        categoryScrollRef.current.scrollTo({
          x: scrollTo,
          animated: true,
        });
      } catch (error) {
        console.warn("[MenuSection] Category scroll failed:", error);
      }
    }

    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      if (mountedRef.current) {
        setIsManualScroll(false);
      }
    }, 800);
  }, [groupedMenu, categoryHeights, categoryWidths, categoryOffsets, width, menuMeasurements]);

  const handleMenuScroll = useCallback((event) => {
    if (isManualScroll || !groupedMenu.length) return;
    
    const yOffset = event.nativeEvent.contentOffset.y;
    setScrollPosition(yOffset);

    if (isScrollingRef.current) return;
    isScrollingRef.current = true;

    const determineVisibleCategory = () => {
      if (!mountedRef.current) return;
      
      let accumulatedHeight = 0;
      let currentCategoryIndex = 0;
      let currentCategoryFound = false;
      
      for (let i = 0; i < groupedMenu.length; i++) {
        const categoryId = groupedMenu[i].category_name;
        const categoryHeight = menuMeasurements[categoryId]?.height || categoryHeights[categoryId] || 0;
        
        if (yOffset >= accumulatedHeight && yOffset < accumulatedHeight + categoryHeight) {
          currentCategoryIndex = i;
          currentCategoryFound = true;
          break;
        }
        
        accumulatedHeight += categoryHeight;
      }
      
      if (!currentCategoryFound && groupedMenu.length > 0) {
        currentCategoryIndex = groupedMenu.length - 1;
      }
      
      const currentCategoryId = groupedMenu[currentCategoryIndex]?.category_name;

      if (currentCategoryId && currentCategoryId !== selectedCategory) {
        setSelectedCategory(currentCategoryId);

        if (categoryScrollRef.current && categoryOffsets[currentCategoryId] !== undefined) {
          const offset = categoryOffsets[currentCategoryId] || 0;
          const itemWidth = categoryWidths[currentCategoryId] || 100;
          const centerPosition = offset - (width / 2) + (itemWidth / 2);
          const scrollTo = Math.max(0, centerPosition);
          
          categoryScrollRef.current.scrollTo({
            x: scrollTo,
            animated: true,
          });
        }
      }
    };
    
    determineVisibleCategory();
    
    setTimeout(() => {
      isScrollingRef.current = false;
    }, 50);
  }, [isManualScroll, groupedMenu, categoryHeights, selectedCategory, categoryOffsets, width, categoryWidths, menuMeasurements]);

  const handleDataFetched = useCallback((data) => {
    if (!mountedRef.current) return;
    
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
    if (!mountedRef.current) return;
    
    syncCartToContext(restaurantId, fetchedCartItems);
    
    loadingSetRef.current = false;
    setIsLoading(false);
  }, [restaurantId, syncCartToContext, setIsLoading]);

  const handleLoading = useCallback((isLoading) => {
    if (!mountedRef.current) return;
    
    if (isLoading) {
      if (!loadingSetRef.current) {
        setIsLoading(true);
        loadingSetRef.current = true;
      }
    } else {
      loadingSetRef.current = false;
      setIsLoading(false);
    }
  }, [setIsLoading]);

  const handleCategoryLayout = useCallback((event, categoryId) => {
    if (!mountedRef.current) return;
    
    const { height } = event.nativeEvent.layout;
    
    menuMeasurements[categoryId] = { height };
    
    clearTimeout(layoutUpdateTimeoutRef.current);
    layoutUpdateTimeoutRef.current = setTimeout(() => {
      setCategoryHeights(prev => {
        if (Math.abs((prev[categoryId] || 0) - height) < 1) return prev;
        return {
          ...prev,
          [categoryId]: height
        };
      });
    }, 50);
  }, []);

  const handleCategoryItemLayout = useCallback((event, categoryId) => {
    if (!mountedRef.current) return;
    
    const { width } = event.nativeEvent.layout;
    
    categoryMeasurements[categoryId] = { width };
    
    clearTimeout(layoutUpdateTimeoutRef.current);
    layoutUpdateTimeoutRef.current = setTimeout(() => {
      setCategoryWidths(prev => {
        if (Math.abs((prev[categoryId] || 0) - width) < 1) return prev;
        return {
          ...prev,
          [categoryId]: width
        };
      });
    }, 50);
  }, []);

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
    const height = menuMeasurements[categoryId]?.height || categoryHeights[categoryId] || 0;
    
    let offset = 0;
    for (let i = 0; i < index; i++) {
      const catId = groupedMenu[i]?.category_name;
      offset += menuMeasurements[catId]?.height || categoryHeights[catId] || 0;
    }
    
    return {
      length: height,
      offset,
      index,
    };
  }, [groupedMenu, categoryHeights, menuMeasurements]);

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
        onLayout={(event) => {
          const { height } = event.nativeEvent.layout;
          menuMeasurements[categoryId] = { height };
          handleCategoryLayout(event, categoryId);
        }}
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
  }, [language, handleCategoryLayout, handleProductPress, handleAddToCart, menuMeasurements]);

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
        onLayout={(event) => {
          const { width } = event.nativeEvent.layout;
          categoryMeasurements[categoryId] = { width };
          handleCategoryItemLayout(event, categoryId);
        }}
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
  }, [selectedCategory, handleCategoryPress, handleCategoryItemLayout, language, categoryMeasurements]);

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
        <View style={styles.emptyContainer} />
      ) : groupedMenu.length > 0 ? (
        <>
          <View style={styles.categoryWrapper}>
            <ScrollView
              horizontal
              ref={categoryScrollRef}
              style={styles.categoryList}
              showsHorizontalScrollIndicator={false}
              scrollEventThrottle={50}
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
            scrollEventThrottle={50}
            contentContainerStyle={styles.flatListContent}
            initialNumToRender={3}
            maxToRenderPerBatch={3}
            windowSize={3}
            removeClippedSubviews={true}
            getItemLayout={getItemLayout}
            onMomentumScrollEnd={() => setIsManualScroll(false)}
            keyboardShouldPersistTaps="handled"
          />
        </>
      ) : (
        <Text style={styles.emptyMessage}></Text>
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
    fontSize: 24 * fontScale, 
    fontFamily: 'Inter-SemiBold', 
    fontWeight: 'bold',
    marginVertical: 12 * scaleHeight, 
    paddingHorizontal: 18 * scaleWidth,
  },
  separator: {
    height: 1 * scaleHeight,
    backgroundColor: '#ddd',
  },
  name: {
    fontSize: 24 * fontScale, 
    fontFamily: 'Inter-SemiBold',
    marginBottom: 6 * scaleHeight,
    maxWidth: 260 * scaleWidth,
  },
  description: {
    fontSize: 20 * fontScale,
    fontFamily: 'Inter-Regular',
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
    height: 56,
  },
  categoryListContent: {
    alignItems: 'center',
    paddingRight: 20 * scaleWidth,
  },
  categoryItem: {
    marginRight: 20 * scaleWidth,
    paddingVertical: 12 * scaleHeight,
    paddingHorizontal: 18 * scaleWidth,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedCategory: {
    borderBottomWidth: 3 * scaleHeight,
    borderBottomColor: 'black',
  },
  categoryText: {
    fontSize: 24 * fontScale, 
    color: '#333',
    textAlignVertical: 'center',
    textAlign: 'center',
  },
  selectedCategoryText: {
    fontWeight: 'bold',
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
    fontSize: 22 * fontScale, 
    fontWeight: 'bold',
  },
  flatListContent: {
    paddingBottom: 100 * scaleHeight,
  },
  viewCartContainer: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 50 : 30,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  viewCartButton: {
    backgroundColor: '#000',
    borderRadius: 10,
    width: '90%',
    height: 50,
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
    fontSize: 20 * fontScale,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  emptyMessage: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16 * fontScale,
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