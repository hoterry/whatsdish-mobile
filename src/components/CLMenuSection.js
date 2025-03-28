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
import { LanguageContext } from '../context/LanguageContext';
import Constants from 'expo-constants';
import LottieView from 'lottie-react-native';
import { useLoading } from '../context/LoadingContext'; // 確保正確導入 LoadingContext

const { width, height } = Dimensions.get('window');
const scaleWidth = width / 375;
const scaleHeight = height / 812;
const fontScale = Math.min(PixelRatio.getFontScale(), 1.3);

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
  const [loading, setLoading] = useState(false); // 本地加載狀態設為 false
  const [menuLoaded, setMenuLoaded] = useState(false);
  const [isManualScroll, setIsManualScroll] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [categoryOffsets, setCategoryOffsets] = useState({});
  
  // 使用全局加載狀態
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
      // 使用全局加載狀態
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
          
          // 為FlatList製作分組數據
          const grouped = uniqueCats.map(category => ({
            category_name: category,
            category_name_zh: category, // 假設API不提供類別中文名
            items: transformedData.filter(item => item.category === category)
          }));
          
          setGroupedMenu(grouped);
          setMenu(transformedData);
          setMenuLoaded(true);
          
          // 初始化類別高度和寬度
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
        // 添加1秒延遲，確保動畫顯示足夠時間
        setTimeout(() => {
          setIsLoading(false);
        }, 1000);
      }
    };
    
    fetchMenuItems();
    
    // 組件卸載時清理
    return () => {
      setIsLoading(false);
    };
  }, [restaurantId, language, setIsLoading]);

  // 計算類別偏移量
  useEffect(() => {
    if (Object.keys(categoryWidths).length > 0 && groupedMenu.length > 0) {
      const offsets = {};
      let currentOffset = 0;
      
      groupedMenu.forEach((category) => {
        const categoryId = category.category_name;
        offsets[categoryId] = currentOffset;
        currentOffset += (categoryWidths[categoryId] || 100) + 20 * scaleWidth; // 加上margin
      });
      
      setCategoryOffsets(offsets);
    }
  }, [categoryWidths, groupedMenu]);

  // 處理類別點擊
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
  }, [groupedMenu, categoryHeights, categoryWidths, categoryOffsets]);

  // 處理菜單滾動
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
  }, [isManualScroll, groupedMenu, categoryHeights, selectedCategory, categoryOffsets, categoryWidths]);

  // 處理類別佈局
  const handleCategoryLayout = useCallback((event, categoryId) => {
    const { height } = event.nativeEvent.layout;
    
    setCategoryHeights(prev => ({
      ...prev,
      [categoryId]: height
    }));
    
    menuMeasurements[categoryId] = { height };
  }, [menuMeasurements]);

  // 處理類別項目佈局
  const handleCategoryItemLayout = useCallback((event, categoryId) => {
    const { width } = event.nativeEvent.layout;
    
    setCategoryWidths(prev => ({
      ...prev,
      [categoryId]: width
    }));
    
    categoryMeasurements[categoryId] = { width };
  }, [categoryMeasurements]);

  // 獲取項目佈局
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

  // 渲染類別
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
            (menuItem.modifierGroups && menuItem.modifierGroups.length > 0) ||
            (menuItem.option_groups && menuItem.option_groups.length > 0) ||
            (menuItem.variants && menuItem.variants.length > 0) ||
            menuItem.variant_group ||
            menuItem.min_max_display;

          return (
            <TouchableOpacity
              key={menuItem.id}
              style={styles.menuItem}
              onPress={goToLogin} // 直接跳轉到登入頁面
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
                onPress={goToLogin} // 直接跳轉到登入頁面
              >
                <Text style={styles.addButtonText}>+</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          );
        })}
      </View>
    );
  }, [language, handleCategoryLayout, goToLogin]);

  // 渲染分類標題項
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

  // 渲染登入按鈕
  const renderLoginButton = useCallback(() => {
    return (
      <View style={styles.loginButtonContainer}>
        <TouchableOpacity 
          style={styles.loginButton}
          onPress={goToLogin} // 直接跳轉到登入頁面
        >
          <Text style={styles.loginButtonText}>
            {t('loginToOrder')}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }, [t, goToLogin]);

  // 主要渲染
  return (
    <SafeAreaView style={styles.container}>
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
  },
  loginButtonContainer: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 50 : 30,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  loginButton: {
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
  loginButtonText: {
    color: '#fff',
    fontSize: 20 * fontScale,
    fontWeight: 'bold',
    textAlign: 'center',
  }
});

export default CLMenuSection;