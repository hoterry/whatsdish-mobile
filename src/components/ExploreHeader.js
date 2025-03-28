import React from 'react';
import { View, Text, TouchableOpacity, Animated, Dimensions, StyleSheet } from 'react-native';
import { AntDesign, Feather } from '@expo/vector-icons';

const { width } = Dimensions.get('window');
const HEADER_HEIGHT = 110;
const TOGGLE_HEIGHT = 60;

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

const ExploreHeader = ({
  language,
  contentType,
  toggleContentType,
  scrollY,
  slideAnimation,
  onSearchPress
}) => {
  return (
    <View style={styles.headerContainer}>
      <View style={styles.headerMain}>
        <Text style={styles.headerTitle}>
          {language.toUpperCase() === 'EN' ? 'Discover' : '探索'}
        </Text>
        <TouchableOpacity style={styles.searchButton} onPress={onSearchPress}>
          <Feather name="search" size={24} color={COLORS.primary} />
        </TouchableOpacity>
      </View>
      
      <Animated.View 
        style={[
          styles.toggleOuterContainer,
          {
            height: scrollY.interpolate({
              inputRange: [0, TOGGLE_HEIGHT],
              outputRange: [TOGGLE_HEIGHT, 0],
              extrapolate: 'clamp',
            }),
            opacity: scrollY.interpolate({
              inputRange: [0, TOGGLE_HEIGHT * 0.6],  // Make opacity fade faster
              outputRange: [1, 0],
              extrapolate: 'clamp',
            }),
            overflow: 'hidden',
            borderBottomWidth: scrollY.interpolate({
              inputRange: [0, TOGGLE_HEIGHT * 0.3],
              outputRange: [1, 0],  // Remove border when collapsed
              extrapolate: 'clamp',
            }),
            borderBottomColor: COLORS.light,
          }
        ]}
      >
        <View style={styles.toggleContainer}>
          <View style={styles.toggleWrapper}>
            <Animated.View 
              style={[
                styles.toggleSlider,
                {
                  transform: [{
                    translateX: slideAnimation.interpolate({
                      inputRange: [0, 1],
                      outputRange: [2, (width - 44) / 2]
                    })
                  }]
                }
              ]} 
            />
            
            <TouchableOpacity 
              style={styles.toggleOption} 
              onPress={() => toggleContentType('articles')}
              activeOpacity={0.7}
            >
              <View style={styles.toggleInner}>
                <AntDesign 
                  name="filetext1" 
                  size={20} 
                  color={contentType === 'articles' ? COLORS.white : COLORS.secondary} 
                />
                <Text style={[
                  styles.toggleText, 
                  contentType === 'articles' && styles.activeToggleText
                ]}>
                  {language.toUpperCase() === 'EN' ? 'Articles' : '文章'}
                </Text>
              </View>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.toggleOption} 
              onPress={() => toggleContentType('videos')}
              activeOpacity={0.7}
            >
              <View style={styles.toggleInner}>
                <AntDesign 
                  name="videocamera" 
                  size={20} 
                  color={contentType === 'videos' ? COLORS.white : COLORS.secondary} 
                />
                <Text style={[
                  styles.toggleText, 
                  contentType === 'videos' && styles.activeToggleText
                ]}>
                  {language.toUpperCase() === 'EN' ? 'Videos' : '短視頻'}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    zIndex: 10,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.light,
  },
  headerMain: {
    height: HEADER_HEIGHT,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 50, // Account for status bar
    backgroundColor: COLORS.white,
  },
  headerTitle: {
    color: COLORS.primary,
    fontSize: 28,
    fontWeight: '700',
  },
  searchButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.lighter,
    alignItems: 'center',
    justifyContent: 'center',
  },
  toggleOuterContainer: {
    backgroundColor: COLORS.white,
    justifyContent: 'center',
  },
  toggleContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  toggleWrapper: {
    height: 44,
    backgroundColor: COLORS.lighter,
    borderRadius: 22,
    flexDirection: 'row',
    position: 'relative',
    padding: 2,
  },
  toggleSlider: {
    position: 'absolute',
    width: '50%',
    height: 40,
    backgroundColor: COLORS.accent,
    borderRadius: 20,
    zIndex: 1,
  },
  toggleOption: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
  toggleInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  toggleText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.secondary,
  },
  activeToggleText: {
    color: COLORS.white,
  },
});

export default ExploreHeader;