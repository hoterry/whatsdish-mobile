// VideoGridComponent.js - Updated for API data compatibility
import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions
} from 'react-native';
import { AntDesign } from '@expo/vector-icons';

const { width } = Dimensions.get('window');
const GRID_SPACING = 8;
const NUM_COLUMNS = 2;
const ITEM_WIDTH = (width - (GRID_SPACING * (NUM_COLUMNS + 1))) / NUM_COLUMNS;

// Colors from existing system
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

// Function to format view count (e.g. 3.8K, 6.9K)
const formatViewCount = (count) => {
  if (count >= 1000) {
    return (count / 1000).toFixed(1) + 'K';
  }
  return count.toString();
};

// Get the first line of the content as title
const getContentTitle = (content) => {
  if (!content) return '';
  const lines = content.split('\n');
  return lines[0] || '';
};

// Get the second line for overlay text
const getOverlayText = (content) => {
  if (!content) return '';
  const lines = content.split('\n');
  return lines.length > 1 ? lines[1] : '';
};

// Get hashtags from content if available
const getHashtags = (content) => {
  if (!content) return [];
  // Find hashtags in the content (words starting with #)
  const hashtagRegex = /#[a-zA-Z0-9]+/g;
  return content.match(hashtagRegex) || [];
};

const VideoGridItem = ({ video, onPress, language }) => {
  // Prepare data from API format
  const videoTitle = video.title || getContentTitle(video.content) || 'Video';
  const overlayText = video.overlay_text || getOverlayText(video.content) || '';
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
      : 'https://via.placeholder.com/400x500?text=Video'
  );

  return (
    <TouchableOpacity 
      style={styles.gridItem} 
      onPress={() => onPress(video)}
      activeOpacity={0.9}
    >
      {/* Video Thumbnail */}
      <View style={styles.thumbnailContainer}>
        <Image
          source={{ uri: coverImageUrl }}
          style={styles.thumbnail}
          resizeMode="cover"
        />
        
        {/* Play Button Overlay */}
        <View style={styles.playButtonContainer}>
          <AntDesign name="playcircleo" size={32} color="white" />
        </View>
        
        {/* Text Overlay - if available */}
        {overlayText && (
          <View style={styles.overlayTextContainer}>
            <Text style={styles.overlayText}>{overlayText}</Text>
          </View>
        )}
        
        {/* User Info at Top */}
        <View style={styles.userInfoContainer}>
          <Image 
            source={{ uri: avatarUrl }} 
            style={styles.userAvatar} 
          />
          <Text style={styles.username}>{username}</Text>
        </View>
      </View>
      
      {/* Video Details Below */}
      <View style={styles.detailsContainer}>
        <Text style={styles.locationText} numberOfLines={1}>
          {videoTitle}
        </Text>
        
        {/* Hashtags if available */}
        {hashtags.length > 0 && (
          <Text style={styles.hashtagsText} numberOfLines={1}>
            {hashtags.slice(0, 2).join(' ')}
            {hashtags.length > 2 ? '...' : ''}
          </Text>
        )}
        
        <View style={styles.statsContainer}>
          {/* Happy Emoji + Count */}
          <View style={styles.statItem}>
            <Text style={styles.emojiText}>😄</Text>
            <Text style={styles.statCount}>{video.likes || Math.floor(Math.random() * 50)}</Text>
          </View>
          
          {/* Sad Emoji + Count */}
          <View style={styles.statItem}>
            <Text style={styles.emojiText}>😔</Text>
            <Text style={styles.statCount}>{video.dislikes || Math.floor(Math.random() * 10)}</Text>
          </View>
          
          {/* View Count */}
          <View style={styles.viewCountContainer}>
            <AntDesign name="eye" size={14} color={COLORS.accent} />
            <Text style={styles.viewCount}>
              {formatViewCount(video.view_count || Math.floor(Math.random() * 10000))}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const VideoGridComponent = ({ videos, navigation, language }) => {
  const handleVideoPress = (video) => {
    console.log('Video pressed:', video.title || getContentTitle(video.content) || video.id);
    
    // 導航到VideoDetail頁面
    navigation && navigation.navigate('VideoDetailScreen', { video: video });
  };
  
  // Pre-process videos if needed
  const processedVideos = videos.map(video => {
    // Add any additional processing here if needed
    return {
      ...video,
      // Pre-compute these values if they're used in multiple places
      title: video.title || getContentTitle(video.content) || 'Video',
      overlay_text: video.overlay_text || getOverlayText(video.content),
      cover_image_url: video.cover_image_url || (
        video.video_url && video.video_url.includes('cloudinary.com') 
          ? video.video_url
              .replace('/video/upload/', '/video/upload/so_0,w_640,h_360,c_fill,q_80/')
              .replace('.mp4', '.jpg')
          : undefined
      )
    };
  });
  
  // 渲染網格佈局
  return (
    <View style={styles.container}>      
      <View style={styles.gridContainer}>
        {processedVideos && processedVideos.length > 0 ? (
          processedVideos.map((video, index) => (
            <VideoGridItem 
              key={`video-grid-${index}`}
              video={video} 
              onPress={handleVideoPress}
              language={language}
            />
          ))
        ) : (
          <View style={styles.emptyContainer}>
            <AntDesign name="videocamera" size={40} color={COLORS.accent} />
            <Text style={styles.emptyText}>
              {language?.toUpperCase() === 'EN' ? 'No videos available' : '暫無可用視頻'}
            </Text>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.background,
    paddingBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.primary,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: GRID_SPACING,
  },
  gridItem: {
    width: ITEM_WIDTH,
    marginBottom: 16,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: COLORS.white,
    elevation: 3,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  thumbnailContainer: {
    height: ITEM_WIDTH * 1.25, // Aspect ratio similar to the reference image
    position: 'relative',
  },
  thumbnail: {
    width: '100%',
    height: '100%',
  },
  playButtonContainer: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 20,
    padding: 4,
  },
  userInfoContainer: {
    position: 'absolute',
    top: 8,
    left: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  userAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: COLORS.white,
  },
  username: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 6,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  overlayTextContainer: {
    position: 'absolute',
    bottom: 12,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  overlayText: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    color: COLORS.white,
    fontSize: 14,
    fontWeight: 'bold',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
    overflow: 'hidden',
    textAlign: 'center',
  },
  detailsContainer: {
    padding: 10,
  },
  locationText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 4,
  },
  hashtagsText: {
    fontSize: 12,
    color: COLORS.accent1,
    marginBottom: 6,
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
  },
  emojiText: {
    fontSize: 15,
    marginRight: 2,
  },
  statCount: {
    fontSize: 14,
    color: COLORS.secondary,
    fontWeight: '500',
  },
  viewCountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 'auto',
  },
  viewCount: {
    fontSize: 14,
    color: COLORS.accent,
    marginLeft: 3,
  },
  emptyContainer: {
    width: '100%',
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    height: 200,
  },
  emptyText: {
    marginTop: 12,
    fontSize: 16,
    color: COLORS.accent,
    textAlign: 'center',
  },
});

export default VideoGridComponent;