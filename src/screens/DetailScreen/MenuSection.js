import React, { useState, useEffect, useRef, useContext, useCallback, useMemo, memo } from 'react';
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
  PixelRatio,
  InteractionManager
} from 'react-native';
import { useCart } from '../../context/CartContext';
import { useNavigation } from '@react-navigation/native';
import MenuFetcher from '../../context/MenuFetcher';
import FetchCartItems from '../../context/FetchCartItems';
import { LanguageContext } from '../../context/LanguageContext';
import { useLoading } from '../../context/LoadingContext'; 

const { width, height } = Dimensions.get('window');
const scaleWidth = width / 375;
const scaleHeight = height / 812;
const fontScale = Math.min(PixelRatio.getFontScale(), 1.15); 

const CATEGORY_BAR_HEIGHT = 43; 

const STYLES = {
  menuItemHeight: 110 * scaleHeight,
  menuItemFullHeight: 122 * scaleHeight,
  headerHeight: 41 * scaleHeight,
  categoryItemWidth: 100 * scaleWidth,
  categorySpacing: 14 * scaleWidth,
  imageSize: 100 * scaleWidth,
};

const MenuItemImage = memo(({ uri, style }) => {
  const [loaded, setLoaded] = useState(false);
  const placeholderUri = 'https://res.cloudinary.com/dfbpwowvb/image/upload/v1740026601/WeChat_Screenshot_20250219204307_juhsxp.png';
  
  return (
    <View style={styles.imageContainer}>
      {!loaded && (
        <View style={[style, { backgroundColor: '#f0f0f0', borderRadius: 10 * scaleWidth }]} />
      )}
      <Image
        source={{ uri: uri || placeholderUri }}
        style={style}
        onLoad={() => setLoaded(true)}
      />
    </View>
  );
});

const MenuItem = memo(({ menuItem, language, handleProductPress, handleAddToCart }) => {
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

      <View style={styles.imageContainer}>
        <MenuItemImage
          uri={menuItem.image_url}
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
      </View>
    </TouchableOpacity>
  );
});

