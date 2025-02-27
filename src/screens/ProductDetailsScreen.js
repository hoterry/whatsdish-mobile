import React, { useState, useContext, useEffect } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useCart } from '../context/CartContext';
import { LanguageContext } from '../context/LanguageContext';

const ProductDetailScreen = ({ route, navigation }) => {
  const { menuItem, restaurantId, restaurants  } = route.params;
  const { addToCart } = useCart();
  const [selectedOption, setSelectedOption] = useState(null);
  const [selectedModifiers, setSelectedModifiers] = useState([]);
  const [note, setNote] = useState('');
  const { language } = useContext(LanguageContext);
  const [errorMessage, setErrorMessage] = useState('');

  const options = menuItem.option_groups
    ? menuItem.option_groups.flatMap(group =>
        group.options.map(option => {
          const name = language === 'ZH' && option.name_zh ? option.name : option.name;
          if (__DEV__) {
            console.log(`[Product Detail Screen Log] Option name for language ${language}:`, name); // Log the selected name
          }
          return {
            id: option.id,
            name: name,
            price: option.price,
          };
        })
      )
    : [];
  const modifiers = (menuItem.modifier_groups || []).flatMap(group =>
      group.modifiers
        ? group.modifiers.map(item => {
            const name = language === 'ZH' && item.name_zh ? item.name : item.name;
            return {
              id: item.id,
              name: name,
              price: item.price,
              groupName: group.name,
            };
          })
        : []
    );
    
  useEffect(() => {
    if (__DEV__) {
      console.log("[Product Detail Screen Log] Options available in Product detail Screen:", options);
      console.log("[Product Detail Screen Log] Modifiers available in Product detail Screen:", modifiers);
    }
  }, []); 
  
  useEffect(() => {
    // Check if modifier_groups exist and log each modifier group's items
    if (menuItem.modifier_groups && menuItem.modifier_groups.length > 0) {
      menuItem.modifier_groups.forEach((group, index) => {
        if (__DEV__) {
          console.log(`[Product Detail Screen Log] Modifier Group in Product detail Screen ${index + 1}:`, group.modifier_items); // Log modifier_items array inside each group
        }
      });
    }
  }, [menuItem, options, modifiers]);  // Re-run effect when these values change

  const basePrice = menuItem.price_in_cents ? menuItem.price_in_cents / 100 : 0;
  const optionPrice = selectedOption ? (selectedOption.price ? selectedOption.price / 100 : 0) : 0;
  const totalModifiersPrice = selectedModifiers.reduce(
    (total, modifier) => total + (modifier.price / 100),
    0
  );
  const currentPrice = basePrice + optionPrice + totalModifiersPrice;

  const handleAddToCart = () => {
    if (__DEV__) {
      console.log("[Product Detail Screen Log] Handling Add to Cart...");
    }
  
    const unmetRequirements = menuItem.modifier_groups.some(group =>
      group.minRequired > 0 &&
      selectedModifiers.filter(m => group.modifiers.some(gm => gm.id === m.id)).length < group.minRequired
    );
  
    if (unmetRequirements) {
      setErrorMessage(language === 'ZH' ? '請至少選取一個選項' : 'Please select at least one option');
      return;
    }
  
    setErrorMessage('');
    const selectedOptionId = selectedOption ? selectedOption.id : 'no-option';
    const selectedOptionName = selectedOption ? selectedOption.name : undefined;
  
    const selectedModifiersIds = selectedModifiers.length > 0
      ? selectedModifiers.map(m => m.id).join('-')
      : 'no-modifiers';
  
    const formattedModifiers = selectedModifiers.map((modifier) => ({
      mod_id: modifier.id,
      mod_group_id: menuItem.modifier_groups.find(group =>
        group.modifiers.some(m => m.id === modifier.id)
      )?.id,
      count: 1,
    }));
  
    const itemWithOptionAndModifiers = {
      ...menuItem,
      selectedOption: selectedOption ? { ...selectedOption, name: selectedOptionName } : undefined,
      selectedModifiers: formattedModifiers.length > 0 ? formattedModifiers : undefined,
      price: currentPrice,
      uniqueId: `${menuItem.id}-${selectedOptionId}-${selectedModifiersIds}-${Date.now()}`,
      note: note, 
    };
  
    if (__DEV__) {
      console.log("[Product Detail Screen Log] Item added to cart:", itemWithOptionAndModifiers);
    }
  
    console.log("[DEBUG] Calling addToCart with:", restaurantId, itemWithOptionAndModifiers);
    addToCart(restaurantId, itemWithOptionAndModifiers, 1);
    navigation.goBack();
  };
  

  const toggleModifier = (modifier, group) => {
    if (__DEV__) {
      console.log("[Product Detail Screen Log] Toggling modifier in Product detail Screen:", modifier);
    }
    setSelectedModifiers((prevModifiers) => {
      const currentGroupModifiers = prevModifiers.filter(m => group.modifiers.some(gm => gm.id === m.id));
      if (currentGroupModifiers.some(m => m.id === modifier.id)) {
        return prevModifiers.filter(m => m.id !== modifier.id);
      } else {
        if (currentGroupModifiers.length >= group.maxAllowed) {
          const updatedModifiers = prevModifiers.filter(m => !currentGroupModifiers.includes(m));
          return [...updatedModifiers, modifier];
        }
        return [...prevModifiers, modifier];
      }
    });
  };
  
  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
          <View style={styles.backButtonContainer}>
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
              <Ionicons name="arrow-back" size={28} color="black" />
            </TouchableOpacity>
          </View>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">

        <Image source={{ uri: menuItem.image_url || 'https://res.cloudinary.com/dfbpwowvb/image/upload/v1740026601/WeChat_Screenshot_20250219204307_juhsxp.png' }} style={styles.largeImage} />
        <Text style={styles.name}>{language === 'ZH' ? menuItem.name : menuItem.name}</Text>
        <Text style={styles.description}>{language === 'ZH' ? menuItem.description : menuItem.description}</Text>
        <Text style={styles.price}>${currentPrice.toFixed(2)}</Text>
        <View style={styles.separator} />

        {options.length > 0 && (
          <View style={styles.optionsContainer}>
            <Text style={styles.optionsTitle}>{language === 'ZH' ? '选择大小' : 'Select Size'}:</Text>
            {options.map((option) => (
              <TouchableOpacity
                key={option.id}
                style={[styles.optionRow, selectedOption?.id === option.id && styles.selectedOption]}
                onPress={() => {
                  console.log("Option selected:", option); // Log the selected option
                  setSelectedOption(option);
                }}
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
                <View style={styles.modifierTitleContainer}>
                  <Text style={styles.modifiersTitle}>
                    {language === 'ZH' ? group.name : group.name}
                  </Text>

                  <Text style={styles.modifierLimitText}>
                  {language === 'ZH'
                    ? (group.minRequired === 0 && group.maxAllowed === 0
                        ? ''
                        : ` (最少可選 ${group.minRequired}，最多可選 ${group.maxAllowed} )`)
                    : (group.minRequired === 0 && group.maxAllowed === 0
                        ? ''
                        : group.minRequired === 1
                        ? 'Required'
                        : group.maxAllowed === 1
                        ? ' (Choose up to 1)'
                        : group.maxAllowed > 1
                        ? ` (Choose up to ${group.maxAllowed})`
                        : `Min: ${group.minRequired}, Max: ${group.maxAllowed}`)}
                </Text>

                </View>

                {group.modifiers.map((modifier) => (
                  <TouchableOpacity
                  key={modifier.id}
                  style={[
                    styles.optionRow,
                    selectedModifiers.some((m) => m.id === modifier.id) && styles.selectedOption,
                  ]}
                  onPress={() => toggleModifier(modifier, group)} 
                >
                  <Text style={styles.optionText}>
                    {modifier.name} (+${(modifier.price / 100).toFixed(2)})
                  </Text>
                  <View
                    style={[
                      styles.radioButton,
                      selectedModifiers.some((m) => m.id === modifier.id) && styles.selectedRadio,
                    ]}
                  />
                </TouchableOpacity>

                ))}
              </View>
            ))}
          </View>
        )}
      <Text style={styles.specialInstructionTitle}>Special Instruction</Text>
        <TextInput
          style={styles.noteInput}
          placeholder={language === 'ZH' ? '输入备注...' : 'Enter a note...'}
          value={note}
          onChangeText={setNote}
          multiline
          numberOfLines={3}
        />
      </ScrollView>

      <View style={styles.fixedBottomContainer}>
      <TouchableOpacity 
        style={styles.addToCartButton} 
        onPress={handleAddToCart}
      >
        <Text style={styles.addToCartButtonText}>
          {language === 'ZH' ? '加入购物车' : 'Add to Cart'}
        </Text>
      </TouchableOpacity>
    </View>
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
    width: "100%",
    height: 300,
    borderRadius: 10,
    marginBottom: 30,
    padding: 20,
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
  separator: {
    borderBottomWidth: 1,
    borderBottomColor: '#999', 
    marginBottom: 10
  },
  optionsContainer: {
    marginBottom: 30,
  },
  noteInput: {
    height: 100,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    marginTop: 12,
    marginBottom: 120,
    backgroundColor: '#fff',
    textAlignVertical: 'top', 
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
  specialInstructionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
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
  fixedBottomContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',  
    paddingVertical: 12, 
    paddingHorizontal: 20, 
    borderTopWidth: 1,
    borderTopColor: '#ddd', 
  },
  backButtonContainer: {
    position: 'absolute',
    top: 10, 
    left: 10,
    zIndex: 10,
  },
  modifierTitleContainer: {
    flexDirection: 'row',
    justifyContent: 'left', // Aligns the title and the limit text on the same row
    alignItems: 'center', // Vertically centers both items
    marginTop: 12,
  },
  modifiersTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333', // Adjust the color as needed
    marginVertical: 12,
  },
  modifierLimitText: {
    fontSize: 18,
    color: '#333', // Adjust the color as needed
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 10,
  }
  

});

export default ProductDetailScreen;
