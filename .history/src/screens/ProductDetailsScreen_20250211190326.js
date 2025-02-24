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
              styles.optionRow,
              selectedOption?.id === option.id && styles.selectedOption,
            ]}
            onPress={() => setSelectedOption(option)}
          >
            <Text style={styles.optionText}>{option.name} (${option.price})</Text>
            <View style={[styles.radioButton, selectedOption?.id === option.id && styles.selectedRadio]} />
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.modifiersContainer}>
        <Text style={styles.modifiersTitle}>Select Modifiers:</Text>
        {modifiers.map((modifier) => (
          <TouchableOpacity
            key={modifier.id}
            style={[
              styles.optionRow,
              selectedModifiers.some((m) => m.id === modifier.id) && styles.selectedOption,
            ]}
            onPress={() => toggleModifier(modifier)}
          >
            <Text style={styles.optionText}>
              {modifier.name} (+${modifier.price})
            </Text>
            <View style={[styles.radioButton, selectedModifiers.some((m) => m.id === modifier.id) && styles.selectedRadio]} />
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
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
    marginTop: 100
  },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    zIndex: 10,
  },
  largeImage: {
    width: '100%',
    height: 250,
    borderRadius: 10,
    marginBottom: 20,
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
  },
  price: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  optionsContainer: {
    marginBottom: 30,
  },
  optionsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  optionText: {
    fontSize: 16,
    flex: 1, // Ensures text is aligned to the left
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#888',
    backgroundColor: 'white',
  },
  selectedRadio: {
    backgroundColor: '#000', // Green when selected
    borderColor: '#4CAF50',
  },
  selectedOption: {

  },
  modifiersContainer: {
    marginBottom: 30,
  },
  modifiersTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  addToCartButton: {
    padding: 15,
    backgroundColor: '#000',
    borderRadius: 10,
    alignItems: 'center',
  },
  addToCartButtonText: {
    fontSize: 18,
    color: 'white',
    fontWeight: 'bold',
  },
});

export default ProductDetailScreen;
