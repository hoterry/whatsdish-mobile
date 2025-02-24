import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, TextInput, ActivityIndicator, StatusBar, Platform, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import * as Font from 'expo-font';
import AdCarousel from '../data/AdCarousel';
import RestaurantList from '../components/RestaurantList';
import { menus } from '../data/menuRowData';

const HomeScreen = () => {
  const navigation = useNavigation();
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [loading, setLoading] = useState(true);
  const [restaurants, setRestaurants] = useState([]);

  useEffect(() => {
    async function loadFonts() {
      await Font.loadAsync({
        CustomFont: require('../../assets/fonts/Inter-SemiBold.ttf'),
      });
      setFontsLoaded(true);
    }
    loadFonts();
  }, []);

  useEffect(() => {
    const loadRestaurants = async () => {
      setLoading(true);
      try {
        const response = await fetch('http://10.0.0.7:5000/restaurant');
        if (!response.ok) {
          throw new Error('Failed to fetch restaurants');
        }
        const data = await response.json();
        console.log(data);
        setRestaurants(data);
      } catch (error) {
        console.error('Error fetching restaurants:', error);
      } finally {
        setLoading(false);
      }
    };
    loadRestaurants();
  }, []);

  if (!fontsLoaded) {
    return <Text>Loading fonts...</Text>;
  }

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <SafeAreaView style={styles.safeArea}> {/* 使用 SafeAreaView 包裹整个页面 */}
      <View style={styles.container}>
        <ScrollView contentContainerStyle={{ flexGrow: 1, paddingBottom: Platform.OS === 'android' ? 100 : 80 }}> {/* 根据平台调整 paddingBottom */}
          <View style={styles.topBar}>
            <View style={styles.topBarRow}>
              <Image
                source={require('../../assets/whatsdish.png')}
                style={styles.logo}
                resizeMode="contain"
              />
              <View style={styles.iconContainer}>
                <TouchableOpacity style={styles.notificationIcon}>
                  <Ionicons name="notifications-outline" size={24} color="black" />
                </TouchableOpacity>
                <TouchableOpacity>
                  <Ionicons name="ellipsis-horizontal" size={24} color="black" />
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.topBarRow}>
              <TouchableOpacity style={styles.location}>
                <Text style={styles.locationText} numberOfLines={1}>8288 Lansdowne Road, Richmond, BC V6X 3M7</Text>
                <Ionicons name="chevron-down-outline" size={16} color="black" />
              </TouchableOpacity>
            </View>

            <View style={styles.searchBar}>
              <Ionicons name="search-outline" size={20} color="#aaa" />
              <TextInput placeholder="Search menu, restaurant etc" style={styles.searchInput} />
            </View>
          </View>

          <AdCarousel />

          <View style={styles.menuSection}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.menuRow}>
              {menus.map((item) => (
                <TouchableOpacity key={item.id} style={styles.menuItem}>
                  <Image source={item.icon} style={styles.menuIcon} />
                  <Text style={styles.menuTitle}>{item.title}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          <View style={styles.restaurantSection}>
            <Text style={styles.sectionTitle}>Featured on Whatsdish</Text>
            <RestaurantList restaurants={restaurants} />
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: Platform.OS === 'ios' ? 0 : StatusBar.currentHeight, // iOS 不需要额外 paddingTop
  },
  container: {
    flex: 1,
    backgroundColor: "#FFF"
  },
  logo: {
    width: 200,
    height: 60,
  },
  topBar: {
    padding: 10,
    backgroundColor: '#fff',
  },
  topBarRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  notificationIcon: {
    marginRight: 16, // 调整通知图标与三点图标之间的间距
  },
  location: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    fontSize: 22,
    fontWeight: 'bold',
    marginRight: 5,
    marginLeft: 10,
    maxWidth: "90%",
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    paddingLeft: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 20,
    height: 45,
    backgroundColor: '#fff',
  },
  searchInput: {
    marginLeft: 10,
    flex: 1,
    height: '100%',
    fontSize: 16,
  },
  menuSection: { 
    padding: 10,
    marginBottom: -10,
  },
  menuRow: { 
    marginTop: 10,
  },
  menuItem: { 
    alignItems: 'center', 
    marginHorizontal: 10,
  },
  menuIcon: { 
    width: 55, 
    height: 55, 
    marginBottom: 5,
  },
  menuTitle: { 
    fontSize: 17, 
    textAlign: 'center',
  },
  sectionTitle:{
    fontSize: 23,
    fontWeight: 'bold',
    marginRight: 5,
    marginLeft: 10,
    maxWidth: "90%",
    marginTop:20
  },
});

export default HomeScreen;