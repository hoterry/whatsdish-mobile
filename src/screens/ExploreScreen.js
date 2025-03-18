import React, { useState, useEffect, useContext, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  RefreshControl,
  ActivityIndicator,
  Dimensions,
  Animated,
  Platform
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import _ from 'lodash';
import { LanguageContext } from '../context/LanguageContext';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.9;
const CARD_HEIGHT = 200;

const ExploreScreen = () => {
  const navigation = useNavigation();
  const { language } = useContext(LanguageContext);
  const [content, setContent] = useState([]);
  const [featuredContent, setFeaturedContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  const scrollY = new Animated.Value(0);
  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [1, 0.2],
    extrapolate: 'clamp'
  });

  const fetchContent = async () => {
    try {
      setError(null);
      const request = await fetch(
        "https://origineer.sheetdb.io/api/v1/ij73hup2r94z5?sheet=content"
      );
      
      if (!request.ok) {
        throw new Error('Network request failed');
      }
      
      let data = await request.json();
      
      // Filter data based on language and published status
      data = _.filter(data, { language, isPublished: "TRUE" });
      
      // Organize data 
      const allCategories = _.uniq(data.map(item => item.category));
      setCategories(['All', ...allCategories]);
      
      // Set featured content (items marked as featured)
      const featured = data.filter(item => item.isFeatured === "TRUE");
      setFeaturedContent(featured);
      
      // Set all content
      setContent(data);
      
      if (__DEV__) {
        console.log(`[Explore Screen Log] Fetched ${data.length} items for language: ${language}`);
        console.log(`[Explore Screen Log] Found ${featured.length} featured items`);
        console.log(`[Explore Screen Log] Categories: ${allCategories.join(', ')}`);
      }
      
    } catch (err) {
      console.error('[Explore Screen Log] Error fetching content:', err);
      setError('Failed to load content. Please try again later.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchContent();
    }, [language])
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchContent();
  };

  const renderFeaturedItem = ({ item, index }) => {
    const isFirst = index === 0;
    const isLast = index === featuredContent.length - 1;
    
    return (
      <TouchableOpacity
        style={[
          styles.featuredCard,
          isFirst && { marginLeft: 20 },
          isLast && { marginRight: 20 }
        ]}
        onPress={() => navigation.navigate('ContentDetail', { item })}
        activeOpacity={0.8}
      >
        <Image
          source={{ uri: item.imageUrl || 'https://via.placeholder.com/300' }}
          style={styles.featuredImage}
          resizeMode="cover"
        />
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.8)']}
          style={styles.gradient}
        >
          <View style={styles.featuredContent}>
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryText}>{item.category}</Text>
            </View>
            <Text style={styles.featuredTitle} numberOfLines={2}>
              {item.title}
            </Text>
            <Text style={styles.featuredSubtitle} numberOfLines={1}>
              {item.subtitle}
            </Text>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    );
  };

  const renderCategoryPill = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.categoryPill,
        selectedCategory === item && styles.categoryPillSelected
      ]}
      onPress={() => setSelectedCategory(item)}
    >
      <Text
        style={[
          styles.categoryPillText,
          selectedCategory === item && styles.categoryPillTextSelected
        ]}
      >
        {item}
      </Text>
    </TouchableOpacity>
  );

  const renderContentItem = ({ item }) => {
    return (
      <TouchableOpacity
        style={styles.contentCard}
        onPress={() => navigation.navigate('ContentDetail', { item })}
        activeOpacity={0.7}
      >
        <Image
          source={{ uri: item.imageUrl || 'https://via.placeholder.com/150' }}
          style={styles.contentImage}
          resizeMode="cover"
        />
        <View style={styles.contentInfo}>
          <View style={styles.contentMeta}>
            <View style={styles.smallCategoryBadge}>
              <Text style={styles.smallCategoryText}>{item.category}</Text>
            </View>
            {item.timeToRead && (
              <Text style={styles.timeToRead}>{item.timeToRead} min</Text>
            )}
          </View>
          <Text style={styles.contentTitle} numberOfLines={2}>
            {item.title}
          </Text>
          <Text style={styles.contentDescription} numberOfLines={2}>
            {item.description}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const filteredContent = selectedCategory === 'All'
    ? content
    : content.filter(item => item.category === selectedCategory);

  // Empty state component for when no content is found
  const EmptyState = () => (
    <View style={styles.emptyState}>
      <MaterialIcons name="search-off" size={64} color="#d0d0d0" />
      <Text style={styles.emptyStateTitle}>
        {language === 'ZH' ? '沒有找到內容' : 'No content found'}
      </Text>
      <Text style={styles.emptyStateDescription}>
        {language === 'ZH' 
          ? '嘗試選擇不同的類別或刷新頁面' 
          : 'Try selecting a different category or refresh the page'}
      </Text>
      <TouchableOpacity 
        style={styles.refreshButton}
        onPress={onRefresh}
      >
        <Text style={styles.refreshButtonText}>
          {language === 'ZH' ? '刷新' : 'Refresh'}
        </Text>
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#000" />
        <Text style={styles.loadingText}>
          {language === 'ZH' ? '正在加載精彩內容...' : 'Loading exciting content...'}
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      
      {/* Animated Header */}
      <Animated.View style={[styles.header, { opacity: headerOpacity }]}>
        <Text style={styles.headerTitle}>
          {language === 'ZH' ? '探索' : 'Explore'}
        </Text>
        <TouchableOpacity style={styles.searchButton} onPress={() => navigation.navigate('Search')}>
          <Ionicons name="search" size={24} color="#000" />
        </TouchableOpacity>
      </Animated.View>
      
      {error ? (
        <View style={styles.errorContainer}>
          <MaterialIcons name="error-outline" size={48} color="#ff6b6b" />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={fetchContent}>
            <Text style={styles.retryButtonText}>
              {language === 'ZH' ? '重試' : 'Retry'}
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <Animated.FlatList
          data={filteredContent}
          keyExtractor={(item, index) => `content-${item.id || index}`}
          renderItem={renderContentItem}
          contentContainerStyle={styles.contentList}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          ListEmptyComponent={EmptyState}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: true }
          )}
          scrollEventThrottle={16}
          ListHeaderComponent={
            <>
              {featuredContent.length > 0 && (
                <View style={styles.featuredSection}>
                  <Text style={styles.sectionTitle}>
                    {language === 'ZH' ? '精選內容' : 'Featured'}
                  </Text>
                  <FlatList
                    horizontal
                    data={featuredContent}
                    keyExtractor={(item, index) => `featured-${item.id || index}`}
                    renderItem={renderFeaturedItem}
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.featuredList}
                    snapToInterval={CARD_WIDTH + 15}
                    decelerationRate="fast"
                    pagingEnabled
                  />
                </View>
              )}

              <View style={styles.categoriesSection}>
                <FlatList
                  horizontal
                  data={categories}
                  keyExtractor={(item, index) => `category-${index}`}
                  renderItem={renderCategoryPill}
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.categoriesList}
                />
              </View>

              {filteredContent.length > 0 && (
                <Text style={styles.sectionTitle}>
                  {selectedCategory === 'All'
                    ? (language === 'ZH' ? '所有內容' : 'All Content')
                    : selectedCategory}
                </Text>
              )}
            </>
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    marginTop: 12,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#555',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  searchButton: {
    height: 44,
    width: 44,
    borderRadius: 22,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  featuredSection: {
    marginTop: Platform.OS === 'ios' ? 110 : 90,
    paddingVertical: 10,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginHorizontal: 20,
    marginBottom: 15,
    marginTop: 5,
  },
  featuredList: {
    paddingRight: 5,
  },
  featuredCard: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    marginRight: 15,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#f0f0f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  featuredImage: {
    width: '100%',
    height: '100%',
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '70%',
    borderRadius: 16,
  },
  featuredContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 15,
  },
  categoryBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#000',
  },
  featuredTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  featuredSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.85)',
  },
  categoriesSection: {
    marginVertical: 15,
  },
  categoriesList: {
    paddingHorizontal: 15,
  },
  categoryPill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginHorizontal: 5,
    backgroundColor: '#f0f0f0',
  },
  categoryPillSelected: {
    backgroundColor: '#000',
  },
  categoryPillText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#555',
  },
  categoryPillTextSelected: {
    color: '#fff',
  },
  contentList: {
    paddingBottom: 30,
  },
  contentCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  contentImage: {
    width: 100,
    height: 100,
    borderRadius: 12,
  },
  contentInfo: {
    flex: 1,
    padding: 12,
  },
  contentMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  smallCategoryBadge: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  smallCategoryText: {
    fontSize: 10,
    fontWeight: '500',
    color: '#555',
  },
  timeToRead: {
    fontSize: 12,
    color: '#888',
  },
  contentTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#000',
  },
  contentDescription: {
    fontSize: 13,
    color: '#666',
    lineHeight: 18,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#000',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 100,
    paddingHorizontal: 20,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
    color: '#333',
  },
  emptyStateDescription: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
    marginBottom: 24,
  },
  refreshButton: {
    backgroundColor: '#000',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  refreshButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ExploreScreen;