import React from 'react';
import { ScrollView, TouchableOpacity, Text, StyleSheet } from 'react-native';

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

const CLCategoryTabs = ({ categories, selectedCategory, onSelectCategory }) => {
  if (!categories || categories.length === 0) return null;
  
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
    backgroundColor: COLORS.accent, // Sea Green accent color
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

export default CLCategoryTabs;