import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, StyleSheet, Dimensions } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.85;

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

const FeaturedArticles = ({ articles, contentType, language, navigation, onViewAll }) => {
  // Helper function for truncating text
  const truncateText = (text, maxLength) => {
    if (!text) return '';
    return text.length > maxLength ? text.slice(0, maxLength) + '...' : text;
  };

  return (
    <View style={styles.featuredSection}>
      <View style={styles.sectionTitleContainer}>
        <Text style={styles.sectionTitle}>
          {contentType === 'articles' 
            ? (language.toUpperCase() === 'EN' ? 'Featured Articles' : '精選文章')
            : (language.toUpperCase() === 'EN' ? 'Featured Videos' : '精選視頻')}
        </Text>
        <TouchableOpacity style={styles.viewAllButton} onPress={onViewAll}>
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
        {articles.length > 0 ? (
          articles.map((article, index) => (
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
};

const styles = StyleSheet.create({
  featuredSection: {
    marginBottom: 24,
  },
  sectionTitleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.primary,
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewAllText: {
    fontSize: 14,
    color: COLORS.secondary,
    marginRight: 4,
  },
  featuredScrollContainer: {
    paddingLeft: 16,
    paddingRight: 8,
  },
  featuredCard: {
    width: CARD_WIDTH,
    marginRight: 16,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: COLORS.cardBg,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  featuredImageContainer: {
    position: 'relative',
    height: 200,
  },
  featuredImage: {
    width: '100%',
    height: '100%',
  },
  playIconOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
  playIconCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  featuredGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '70%',
    zIndex: 1,
  },
  featuredContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    zIndex: 2,
  },
  tagContainer: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  tag: {
    backgroundColor: COLORS.accent1,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  tagText: {
    color: COLORS.white,
    fontSize: 10,
    fontWeight: '600',
  },
  featuredTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.white,
    marginBottom: 8,
  },
  featuredExcerpt: {
    fontSize: 14,
    color: COLORS.light,
    marginBottom: 12,
  },
  featuredMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  metaText: {
    color: COLORS.light,
    fontSize: 12,
    marginLeft: 4,
  },
  noFeaturedContent: {
    width: CARD_WIDTH,
    height: 200,
    backgroundColor: COLORS.lighter,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noFeaturedText: {
    color: COLORS.accent,
    fontSize: 16,
  },
});

export default FeaturedArticles;