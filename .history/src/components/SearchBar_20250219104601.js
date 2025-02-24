import React, { useState } from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const SearchBar = ({ onSearchChange, placeholder }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleTextChange = (text) => {
    setSearchQuery(text);
    onSearchChange(text); // 把文字變化傳遞給父組件
  };

  return (
    <View style={styles.searchBar}>
      <Ionicons name="search-outline" size={20} color="#aaa" />
      <TextInput
        placeholder={placeholder}
        style={styles.searchInput}
        value={searchQuery}
        onChangeText={handleTextChange}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
  },
});

export default SearchBar;
