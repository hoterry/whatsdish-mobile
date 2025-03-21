import React, { useEffect, useState, useContext, useCallback, useRef } from 'react';
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
  Animated,
  SectionList
} from 'react-native';
import _ from 'lodash';
import { LanguageContext } from '../context/LanguageContext';
import { LinearGradient } from 'expo-linear-gradient';
import { AntDesign, Feather, Ionicons } from '@expo/vector-icons';
import VideoGridComponent from '../components/VideoGridComponent';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.85;
const ARTICLE_CARD_HEIGHT = 160;
const FEATURED_ARTICLES_COUNT = 3;
const HEADER_GRADIENT_HEIGHT = 110; // Increased height to account for the additional padding
const TOGGLE_HEIGHT = 60; // Height of the toggle part that will collapse
const HEADER_MAX_HEIGHT = HEADER_GRADIENT_HEIGHT + TOGGLE_HEIGHT; // Total header height
const HEADER_MIN_HEIGHT = HEADER_GRADIENT_HEIGHT; // Minimum height (only the fixed part)
const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

// Color system
const COLORS = {
  primary: '#000000',
  secondary: '#222222',
  accent: '#444444',
  highlight: '#666666',
  light: '#E0E0E0',
  lighter: '#F5F5F5',
  white: '#FFFFFF',
  background: '#FAFAFA',
  cardBg: '#FFFFFF',
  shadow: 'rgba(0, 0, 0, 0.12)',
  accent1: '#1A73E8',
};

