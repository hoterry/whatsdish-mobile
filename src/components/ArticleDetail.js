
import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Share,
  Dimensions,
  ActivityIndicator,
  Platform
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { AntDesign } from '@expo/vector-icons';
import Markdown from 'react-native-markdown-display';
import { LanguageContext } from '../context/LanguageContext';

const { width, height } = Dimensions.get('window');

const COLORS = {
  primary: '#000000',
  secondary: '#222222',
  accent: '#2E8B57',
  highlight: '#3CB371',
  light: '#E0E0E0',
  lighter: '#F5F5F5',
  white: '#FFFFFF',
  background: '#FAFAFA',
  cardBg: '#FFFFFF',
  shadow: 'rgba(0, 0, 0, 0.12)',
  overlay: 'rgba(0, 0, 0, 0.75)',
  overlaySoft: 'rgba(0, 0, 0, 0.5)',
  accent1: '#2E8B57',
  accent2: '#2E8B57',
  goldStar: '#FFD700',
};

const ArticleDetail = ({ route, navigation }) => {
  const { article } = route.params || {};
  const { language } = useContext(LanguageContext);
  const [loading, setLoading] = useState(true);
  const [relatedArticles, setRelatedArticles] = useState([]);
  const [bookmarked, setBookmarked] = useState(false);
  const [readTime, setReadTime] = useState('5 min');

  useEffect(() => {
    if (article?.content) {
      const words = article.content.split(/\s+/).length;
      const minutes = Math.round(words / 200);
      setReadTime(`${Math.max(1, minutes)} ${language.toUpperCase() === 'EN' ? 'min' : '分鐘'}`);
    }
  }, [article, language]);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 500);
    
    setRelatedArticles([
      {
        id: 1,
        title: language.toUpperCase() === 'EN' ? 'Related Article Example' : '相關文章標題示例',
        excerpt: language.toUpperCase() === 'EN' ? 'This is a brief summary of a related article.' : '這是一個相關文章的簡短摘要，說明文章的主要內容和重點。',
        cover_image_url: 'https://via.placeholder.com/300',
        type: language.toUpperCase() === 'EN' ? 'Blog' : '部落格'
      },
      {
        id: 2,
        title: language.toUpperCase() === 'EN' ? 'Another Related Video Content' : '另一篇相關視頻內容',
        excerpt: language.toUpperCase() === 'EN' ? 'This is a brief summary of another related video.' : '這是另一個相關視頻的簡短摘要，包含視頻的主要內容介紹。',
        cover_image_url: 'https://via.placeholder.com/300',
        type: language.toUpperCase() === 'EN' ? 'Video' : '視頻'
      }
    ]);
  }, [article, language]);

  const toggleBookmark = () => {
    setBookmarked(!bookmarked);
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `${article.title}\n\n${article.excerpt || ''}\n\n${language.toUpperCase() === 'EN' ? 'Read full article' : '閱讀全文'}`,
      });
    } catch (error) {
      console.error('Error sharing article:', error);
    }
  };

  const handleGoBack = () => {
    navigation.goBack();
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return '';
      
      return date.toLocaleDateString(language.toUpperCase() === 'EN' ? 'en-US' : 'zh-TW', {
        year: 'numeric', 
        month: 'long', 
        day: 'numeric'
      });
    } catch (e) {
      return '';
    }
  };

  const renderHeader = () => (
    <View style={styles.headerSection}>
      <Image
        source={{ uri: article.cover_image_url || 'https://via.placeholder.com/800x400' }}
        style={styles.headerImage}
        resizeMode="cover"
      />
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.5)', COLORS.overlay]}
        locations={[0, 0.6, 1]}
        style={styles.headerGradient}
      />
      
      <SafeAreaView style={styles.headerControls}>
        <TouchableOpacity 
          style={styles.iconButton}
          onPress={handleGoBack}
        >
          <AntDesign name="arrowleft" size={24} color={COLORS.white} />
        </TouchableOpacity>
        
        <View style={styles.headerRightControls}>
          <TouchableOpacity 
            style={styles.iconButton}
            onPress={toggleBookmark}
          >
            <AntDesign 
              name={bookmarked ? "star" : "staro"} 
              size={24} 
              color={bookmarked ? COLORS.goldStar : COLORS.white} 
            />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.iconButton}
            onPress={handleShare}
          >
            <AntDesign name="sharealt" size={24} color={COLORS.white} />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
      
      <View style={styles.headerContent}>
        <View style={styles.tagRow}>
          <View style={styles.tag}>
            <Text style={styles.tagText}>{article.type || (language.toUpperCase() === 'EN' ? 'Article' : '文章')}</Text>
          </View>
          
          <View style={styles.timeToRead}>
            <AntDesign name="clockcircleo" size={14} color={COLORS.light} />
            <Text style={styles.timeToReadText}>{readTime}</Text>
          </View>
        </View>
        
        <Text style={styles.articleTitle}>{article.title}</Text>
        
        <Text style={styles.articleExcerpt}>{article.excerpt}</Text>
        
        <View style={styles.articleMeta}>
          {article.created_at_display && (
            <View style={styles.metaItem}>
              <AntDesign name="calendar" size={16} color={COLORS.light} />
              <Text style={styles.metaText}>
                {formatDate(article.created_at_display)}
              </Text>
            </View>
          )}
          
          {article.tags && (
            <View style={styles.metaItem}>
              <AntDesign name="tags" size={16} color={COLORS.light} />
              <Text style={styles.metaText}>{article.tags}</Text>
            </View>
          )}
        </View>
      </View>
    </View>
  );

  const markdownStyles = {
    body: {
      color: COLORS.primary,
      fontSize: 18,
      lineHeight: 30,
    },
    heading1: {
      fontSize: 28,
      marginTop: 32,
      marginBottom: 16,
      fontWeight: 'bold',
      color: COLORS.primary,
      letterSpacing: 0.3,
    },
    heading2: {
      fontSize: 24,
      marginTop: 28,
      marginBottom: 14,
      fontWeight: 'bold',
      color: COLORS.primary,
      letterSpacing: 0.2,
    },
    heading3: {
      fontSize: 22,
      marginTop: 24,
      marginBottom: 12,
      fontWeight: 'bold',
      color: COLORS.primary,
    },
    paragraph: {
      marginBottom: 22,
      fontSize: 18,
      lineHeight: 30,
      color: COLORS.secondary,
    },
    link: {
      color: COLORS.accent1,
      textDecorationLine: 'underline',
      fontWeight: '600',
    },
    blockquote: {
      backgroundColor: COLORS.lighter,
      borderLeftColor: COLORS.accent1,
      borderLeftWidth: 4,
      paddingHorizontal: 20,
      paddingVertical: 16,
      marginVertical: 24,
    },
    bullet_list: {
      marginBottom: 24,
    },
    ordered_list: {
      marginBottom: 24,
    },
    list_item: {
      flexDirection: 'row',
      marginBottom: 12,
    },
    bullet_list_icon: {
      marginRight: 10,
      fontSize: 18,
      color: COLORS.primary,
    },
    bullet_list_content: {
      flex: 1,
    },
    image: {
      width: width - 40,
      height: 240,
      borderRadius: 12,
      marginVertical: 28,
    },
    code_block: {
      backgroundColor: COLORS.lighter,
      padding: 18,
      borderRadius: 10,
      marginVertical: 20,
      fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
      fontSize: 16,
    },
    fence: {
      backgroundColor: COLORS.lighter,
      padding: 18,
      borderRadius: 10,
      marginVertical: 20,
      fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
      fontSize: 16,
    },
    code_inline: {
      backgroundColor: COLORS.lighter,
      paddingHorizontal: 6,
      paddingVertical: 2,
      borderRadius: 4,
      fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
      fontSize: 16,
    },
    table: {
      borderWidth: 1,
      borderColor: COLORS.light,
      borderRadius: 10,
      marginVertical: 20,
      overflow: 'hidden',
    },
    thead: {
      backgroundColor: COLORS.lighter,
    },
    th: {
      padding: 14,         
      fontWeight: 'bold',
      fontSize: 16,          
    },
    td: {
      padding: 14,            
      borderTopWidth: 1,
      borderTopColor: COLORS.light,
      fontSize: 16,         
    },
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.accent} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {renderHeader()}
        
        <View style={styles.articleContentContainer}>

          <View style={styles.articleIntroBlock}>
            <View style={styles.introHeadingWrapper}>
              <View style={styles.introLine} />
              <Text style={styles.introHeading}>
                {language.toUpperCase() === 'EN' ? 'Key Points' : '內容精華'}
              </Text>
              <View style={styles.introLine} />
            </View>
            <Text style={styles.articleIntro}>
              {article.excerpt || (language.toUpperCase() === 'EN' 
                ? 'This article contains important insights and practical advice. The following content will explore key points of this topic to help you gain comprehensive understanding and practical value.'
                : '這篇文章包含了重要的見解和實用的建議。以下內容將深入探討這個話題的關鍵點，幫助您全面理解並獲得實用價值。'
              )}
            </Text>
          </View>
          
          <Markdown style={markdownStyles}>
            {article.content || (language.toUpperCase() === 'EN' 
              ? '# This is an engaging article title\n\nHere is the detailed content of the article, supporting Markdown format. You can add **bold**, *italic*, or [hyperlinks](https://example.com).\n\n## Core Point Discussion\n\nThe following points are key content of this article:\n- First important point discussed\n- Second point worth deep thinking\n- Third highly practical point\n\n> This quote contains the most essence of this article, worth your repeated thinking and practice.\n\n### Case Analysis\n\n![Example Image](https://via.placeholder.com/800x400)\n\n```javascript\n// Core solution\nfunction solution() {\n  console.log("This is a method that can truly solve problems");\n}\n```'
              : '# 這是一個引人入勝的文章標題\n\n這裡是文章的詳細內容，支持Markdown格式。您可以添加**粗體**、*斜體*，或者[超鏈接](https://example.com)。\n\n## 核心觀點探討\n\n以下幾點是本文的關鍵內容:\n- 第一個重要觀點探討\n- 值得深入思考的第二點\n- 實用性極強的第三個要點\n\n> 這段引用包含了本文最精華的思想，值得您反覆思考和實踐。\n\n### 案例分析\n\n![示例圖片](https://via.placeholder.com/800x400)\n\n```javascript\n// 核心解決方案\nfunction solution() {\n  console.log("這是一個能夠真正解決問題的方法");\n}\n```'
            )}
          </Markdown>
          
          {article.categories && (
            <View style={styles.categories}>
              <AntDesign name="appstore1" size={18} color={COLORS.accent} />
              <Text style={styles.categoriesLabel}>
                {language.toUpperCase() === 'EN' ? 'Categories:' : '分類：'}
              </Text>
              <Text style={styles.categoriesText}>{article.categories}</Text>
            </View>
          )}
          
          <View style={styles.interactionSection}>
            <Text style={styles.interactionTitle}>
              {language.toUpperCase() === 'EN' ? 'Reader Ratings' : '讀者評價'}
            </Text>
            
            <View style={styles.ratingContainer}>
              <View style={styles.ratingValueContainer}>
                <Text style={styles.ratingValue}>4.8</Text>
                <Text style={styles.ratingMax}>/5</Text>
              </View>
              
              <View style={styles.ratingStarsAndCount}>
                <View style={styles.starsContainer}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <AntDesign 
                      key={star}
                      name="star" 
                      size={30} 
                      color={star <= 4 ? COLORS.goldStar : COLORS.light} 
                    />
                  ))}
                </View>
                <Text style={styles.ratingText}>
                  {language.toUpperCase() === 'EN' 
                    ? 'Based on 86 reader ratings' 
                    : '基於 86 位讀者的評價'}
                </Text>
              </View>
            </View>

            <View style={styles.actionButtons}>
              <TouchableOpacity 
                style={[styles.actionButton, styles.primaryButton]}
                onPress={toggleBookmark}
              >
                <AntDesign 
                  name={bookmarked ? "star" : "staro"} 
                  size={22} 
                  color={bookmarked ? COLORS.goldStar : COLORS.white} 
                />
                <Text style={styles.primaryButtonText}>
                  {bookmarked 
                    ? (language.toUpperCase() === 'EN' ? 'Bookmarked' : '已加入收藏')
                    : (language.toUpperCase() === 'EN' ? 'Bookmark' : '收藏文章')}
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.actionButton, styles.secondaryButton]}
                onPress={handleShare}
              >
                <AntDesign name="sharealt" size={22} color={COLORS.primary} />
                <Text style={styles.secondaryButtonText}>
                  {language.toUpperCase() === 'EN' ? 'Share' : '分享'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 17,
    color: COLORS.accent,
    letterSpacing: 0.3,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    flexGrow: 1,
    paddingBottom: 50,
  },
  headerSection: {
    height: 420,                // 增高標題區域
    width: '100%',
    position: 'relative',
  },
  headerImage: {
    ...StyleSheet.absoluteFillObject,
  },
  headerGradient: {
    ...StyleSheet.absoluteFillObject,
    height: '100%',
  },
  headerControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 50 : StatusBar.currentHeight + 16,
  },
  headerRightControls: {
    flexDirection: 'row',
  },
  iconButton: {
    width: 46,                  // 更大的按鈕
    height: 46,                 // 更大的按鈕
    borderRadius: 23,
    backgroundColor: COLORS.overlaySoft,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,

  },
  headerContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 24,                // 更大的內邊距
    top: 70
  },
  tagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
    
  },
  tag: {
    paddingHorizontal: 14,      // 更寬標籤
    paddingVertical: 6,         // 更高標籤
    borderRadius: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
  },
  tagText: {
    color: COLORS.white,
    fontSize: 14,               // 更大標籤字體
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  timeToRead: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  timeToReadText: {
    color: COLORS.white,
    fontSize: 14,               // 更大的閱讀時間
    marginLeft: 6,
    fontWeight: '500',
  },
  articleTitle: {
    fontSize: 30,               // 顯著更大的標題
    fontWeight: 'bold',
    color: COLORS.white,
    marginBottom: 12,
    lineHeight: 38,             // 適當行高
    letterSpacing: 0.4,
  },
  articleExcerpt: {
    fontSize: 18,               // 更大的摘要
    color: 'rgba(255, 255, 255, 0.95)',
    marginBottom: 18,
    lineHeight: 26,
  },
  articleMeta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 18,
    marginBottom: 6,
  },
  metaText: {
    fontSize: 15,               // 更大的元數據
    color: COLORS.light,
    marginLeft: 8,
  },
  articleContentContainer: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 28,    // 更大圓角
    borderTopRightRadius: 28,   // 更大圓角
    marginTop: 0,             // 更大的負邊距
    padding: 24,                // 更大的內邊距
    paddingTop: 32,             // 更大的頂部內邊距
    elevation: 10,              // 更強的陰影
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  

  articleIntroBlock: {
    backgroundColor: COLORS.lighter,
    padding: 20,
    borderRadius: 16,
    marginBottom: 30,

    borderLeftColor: COLORS.primary,
  },
  introHeadingWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  introLine: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.accent,
    opacity: 0.3,
  },
  introHeading: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginHorizontal: 10,
    letterSpacing: 1,
  },
  articleIntro: {
    fontSize: 17,
    lineHeight: 28,
    color: COLORS.secondary,
    fontStyle: 'italic',
  },
  
  // 分類信息
  categories: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 36,
    marginBottom: 24,
    paddingTop: 24,
    borderTopWidth: 1,
    borderTopColor: COLORS.lighter,
  },
  categoriesLabel: {
    fontSize: 16,                // 更大字體
    color: COLORS.accent,
    fontWeight: '600',
    marginLeft: 10,
  },
  categoriesText: {
    fontSize: 16,                // 更大字體
    color: COLORS.secondary,
  },
  
  // 互動區域
  interactionSection: {
    marginTop: 30,
    padding: 24,                 // 更大內邊距
    backgroundColor: COLORS.lighter,
    borderRadius: 16,            // 更大圓角
    elevation: 2,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  interactionTitle: {
    fontSize: 20,                // 更大標題
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 20,
    letterSpacing: 0.4,
  },
  
  // 評分區域重新設計
  ratingContainer: {
    flexDirection: 'row',
    marginBottom: 24,
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.white,
    padding: 16,
    borderRadius: 12,
  },
  ratingValueContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  ratingValue: {
    fontSize: 48,               // 超大評分字體
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  ratingMax: {
    fontSize: 20,
    color: COLORS.accent,
    marginLeft: 4,
  },
  ratingStarsAndCount: {
    flex: 1,
    alignItems: 'flex-end',
  },
  starsContainer: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  ratingText: {
    fontSize: 15,
    color: COLORS.secondary,
    fontStyle: 'italic',
  },
  
  // 全新反饋提示部分
  feedbackPrompt: {
    marginVertical: 20,
    alignItems: 'center',
  },
  feedbackQuestion: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.primary,
    marginBottom: 16,
    textAlign: 'center',
  },
  feedbackButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  feedbackButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 30,
    backgroundColor: COLORS.white,
    marginHorizontal: 10,
    elevation: 2,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  feedbackButtonText: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
    color: COLORS.secondary,
  },
  
  // 行動按鈕
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,        // 更高按鈕
    borderRadius: 12,           // 更大圓角
    flex: 1,
  },
  primaryButton: {
    backgroundColor: COLORS.primary,
    marginRight: 8,
  },
  secondaryButton: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.primary,
    marginLeft: 8,
  },
  primaryButtonText: {
    color: COLORS.white,
    fontWeight: '600',
    marginLeft: 10,
    fontSize: 16,               // 更大字體
    letterSpacing: 0.4,
  },
  secondaryButtonText: {
    color: COLORS.primary,
    fontWeight: '600',
    marginLeft: 10,
    fontSize: 16,               // 更大字體
    letterSpacing: 0.4,
  },
  
  // 全新閱讀提示
  readingPrompt: {
    flexDirection: 'row',
    backgroundColor: COLORS.primary,
    borderRadius: 16,
    padding: 20,
    marginTop: 30,
    alignItems: 'center',
  },
  promptIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  promptText: {
    flex: 1,
    color: COLORS.white,
    fontSize: 16,
    lineHeight: 24,
    letterSpacing: 0.3,
  },
  
  // 相關文章樣式
  relatedSection: {
    marginTop: 36,
    marginBottom: 20,
  },
  relatedSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  relatedHeaderLine: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.accent,
    opacity: 0.3,
  },
  relatedSectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginHorizontal: 12,
    color: COLORS.primary,
    letterSpacing: 0.3,
  },
  relatedList: {
    marginHorizontal: -4,
  },
  relatedCard: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    marginBottom: 20,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
  },
  relatedImageContainer: {
    width: '100%',
    height: 180,
    position: 'relative',
  },
  relatedImage: {
    width: '100%',
    height: '100%',
  },
  playIconOverlay: {
    position: 'absolute',
    right: 12,
    bottom: 12,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 20,
    padding: 4,
  },
  relatedContent: {
    padding: 16,
  },
  relatedTag: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 4,
    backgroundColor: COLORS.lighter,
    marginBottom: 10,
  },
  relatedTagText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: COLORS.secondary,
    letterSpacing: 0.5,
  },
  relatedTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 8,
    lineHeight: 24,
  },
  relatedExcerpt: {
    fontSize: 15,
    color: COLORS.accent,
    lineHeight: 22,
    marginBottom: 12,
  },
  relatedReadMore: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  relatedReadMoreText: {
    fontSize: 14,
    color: COLORS.accent1,
    fontWeight: '600',
    marginRight: 6,
  },
});

export default ArticleDetail;