import React from 'react';
import { View, Text, TouchableOpacity, Animated, Dimensions, StyleSheet, Platform, StatusBar } from 'react-native';
import { AntDesign, Feather } from '@expo/vector-icons';

const { width } = Dimensions.get('window');
const HEADER_HEIGHT = 70; // 從 110 改為 70，減小高度
const TOGGLE_HEIGHT = 60;

// 顏色系統保持不變
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

// 計算狀態欄高度
const STATUS_BAR_HEIGHT = Platform.OS === 'ios' ? 
  (Platform.isPad ? 20 : StatusBar.currentHeight || 44) : 
  (StatusBar.currentHeight || 0);

const CLExploreHeader = ({
  language,
  contentType,
  toggleContentType,
  scrollY,
  slideAnimation,
  onSearchPress
}) => {
  return (
    <View style={styles.headerContainer}>
      <StatusBar 
        barStyle="dark-content" 
        backgroundColor="transparent"
        translucent={true}
      />
      
      <View style={styles.headerMain}>
        <Text style={styles.headerTitle}>
          {language.toUpperCase() === 'EN' ? 'Discover' : '探索'}
        </Text>
        {/*<TouchableOpacity style={styles.searchButton} onPress={onSearchPress}>
          <Feather name="search" size={24} color={COLORS.primary} />
        </TouchableOpacity>*/}
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
    paddingTop: STATUS_BAR_HEIGHT, // 添加動態計算的狀態欄高度
  },
  headerMain: {
    height: HEADER_HEIGHT, // 使用減小後的高度
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 12, // 添加底部 padding
    paddingTop: 5, // 添加頂部 padding
    backgroundColor: COLORS.white,
    // 移除了固定的 paddingTop: 50
  },
  headerTitle: {
    color: COLORS.primary,
    fontSize: 26, // 稍微減小字體大小
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

export default CLExploreHeader;