import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ScrollView,
} from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.85;
const ARTICLE_CARD_HEIGHT = 160; 

// Updated color system with black, white, and green
const COLORS = {
  primary: '#000000',          // Black
  secondary: '#222222',        // Dark gray (nearly black)
  accent: '#2E8B57',           // Sea Green
  highlight: '#3CB371',        // Medium Sea Green (lighter green)
  light: '#E0E0E0',            // Light gray
  lighter: '#F5F5F5',          // Very light gray
  white: '#FFFFFF',            // White
  background: '#FFFFFF',       // White background
  cardBg: '#FFFFFF',           // White card background
  shadow: 'rgba(0, 0, 0, 0.12)', // Shadow
  accent1: '#2E8B57',          // Sea Green (same as accent)
};

const ArticlesList = ({ articles, featuredArticles, language, contentType, navigation }) => {

  const truncateText = (text, maxLength) => {
    if (!text) return '';
    return text.length > maxLength ? text.slice(0, maxLength) + '...' : text;
  };

  // 渲染精選文章區域
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
          <AntDesign name="right" size={16} color={COLORS.accent} />
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
      {articles.map((article, index) => (
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
                <AntDesign name="arrowright" size={16} color={COLORS.accent} />
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
    <>
      {articles.length > 0 ? (
        <>
          {renderFeaturedArticles()}
          {renderArticleList()}
        </>
      ) : (
        renderEmptyState()
      )}
    </>
  );
};

const styles = StyleSheet.create({
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
    color: COLORS.accent,
    marginRight: 4,
  },

  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    marginTop: 100,  
  },
  emptyText: {
    marginTop: 16,
    fontSize: 17,
    color: COLORS.accent,
    textAlign: 'center',
  },
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
    backgroundColor: COLORS.accent, // Changed from rgba(255, 255, 255, 0.2) to accent green
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
    backgroundColor: COLORS.lighter, // Kept light background for contrast
  },
  articleTagText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: COLORS.accent, // Changed from secondary to green accent
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
    color: COLORS.accent, // Changed from accent1 (blue) to accent (green)
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

export default ArticlesList;