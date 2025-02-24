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
        marginTop: 8,
        paddingLeft: 8,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 18,
        height: 40,
        backgroundColor: '#fff',
      },
      searchInput: {
        marginLeft: 8,
        flex: 1,
        height: '100%',
        fontSize: 14,
      },
});

export default SearchBar;
