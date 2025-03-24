import React from 'react';
import { View, Text, TouchableOpacity, Animated, Dimensions, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { AntDesign, Feather } from '@expo/vector-icons';

const { width } = Dimensions.get('window');
const HEADER_GRADIENT_HEIGHT = 110;
const TOGGLE_HEIGHT = 60;

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
      <LinearGradient
        colors={[COLORS.primary, COLORS.secondary]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.headerGradient}
      >
        <Text style={styles.headerTitle}>
          {language.toUpperCase() === 'EN' ? 'Discover' : '探索'}
        </Text>
        <TouchableOpacity style={styles.searchButton} onPress={onSearchPress}>
          <Feather name="search" size={24} color={COLORS.white} />
        </TouchableOpacity>
      </LinearGradient>
      
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
  },
  headerGradient: {
    height: HEADER_GRADIENT_HEIGHT,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 50, // Account for status bar
  },
  headerTitle: {
    color: COLORS.white,
    fontSize: 28,
    fontWeight: '700',
  },
  searchButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
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
    backgroundColor: COLORS.primary,
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