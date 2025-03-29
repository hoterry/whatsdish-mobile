import React, { useEffect, useState, useContext, useCallback, useRef } from 'react';
import {
  View,
  Text,
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
import { LanguageContext } from '../../context/LanguageContext';
import { AntDesign, Feather, Ionicons } from '@expo/vector-icons';
import CLVideoGridComponent from './CLVideoGridComponent';
import CLArticleCard from './CLArticleCard';
import CLFeaturedArticles from './CLFeaturedArticles';
import CLExploreHeader from './CLExploreHeader';
import CLCategoryTabs from './CLCategoryTabs';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.85;
const ARTICLE_CARD_HEIGHT = 160;
const FEATURED_ARTICLES_COUNT = 3;
const HEADER_GRADIENT_HEIGHT = 110;
const TOGGLE_HEIGHT = 60;
const HEADER_MAX_HEIGHT = HEADER_GRADIENT_HEIGHT + TOGGLE_HEIGHT;
const HEADER_MIN_HEIGHT = HEADER_GRADIENT_HEIGHT;
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

const CLExploreScreen = ({ navigation }) => {
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
      
      if (filtered.length > 0) {
        global.videoEvents.setProcessedVideos(filtered);
        console.log('Set processed videos to global.videoEvents, count:', filtered.length);
      }
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
    console.error('[CLExploreScreen Error] Failed to fetch articles:', error);
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

  const renderCategoryTabs = () => (
    <CLCategoryTabs
      categories={categories}
      selectedCategory={selectedCategory}
      onSelectCategory={setSelectedCategory}
    />
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
  <CLFeaturedArticles
    articles={featuredArticles}
    contentType={contentType}
    language={language}
    navigation={navigation}
    onViewAll={() => {
      console.log('View all articles clicked');
    }}
  />
);
  
  const renderArticleList = () => (
    <View style={styles.articlesSection}>
      <View style={styles.sectionTitleContainer}>
        <Text style={styles.sectionTitle}>
          {language.toUpperCase() === 'EN' ? 'Latest Articles' : '最新文章'}
        </Text>
      </View>
      {filteredArticles.map((article, index) => (
        <CLArticleCard
          key={index}
          article={article}
          language={language}
          onPress={() => navigation && navigation.navigate('CLArticleDetail', { article })}
        />
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
        <CLVideoGridComponent 
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
      
      <CLExploreHeader
        language={language}
        contentType={contentType}
        toggleContentType={toggleContentType}
        scrollY={scrollY}
        slideAnimation={slideAnimation}
        onSearchPress={() => {
          console.log('Search button pressed');
        }}
      />
      
      <SectionList
        sections={getSectionData()}
        keyExtractor={(item, index) => String(index)}
        renderItem={({ section, item }) => renderSection({ section, item })}
        renderSectionHeader={() => null}
        contentContainerStyle={[
          styles.container,
          { paddingTop: 0 }
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    minHeight: 300,
    marginTop: HEADER_GRADIENT_HEIGHT,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 17,
    color: COLORS.accent,
    letterSpacing: 0.2,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    marginTop: 100 + HEADER_GRADIENT_HEIGHT,
  },
  emptyText: {
    marginTop: 16,
    fontSize: 17,
    color: COLORS.accent,
    textAlign: 'center',
  },
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
  articlesSection: {
    paddingHorizontal: 20,
  }
});

export default CLExploreScreen;