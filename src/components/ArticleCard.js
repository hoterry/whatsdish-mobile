import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { AntDesign } from '@expo/vector-icons';

// Color system - 保持與父組件相同的顏色系統
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

const ArticleCard = ({ article, onPress, language }) => {
  // Helper function for truncating text
  const truncateText = (text, maxLength) => {
    if (!text) return '';
    return text.length > maxLength ? text.slice(0, maxLength) + '...' : text;
  };

  return (
    <TouchableOpacity
      style={styles.articleCard}
      onPress={onPress}
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
        <Text style={styles.articleExcerpt} numberOfLines={2}>
          {truncateText(article.excerpt || article.content, 120)}
        </Text>
        
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
  );
};

const styles = StyleSheet.create({
  articleCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.cardBg,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
    overflow: 'hidden',
    height: 160, // 保持與原ARTICLE_CARD_HEIGHT常量一致
  },
  articleContentWrapper: {
    flex: 3,
    padding: 12,
    justifyContent: 'space-between',
  },
  articleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  articleTag: {
    backgroundColor: COLORS.accent1,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginRight: 8,
  },
  articleTagText: {
    color: COLORS.white,
    fontSize: 10,
    fontWeight: '600',
  },
  articleTags: {
    color: COLORS.accent,
    fontSize: 12,
    flex: 1,
  },
  articleTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.primary,
    marginBottom: 4,
  },
  articleExcerpt: {
    fontSize: 14,
    color: COLORS.secondary,
    marginBottom: 8,
    flex: 1,
  },
  articleFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  articleMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaItemSmall: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
  },
  metaTextSmall: {
    color: COLORS.accent,
    fontSize: 12,
    marginLeft: 4,
  },
  readMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  readMoreText: {
    color: COLORS.accent1,
    fontSize: 14,
    fontWeight: '500',
    marginRight: 4,
  },
  articleImageWrapper: {
    flex: 2,
  },
  articleImage: {
    width: '100%',
    height: '100%',
    borderTopRightRadius: 12,
    borderBottomRightRadius: 12,
  },
});

export default ArticleCard;