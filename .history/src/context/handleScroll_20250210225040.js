// CategorySelector.js
import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';

const CategorySelector = ({ groupedMenu, selectedCategory, onCategoryClick }) => {
  return (
    <ScrollView
      horizontal
      style={styles.categoryList}
      showsHorizontalScrollIndicator={false}
    >
      {groupedMenu.map((category, index) => (
        <TouchableOpacity
          key={category.category_name}
          style={[styles.categoryItem, selectedCategory === category.category_name && styles.selectedCategory]}
          onPress={() => onCategoryClick(category.category_name, index)}
        >
          <Text style={styles.categoryText}>{category.category_name}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  categoryList: {
    marginBottom: 10,
  },
  categoryItem: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  selectedCategory: {
    borderBottomWidth: 2,
    borderBottomColor: '#007bff',
  },
  categoryText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default CategorySelector;