const CategoryItem = memo(({ category, index, isSelected, onPress, language }) => {
  return (
    <TouchableOpacity
      key={category.category_name}
      style={[
        styles.categoryItem, 
        isSelected && styles.selectedCategory
      ]}
      onPress={() => onPress(category.category_name, index)}
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
});

const CategoryList = memo(({ categories, selectedCategory, handleCategoryPress, language }) => {
  return categories.map((category, index) => (
    <CategoryItem
      key={category.category_name}
      category={category}
      index={index}
      isSelected={selectedCategory === category.category_name}
      onPress={handleCategoryPress}
      language={language}
    />
  ));
});

const MenuSection = ({ restaurantId, restaurants }) => {
  const [menu, setMenu] = useState([]);
  const [groupedMenu, setGroupedMenu] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [menuLoaded, setMenuLoaded] = useState(false);
  const [isManualScroll, setIsManualScroll] = useState(false);
  
  const categoryHeightsRef = useRef({});
  const isScrollingRef = useRef(false);
  const menuPositionsRef = useRef([]);
  const lockScrollUpdateRef = useRef(false);
  const menuDataRef = useRef(null);
  const categoryOffsetsRef = useRef({});
  const categoryItemsRef = useRef({});
  
  const { setIsLoading } = useLoading();

  const menuListRef = useRef(null);
  const categoryScrollRef = useRef(null);
  const timeoutRef = useRef(null);

  const navigation = useNavigation();
  const { addToCart, getTotalItems, syncCartToContext } = useCart();
  const { language } = useContext(LanguageContext);

  const staticEstimateHeight = useCallback((categoryItems) => {
    const headerHeight = 19 * fontScale + (11 * 2 * scaleHeight) + 1 * scaleHeight;
    const itemHeight = 110 * scaleHeight + 8 * scaleHeight;
    
    return headerHeight + (categoryItems.length * itemHeight);
  }, [fontScale, scaleHeight]);
  
  const calculateCategoryLayouts = useCallback(() => {
    if (!menuListRef.current) return;
    
    const positions = [];
    let currentOffset = 0;
    
    groupedMenu.forEach((category, index) => {
      const categoryId = category.category_name;
      const estimatedHeight = staticEstimateHeight(category.items);
      
      positions.push({
        index,
        categoryId,
        offset: currentOffset,
        height: estimatedHeight
      });
      
      categoryHeightsRef.current[categoryId] = estimatedHeight;
      currentOffset += estimatedHeight;
    });
    
    menuPositionsRef.current = positions;

    const categoryOffsets = {};
    let categoryOffset = 0;
    
    groupedMenu.forEach((category, index) => {
      const categoryId = category.category_name;
      const estimatedWidth = (17 * fontScale * category.category_name.length * 0.6) + (12 * 2 * scaleWidth);
      
      categoryOffsets[categoryId] = categoryOffset;
      categoryItemsRef.current[categoryId] = {
        width: Math.max(80 * scaleWidth, estimatedWidth),
        index
      };
      
      categoryOffset += Math.max(80 * scaleWidth, estimatedWidth) + (14 * scaleWidth);
    });
    
    categoryOffsetsRef.current = categoryOffsets;
  }, [groupedMenu, staticEstimateHeight, fontScale, scaleWidth]);

  useEffect(() => {
    if (menuLoaded && groupedMenu.length > 0) {
      InteractionManager.runAfterInteractions(() => {
        requestAnimationFrame(() => {
          calculateCategoryLayouts();
        });
      });
    }
  }, [menuLoaded, groupedMenu, calculateCategoryLayouts]);

  const handleCategoryPress = useCallback((categoryId, index) => {
    lockScrollUpdateRef.current = true;
    setSelectedCategory(categoryId);
    setIsManualScroll(true);

    if (menuListRef.current) {
      const position = menuPositionsRef.current.find(p => p.categoryId === categoryId);
      
      if (position) {
        menuListRef.current.scrollToOffset({
          offset: position.offset,
          animated: true,
        });
      } else {
        try {
          menuListRef.current.scrollToIndex({
            index,
            animated: true,
            viewPosition: 0,
          });
        } catch (error) {
          console.warn("[MenuSection] Scroll to index failed:", error);
        }
      }
    }

    if (categoryScrollRef.current) {
      updateCategoryScroll(index);
    }

    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      lockScrollUpdateRef.current = false;
      setIsManualScroll(false);
    }, 1200);
  }, []);

  const updateCategoryScroll = useCallback((index) => {
    if (!categoryScrollRef.current) return;
    
    const categoryId = groupedMenu[index]?.category_name;
    if (!categoryId) return;
    
    const categoryInfo = categoryItemsRef.current[categoryId];
    const itemWidth = categoryInfo ? categoryInfo.width : STYLES.categoryItemWidth;
    
    const offset = categoryOffsetsRef.current[categoryId] || 0;
    const centerPosition = offset - (width / 2) + (itemWidth / 2);
    
    const scrollTo = Math.max(0, centerPosition);
    
    categoryScrollRef.current.scrollTo({
      x: scrollTo,
      animated: true,
    });
  }, [groupedMenu, width]);

  const handleMenuScroll = useCallback((event) => {
    if (isManualScroll || lockScrollUpdateRef.current || !groupedMenu.length) return;
    
    const yOffset = event.nativeEvent.contentOffset.y;
    
    if (!isScrollingRef.current) {
      isScrollingRef.current = true;
      
      requestAnimationFrame(() => {

        const topOffset = yOffset + CATEGORY_BAR_HEIGHT;
        
        let foundCategory = null;
        let foundIndex = 0;

        for (let i = 0; i < menuPositionsRef.current.length; i++) {
          const position = menuPositionsRef.current[i];
          const nextPosition = menuPositionsRef.current[i + 1];

          if (topOffset >= position.offset && 
              (!nextPosition || topOffset < nextPosition.offset)) {
            foundCategory = position.categoryId;
            foundIndex = i;
            break;
          }
        }

        if (!foundCategory && menuPositionsRef.current.length > 0) {
          const lastPosition = menuPositionsRef.current[menuPositionsRef.current.length - 1];
          foundCategory = lastPosition.categoryId;
          foundIndex = menuPositionsRef.current.length - 1;
        }

        if (foundCategory && foundCategory !== selectedCategory) {
          setSelectedCategory(foundCategory);
          updateCategoryScroll(foundIndex);
        }
        
        isScrollingRef.current = false;
      });
    }
  }, [isManualScroll, groupedMenu, selectedCategory, updateCategoryScroll]);

  const handleCategoryLayout = useCallback((event, categoryId, index) => {
    const { height } = event.nativeEvent.layout;
    
    categoryHeightsRef.current[categoryId] = height;
    
    if (menuPositionsRef.current.length > 0) {
      const position = menuPositionsRef.current.find(p => p.categoryId === categoryId);
      if (position) {
        position.height = height;
        
        let currentOffset = 0;
        menuPositionsRef.current.forEach(pos => {
          pos.offset = currentOffset;
          currentOffset += pos.height;
        });
      }
    }
  }, []);

  const handleCategoryItemLayout = useCallback((event, categoryId, index) => {
    const { width } = event.nativeEvent.layout;
    
    if (categoryItemsRef.current[categoryId]) {
      categoryItemsRef.current[categoryId].width = width;
    } else {
      categoryItemsRef.current[categoryId] = { width, index };
    }
    
    let currentOffset = 0;
    const offsets = {};
    
    for (let i = 0; i < groupedMenu.length; i++) {
      const catId = groupedMenu[i].category_name;
      offsets[catId] = currentOffset;
      
      const itemInfo = categoryItemsRef.current[catId];
      const itemWidth = itemInfo ? itemInfo.width : 80 * scaleWidth;
      
      currentOffset += itemWidth + (14 * scaleWidth);
    }
    
    categoryOffsetsRef.current = offsets;
  }, [groupedMenu, scaleWidth]);

  const getItemLayout = useCallback((data, index) => {
    if (!data || !menuPositionsRef.current[index]) {
      const defaultHeight = 200 * scaleHeight;
      return { 
        length: defaultHeight, 
        offset: defaultHeight * index, 
        index 
      };
    }
    
    const position = menuPositionsRef.current[index];
    
    return {
      length: position.height,
      offset: position.offset,
      index,
    };
  }, [scaleHeight]);

  const handleDataFetched = useCallback((data) => {
    if (!data || !data.categories || !data.groupedItems) {
      console.error('[Menu Section Error] Invalid data received:', data);
      return;
    }

    const categories = data.categories;
    const groupedItems = data.groupedItems;

    const variantGroupsMap = new Map();
    const dedupedItemsMap = new Map();
    
    groupedItems.forEach(item => {
      if (item.variant_group && item.variant_group !== '') {
        if (!variantGroupsMap.has(item.variant_group)) {
          variantGroupsMap.set(item.variant_group, []);
        }
        variantGroupsMap.get(item.variant_group).push(item);
      }
      
      if (!(item.variant_group && item.variant_group !== '' && item.is_variant)) {
        dedupedItemsMap.set(item.id, item);
      }
    });

    const grouped = categories.map(category => ({
      category_name: category.name,
      category_name_zh: category.name || category.name,
      items: category.items
        .map(item => dedupedItemsMap.get(item.id))
        .filter(Boolean),
    }));

    setGroupedMenu(grouped);
    setMenu(data.groupedItems);

    if (!menuLoaded) {
      if (grouped.length > 0) {
        setSelectedCategory(grouped[0].category_name);
      }
      
      setMenuLoaded(true);
      setIsLoading(false);
    }
  }, [menuLoaded, setIsLoading]);

  const handleCartFetched = useCallback((fetchedCartItems) => {
    syncCartToContext(restaurantId, fetchedCartItems);
    setIsLoading(false);
  }, [restaurantId, syncCartToContext, setIsLoading]);

  const handleLoading = useCallback((isLoading) => {
    if (!menuLoaded) {
      setIsLoading(isLoading);
    }
  }, [setIsLoading, menuLoaded]);

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
        onLayout={(event) => handleCategoryLayout(event, categoryId, index)}
      >
        <Text style={styles.categoryHeader} numberOfLines={1} ellipsizeMode="tail">
          {language === 'ZH' ? category.category_name_zh : category.category_name}
        </Text>
        <View style={styles.separator} />

        {category.items.map((menuItem) => (
          <MenuItem 
            key={menuItem.id}
            menuItem={menuItem}
            language={language}
            handleProductPress={handleProductPress}
            handleAddToCart={handleAddToCart}
          />
        ))}
      </View>
    );
  }, [language, handleCategoryLayout, handleProductPress, handleAddToCart]);

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
              <CategoryList 
                categories={groupedMenu}
                selectedCategory={selectedCategory}
                handleCategoryPress={handleCategoryPress}
                language={language}
              />
            </ScrollView>
          </View>

          <FlatList
            ref={menuListRef}
            data={groupedMenu}
            showsVerticalScrollIndicator={false}
            keyExtractor={(item) => item.category_name}
            renderItem={renderCategory}
            style={styles.flatList}
            onScroll={handleMenuScroll}
            scrollEventThrottle={16}
            contentContainerStyle={styles.flatListContent}
            initialNumToRender={3}
            maxToRenderPerBatch={3}
            windowSize={5}
            updateCellsBatchingPeriod={50}
            removeClippedSubviews={true}
            getItemLayout={getItemLayout}
            onMomentumScrollEnd={() => {
              setTimeout(() => {
                lockScrollUpdateRef.current = false;
                setIsManualScroll(false);
              }, 200);
            }}
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
    fontSize: 19 * fontScale,
    fontFamily: 'Inter-SemiBold', 
    fontWeight: 'bold',
    marginVertical: 11 * scaleHeight,
    paddingHorizontal: 15 * scaleWidth,
  },
  separator: {
    height: 1 * scaleHeight,
    backgroundColor: '#ddd',
  },
  name: {
    fontSize: 17 * fontScale,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 4 * scaleHeight,
    maxWidth: 240 * scaleWidth,
  },
  description: {
    fontSize: 15 * fontScale,
    fontFamily: 'Inter-Regular',
    color: '#555',
    marginBottom: 4 * scaleHeight,
    lineHeight: 18 * scaleHeight,
    maxHeight: 36 * scaleHeight,
    maxWidth: 240 * scaleWidth,
    overflow: 'hidden',
  },
  price: {
    fontSize: 17 * fontScale,
    color: '#000',
    marginTop: 2 * scaleHeight,
  },
  menuItem: {
    flexDirection: 'row',
    paddingHorizontal: 16 * scaleWidth,
    backgroundColor: '#fff',
    borderRadius: 8 * scaleWidth,
    alignItems: 'center',
    borderBottomWidth: 1 * scaleHeight,
    borderBottomColor: '#eee',
    height: 110 * scaleHeight,
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 4 * scaleHeight,
    marginBottom: 4 * scaleHeight,
  },
  info: {
    flex: 1,
    marginRight: 18 * scaleWidth,
    justifyContent: 'center',
    paddingVertical: 5 * scaleHeight,
  },
  imageContainer: {
    position: 'relative',
    width: 100 * scaleWidth,
    height: 100 * scaleHeight,
    marginVertical: 5 * scaleHeight,
  },
  image: {
    width: 100 * scaleWidth,
    height: 100 * scaleHeight,
    borderRadius: 10 * scaleWidth,
    resizeMode: 'cover',
  },
  categoryList: {
    paddingHorizontal: 10 * scaleWidth,
    height: 42,
  },
  categoryListContent: {
    alignItems: 'center',
    paddingRight: 16 * scaleWidth,
  },
  categoryItem: {
    marginRight: 14 * scaleWidth,
    paddingVertical: 8 * scaleHeight,
    paddingHorizontal: 12 * scaleWidth,
    height: 42,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedCategory: {
    borderBottomWidth: 2,
    borderBottomColor: '#000',
  },
  categoryText: {
    fontSize: 17 * fontScale,
    color: '#333',
    textAlignVertical: 'center',
    textAlign: 'center',
  },
  selectedCategoryText: {
    fontWeight: 'bold',
    color: '#000',
  },
  addButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    width: 32 * scaleWidth,
    height: 32 * scaleHeight,
    borderRadius: 40,
    position: 'absolute',
    bottom: -5 * scaleHeight,
    right: -5 * scaleWidth,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 18 * fontScale,
    fontWeight: 'bold',
  },
  flatListContent: {
    paddingBottom: 120 * scaleHeight, 
  },
  emptyMessage: {
    textAlign: 'center',
    marginTop: 15,
    fontSize: 14 * fontScale,
    color: '#666',
  },
  flatList: {
    flex: 1,
  },
  categorySection: {
    backgroundColor: '#fff',
  },
  viewCartContainer: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 36 : 24,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 15,
  },
  viewCartButton: {
    backgroundColor: '#000',
    borderRadius: 7,
    width: '90%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 2.5,
    elevation: 3,
  },
  viewCartButtonText: {
    color: '#fff',
    fontSize: 17 * fontScale,
    fontWeight: 'bold',
    textAlign: 'center',
  }
});
  
export default MenuSection;