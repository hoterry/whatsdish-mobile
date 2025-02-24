import React, { useState } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // 引入返回图标

const ProductDetailScreen = ({ route, navigation }) => {
  const { menuItem } = route.params; 
  const [selectedOption, setSelectedOption] = useState(null);

  const options = [
    { id: 1, name: 'Small', price: menuItem.price },
    { id: 2, name: 'Medium', price: menuItem.price + 2 },
    { id: 3, name: 'Large', price: menuItem.price + 4 },
  ];

  const handleAddToCart = () => {
    if (selectedOption) {
      const itemWithOption = { ...menuItem, selectedOption };
      console.log('Added to Cart:', itemWithOption);
      navigation.goBack();
    } else {
      alert('Please select an option.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* 返回按钮 */}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={28} color="black" />
      </TouchableOpacity>

      <Image source={{ uri: menuItem.image_url }} style={styles.largeImage} />
      <Text style={styles.name}>{menuItem.name}</Text>
      <Text style={styles.description}>{menuItem.description}</Text>
      <Text style={styles.price}>${menuItem.price}</Text>

      <View style={styles.optionsContainer}>
        <Text style={styles.optionsTitle}>Select Size:</Text>
        {options.map((option) => (
          <TouchableOpacity
            key={option.id}
            style={[
              styles.optionButton,
              selectedOption?.id === option.id && styles.selectedOption,
            ]}
            onPress={() => setSelectedOption(option)}
          >
            <Text style={styles.optionText}>
              {option.name} (${option.price})
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.addToCartButton} onPress={handleAddToCart}>
        <Text style={styles.addToCartButtonText}>Add to Cart</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 16,
    zIndex: 1,
    padding: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 20,
  },
  largeImage: {
    width: '100%',
    height: 300,
    borderRadius: 10,
    marginBottom: 20,
    marginTop: 30,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: '#555',
    marginBottom: 20,
    textAlign: 'center',
  },
  price: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 20,
  },
  optionsContainer: {
    width: '100%',
    marginBottom: 20,
  },
  optionsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  optionButton: {
    padding: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    marginBottom: 10,
    alignItems: 'center',
  },
  selectedOption: {
    borderColor: '#000',
    backgroundColor: '#f0f0f0',
  },
  optionText: {
    fontSize: 16,
  },
  addToCartButton: {
    backgroundColor: '#000',
    padding: 15,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
  },
  addToCartButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default ProductDetailScreen;
