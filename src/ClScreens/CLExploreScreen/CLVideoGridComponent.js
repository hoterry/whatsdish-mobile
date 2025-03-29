import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Dimensions
} from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 50) / 2;
const CARD_HEIGHT = CARD_WIDTH * 1.5;

const CLVideoGridComponent = ({ videos, navigation, language }) => {
  if (!videos || videos.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Feather name="video-off" size={50} color="#999" />
        <Text style={styles.emptyText}>
          {language === 'EN' ? 'No videos available' : '暫無可用視頻'}
        </Text>
      </View>
    );
  }

  const renderVideoItem = ({ item, index }) => {
    const coverImage = item.cover_image_url || 'https://via.placeholder.com/640x360?text=Video';
    
    // Format view count
    const formatViewCount = (count) => {
      if (count >= 1000000) {
        return (count / 1000000).toFixed(1) + 'M';
      } else if (count >= 1000) {
        return (count / 1000).toFixed(1) + 'K';
      }
      return count;
    };

    return (
      <TouchableOpacity
        style={styles.videoCard}
        onPress={() => navigation && navigation.navigate('VideoDetailScreen', { 
          video: item,
          videos: videos
        })}
        activeOpacity={0.9}
      >
        <View style={styles.cardImageContainer}>
          <Image 
            source={{ uri: coverImage }} 
            style={styles.cardImage} 
            resizeMode="cover"
          />
          <View style={styles.viewsContainer}>
            <Ionicons name="play" size={14} color="#FFF" />
            <Text style={styles.viewCount}>
              {formatViewCount(item.view_count || 0)}
            </Text>
          </View>
          
          {item.overlay_text && (
            <View style={styles.overlayTextContainer}>
              <Text style={styles.overlayText} numberOfLines={2}>
                {item.overlay_text}
              </Text>
            </View>
          )}
        </View>
        
        <View style={styles.cardContent}>
          <Text style={styles.videoTitle} numberOfLines={2}>
            {item.title}
          </Text>
          
          <View style={styles.creatorContainer}>
            <Image 
              source={{ uri: item.avatar_url }} 
              style={styles.avatar}
              resizeMode="cover"
            />
            <Text style={styles.creatorName} numberOfLines={1}>
              {item.author}
            </Text>
          </View>
          
          <View style={styles.statsContainer}>
            <View style={styles.statsItem}>
              <Ionicons name="heart" size={14} color="#E53935" />
              <Text style={styles.statsText}>{item.likes || 0}</Text>
            </View>
            
            <View style={styles.statsItem}>
              <Ionicons name="chatbubble-outline" size={14} color="#777" />
              <Text style={styles.statsText}>{item.comments_count || 0}</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={videos}
        renderItem={renderVideoItem}
        keyExtractor={(item, index) => String(index)}
        numColumns={2}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.gridContainer}
        scrollEnabled={false} // Let parent handle scrolling
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gridContainer: {
    padding: 15,
    paddingTop: 5,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    minHeight: 300,
  },
  emptyText: {
    marginTop: 16,
    fontSize: 17,
    fontFamily: 'Poppins-Medium',
    color: '#999',
    textAlign: 'center',
  },
  videoCard: {
    width: CARD_WIDTH,
    marginHorizontal: 5,
    marginBottom: 20,
    borderRadius: 12,
    backgroundColor: '#FFF',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardImageContainer: {
    position: 'relative',
    width: '100%',
    height: CARD_WIDTH * 0.6,
  },
  cardImage: {
    width: '100%',
    height: '100%',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  viewsContainer: {
    position: 'absolute',
    top: 8,
    right: 8,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  viewCount: {
    fontSize: 12,
    color: '#FFF',
    marginLeft: 4,
    fontFamily: 'Poppins-Medium',
  },
  overlayTextContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    padding: 8,
  },
  overlayText: {
    fontSize: 12,
    color: '#FFF',
    fontFamily: 'Poppins-Medium',
  },
  cardContent: {
    padding: 10,
  },
  videoTitle: {
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
    color: '#333',
    marginBottom: 8,
  },
  creatorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  avatar: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginRight: 6,
  },
  creatorName: {
    fontSize: 12,
    fontFamily: 'Poppins-Medium',
    color: '#666',
    flex: 1,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statsItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statsText: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: '#888',
    marginLeft: 4,
  }
});

export default CLVideoGridComponent;