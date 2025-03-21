import React, { useState, useEffect, useRef, useContext } from 'react';
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import { useCart } from './CartContext';
import { useNavigation } from '@react-navigation/native';
import ScrollHandler from './ScrollHandler';
import MenuFetcher from './MenuFetcher';
import FetchCartItems from './FetchCartItems';
import { LanguageContext } from '../context/LanguageContext';
import { Dimensions, PixelRatio } from 'react-native';

const { width, height } = Dimensions.get('window');
const scaleWidth = width / 375;
const scaleHeight = height / 812;
const fontScale = PixelRatio.getFontScale();

const MenuSection = ({ restaurantId, restaurants }) => {
  const [menu, setMenu] = useState([]);
  const [groupedMenu, setGroupedMenu] = useState([]);
  const [categoryHeights, setCategoryHeights] = useState([]);
  const [categoryItemWidths, setCategoryItemWidths] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [menuLoaded, setMenuLoaded] = useState(false);
  const navigation = useNavigation();
  const flatListRef = useRef();
  const categoryListRef = useRef();
  const { addToCart, getTotalItems, syncCartToContext, cartItems } = useCart();
  const { language } = useContext(LanguageContext);
  const [isCategoryClicking, setIsCategoryClicking] = useState(false);

  
  // Custom category click handler to replace the one from ScrollHandler
  const handleCustomCategoryClick = (categoryName, index) => {
    setSelectedCategory(categoryName);
    
    // Calculate scroll position for horizontal category list
    if (categoryListRef.current) {
      // Calculate offset based on measured widths
      let offsetToCenter = 0;
      for (let i = 0; i < index; i++) {
        offsetToCenter += categoryItemWidths[i] || 80; // Use default if width not measured yet
      }
      
      // Add half of the current item width to center it
      const currentItemWidth = categoryItemWidths[index] || 80;
      const screenCenter = width / 2;
      const scrollPosition = Math.max(0, offsetToCenter - screenCenter + currentItemWidth / 2);
      
      categoryListRef.current.scrollTo({ 
        x: scrollPosition, 
        animated: true 
      });
    }
    
    // Scroll FlatList to the selected category
    if (flatListRef.current) {
      try {
        flatListRef.current.scrollToIndex({
          index,
          animated: true,
          viewPosition: 0,
        });
      } catch (error) {
        // Fallback for "index out of bounds" errors
        console.warn("[Menu Section Warning] Scroll error:", error);
        
        // Alternative approach: calculate offset and use scrollToOffset
        let offset = 0;
        for (let i = 0; i < index; i++) {
          offset += categoryHeights[i] || 0;
        }
        
        flatListRef.current.scrollToOffset({
          offset,
          animated: true
        });
      }
    }
  };
  
  // Custom scroll handler for FlatList
  const handleCustomScroll = (event) => {
    if (isCategoryClicking || !categoryHeights.length || categoryHeights.includes(0)) return;
  
    const y = event.nativeEvent.contentOffset.y;
    let totalHeight = 0;
  
    for (let i = 0; i < categoryHeights.length; i++) {
      totalHeight += categoryHeights[i];
      if (y < totalHeight) {
        if (selectedCategory !== groupedMenu[i].category_name) {
          setSelectedCategory(groupedMenu[i].category_name);
  
          if (categoryListRef.current) {
            let offsetToCenter = 0;
            for (let j = 0; j < i; j++) {
              offsetToCenter += categoryItemWidths[j] || 80;
            }
  
            const currentItemWidth = categoryItemWidths[i] || 80;
            const screenCenter = width / 2;
            const scrollPosition = Math.max(0, offsetToCenter - screenCenter + currentItemWidth / 2);
  
            categoryListRef.current.scrollTo({ 
              x: scrollPosition, 
              animated: true 
            });
          }
        }
        break;
      }
    }
  };
  
  const handleDataFetched = (data) => {
    if (!data || !data.categories || !data.groupedItems) {
      console.error('[Menu Section Error] Invalid data received:', data);
      return;
    }

    const firstFoodItem = data.groupedItems[50];
    if (__DEV__) {
      console.log('[Menu Section Log] Log 1 food item:', JSON.stringify(firstFoodItem, null, 2));
    }

    const categories = data.categories;
    const groupedItems = data.groupedItems;

    // Create a map to group items by variant_group
    const variantGroups = new Map();
    
    // First, identify all variant groups
    groupedItems.forEach(item => {
      if (item.variant_group && item.variant_group !== '') {
        if (!variantGroups.has(item.variant_group)) {
          variantGroups.set(item.variant_group, []);
        }
        variantGroups.get(item.variant_group).push(item);
      }
    });
    
    // Create a map with deduplicated items
    const dedupedItemsMap = new Map();
    
    groupedItems.forEach(item => {
      // If this is a variant but not the parent item, skip it
      if (item.variant_group && item.variant_group !== '' && item.is_variant) {
        return;
      }
      
      // Add non-variant items or parent variant items to the map
      dedupedItemsMap.set(item.id, item);
    });
    
    // Create the grouped menu with deduplicated items
    const groupedItemsMap = dedupedItemsMap;

    const grouped = categories.map(category => ({
      category_name: category.name,
      category_name_zh: category.name || category.name,
      items: category.items
        .map(item => groupedItemsMap.get(item.id))
        .filter(item => item), // Remove nulls and undefineds
    }));

    setGroupedMenu(grouped);
    setMenu(data.groupedItems); // Keep the full menu with all variants for reference
    setMenuLoaded(true); // Mark menu data as loaded
    
    // Initialize arrays to track heights and widths
    setCategoryHeights(new Array(grouped.length).fill(0));
    setCategoryItemWidths(new Array(grouped.length).fill(0));
  };

  const handleCartFetched = (fetchedCartItems) => {
    syncCartToContext(restaurantId, fetchedCartItems);
    setLoading(false); // Mark overall loading as complete
  };

  const handleLoading = (isLoading) => {
    setLoading(isLoading); // Update loading state
  };

  const getItemLayout = (data, index) => {
    let offset = 0;
    for (let i = 0; i < index; i++) {
      offset += categoryHeights[i] || 0;
    }
    return {
      length: categoryHeights[index] || 0,
      offset,
      index,
    };
  };

  useEffect(() => {
    if (groupedMenu.length > 0) {
      const firstCategory = groupedMenu[0].category_name;
      setSelectedCategory(firstCategory);
      
      // Safely scroll to first item
      if (flatListRef.current) {
        try {
          flatListRef.current.scrollToIndex({
            index: 0,
            animated: false,
          });
        } catch (error) {
          console.warn("[Menu Section Warning] Initial scroll error:", error);
        }
      }
    }

    if (__DEV__) {
      console.log('[Menu Section Log] Running in development environment');
    } else {
      console.log('[Menu Section Log] Running in production environment');
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
  
  const handleCategoryItemLayout = (event, index) => {
    const { width } = event.nativeEvent.layout;
    setCategoryItemWidths((prevWidths) => {
      const newWidths = [...prevWidths];
      newWidths[index] = width;
      return newWidths;
    });
  };

  const handleAddToCart = (item) => {
    const price = item.price || 
                  (item.price_formatted ? parseFloat(item.price_formatted.replace('$', '')) : null) || 
                  (item.fee_in_cents ? item.fee_in_cents / 100 : 0);
    
    // Ensure modifiers are initialized as an empty array
    const selectedModifiers = [];
    
    // Create a more reliable unique identifier
    const uniqueId = `${restaurantId}-${item.id}-no-modifiers-${Date.now()}`;
    
    const updatedItem = {
      ...item,
      uniqueId,
      price,
      selectedModifiers,
    };
    
    console.log("[Menu Section Log] Adding item to cart:", updatedItem);
    addToCart(restaurantId, updatedItem);
  };

  const handleViewCart = () => {
    navigation.navigate('Cart', { 
      restaurantId, 
      restaurants, 
      menuData: menu,
    });
  };

  const cartItemCount = getTotalItems(restaurantId);

  const renderCategory = ({ item: category, index }) => {
    if (!category) {
      return null;
    }

    return (
      <View
        style={styles.categorySection}
        key={category.category_name}
        onLayout={(event) => handleCategoryLayout(event, index)}
      >
        <Text style={styles.categoryHeader}>
          {language === 'ZH' ? category.category_name : category.category_name}
        </Text>
        <View style={styles.separator} />

        {category.items.map((menuItem, itemIndex) => {
          if (!menuItem) return null;

          if (index === 30 && itemIndex === 30) {
            if (__DEV__) {
              console.log('[Menu Section Log] First Menu Item in MenuSection:', menuItem);
            }

            if (menuItem.option_groups && menuItem.option_groups.length > 0) {
              if (__DEV__) {
                console.log('[Menu Section Log] Option Groups in MenuSection:', menuItem.option_groups);
              }
            }

            if (menuItem.modifier_groups && menuItem.modifier_groups.length > 0) {
              if (__DEV__) {
                console.log('[Menu Section Log] Modifier Groups in MenuSection:', menuItem.modifier_groups);
              }
            }
          }

          // Check if this item has variants, options, or modifiers
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
              onPress={() => navigation.navigate('ProductDetail', { menuItem, restaurantId, restaurants })}
            >
              <View style={styles.info}>
                <Text style={styles.name}>{language === 'ZH' ? menuItem.name : menuItem.name}</Text>
                <Text style={styles.description} numberOfLines={1} ellipsizeMode="tail">
                  {language === 'ZH' ? menuItem.description : menuItem.description}
                </Text>
                
                {/* Display price range for items with variants */}
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
                    navigation.navigate('ProductDetail', { menuItem, restaurantId, restaurants });
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
  };

  return (
    <View style={styles.container}>
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
      {groupedMenu.length > 0 ? (
        <>
          <ScrollView
            horizontal
            style={styles.categoryList}
            ref={categoryListRef}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoryListContent}
          >
            {groupedMenu.map((category, index) => (
              <TouchableOpacity
                key={category.category_name}
                style={[styles.categoryItem, selectedCategory === category.category_name && styles.selectedCategory]}
                onPress={() => handleCustomCategoryClick(category.category_name, index)}
                onLayout={(event) => handleCategoryItemLayout(event, index)}
              >
                <Text style={[
                  styles.categoryText,
                  selectedCategory === category.category_name && styles.selectedCategoryText
                ]}>
                  {language === 'ZH' ? category.category_name : category.category_name}
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
            onScroll={handleCustomScroll}
            scrollEventThrottle={16}
            contentContainerStyle={{ paddingBottom: 750 * scaleHeight }}
            initialNumToRender={10}
            maxToRenderPerBatch={10}
            windowSize={5}
            removeClippedSubviews={true}
            getItemLayout={getItemLayout}
          />
        </>
      ) : (
        <Text style={styles.emptyMessage}> </Text>
      )}
  
      {menuLoaded && cartItemCount > 0 && (
        <TouchableOpacity style={styles.viewCartButton} onPress={handleViewCart}>
          <Text style={styles.viewCartButtonText}>
            View Cart ({cartItemCount})
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};


const styles = StyleSheet.create({
  categoryHeader: {
    fontSize: 28 * fontScale,
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
    fontSize: 24 * fontScale, 
    fontFamily: 'Quicksand-Bold',
    marginBottom: 6 * scaleHeight,
    maxWidth: 260 * scaleWidth,
  },
  description: {
    fontSize: 20 * fontScale,
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
    fontSize: 24* fontScale, 
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
    fontSize: 22 * fontScale, 
    fontWeight: 'bold',
  },
  viewCartButton: {
    position: 'absolute',
    top: height * 0.6,  
    left: width * 0.05,  
    backgroundColor: '#000',
    padding: 12 * scaleWidth,
    borderRadius: 6 * scaleWidth,
    zIndex: 999,
    width: '90%',
    height: '5%',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  viewCartButtonText: {
    color: '#fff',
    fontSize: 18 * fontScale,
    textAlign: 'center',
  },
    emptyMessage: {
      textAlign: 'center',
      marginTop: 20,
      fontSize: 16,
      color: '#666',
    },
});

  
export default MenuSection;
