import React, { useContext, useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform, Image } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LanguageContext } from '../../context/LanguageContext';

import HomeScreen from '../../screens/HomeScreen/HomeScreen';
import ExploreScreen from '../../screens/ExploreScreen/ExploreScreen';
import OrderHistoryScreen from '../../screens/HistoryDetail/OrderHistoryScreen';
import AccountScreen from '../../screens/AccountScreen/AccountScreen';
import VideoDetailScreen from '../VideoDetailScreen';


global.videoEvents = global.videoEvents || {

  processedVideos: [],

  setProcessedVideos: function(videos) {
    if (videos && Array.isArray(videos) && videos.length > 0) {
      this.processedVideos = videos;
      console.log('Updated processed videos, count:', videos.length);
    }
  },
  
  getRandomVideo: function() {
    if (!this.processedVideos || this.processedVideos.length === 0) {
      console.log('No processed videos available');
      return null;
    }
    const randomIndex = Math.floor(Math.random() * this.processedVideos.length);
    console.log(`Randomly selected video index: ${randomIndex} of ${this.processedVideos.length}`);
    return this.processedVideos[randomIndex];
  }
};

const Tab = createBottomTabNavigator();

const tabTranslations = {
  EN: {
    home: 'Home',
    explore: 'Explore',
    video: 'Video',
    orders: 'Orders',
    account: 'Account'
  },
  ZH: {
    home: '首頁',
    explore: '探索',
    video: '視頻',
    orders: '訂單',
    account: '我的'
  }
};

function IconButton({ onPress }) {
  return (
    <TouchableOpacity
      style={styles.iconButton}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Image 
        source={require('../../../assets/icon.png')} 
        style={styles.centerIcon} 
        resizeMode="contain"
      />
    </TouchableOpacity>
  );
}


function CustomTabBar({ state, descriptors, navigation }) {
  const insets = useSafeAreaInsets();
  const { language } = useContext(LanguageContext);

  const t = (key) => {
    return tabTranslations[language]?.[key] || key;
  };
  
  return (
    <View style={[
      styles.tabBar,
      { 
        height: 60 + (Platform.OS === 'ios' ? insets.bottom : 0),
        paddingBottom: Platform.OS === 'ios' ? insets.bottom : 0 
      }
    ]}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            if (route.name === 'Video') {
              const randomVideo = global.videoEvents.getRandomVideo();
              if (randomVideo) {
                const allVideos = global.videoEvents.processedVideos || [];
                navigation.navigate('VideoDetailScreen', { 
                  video: randomVideo,
                  videos: allVideos
                });
              } else {
                console.log('No videos available for random play');
                Alert.alert(
                  language.toUpperCase() === 'EN' ? 'Notice' : '提示',
                  language.toUpperCase() === 'EN' ? 'No videos available' : '暫無可用視頻'
                );
              }
            } else {
              navigation.navigate(route.name);
            }
          }
        };

        if (route.name === 'Video') {
          return (
            <IconButton key={route.key} onPress={onPress} />
          );
        }

        let iconName;
        if (route.name === 'Home') {
          iconName = isFocused ? 'home' : 'home-outline';
        } else if (route.name === 'Explore') {
          iconName = isFocused ? 'search' : 'search-outline';
        } else if (route.name === 'Orders') {
          iconName = isFocused ? 'list' : 'list-outline';
        } else if (route.name === 'Account') {
          iconName = isFocused ? 'person' : 'person-outline';
        }

        let labelText = '';
        if (route.name === 'Home') {
          labelText = t('home');
        } else if (route.name === 'Explore') {
          labelText = t('explore');
        } else if (route.name === 'Orders') {
          labelText = t('orders');
        } else if (route.name === 'Account') {
          labelText = t('account');
        }

        return (
          <TouchableOpacity
            key={route.key}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            onPress={onPress}
            style={styles.tabButton}
          >
            <Ionicons 
              name={iconName} 
              size={24} 
              color={isFocused ? '#E53935' : '#777'} 
            />
            <Text style={[
              styles.tabLabel, 
              { color: isFocused ? '#E53935' : '#777' }
            ]}>
              {labelText}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

function CustomTabNavigator({ setIsAuthenticated }) {
  return (
    <Tab.Navigator
      tabBar={props => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Explore" component={ExploreScreen} />
      <Tab.Screen name="Video" component={VideoDetailScreen} />
      <Tab.Screen name="Orders" component={OrderHistoryScreen} />
      <Tab.Screen name="Account">
        {props => <AccountScreen {...props} setIsAuthenticated={setIsAuthenticated} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 5,
    paddingHorizontal: 10,
    paddingTop: 5,
    justifyContent: 'space-around',
    alignItems: 'flex-start',
  },
  tabButton: {
    flex: 1,
    alignItems: 'center', 
    justifyContent: 'center',
    paddingVertical: 8,
  },
  iconButton: {
    top: -20,
    width: 56,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 5,
  },
  centerIcon: {
    width: 56,
    height: 56,
  },
  tabLabel: {
    fontSize: 12,
    fontFamily: 'Quicksand-Bold',
    marginTop: 4,
    textAlign: 'center',
  }
});

export default CustomTabNavigator;