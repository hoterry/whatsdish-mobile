import React, { useState, useContext, useEffect } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, TextInput, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useCart } from '../context/CartContext';
import { LanguageContext } from '../context/LanguageContext';

const ProductDetailScreen = ({ route, navigation }) => {
  const { menuItem, restaurantId, restaurants } = route.params;
  const { addToCart } = useCart();
  const [selectedModifiers, setSelectedModifiers] = useState([]);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [note, setNote] = useState('');
  const { language } = useContext(LanguageContext);
  const [errorMessage, setErrorMessage] = useState('');

  const variants = menuItem.items || [];
  const hasVariants = variants.length > 0 && menuItem.variant_group;

  useEffect(() => {
    if (__DEV__) {
      console.log("[VARIANT DEBUG] variant_group:", menuItem.variant_group);
      if (menuItem.variant_group) {
        console.log("[VARIANT DEBUG] variant_group.id:", menuItem.variant_group.id);
      }
      console.log("[VARIANT DEBUG] variants:", variants);

      if (variants.length > 0) {
        console.log("[VARIANT DEBUG] First variant:", variants[0]);
        console.log("[VARIANT DEBUG] First variant id:", variants[0].id);
        console.log("[VARIANT DEBUG] First variant gid (if exists):", variants[0].gid);
      }
    }
  }, [menuItem]);

  const modifiers = (menuItem.modifier_groups || []).flatMap(group =>
    group.modifiers
      ? group.modifiers.map(item => {
          const name = language === 'ZH' && item.name_zh ? item.name : item.name;
          return {
            id: item.id,
            name: name,
            price: item.price,
            groupName: group.name,
            groupId: group.id 
          };
        })
      : []
  );

  useEffect(() => {
    if (__DEV__) {
      console.log("[Product Detail Screen Log] Modifiers available:", modifiers);
      console.log("[Product Detail Screen Log] Variants available:", variants);
    }

    if (hasVariants && variants.length > 0 && !selectedVariant) {
      setSelectedVariant(variants[0]);
    }
  }, [menuItem]); 

  const getBasePrice = () => {
    if (selectedVariant) {
      return selectedVariant.fee_in_cents / 100;
    }
    return menuItem.fee_in_cents ? menuItem.fee_in_cents / 100 : 0;
  };

  const basePrice = getBasePrice();
  const totalModifiersPrice = selectedModifiers.reduce(
    (total, modifier) => total + (modifier.price / 100),
    0
  );
  const currentPrice = basePrice + totalModifiersPrice;

  const handleAddToCart = () => {
    if (__DEV__) {
      console.log("[Product Detail Screen Log] Handling Add to Cart...");
    }
  
    if (hasVariants && !selectedVariant) {
      setErrorMessage(language === 'ZH' ? '請選擇規格' : 'Please select a size');
      Alert.alert(
        language === 'ZH' ? '選項不完整' : 'Incomplete Selection',
        language === 'ZH' ? '請選擇規格' : 'Please select a size'
      );
      return;
    }
  
    let unmetRequirements = false;
    if (menuItem.modifier_groups) {
      unmetRequirements = menuItem.modifier_groups.some(group => {
        if (!group.minRequired || group.minRequired <= 0) return false;
        const selectedInGroup = selectedModifiers.filter(mod => mod.groupId === group.id).length;
        return selectedInGroup < group.minRequired;
      });
    }
  
    if (unmetRequirements) {
      setErrorMessage(language === 'ZH' ? '請至少選取一個選項' : 'Please select at least one option');
      Alert.alert(
        language === 'ZH' ? '選項不完整' : 'Incomplete Selection',
        language === 'ZH' ? '請完成所有必選項' : 'Please complete all required selections'
      );
      return;
    }
  
    setErrorMessage('');
    const selectedVariantId = selectedVariant ? selectedVariant.id : 'no-variant';
    const selectedModifiersIds = selectedModifiers.length > 0
      ? selectedModifiers.map(m => m.id).join('-')
      : 'no-modifiers';
  
    const formattedModifiers = selectedModifiers.map((modifier) => ({
      mod_id: modifier.id,
      mod_group_id: modifier.groupId,
      name: modifier.name,
      price: modifier.price, 
      count: 1,
    }));
  
    const itemWithOptionsAndVariants = {
      ...(selectedVariant || menuItem),
      gid: selectedVariant?.gid || menuItem.gid || restaurantId,
      selectedModifiers: formattedModifiers,
      selectedVariant: selectedVariant ? {
        id: selectedVariant.id,
        name: selectedVariant.name,
        price: selectedVariant.fee_in_cents / 100
      } : null,
      price: basePrice,
      uniqueId: `${(selectedVariant || menuItem).id}-${selectedModifiersIds}-${Date.now()}`,
      note: note,
    };
  
    // 🛠️ 在這裡檢查 `gid` 是否存在
    console.log("[DEBUG] gid:", itemWithOptionsAndVariants.gid);
    console.log("[DEBUG] Complete Item Data:", itemWithOptionsAndVariants);
  
    addToCart(restaurantId, itemWithOptionsAndVariants, 1);
    navigation.goBack();
  };
  

  const toggleModifier = (modifier, group) => {
    if (__DEV__) {
      console.log("[Product Detail Screen Log] Toggling modifier:", modifier);
    }

    setSelectedModifiers((prevModifiers) => {
      const isAlreadySelected = prevModifiers.some(m => m.id === modifier.id);

      if (isAlreadySelected) {
        return prevModifiers.filter(m => m.id !== modifier.id);
      } else {
        const selectedInGroup = prevModifiers.filter(m => m.groupId === group.id).length;

        if (group.maxAllowed && selectedInGroup >= group.maxAllowed) {
          const oldestInGroup = prevModifiers.find(m => m.groupId === group.id);

          if (oldestInGroup) {
            const withoutOldest = prevModifiers.filter(m => m.id !== oldestInGroup.id);
            return [...withoutOldest, {...modifier, groupId: group.id}];
          }
        }

        return [...prevModifiers, {...modifier, groupId: group.id}];
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
        <Image 
          source={{ uri: (selectedVariant || menuItem).image_url || 'https://res.cloudinary.com/dfbpwowvb/image/upload/v1740026601/WeChat_Screenshot_20250219204307_juhsxp.png' }} 
          style={styles.largeImage} 
        />
        <Text style={styles.name}>{language === 'ZH' ? (selectedVariant || menuItem).name : (selectedVariant || menuItem).name}</Text>
        <Text style={styles.description}>{language === 'ZH' ? (selectedVariant || menuItem).description : (selectedVariant || menuItem).description}</Text>
        <Text style={styles.price}>${currentPrice.toFixed(2)}</Text>
        <View style={styles.separator} />

        {errorMessage ? <Text style={styles.errorMessage}>{errorMessage}</Text> : null}

        {hasVariants && (
          <View style={styles.variantsContainer}>
            <Text style={styles.variantsTitle}>
              {language === 'ZH' ? '選擇規格' : 'Select Size'}:
            </Text>
            {variants.map((variant) => (
              <TouchableOpacity
                key={variant.id}
                style={[
                  styles.optionRow,
                  selectedVariant?.id === variant.id && styles.selectedOption
                ]}
                onPress={() => setSelectedVariant(variant)}
              >
                <Text style={styles.optionText}>
                  {variant.name} (${(variant.fee_in_cents / 100).toFixed(2)})
                </Text>
                <View 
                  style={[
                    styles.radioButton,
                    selectedVariant?.id === variant.id && styles.selectedRadio
                  ]} 
                />
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
                        : ` (最少選 ${group.minRequired}，最多可選 ${group.maxAllowed} )`)
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

                {group.modifiers && group.modifiers.map((modifier) => (
                  <TouchableOpacity
                    key={modifier.id}
                    style={[
                      styles.optionRow,
                      selectedModifiers.some((m) => m.id === modifier.id) && styles.selectedOption,
                    ]}
                    onPress={() => toggleModifier({...modifier, groupId: group.id}, group)} 
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

      <View style={[styles.fixedBottomContainer, { paddingBottom: Platform.OS === 'android' ? 0 : 20 }]}>
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
    marginBottom: 20
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
    justifyContent: 'left', 
    alignItems: 'center', 
    marginTop: 12,
  },
  modifiersTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333', 
    marginVertical: 12,
  },
  modifierLimitText: {
    fontSize: 18,
    color: '#333', 
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 10,
  },
  variantsContainer: {
    marginBottom: 20,
  },
  variantsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  errorMessage: {
    color: 'red',
    fontSize: 16,
    marginVertical: 10,
    textAlign: 'center',
  },

});

export default ProductDetailScreen;
