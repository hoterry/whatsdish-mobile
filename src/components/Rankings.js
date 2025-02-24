import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
} from 'react-native';

const SCREEN_WIDTH = Dimensions.get('window').width;

const dataSets = {
  'Top of the week': [
    { id: '1', name: 'Sushi Roll', description: 'Toku Japanese Restaurant', rank: 1 },
    { id: '2', name: 'Gyudon', description: 'Pouns Steak', rank: 2 },
    { id: '3', name: 'Fried Rice', description: 'Peaches Cafe', rank: 3 },
    { id: '4', name: 'Tempura', description: 'Sakura Japanese', rank: 4 },
    { id: '5', name: 'Ramen', description: 'Noodle House', rank: 5 },
  ],
  'Top of today': [
    { id: '1', name: 'Burger King', description: 'Best Burgers in Town', rank: 1 },
    { id: '2', name: 'Pizza Hut', description: 'Delicious Pizzas', rank: 2 },
    { id: '3', name: 'Pasta Express', description: 'Quick Pasta Dishes', rank: 3 },
  ],
  'Top new restaurant': [
    { id: '1', name: 'Korean BBQ', description: 'Amazing BBQ Experience', rank: 1 },
    { id: '2', name: 'Vegan Delight', description: 'Plant-based Menus', rank: 2 },
    { id: '3', name: 'Seafood Heaven', description: 'Fresh Seafood Specialties', rank: 3 },
  ],
};

const rankTypes = Object.keys(dataSets);

const Rankings = () => {
  const [activeIndex, setActiveIndex] = useState(0); 
  const flatListRef = useRef(null); 

  const handleTitlePress = (index) => {
    setActiveIndex(index);
    flatListRef.current.scrollToOffset({ offset: index * SCREEN_WIDTH, animated: true });
  };

  const handleContentScroll = (event) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / SCREEN_WIDTH);
    setActiveIndex(index); 
  };

  // 渲染标题
  const renderTitles = () => (
    <View style={styles.rankHeader}>
      {rankTypes.map((type, index) => (
        <TouchableOpacity
          key={type}
          style={[styles.rankTypeButton, activeIndex === index && styles.selectedRankTypeButton]}
          onPress={() => handleTitlePress(index)}
        >
          <Text style={[styles.rankTypeText, activeIndex === index && styles.selectedRankTypeText]}>
            {type}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  // 渲染内容卡片
  const renderContent = ({ item }) => (
    <View style={styles.rankItem}>
      <Text style={styles.rankText}>{item.rank}</Text>
      <View style={styles.rankInfo}>
        <Text style={styles.rankName}>{item.name}</Text>
        <Text style={styles.rankDescription}>{item.description}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.rankSection}>
      {renderTitles()}

      <FlatList
        ref={flatListRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        data={rankTypes.map((type, index) => ({
          key: index.toString(),
          data: dataSets[type],
        }))}
        keyExtractor={(item) => item.key}
        onScroll={handleContentScroll}
        renderItem={({ item }) => (
          <FlatList
            data={item.data}
            keyExtractor={(item) => item.id}
            renderItem={renderContent}
            contentContainerStyle={styles.contentContainer}
          />
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  rankSection: {
    flex: 1,
    paddingVertical: 20,
  },
  rankHeader: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  rankTypeButton: {
    paddingBottom: 5,
  },
  selectedRankTypeButton: {
    borderBottomWidth: 2,
    borderBottomColor: '#000',
  },
  rankTypeText: {
    fontSize: 18,
    color: '#aaa',
  },
  selectedRankTypeText: {
    color: '#000',
    fontWeight: 'bold',
  },
  rankItem: {
    width: SCREEN_WIDTH - 40,
    backgroundColor: '#f4f4f4',
    borderRadius: 10,
    marginHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
  },
  rankText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  rankInfo: {
    flex: 1,
  },
  rankName: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  rankDescription: {
    fontSize: 14,
    color: '#555',
  },
});

export default Rankings;
