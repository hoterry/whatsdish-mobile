import React, { useState, useContext } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useCart } from '../context/CartContext';
import { LanguageContext } from '../context/LanguageContext';

const ProductDetailScreen = ({ route, navigation }) => {
  const { menuItem, restaurantId } = route.params;
  const { addToCart } = useCart();
  const [selectedOption, setSelectedOption] = useState(null);
  const [selectedModifiers, setSelectedModifiers] = useState([]);
  const { language } = useContext(LanguageContext);
  const options = menuItem.option_groups
    ? menuItem.option_groups.flatMap(group =>
        group.options.map(option => ({
          id: option.id,
          name: language === 'ZH' ? option.name_zh : option.name,
          price: option.price,
        }))
      )
    : [];

  const modifiers = (menuItem.modifier_groups || []).flatMap(group =>
    group.modifier_items
      ? group.modifier_items.map(item => ({
          id: item.id,
          name: language === 'ZH' ? item.name_zh : item.name,
          price: item.price,
        }))
      : []
  );

  const totalModifiersPrice = selectedModifiers.reduce((total, modifier) => total + modifier.price, 0);
  const currentPrice = (selectedOption ? selectedOption.price : menuItem.price) + totalModifiersPrice;

  const handleAddToCart = () => {
    const selectedOptionId = selectedOption ? selectedOption.id : 'no-option';
    const selectedModifiersIds = selectedModifiers.length > 0 ? selectedModifiers.map(m => m.id).join('-') : 'no-modifiers';

    const itemWithOptionAndModifiers = {
      ...menuItem,
      selectedOption,
      selectedModifiers,
      price: currentPrice,
      uniqueId: `${menuItem.id}-${selectedOptionId}-${selectedModifiersIds}-${Date.now()}`,
    };

    addToCart(restaurantId, itemWithOptionAndModifiers, 1);
    navigation.goBack();
  };

  const toggleModifier = (modifier) => {
    setSelectedModifiers((prevModifiers) => {
      if (prevModifiers.some((m) => m.id === modifier.id)) {
        return prevModifiers.filter((m) => m.id !== modifier.id);
      } else {
        return [...prevModifiers, modifier];
      }
    });
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={28} color="black" />
        </TouchableOpacity>

        <Image source={{ uri: menuItem.image_url }} style={styles.largeImage} />
        <Text style={styles.name}>{language === 'ZH' ? menuItem.name_zh : menuItem.name}</Text>
        <Text style={styles.description}>{language === 'ZH' ? menuItem.description_zh : menuItem.description}</Text>
        <Text style={styles.price}>${currentPrice.toFixed(2)}</Text>

        {options.length > 0 && (
          <View style={styles.optionsContainer}>
            <Text style={styles.optionsTitle}>{language === 'ZH' ? '选择大小' : 'Select Size'}:</Text>
            {options.map((option) => (
              <TouchableOpacity
                key={option.id}
                style={[styles.optionRow, selectedOption?.id === option.id && styles.selectedOption]}
                onPress={() => setSelectedOption(option)}
              >
                <Text style={styles.optionText}>{option.name} (${option.price.toFixed(2)})</Text>
                <View style={[styles.radioButton, selectedOption?.id === option.id && styles.selectedRadio]} />
              </TouchableOpacity>
            ))}
          </View>
        )}

        {modifiers.length > 0 && (
          <View style={styles.modifiersContainer}>
            {menuItem.modifier_groups.map((group) => (
              <View key={group.id}>
                <Text style={styles.modifiersTitle}>{language === 'ZH' ? group.name_zh : group.name}</Text>
                {group.modifier_items.map((modifier) => (
                  <TouchableOpacity
                    key={modifier.id}
                    style={[styles.optionRow, selectedModifiers.some((m) => m.id === modifier.id) && styles.selectedOption]}
                    onPress={() => toggleModifier(modifier)}
                  >
                    <Text style={styles.optionText}>{modifier.name} (+${modifier.price.toFixed(2)})</Text>
                    <View style={[styles.radioButton, selectedModifiers.some((m) => m.id === modifier.id) && styles.selectedRadio]} />
                  </TouchableOpacity>
                ))}
              </View>
            ))}
          </View>
        )}

        <TouchableOpacity style={styles.addToCartButton} onPress={handleAddToCart}>
          <Text style={styles.addToCartButtonText}>{language === 'ZH' ? '加入购物车' : 'Add to Cart'}</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flexGrow: 1,
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 10,
    zIndex: 1,
  },
  largeImage: {
    width: '100%',
    height: 300,
    borderRadius: 10,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  description: {
    fontSize: 16,
    color: '#555',
    marginBottom: 10,
  },
  price: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 20,
  },
  optionsContainer: {
    marginBottom: 20,
  },
  optionsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  optionText: {
    fontSize: 16,
    flex: 1,
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderColor: '#aaa',
    borderWidth: 2,
    marginLeft: 10,
  },
  selectedRadio: {
    backgroundColor: '#000',
  },
  selectedOption: {
    backgroundColor: '#f0f0f0',
  },
  modifiersContainer: {
    marginBottom: 20,
  },
  modifiersTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  addToCartButton: {
    backgroundColor: '#000',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  addToCartButtonText: {
    color: '#fff',
    fontSize: 18,
  },
});

export default ProductDetailScreen;