const ExploreScreen = ({ navigation }) => {
  const { language } = useContext(LanguageContext);
  const [articles, setArticles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [featuredArticles, setFeaturedArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  // Content type state
  const [contentType, setContentType] = useState('articles');
  const slideAnimation = useState(new Animated.Value(0))[0];
  
  // Scroll animations
  const scrollY = useRef(new Animated.Value(0)).current;
  
  // Calculate header scroll distance
  const HEADER_SCROLL_DISTANCE = TOGGLE_HEIGHT;

  // Fetch articles function
  const fetchArticles = useCallback(async () => {
    try {
      console.log(`Fetching ${contentType === 'videos' ? 'videos' : 'articles'} data...`);
      
      const response = await fetch(
        'https://origineer.sheetdb.io/api/v1/ij73hup2r94z5?sheet=content'
      );
      let data = await response.json();
      
      // Language mapping
      let mappedLanguage;
      if (language.toUpperCase() === 'EN') {
        mappedLanguage = 'en';
      } else if (language.toUpperCase() === 'ZH') {
        mappedLanguage = 'zh-hant';
      } else {
        mappedLanguage = language.toLowerCase();
      }
      
      // Process data based on content type
      let filtered = [];
      
      if (contentType === 'videos') {
        // Video mode: filter for video type content
        const videoItems = _.filter(data, (item) => {
          const isVideo = item.type && item.type.toLowerCase().includes('video');
          return isVideo;
        });
        
        // Process video data for display
        filtered = videoItems.map(item => {
          const videoItem = { ...item };
          
          // Handle cover image
          if (!videoItem.cover_image_url && videoItem.video_url) {
            if (videoItem.video_url.includes('cloudinary.com')) {
              videoItem.cover_image_url = videoItem.video_url
                .replace('/video/upload/', '/video/upload/so_0,w_640,h_360,c_fill,q_80/')
                .replace('.mp4', '.jpg');
            } else {
              videoItem.cover_image_url = 'https://via.placeholder.com/640x360?text=Video';
            }
          }
          
          // Handle title and excerpt
          if (!videoItem.title && videoItem.content) {
            const firstLine = videoItem.content.split('\n')[0];
            videoItem.title = firstLine.length > 60 ? firstLine.substring(0, 60) + '...' : firstLine;
          }
          
          if (!videoItem.excerpt && videoItem.content) {
            videoItem.excerpt = videoItem.content.length > 120 ? videoItem.content.substring(0, 120) + '...' : videoItem.content;
          }
          
          // Set default read time
          if (!videoItem.read_time) {
            videoItem.read_time = '2';
          }
          
          // Add data for video grid layout
          videoItem.location = videoItem.title;
          videoItem.author = videoItem.creator || 'user' + Math.floor(Math.random() * 1000);
          videoItem.likes = Math.floor(Math.random() * 50);
          videoItem.dislikes = Math.floor(Math.random() * 10);
          videoItem.view_count = Math.floor(Math.random() * 10000);
          videoItem.avatar_url = `https://api.dicebear.com/7.x/adventurer/png?seed=${videoItem.author}`;
          
          // Extract overlay text
          if (videoItem.content) {
            const lines = videoItem.content.split('\n');
            if (lines.length > 1) {
              videoItem.overlay_text = lines[1] || '';
            }
          }
          
          return videoItem;
        });
      } else {
        // Article mode: filter by language and published status
        filtered = _.filter(data, (item) => {
          return item.language?.toLowerCase() === mappedLanguage && 
                 item.is_published === 'TRUE' &&
                 (!item.type || item.type.toLowerCase() !== 'video');
        });
      }
      
      // Extract and deduplicate categories
      const allCategories = filtered
        .map(item => item.categories ? item.categories.split(', ') : [])
        .flat()
        .filter(Boolean);
      const uniqueCategories = ['All', ...new Set(allCategories)];
      setCategories(uniqueCategories);
      
      // Sort by creation date
      const sortedArticles = _.sortBy(filtered, item => -new Date(item.created_at_display || Date.now()));
      
      setFeaturedArticles(sortedArticles.slice(0, FEATURED_ARTICLES_COUNT));
      setArticles(sortedArticles);
      
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

  // Toggle content type
  const toggleContentType = (type) => {
    if (type === contentType) return;
    
    setLoading(true);
    setContentType(type);
    
    // Animation effect
    Animated.timing(slideAnimation, {
      toValue: type === 'articles' ? 0 : 1,
      duration: 300,
      useNativeDriver: true
    }).start();
  };

  // Filter articles by category
  const filteredArticles = selectedCategory === 'All' 
    ? articles 
    : articles.filter(article => {
        const articleCategories = article.categories ? article.categories.split(', ') : [];
        return articleCategories.includes(selectedCategory);
      });

  // Helper functions
  const truncateText = (text, maxLength) => {
    if (!text) return '';
    return text.length > maxLength ? text.slice(0, maxLength) + '...' : text;
  };

  // COMPONENT RENDERERS
  const renderHeader = () => (
    <View style={styles.headerContainer}>
      {/* Fixed gradient header part that always stays visible */}
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
      
      {/* Collapsible toggle part */}
      <Animated.View 
        style={[
          styles.toggleOuterContainer,
          {
            height: scrollY.interpolate({
              inputRange: [0, TOGGLE_HEIGHT],
              outputRange: [TOGGLE_HEIGHT, 0],
              extrapolate: 'clamp',
            }),
            opacity: scrollY.interpolate({
              inputRange: [0, TOGGLE_HEIGHT * 0.6],  // Make opacity fade faster
              outputRange: [1, 0],
              extrapolate: 'clamp',
            }),
            overflow: 'hidden',
            borderBottomWidth: scrollY.interpolate({
              inputRange: [0, TOGGLE_HEIGHT * 0.3],
              outputRange: [1, 0],  // Remove border when collapsed
              extrapolate: 'clamp',
            }),
            borderBottomColor: COLORS.light,
          }
        ]}
      >
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
      </Animated.View>
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

  // PREPARE SECTION DATA
  const getSectionData = () => {
    if (loading) {
      return [
        {
          title: 'loading',
          data: [{ type: 'loading' }]
        }
      ];
    }
    
    if (articles.length === 0) {
      return [
        {
          title: 'empty',
          data: [{ type: 'empty' }]
        }
      ];
    }
    
    let sections = [
      {
        title: 'categories',
        data: [{ type: 'categories' }]
      }
    ];
    
    // Only add featured section for articles, not for videos
    if (contentType === 'articles') {
      sections.push({
        title: 'featured',
        data: [{ type: 'featured' }]
      });
    }
    
    if (contentType === 'videos') {
      sections.push({
        title: 'videoGrid',
        data: [{ type: 'videoGrid', videos: filteredArticles }]
      });
    } else {
      sections.push({
        title: 'articles',
        data: [{ type: 'articles' }]
      });
    }
    
    return sections;
  };

  // SECTION RENDERERS
  const renderLoading = () => (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color={COLORS.primary} />
      <Text style={styles.loadingText}>
        {language.toUpperCase() === 'EN' ? 'Loading content...' : '正在加載內容...'}
      </Text>
    </View>
  );
  
  const renderEmpty = () => (
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
  
  const renderFeatured = () => (
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
        nestedScrollEnabled={true}
      >
        {featuredArticles.length > 0 ? (
          featuredArticles.map((article, index) => (
            <TouchableOpacity 
              key={index}
              style={styles.featuredCard}
              onPress={() => {
                navigation && navigation.navigate('ArticleDetail', { article });
              }}
            >
              <View style={styles.featuredImageContainer}>
                <Image
                  source={{ uri: article.cover_image_url || 'https://via.placeholder.com/640x360?text=Preview' }}
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
                      <Text style={styles.tagText}>{article.type || (contentType === 'videos' ? 'Video' : 'Article')}</Text>
                    </View>
                  </View>
                  <Text style={styles.featuredTitle}>{article.title || '無標題'}</Text>
                  <Text style={styles.featuredExcerpt}>{truncateText(article.excerpt || article.content, 100)}</Text>
                  <View style={styles.featuredMeta}>
                    <View style={styles.metaItem}>
                      <AntDesign name={contentType === 'videos' ? "videocamera" : "clockcircleo"} size={14} color={COLORS.light} />
                      <Text style={styles.metaText}>
                        {article.read_time || (contentType === 'videos' ? '2' : '5')} {language.toUpperCase() === 'EN' ? 'min' : '分鐘'}
                      </Text>
                    </View>
                    <View style={styles.metaItem}>
                      <AntDesign name="calendar" size={14} color={COLORS.light} />
                      <Text style={styles.metaText}>
                        {article.created_at_display || '2025-03-21'}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          ))
        ) : (
          <View style={styles.noFeaturedContent}>
            <Text style={styles.noFeaturedText}>
              {contentType === 'articles'
                ? (language.toUpperCase() === 'EN' ? 'No featured articles' : '暫無精選文章')
                : (language.toUpperCase() === 'EN' ? 'No featured videos' : '暫無精選視頻')}
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
  
  const renderArticleList = () => (
    <View style={styles.articlesSection}>
      <View style={styles.sectionTitleContainer}>
        <Text style={styles.sectionTitle}>
          {language.toUpperCase() === 'EN' ? 'Latest Articles' : '最新文章'}
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
            <Text style={styles.articleTitle} numberOfLines={2}>{article.title || '無標題'}</Text>
            <Text style={styles.articleExcerpt} numberOfLines={2}>{truncateText(article.excerpt || article.content, 120)}</Text>
            
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
                  {language.toUpperCase() === 'EN' ? 'Read more' : '繼續閱讀'}
                </Text>
                <AntDesign name="arrowright" size={16} color={COLORS.accent1} />
              </View>
            </View>
          </View>
          
          <View style={styles.articleImageWrapper}>
            <Image
              source={{ uri: article.cover_image_url || 'https://via.placeholder.com/640x360?text=Preview' }}
              style={styles.articleImage}
              resizeMode="cover"
            />
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );

  // RENDER THE SECTION LIST
  const renderSection = ({ section, item }) => {
    if (section.title === 'loading') {
      return renderLoading();
    } else if (section.title === 'empty') {
      return renderEmpty();
    } else if (section.title === 'categories') {
      return renderCategoryTabs();
    } else if (section.title === 'featured') {
      // Only render featured section for articles
      if (contentType === 'articles') {
        return renderFeatured();
      }
      return null;
    } else if (section.title === 'videoGrid') {
      return (
        <VideoGridComponent 
          videos={item.videos} 
          navigation={navigation}
          language={language}
        />
      );
    } else if (section.title === 'articles') {
      return renderArticleList();
    }
    return null;
  };

  // Handle scroll events to animate header
  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
    { useNativeDriver: false }
  );

  return (
    <SafeAreaView style={[styles.safeArea, { paddingTop: 0 }]}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
      
      {/* Render header outside of the SectionList */}
      {renderHeader()}
      
      <SectionList
        sections={getSectionData()}
        keyExtractor={(item, index) => String(index)}
        renderItem={({ section, item }) => renderSection({ section, item })}
        renderSectionHeader={() => null}
        contentContainerStyle={[
          styles.container,
          { paddingTop: 0 } // Remove top padding as the header is outside
        ]}
        showsVerticalScrollIndicator={false}
        stickySectionHeadersEnabled={false}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh}
            colors={[COLORS.primary]} 
            tintColor={COLORS.primary}
          />
        }
        onScroll={handleScroll}
        scrollEventThrottle={16}
      />
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
    zIndex: 10,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.white, // Ensure background is consistent
  },
  headerGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 18,
    paddingTop: Platform.OS === 'ios' ? 50 : 30, // Add more padding at the top to move header down
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

  toggleOuterContainer: {
    backgroundColor: COLORS.white,
    paddingVertical: 0,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.light,
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
    marginTop: HEADER_GRADIENT_HEIGHT, // Add margin for fixed header only
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
    marginTop: 100 + HEADER_GRADIENT_HEIGHT,  // Add fixed header height only
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
    marginTop: HEADER_GRADIENT_HEIGHT, // Add margin to account for fixed header only
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
  // For no featured content
  noFeaturedContent: {
    width: CARD_WIDTH,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.lighter,
    borderRadius: 14,
    marginRight: 12,
  },
  noFeaturedText: {
    fontSize: 16,
    color: COLORS.accent,
  }
});

export default ExploreScreen;