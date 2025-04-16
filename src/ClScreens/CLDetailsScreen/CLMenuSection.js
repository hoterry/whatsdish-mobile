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
import { useNavigation } from '@react-navigation/native';
import { LanguageContext } from '../../context/LanguageContext';
import Constants from 'expo-constants';
import LottieView from 'lottie-react-native';
import { useLoading } from '../../context/LoadingContext';

const { width, height } = Dimensions.get('window');
const scaleWidth = width / 375;
const scaleHeight = height / 812;
// Slightly reduced font scale to make text smaller, but not too small
const fontScale = Math.min(PixelRatio.getFontScale(), 1.15); 

const translations = {
  EN: {
    emptyMenu: "Menu information is not available",
    loginToOrder: "Login to Order",
    guestMode: "You are in guest mode. Login to place orders."
  },
  ZH: {
    emptyMenu: "菜單資訊不可用",
    loginToOrder: "登入以下單",
    guestMode: "您正在使用訪客模式。登入以下單。"
  }
};

const CLMenuSection = ({ restaurantId, restaurants }) => {
  const [menu, setMenu] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [uniqueCategories, setUniqueCategories] = useState([]);
  const [groupedMenu, setGroupedMenu] = useState([]);
  const [categoryHeights, setCategoryHeights] = useState({});
  const [categoryWidths, setCategoryWidths] = useState({});
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(false);
  const [menuLoaded, setMenuLoaded] = useState(false);
  const [isManualScroll, setIsManualScroll] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [categoryOffsets, setCategoryOffsets] = useState({});
  
  const { setIsLoading } = useLoading();

  const menuListRef = useRef(null);
  const categoryScrollRef = useRef(null);
  const categoryMeasurements = useRef({}).current;
  const menuMeasurements = useRef({}).current;
  const timeoutRef = useRef(null);
  const isScrollingRef = useRef(false);

  const navigation = useNavigation();
  const { language } = useContext(LanguageContext);

  const t = (key) => translations[language][key] || key;

  const goToLogin = useCallback(() => {
    navigation.navigate('Login');
  }, [navigation]);

  useEffect(() => {
    const fetchMenuItems = async () => {
      setIsLoading(true);
      
      try {
        const API_BASE_URL = Constants.expoConfig.extra.API_URL;
        const currentLanguage = language.toLowerCase() === 'zh' ? 'zh' : 'en';
        
        const response = await fetch(`https://whatsdish-backend-f1d7ff67f065.herokuapp.com/api/menu/${restaurantId}?language=${currentLanguage}`);
        const data = await response.json();

        if (data.success && Array.isArray(data.groupedItems)) {
          const validMenuItems = data.groupedItems.filter(item => {
            if (item.variant_group && item.variant_group.length > 0) {
              return item.items && item.items.length > 0;
            }
            return true;
          });
          
          const transformedData = validMenuItems.map(item => {
            const hasValidVariants = item.variant_group && 
                                    item.variant_group.length > 0 && 
                                    item.items && 
                                    item.items.length > 0;
    
            return {
              id: item.id,
              category: item.categories.join(', '),
              name: item.name,
              name_zh: item.name_zh || item.name,
              description: item.description || 'No description available',
              description_zh: item.description_zh || item.description || '暫無說明',
              price: item.fee_in_cents / 100,
              fee_in_cents: item.fee_in_cents,
              image_url: item.image_url,
              modifierGroups: item.modifier_groups || [],
              modifier_groups: item.modifier_groups || [],
              variants: hasValidVariants ? [...item.items] : [],
              isActive: item.is_available,
              is_available: item.is_available,
              alternate_name: item.alternate_name || []
            };
          });
    
          transformedData.sort((a, b) => {
            if (a.category.toLowerCase() > b.category.toLowerCase()) return 1;
            if (a.category.toLowerCase() < b.category.toLowerCase()) return -1;
            return a.name.toLowerCase().localeCompare(b.name.toLowerCase());
          });
    
          setMenuItems(transformedData);
          const uniqueCats = [...new Set(transformedData.map(item => item.category))].sort();
          setUniqueCategories(uniqueCats);
          
          const grouped = uniqueCats.map(category => ({
            category_name: category,
            category_name_zh: category,
            items: transformedData.filter(item => item.category === category)
          }));
          
          setGroupedMenu(grouped);
          setMenu(transformedData);
          setMenuLoaded(true);
          
          const initialHeights = {};
          const initialWidths = {};
          
          grouped.forEach(cat => {
            initialHeights[cat.category_name] = 0;
            initialWidths[cat.category_name] = 0;
          });
          
          setCategoryHeights(initialHeights);
          setCategoryWidths(initialWidths);
          
          if (grouped.length > 0) {
            setSelectedCategory(grouped[0].category_name);
          }
        }
      } catch (error) {
        console.error('Failed to fetch menu data', error);
      } finally {
        setTimeout(() => {
          setIsLoading(false);
        }, 1000);
      }
    };
    
    fetchMenuItems();
    
    return () => {
      setIsLoading(false);
    };
  }, [restaurantId, language, setIsLoading]);

  useEffect(() => {
    if (Object.keys(categoryWidths).length > 0 && groupedMenu.length > 0) {
      const offsets = {};
      let currentOffset = 0;
      
      groupedMenu.forEach((category) => {
        const categoryId = category.category_name;
        offsets[categoryId] = currentOffset;
        currentOffset += (categoryWidths[categoryId] || 100) + 20 * scaleWidth;
      });
      
      setCategoryOffsets(offsets);
    }
  }, [categoryWidths, groupedMenu]);

  const handleCategoryPress = (categoryId, index) => {
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
        console.warn("[CLMenuSection] Scroll to index failed:", error);

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
      const itemWidth = categoryWidths[categoryId] || 100;
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
  };

  const handleMenuScroll = (event) => {
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
          const itemWidth = categoryWidths[currentCategoryId] || 100;
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
  };

  const handleCategoryLayout = (event, categoryId) => {
    const { height } = event.nativeEvent.layout;
    
    setCategoryHeights(prev => ({
      ...prev,
      [categoryId]: height
    }));
    
    menuMeasurements[categoryId] = { height };
  };

  const handleCategoryItemLayout = (event, categoryId) => {
    const { width } = event.nativeEvent.layout;
    
    setCategoryWidths(prev => ({
      ...prev,
      [categoryId]: width
    }));
    
    categoryMeasurements[categoryId] = { width };
  };

  const getItemLayout = (data, index) => {
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
  };

  const renderCategory = ({ item: category, index }) => {
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
            (menuItem.modifierGroups && menuItem.modifierGroups.length > 0) ||
            (menuItem.option_groups && menuItem.option_groups.length > 0) ||
            (menuItem.variants && menuItem.variants.length > 0) ||
            menuItem.variant_group ||
            menuItem.min_max_display;

          return (
            <TouchableOpacity
              key={menuItem.id}
              style={styles.menuItem}
              onPress={goToLogin}
            >
              <View style={styles.info}>
                <Text style={styles.name} numberOfLines={1} ellipsizeMode="tail">
                  {language === 'ZH' ? (menuItem.name_zh || menuItem.name) : menuItem.name}
                </Text>
                <Text style={styles.description} numberOfLines={1} ellipsizeMode="tail">
                  {language === 'ZH' ? (menuItem.description_zh || menuItem.description) : menuItem.description}
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
                onPress={goToLogin}
              >
                <Text style={styles.addButtonText}>+</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          );
        })}
      </View>
    );
  };

  const renderCategoryItem = (category, index) => {
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
  };

  const renderLoginButton = () => {
    return (
      <View style={styles.loginButtonContainer}>
        <TouchableOpacity 
          style={styles.loginButton}
          onPress={goToLogin}
        >
          <Text style={styles.loginButtonText}>
            {t('loginToOrder')}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
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
        <Text style={styles.emptyMessage}>{t('emptyMenu')}</Text>
      )}

      {renderLoginButton()}
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
    fontSize: 19 * fontScale, // Made slightly larger than previous version
    fontFamily: 'Inter-SemiBold', 
    fontWeight: 'bold',
    marginVertical: 10 * scaleHeight,
    paddingHorizontal: 16 * scaleWidth,
  },
  separator: {
    height: 1 * scaleHeight,
    backgroundColor: '#ddd',
  },
  name: {
    fontSize: 17 * fontScale, // Made slightly larger
    fontFamily: 'Inter-SemiBold',
    marginBottom: 4 * scaleHeight,
    maxWidth: 240 * scaleWidth,
  },
  description: {
    fontSize: 15 * fontScale, // Made slightly larger
    fontFamily: 'Inter-Regular',
    color: '#555',
    marginBottom: 4 * scaleHeight,
    lineHeight: 19 * scaleHeight, // Made slightly larger
    maxHeight: 42 * scaleHeight, // Made slightly larger
    maxWidth: 240 * scaleWidth,
    overflow: 'hidden',
  },
  price: {
    fontSize: 17 * fontScale, // Made slightly larger
    color: '#000',
  },
  menuItem: {
    flexDirection: 'row',
    padding: 12 * scaleWidth, // Reduced from 14
    backgroundColor: '#fff',
    borderRadius: 10 * scaleWidth, // Reduced from 11
    alignItems: 'center',
    borderBottomWidth: 1 * scaleHeight,
    borderBottomColor: '#ccc',
    height: 100 * scaleHeight, // Reduced from 110
    justifyContent: 'space-between',
    width: '100%',
  },
  info: {
    flex: 1,
    marginRight: 16 * scaleWidth,
    justifyContent: 'center',
  },
  image: {
    width: 80 * scaleWidth, // Reduced from 90
    height: 80 * scaleHeight, // Reduced from 90
    borderRadius: 10 * scaleWidth, // Reduced from 11
    resizeMode: 'cover',
  },
  categoryList: {
    paddingHorizontal: 12 * scaleWidth,
    height: 45, // Reduced from 50
  },
  categoryListContent: {
    alignItems: 'center',
    paddingRight: 18 * scaleWidth,
  },
  categoryItem: {
    marginRight: 16 * scaleWidth, // Reduced from 18
    paddingVertical: 10 * scaleHeight, // Reduced from 11
    paddingHorizontal: 14 * scaleWidth, // Reduced from 16
    height: 45, // Reduced from 50
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedCategory: {
    borderBottomWidth: 2 * scaleHeight, // Reduced from 2.5
    borderBottomColor: 'black',
  },
  categoryText: {
    fontSize: 17 * fontScale, // Made slightly larger
    color: '#333',
    textAlignVertical: 'center',
    textAlign: 'center',
  },
  selectedCategoryText: {
    fontWeight: 'bold',
  },
  addButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    width: 28 * scaleWidth, // Reduced from 30
    height: 28 * scaleHeight, // Reduced from 30
    borderRadius: 38, // Reduced from 40
    position: 'absolute',
    bottom: 14 * scaleHeight, // Reduced from 16
    right: 14 * scaleWidth, // Reduced from 16
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 18 * fontScale, // Reduced from 20
    fontWeight: 'bold',
  },
  flatListContent: {
    paddingBottom: 80 * scaleHeight, // Reduced from 90
  },
  emptyMessage: {
    textAlign: 'center',
    marginTop: 16, // Reduced from 18
    fontSize: 14 * fontScale, // Reduced from 15
    color: '#666',
  },
  flatList: {
    flex: 1,
  },
  categorySection: {
    backgroundColor: '#fff',
  },
  loginButtonContainer: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 40 : 26, // Reduced from 45/28
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16, // Reduced from 18
  },
  loginButton: {
    backgroundColor: '#000',
    borderRadius: 8, // Reduced from 9
    width: '90%',
    height: 42, // Reduced from 46
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.28,
    shadowRadius: 3,
    elevation: 4,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 17 * fontScale, // Made slightly larger
    fontWeight: 'bold',
    textAlign: 'center',
  }
});

export default CLMenuSection;