import React, { useEffect, useState, useContext, useCallback } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Dimensions,
  RefreshControl,
  StatusBar,
  Platform,
  SafeAreaView,
  Animated
} from 'react-native';
import _ from 'lodash';
import { LanguageContext } from '../context/LanguageContext';
import { LinearGradient } from 'expo-linear-gradient';
import { AntDesign, Feather, Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.85;
const ARTICLE_CARD_HEIGHT = 160; // 固定文章卡片高度

// 設置精選文章的最大數量
const FEATURED_ARTICLES_COUNT = 3;

// 優化的黑白灰色彩系統
const COLORS = {
  primary: '#000000',          // 更純的黑色
  secondary: '#222222',        // 更深黑灰
  accent: '#444444',           // 中灰
  highlight: '#666666',        // 亮灰
  light: '#E0E0E0',            // 淺灰
  lighter: '#F5F5F5',          // 更淺灰
  white: '#FFFFFF',            // 純白
  background: '#FAFAFA',       // 背景色
  cardBg: '#FFFFFF',           // 卡片背景
  shadow: 'rgba(0, 0, 0, 0.12)', // 更強陰影
  accent1: '#1A73E8',          // 藍色強調
};

const ExploreScreen = ({ navigation }) => {
  const { language } = useContext(LanguageContext);
  const [articles, setArticles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [featuredArticles, setFeaturedArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  // 內容類型切換狀態
  const [contentType, setContentType] = useState('articles'); // 'articles' 或 'videos'
  const slideAnimation = useState(new Animated.Value(0))[0];

  const fetchArticles = useCallback(async () => {
    try {
      const response = await fetch(
        'https://origineer.sheetdb.io/api/v1/ij73hup2r94z5?sheet=content'
      );
      let data = await response.json();
      
      // 添加語言映射
      let mappedLanguage;
      if (language.toUpperCase() === 'EN') {
        mappedLanguage = 'en';
      } else if (language.toUpperCase() === 'ZH') {
        mappedLanguage = 'zh-hant';
      } else {
        mappedLanguage = language.toLowerCase();
      }
      
      // 過濾已發布的文章
      const filtered = _.filter(data, (item) => {
        return item.language?.toLowerCase() === mappedLanguage && item.is_published === 'TRUE';
      });
      
      // 提取所有類別並去重
      const allCategories = filtered
        .map(item => item.categories ? item.categories.split(', ') : [])
        .flat()
        .filter(Boolean);
      const uniqueCategories = ['All', ...new Set(allCategories)];
      setCategories(uniqueCategories);
      
      // 選取精選文章（按某種標準，這裡選擇最新的幾篇）
      const sortedArticles = _.sortBy(filtered, item => -new Date(item.created_at_display || Date.now()));
      
      // 根據內容類型過濾內容
      const articlesByType = contentType === 'articles' 
        ? sortedArticles.filter(item => item.type?.toLowerCase() !== 'video')
        : sortedArticles.filter(item => item.type?.toLowerCase() === 'video');
      
      setFeaturedArticles(articlesByType.slice(0, FEATURED_ARTICLES_COUNT));
      setArticles(articlesByType);
    } catch (error) {
      console.error('[ExploreScreen Error] Failed to fetch articles:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [language, contentType]);
  
  useEffect(() => {
    fetchArticles();
  }, [fetchArticles]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchArticles();
  }, [fetchArticles]);

  // 內容類型切換處理
  const toggleContentType = (type) => {
    if (type === contentType) return;
    
    setLoading(true);
    setContentType(type);
    
    // 動畫效果
    Animated.timing(slideAnimation, {
      toValue: type === 'articles' ? 0 : 1,
      duration: 300,
      useNativeDriver: true
    }).start();
  };

  // 根據選擇的類別過濾文章
  const filteredArticles = selectedCategory === 'All' 
    ? articles 
    : articles.filter(article => {
        const articleCategories = article.categories ? article.categories.split(', ') : [];
        return articleCategories.includes(selectedCategory);
      });

  // 根據文章類型返回不同的標籤顏色
  const getTagColor = (type) => {
    switch(type?.toLowerCase()) {
      case 'blog':
        return [COLORS.secondary, COLORS.accent];
      case 'video':
        return [COLORS.accent, COLORS.highlight];
      default:
        return [COLORS.primary, COLORS.secondary];
    }
  };

  // 截斷長文本
  const truncateText = (text, maxLength) => {
    if (!text) return '';
    return text.length > maxLength ? text.slice(0, maxLength) + '...' : text;
  };

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <LinearGradient
        colors={[COLORS.primary, COLORS.secondary]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.headerGradient}
      >
        <Text style={styles.headerTitle}>
          {language.toUpperCase() === 'EN' ? 'Discover' : '探索'}
        </Text>
        <TouchableOpacity style={styles.searchButton}>
          <Feather name="search" size={24} color={COLORS.white} />
        </TouchableOpacity>
      </LinearGradient>
      
      {/* 企業級內容類型切換按鈕 - 修復對齊問題 */}
      <View style={styles.toggleOuterContainer}>
        <View style={styles.toggleContainer}>
          <View style={styles.toggleWrapper}>
            <Animated.View 
              style={[
                styles.toggleSlider,
                {
                  transform: [{
                    translateX: slideAnimation.interpolate({
                      inputRange: [0, 1],
                      outputRange: [2, (width - 44) / 2]
                    })
                  }]
                }
              ]} 
            />
            
            <TouchableOpacity 
              style={styles.toggleOption} 
              onPress={() => toggleContentType('articles')}
              activeOpacity={0.7}
            >
              <View style={styles.toggleInner}>
                <AntDesign 
                  name="filetext1" 
                  size={20} 
                  color={contentType === 'articles' ? COLORS.white : COLORS.secondary} 
                />
                <Text style={[
                  styles.toggleText, 
                  contentType === 'articles' && styles.activeToggleText
                ]}>
                  {language.toUpperCase() === 'EN' ? 'Articles' : '文章'}
                </Text>
              </View>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.toggleOption} 
              onPress={() => toggleContentType('videos')}
              activeOpacity={0.7}
            >
              <View style={styles.toggleInner}>
                <AntDesign 
                  name="videocamera" 
                  size={20} 
                  color={contentType === 'videos' ? COLORS.white : COLORS.secondary} 
                />
                <Text style={[
                  styles.toggleText, 
                  contentType === 'videos' && styles.activeToggleText
                ]}>
                  {language.toUpperCase() === 'EN' ? 'Videos' : '短視頻'}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );

  const renderCategoryTabs = () => (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.categoriesContainer}
    >
      {categories.map((category, index) => (
        <TouchableOpacity
          key={index}
          style={[
            styles.categoryTab,
            selectedCategory === category && styles.selectedCategoryTab
          ]}
          onPress={() => setSelectedCategory(category)}
        >
          <Text
            style={[
              styles.categoryText,
              selectedCategory === category && styles.selectedCategoryText
            ]}
          >
            {category}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );

  const renderFeaturedArticles = () => (
    <View style={styles.featuredSection}>
      <View style={styles.sectionTitleContainer}>
        <Text style={styles.sectionTitle}>
          {contentType === 'articles' 
            ? (language.toUpperCase() === 'EN' ? 'Featured Articles' : '精選文章')
            : (language.toUpperCase() === 'EN' ? 'Featured Videos' : '精選視頻')}
        </Text>
        <TouchableOpacity style={styles.viewAllButton}>
          <Text style={styles.viewAllText}>
            {language.toUpperCase() === 'EN' ? 'View All' : '查看全部'}
          </Text>
          <AntDesign name="right" size={16} color={COLORS.secondary} />
        </TouchableOpacity>
      </View>
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.featuredScrollContainer}
      >
        {featuredArticles.map((article, index) => (
          <TouchableOpacity 
            key={index}
            style={styles.featuredCard}
            onPress={() => navigation && navigation.navigate('ArticleDetail', { article })}
          >
            <View style={styles.featuredImageContainer}>
              <Image
                source={{ uri: article.cover_image_url || 'https://via.placeholder.com/300' }}
                style={styles.featuredImage}
                resizeMode="cover"
              />
              {contentType === 'videos' && (
                <View style={styles.playIconOverlay}>
                  <View style={styles.playIconCircle}>
                    <AntDesign name="play" size={26} color={COLORS.white} />
                  </View>
                </View>
              )}
              <LinearGradient
                colors={['transparent', 'rgba(0,0,0,0.85)']}
                style={styles.featuredGradient}
              />
              <View style={styles.featuredContent}>
                <View style={styles.tagContainer}>
                  <View style={styles.tag}>
                    <Text style={styles.tagText}>{article.type || 'Article'}</Text>
                  </View>
                </View>
                <Text style={styles.featuredTitle}>{article.title}</Text>
                <Text style={styles.featuredExcerpt}>{truncateText(article.excerpt, 100)}</Text>
                <View style={styles.featuredMeta}>
                  <View style={styles.metaItem}>
                    <AntDesign name="clockcircleo" size={14} color={COLORS.light} />
                    <Text style={styles.metaText}>
                      {article.read_time || '5'} {language.toUpperCase() === 'EN' ? 'min' : '分鐘'}
                    </Text>
                  </View>
                  <View style={styles.metaItem}>
                    <AntDesign name="calendar" size={14} color={COLORS.light} />
                    <Text style={styles.metaText}>
                      {article.created_at_display || '2025-03-20'}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  const renderArticleList = () => (
    <View style={styles.articlesSection}>
      <View style={styles.sectionTitleContainer}>
        <Text style={styles.sectionTitle}>
          {contentType === 'articles'
            ? (language.toUpperCase() === 'EN' ? 'Latest Articles' : '最新文章')
            : (language.toUpperCase() === 'EN' ? 'Latest Videos' : '最新視頻')}
        </Text>
      </View>
      {filteredArticles.map((article, index) => (
        <TouchableOpacity
          key={index}
          style={styles.articleCard}
          onPress={() => navigation && navigation.navigate('ArticleDetail', { article })}
        >
          <View style={styles.articleContentWrapper}>
            <View style={styles.articleHeader}>
              <View style={styles.articleTag}>
                <Text style={styles.articleTagText}>{article.type || 'Article'}</Text>
              </View>
              {article.tags && (
                <Text style={styles.articleTags} numberOfLines={1}>{article.tags}</Text>
              )}
            </View>
            <Text style={styles.articleTitle} numberOfLines={2}>{article.title}</Text>
            <Text style={styles.articleExcerpt} numberOfLines={2}>{truncateText(article.excerpt, 120)}</Text>
            
            <View style={styles.articleFooter}>
              <View style={styles.articleMeta}>
                <View style={styles.metaItemSmall}>
                  <AntDesign name="clockcircleo" size={14} color={COLORS.accent} />
                  <Text style={styles.metaTextSmall}>
                    {article.read_time || '5'} {language.toUpperCase() === 'EN' ? 'min' : '分鐘'}
                  </Text>
                </View>
              </View>
              
              <View style={styles.readMoreButton}>
                <Text style={styles.readMoreText}>
                  {contentType === 'articles'
                    ? (language.toUpperCase() === 'EN' ? 'Read more' : '繼續閱讀')
                    : (language.toUpperCase() === 'EN' ? 'Watch now' : '立即觀看')}
                </Text>
                <AntDesign name="arrowright" size={16} color={COLORS.accent1} />
              </View>
            </View>
          </View>
          
          <View style={styles.articleImageWrapper}>
            {article.cover_image_url && (
              <Image
                source={{ uri: article.cover_image_url }}
                style={styles.articleImage}
                resizeMode="cover"
              />
            )}
            {contentType === 'videos' && (
              <View style={styles.smallPlayIcon}>
                <AntDesign name="playcircleo" size={26} color={COLORS.white} />
              </View>
            )}
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );

  // 改進空狀態顯示
  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <AntDesign 
        name={contentType === 'articles' ? "file1" : "videocamera"} 
        size={60} 
        color={COLORS.accent} 
      />
      <Text style={styles.emptyText}>
        {contentType === 'articles'
          ? (language.toUpperCase() === 'EN' ? 'No articles available' : '暫無可用文章')
          : (language.toUpperCase() === 'EN' ? 'No videos available' : '暫無可用視頻')}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />
      {renderHeader()}
      
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh}
            colors={[COLORS.primary]} 
            tintColor={COLORS.primary}
          />
        }
      >
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={COLORS.primary} />
            <Text style={styles.loadingText}>
              {language.toUpperCase() === 'EN' ? 'Loading content...' : '正在加載內容...'}
            </Text>
          </View>
        ) : articles.length > 0 ? (
          <>
            {renderCategoryTabs()}
            {renderFeaturedArticles()}
            {renderArticleList()}
          </>
        ) : (
          renderEmptyState()
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  container: {
    flexGrow: 1,
    paddingBottom: 30,
  },
  headerContainer: {
    width: '100%',
    elevation: 4,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  headerGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 18,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: COLORS.white,
    letterSpacing: 0.3,
  },
  searchButton: {
    padding: 8,
  },
  
  // 修復Toggle對齊問題
  toggleOuterContainer: {
    backgroundColor: COLORS.white,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  toggleContainer: {
    width: width - 40,
    borderRadius: 8,
    backgroundColor: COLORS.light,
    overflow: 'hidden',  // 確保滑塊不會超出容器
  },
  toggleWrapper: {
    flexDirection: 'row',
    position: 'relative',
    height: 44,
    borderRadius: 6,
  },
  toggleSlider: {
    position: 'absolute',
    width: '50%',
    height: 44,
    backgroundColor: COLORS.primary,
    zIndex: 1,
    borderRadius: 6,
  },
  toggleOption: {
    flex: 1,
    height: 44,
    justifyContent: 'center',
    zIndex: 2,
  },
  toggleInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
  toggleText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.secondary,
    marginLeft: 8,
    letterSpacing: 0.3,
    textAlign: 'center',
  },
  activeToggleText: {
    color: COLORS.white,
  },
  
  // 主要內容樣式
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    minHeight: 300,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 17,
    color: COLORS.accent,
    letterSpacing: 0.2,
  },
  // 改進空狀態顯示
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    marginTop: 100,  // 確保在頁面中部顯示
  },
  emptyText: {
    marginTop: 16,
    fontSize: 17,
    color: COLORS.accent,
    textAlign: 'center',
  },
  categoriesContainer: {
    paddingHorizontal: 20,
    paddingVertical: 18,
  },
  categoryTab: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 6,
    marginRight: 12,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.light,
  },
  selectedCategoryTab: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  categoryText: {
    fontSize: 15,
    fontWeight: '500',
    color: COLORS.secondary,
  },
  selectedCategoryText: {
    color: COLORS.white,
  },
  
  // 章節標題容器
  sectionTitleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 18,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.primary,
    letterSpacing: 0.2,
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewAllText: {
    fontSize: 15,
    color: COLORS.secondary,
    marginRight: 4,
  },
  
  // 精選文章區域
  featuredSection: {
    marginBottom: 32,
  },
  featuredScrollContainer: {
    paddingLeft: 20,
    paddingRight: 10,
  },
  featuredCard: {
    width: CARD_WIDTH,
    height: 260,
    marginRight: 12,
    borderRadius: 14,
    overflow: 'hidden',
    backgroundColor: COLORS.cardBg,
    elevation: 4,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  featuredImageContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  featuredImage: {
    ...StyleSheet.absoluteFillObject,
  },
  playIconOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  playIconCircle: {
    width: 66,
    height: 66,
    borderRadius: 33,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 3,
  },
  featuredGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '70%',
    zIndex: 9,
  },
  featuredContent: {
    padding: 18,
    zIndex: 11,
  },
  tagContainer: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  tag: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 5,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  tagText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  featuredTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.white,
    marginBottom: 8,
    letterSpacing: 0.3,
  },
  featuredExcerpt: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    lineHeight: 20,
    marginBottom: 12,
  },
  featuredMeta: {
    flexDirection: 'row',
    marginTop: 8,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 14,
  },
  metaText: {
    fontSize: 14,
    color: COLORS.light,
    marginLeft: 6,
  },
  
  // 文章列表區域
  articlesSection: {
    paddingHorizontal: 20,
  },
  articleCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.cardBg,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 3,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    height: ARTICLE_CARD_HEIGHT,
  },
  articleContentWrapper: {
    flex: 1,
    marginRight: 16,
    justifyContent: 'space-between',
    height: '100%',
  },
  articleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  articleTag: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 4,
    backgroundColor: COLORS.light,
  },
  articleTagText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: COLORS.secondary,
    letterSpacing: 0.5,
  },
  articleTags: {
    fontSize: 14,
    color: COLORS.accent,
    marginLeft: 8,
    flex: 1,
  },
  articleTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 8,
    letterSpacing: 0.2,
    lineHeight: 22,
  },
  articleExcerpt: {
    fontSize: 15,
    color: COLORS.secondary,
    lineHeight: 20,
  },
  articleFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  articleMeta: {
    flexDirection: 'row',
  },
  metaItemSmall: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaTextSmall: {
    fontSize: 13,
    color: COLORS.accent,
    marginLeft: 6,
  },
  readMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  readMoreText: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.accent1,
    marginRight: 6,
  },
  articleImageWrapper: {
    width: 120,
    height: 120,
    position: 'relative',
    borderRadius: 10,
    overflow: 'hidden',
    alignSelf: 'center',
  },
  articleImage: {
    width: '100%',
    height: '100%',
  },
  smallPlayIcon: {
    position: 'absolute',
    right: 6,
    bottom: 6,
  },
});

export default ExploreScreen;