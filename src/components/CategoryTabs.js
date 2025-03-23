import React from 'react';
import { ScrollView, TouchableOpacity, Text, StyleSheet } from 'react-native';

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

const CategoryTabs = ({ categories, selectedCategory, onSelectCategory }) => {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.categoriesContainer}
    >
      {categories.map((category, index) => (
        <TouchableOpacity
          key={index}
          style={[
            styles.categoryTab,
            selectedCategory === category && styles.selectedCategoryTab
          ]}
          onPress={() => onSelectCategory(category)}
        >
          <Text
            style={[
              styles.categoryText,
              selectedCategory === category && styles.selectedCategoryText
            ]}
          >
            {category}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  categoriesContainer: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: COLORS.white,
  },
  categoryTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: COLORS.lighter,
    marginRight: 10,
  },
  selectedCategoryTab: {
    backgroundColor: COLORS.primary,
  },
  categoryText: {
    color: COLORS.secondary,
    fontWeight: '500',
    fontSize: 14,
  },
  selectedCategoryText: {
    color: COLORS.white,
  }
});

export default CategoryTabs;