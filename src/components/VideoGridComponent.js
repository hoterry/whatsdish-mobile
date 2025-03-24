import React, { useEffect, useMemo } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  FlatList
} from 'react-native';
import { AntDesign } from '@expo/vector-icons';

const { width } = Dimensions.get('window');
const GRID_SPACING = 8;
const NUM_COLUMNS = 2;
const ITEM_WIDTH = (width - (GRID_SPACING * (NUM_COLUMNS + 1))) / NUM_COLUMNS;

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

const formatViewCount = (count) => {
  if (count >= 1000) {
    return (count / 1000).toFixed(1) + 'K';
  }
  return count.toString();
};

const VideoGridItem = ({ video, onPress, language }) => {
  return (
    <TouchableOpacity 
      style={styles.gridItem} 
      onPress={() => onPress(video)}
      activeOpacity={0.9}
    >
      <View style={styles.thumbnailContainer}>
        <Image
          source={{ uri: video.cover_image_url || 'https://via.placeholder.com/400x500?text=Video' }}
          style={styles.thumbnail}
          resizeMode="cover"
        />
        
        <View style={styles.playButtonContainer}>
          <AntDesign name="playcircleo" size={32} color="white" />
        </View>
        
        {video.overlay_text && (
          <View style={styles.overlayTextContainer}>
            <Text style={styles.overlayText}>{video.overlay_text}</Text>
          </View>
        )}
        
        <View style={styles.userInfoContainer}>
          <Image 
            source={{ uri: video.avatar_url || 'https://via.placeholder.com/50x50?text=User' }} 
            style={styles.userAvatar} 
          />
          <Text style={styles.username}>{video.author || 'username'}</Text>
        </View>
      </View>
      
      <View style={styles.detailsContainer}>
        <Text style={styles.locationText} numberOfLines={1}>
          {video.location || video.title || 'Location Name'}
        </Text>
        
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.emojiText}>😄</Text>
            <Text style={styles.statCount}>{video.likes || Math.floor(Math.random() * 50)}</Text>
          </View>
          
          <View style={styles.statItem}>
            <Text style={styles.emojiText}>😔</Text>
            <Text style={styles.statCount}>{video.dislikes || Math.floor(Math.random() * 10)}</Text>
          </View>
          
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
  const filteredVideos = useMemo(() => {
    if (!videos || videos.length === 0) return [];
    return videos.filter(video => video.video_url);
  }, [videos]);

  const handleVideoPress = (video) => {
    navigation && navigation.navigate('VideoDetailScreen', { video: video });
  };

  return (
    <View style={styles.container}>      
      <View style={styles.gridContainer}>
        {filteredVideos.length > 0 ? (
          filteredVideos.map((video, index) => (
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