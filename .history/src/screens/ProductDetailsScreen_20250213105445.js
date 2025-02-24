import React, { useState, useContext } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, TextInput  } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useCart } from '../context/CartContext';
import { LanguageContext } from '../context/LanguageContext';

const ProductDetailScreen = ({ route, navigation }) => {
  const { menuItem, restaurantId } = route.params;
  const { addToCart } = useCart();
  const [selectedOption, setSelectedOption] = useState(null);
  const [selectedModifiers, setSelectedModifiers] = useState([]);
  const [note, setNote] = useState(''); 
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
        <TextInput
        style={styles.noteInput}
        placeholder={language === 'ZH' ? '输入备注...' : 'Enter a note...'}
        value={note}
        onChangeText={setNote}
        multiline
        numberOfLines={3}
      />

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
    flexGrow: 1,
    padding: 20,
    backgroundColor: "#fff",
    paddingTop: 50,
  },
  backButton: {
    position: 'absolute',
    top: 50,
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
  noteInput: {
    height: 80,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    marginTop: 12,
    backgroundColor: '#f9f9f9',
    textAlignVertical: 'top', // 確保文本從頂部開始
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
    maxWidth: 350
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
    marginBottom: 50
  },
  addToCartButtonText: {
    fontSize: 18,
    color: 'white',
    fontWeight: 'bold',
  },
});

export default ProductDetailScreen;
