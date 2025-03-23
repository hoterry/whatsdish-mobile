import React, { useState, useRef, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Image,
  TouchableOpacity,
  Dimensions,
  Share,
  Platform,
  ScrollView
} from 'react-native';
import { Video } from 'expo-av';
import { LinearGradient } from 'expo-linear-gradient';
import { AntDesign, Feather, Ionicons } from '@expo/vector-icons';
import { LanguageContext } from '../context/LanguageContext';

const { width, height } = Dimensions.get('window');

// 色彩方案
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

// Helper functions for content processing
const getContentTitle = (content) => {
  if (!content) return '';
  const lines = content.split('\n');
  return lines[0] || '';
};

const getContentDescription = (content) => {
  if (!content) return '';
  const lines = content.split('\n');
  // Return everything except the first line
  return lines.slice(1).join('\n');
};

const getHashtags = (content) => {
  if (!content) return [];
  const hashtagRegex = /#[a-zA-Z0-9]+/g;
  return content.match(hashtagRegex) || [];
};

const VideoDetailScreen = ({ route, navigation }) => {
  const { video } = route.params;
  const { language } = useContext(LanguageContext);
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isError, setIsError] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);
  
  // Process video data for display
  const videoTitle = video.title || getContentTitle(video.content) || '';
  const videoDescription = video.excerpt || getContentDescription(video.content) || '';
  const hashtags = getHashtags(video.content);
  
  // Ensure avatar information is available
  const username = video.avatar_name || video.author || 'username';
  const avatarUrl = video.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(username)}`;
  
  // Generate cover image from video URL if needed
  const coverImageUrl = video.cover_image_url || (
    video.video_url && video.video_url.includes('cloudinary.com') 
      ? video.video_url
          .replace('/video/upload/', '/video/upload/so_0,w_640,h_360,c_fill,q_80/')
          .replace('.mp4', '.jpg')
      : 'https://via.placeholder.com/640x360?text=Video'
  );
  
  const togglePlayPause = async () => {
    if (!videoRef.current) return;
    
    try {
      const status = await videoRef.current.getStatusAsync();
      
      if (status.isPlaying) {
        await videoRef.current.pauseAsync();
        setIsPlaying(false);
      } else {
        await videoRef.current.playAsync();
        setIsPlaying(true);
      }
    } catch (error) {
      console.error('Error toggling play/pause:', error);
    }
  };
  
  const handlePlaybackStatusUpdate = (status) => {
    setIsPlaying(status.isPlaying);
  };
  
  const handleVideoError = (error) => {
    console.error('Video error:', error);
    setIsError(true);
  };
  
  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out this video: ${videoTitle}`,
        url: video.video_url,
        title: videoTitle
      });
    } catch (error) {
      console.error('Error sharing video:', error);
    }
  };
  
  const toggleDescription = () => {
    setShowFullDescription(!showFullDescription);
  };
  
  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      
      {/* TikTok 風格視頻播放器 */}
      <TouchableOpacity 
        activeOpacity={1}
        style={styles.videoWrapper}
        onPress={togglePlayPause}
      >
        {video.video_url && !isError ? (
          <Video
            ref={videoRef}
            source={{ uri: video.video_url }}
            style={styles.fullScreenVideo}
            resizeMode="cover"
            isLooping
            shouldPlay
            onPlaybackStatusUpdate={handlePlaybackStatusUpdate}
            onError={handleVideoError}
            useNativeControls={false}
          />
        ) : (
          <Image 
            source={{ uri: coverImageUrl }}
            style={styles.fullScreenVideo}
            resizeMode="cover"
          />
        )}
        
        {/* 漸變覆蓋層 - 底部 */}
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.7)']}
          style={styles.bottomGradient}
        />
        
        {/* 漸變覆蓋層 - 頂部 */}
        <LinearGradient
          colors={['rgba(0,0,0,0.5)', 'transparent']}
          style={styles.topGradient}
        />
        
        {/* 暫停指示器 - 只在暫停時顯示 */}
        {!isPlaying && (
          <View style={styles.pauseIndicator}>
            <Ionicons name="play" size={60} color="rgba(255, 255, 255, 0.8)" />
          </View>
        )}
        
        {/* 頂部控制區 */}
        <SafeAreaView style={styles.topControls}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <AntDesign name="arrowleft" size={24} color={COLORS.white}  />
          </TouchableOpacity>
        </SafeAreaView>
        
        {/* 底部信息區 */}
        <SafeAreaView style={styles.bottomControls}>
          <View style={styles.videoInfo}>
            {videoTitle ? (
              <Text style={styles.videoTitle}>{videoTitle}</Text>
            ) : null}
            
            <View style={styles.authorRow}>
              <Image 
                source={{ uri: avatarUrl }}
                style={styles.authorAvatar}
              />
              <Text style={styles.authorName}>@{username}</Text>
            </View>
            
            <TouchableOpacity 
              activeOpacity={0.8} 
              onPress={toggleDescription}
              style={styles.descriptionContainer}
            >
              <Text 
                style={styles.videoDescription} 
                numberOfLines={showFullDescription ? undefined : 2}
              >
                {videoDescription}
              </Text>
              
              {/* 單行顯示所有標籤 */}
              {hashtags.length > 0 && (
                <View style={styles.hashtagsRow}>
                  <Text style={styles.hashtagText} numberOfLines={1} ellipsizeMode="tail">
                    {hashtags.join(' ')}
                  </Text>
                </View>
              )}
              
              <Text style={styles.readMoreLink}>
                {showFullDescription 
                  ? (language.toUpperCase() === 'EN' ? 'Show less' : '收起') 
                  : (language.toUpperCase() === 'EN' ? 'Read more' : '展開')}
              </Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
        
        {/* 右側交互按鈕 */}
        <View style={styles.sideButtons}>
          <TouchableOpacity style={styles.sideButton} onPress={handleShare}>
            <Feather name="share" size={28} color={COLORS.white} />
            <Text style={styles.sideButtonText}>
              {language.toUpperCase() === 'EN' ? 'Share' : '分享'}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.sideButton}>
            <AntDesign name="heart" size={28} color={COLORS.white} />
            <Text style={styles.sideButtonText}>{video.likes || 0}</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.sideButton}>
            <AntDesign name="message1" size={28} color={COLORS.white} />
            <Text style={styles.sideButtonText}>
              {language.toUpperCase() === 'EN' ? 'Comment' : '評論'}
            </Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  videoWrapper: {
    flex: 1,
    position: 'relative',
  },
  fullScreenVideo: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    backgroundColor: '#000',
  },
  topGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 150,
  },
  bottomGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 250,
  },
  pauseIndicator: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  topControls: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 44 : 20,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    zIndex: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomControls: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 80 : 60, // 調整底部位置，使其更靠上
    left: 20,
    right: 85, // 增加右側空間
    padding: 16,
    paddingRight: 5, // 減少右側內邊距
    zIndex: 20, // 增加 zIndex 確保它在其他元素之上
  },
  videoInfo: {
    width: '100%',
  },
  videoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.white,
    marginBottom: 10,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  authorAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.white,
    marginRight: 8,
  },
  authorName: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.white,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  descriptionContainer: {
    width: '85%',  // Reduce width to prevent text from going off-screen
    paddingRight: 10,
  },
  videoDescription: {
    fontSize: 14,
    color: COLORS.white,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
    lineHeight: 18,
  },
  // 修改為單行顯示標籤
  hashtagsRow: {
    flexDirection: 'row',
    marginTop: 8,
    width: '100%',
  },
  hashtagText: {
    color: '#3897f0',  // Instagram-style hashtag color
    fontWeight: '500',
    fontSize: 14,
  },
  readMoreLink: {
    color: COLORS.light,
    fontSize: 14,
    marginTop: 4,
    fontWeight: '500',
  },
  sideButtons: {
    position: 'absolute',
    right: 16,
    bottom: Platform.OS === 'ios' ? 100 : 80,
    alignItems: 'center',
    zIndex: 10,
  },
  sideButton: {
    alignItems: 'center',
    marginBottom: 20,
  },
  sideButtonText: {
    color: COLORS.white,
    fontSize: 12,
    marginTop: 4,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
});

export default VideoDetailScreen;