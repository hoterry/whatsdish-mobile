import React, { useState } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useCart } from '../context/CartContext'; // 引入购物车上下文

const ProductDetailScreen = ({ route, navigation }) => {
  const { menuItem, restaurantId } = route.params;  // 确保从上个页面传递了 restaurantId
  const { addToCart } = useCart();  // 获取 addToCart 方法
  const [selectedOption, setSelectedOption] = useState(null);
  const [selectedModifiers, setSelectedModifiers] = useState([]);  // New state for selected modifiers

  const options = [
    { id: 1, name: 'Small', price: menuItem.price },
    { id: 2, name: 'Medium', price: menuItem.price + 2 },
    { id: 3, name: 'Large', price: menuItem.price + 4 },
  ];

  const modifiers = [
    { id: 1, name: 'Extra Cheese', price: 1.5 },
    { id: 2, name: 'Bacon', price: 2 },
    { id: 3, name: 'Avocado', price: 1.8 },
  ];

  const handleAddToCart = () => {
    if (selectedOption) {
      const totalModifiersPrice = selectedModifiers.reduce((total, modifier) => total + modifier.price, 0);
      const itemWithOptionAndModifiers = {
        ...menuItem,
        selectedOption,
        selectedModifiers,
        price: selectedOption.price + totalModifiersPrice,  // Include modifier prices in total
        uniqueId: `${menuItem.id}-${selectedOption?.id || 'default'}-${selectedModifiers.map(m => m.id).join('-')}`, // Combine IDs to prevent overwrites
      };

      addToCart(restaurantId, itemWithOptionAndModifiers, 1); // Pass restaurantId and item with option
      console.log('Added to Cart:', itemWithOptionAndModifiers);
      navigation.goBack();
    } else {
      alert('Please select an option.');
    }
  };

  const toggleModifier = (modifier) => {
    setSelectedModifiers((prevModifiers) => {
      if (prevModifiers.some((m) => m.id === modifier.id)) {
        return prevModifiers.filter((m) => m.id !== modifier.id); // Deselect if already selected
      } else {
        return [...prevModifiers, modifier]; // Add modifier to selected list
      }
    });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={28} color="black" />
      </TouchableOpacity>

      <Image source={{ uri: menuItem.image_url }} style={styles.largeImage} />
      <Text style={styles.name}>{menuItem.name}</Text>
      <Text style={styles.description}>{menuItem.description}</Text>
      <Text style={styles.price}>${selectedOption ? selectedOption.price + selectedModifiers.reduce((total, modifier) => total + modifier.price, 0) : menuItem.price}</Text> {/* Update price with modifiers */}

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

      <View style={styles.modifiersContainer}>
        <Text style={styles.modifiersTitle}>Select Modifiers:</Text>
        {modifiers.map((modifier) => (
          <TouchableOpacity
            key={modifier.id}
            style={[
              styles.modifierButton,
              selectedModifiers.some((m) => m.id === modifier.id) && styles.selectedModifier,
            ]}
            onPress={() => toggleModifier(modifier)}
          >
            <Text style={styles.modifierText}>
              {modifier.name} (+${modifier.price})
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
    marginTop: 40,
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
