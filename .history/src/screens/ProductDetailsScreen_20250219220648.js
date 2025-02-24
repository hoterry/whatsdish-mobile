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

  // Prepare the options with localized names
  const options = menuItem.option_groups
    ? menuItem.option_groups.flatMap(group =>
        group.options.map(option => {
          const name = language === 'ZH' && option.name_zh ? option.name_zh : option.name;
          console.log(`Option name for language ${language}:`, name); // Log the selected name
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
            const name = language === 'ZH' && item.name_zh ? item.name_zh : item.name;
            return {
              id: item.id,
              name: name,
              price: item.price,
              groupName: group.name, // 讓 UI 顯示分組名稱
            };
          })
        : []
    );
    

  useEffect(() => {
    console.log("Restaurants data in ProductDetailScreen:", restaurants);  // 日誌 restaurants 數據
  }, [restaurants]);

  useEffect(() => {
    console.log("Menu Item in Product Detail:", menuItem);
    console.log("Options available:", options);
    console.log("Modifiers available:", modifiers);
  }, []);  // 這樣會在組件第一次加載時觸發一次
  
  useEffect(() => {
    console.log("Menu Item in Product Detail:", menuItem); // Log the entire menu item
    
    // Check if modifier_groups exist and log each modifier group's items
    if (menuItem.modifier_groups && menuItem.modifier_groups.length > 0) {
      menuItem.modifier_groups.forEach((group, index) => {
        console.log(`Modifier Group ${index + 1}:`, group.modifier_items); // Log modifier_items array inside each group
      });
    }
  
    console.log("Options available:", options); // Log options after they are prepared
    console.log("Modifiers available:", modifiers); // Log modifiers after they are prepared
  }, [menuItem, options, modifiers]);  // Re-run effect when these values change

  const basePrice = menuItem.price_in_cents ? menuItem.price_in_cents / 100 : 0;
  const optionPrice = selectedOption ? (selectedOption.price ? selectedOption.price / 100 : 0) : 0;
  const totalModifiersPrice = selectedModifiers.reduce(
    (total, modifier) => total + (modifier.price / 100),
    0
  );
  const currentPrice = basePrice + optionPrice + totalModifiersPrice;
  

const handleAddToCart = () => {
  console.log("Handling Add to Cart...");
  
  // 確保所有有 minRequired > 0 的分組都有選到足夠數量
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

  const itemWithOptionAndModifiers = {
    ...menuItem,
    selectedOption: selectedOption ? { ...selectedOption, name: selectedOptionName } : undefined,
    selectedModifiers: selectedModifiers.length > 0 ? selectedModifiers : undefined,
    price: currentPrice,
    uniqueId: `${menuItem.id}-${selectedOptionId}-${selectedModifiersIds}-${Date.now()}`,
  };

  console.log("Item added to cart:", itemWithOptionAndModifiers);
  addToCart(restaurantId, itemWithOptionAndModifiers, 1);
  navigation.goBack();
};
  

  const toggleModifier = (modifier, group) => {
    console.log("Toggling modifier:", modifier);
  
    setSelectedModifiers((prevModifiers) => {
      // 過濾出當前 modifier group 的已選選項
      const currentGroupModifiers = prevModifiers.filter(m => group.modifiers.some(gm => gm.id === m.id));
  
      if (currentGroupModifiers.some(m => m.id === modifier.id)) {
        // 如果點選的選項已選中，則取消選擇
        return prevModifiers.filter(m => m.id !== modifier.id);
      } else {
        // 如果超過 maxAllowed，就替換最舊的選擇
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
        <Text style={styles.name}>{language === 'ZH' ? menuItem.name_zh : menuItem.name}</Text>
        <Text style={styles.description}>{language === 'ZH' ? menuItem.description_zh : menuItem.description}</Text>
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
            {language === 'ZH' ? group.name_zh : group.name}
          </Text>

          <Text style={styles.modifierLimitText}>
            {language === 'ZH'
              ? `最少选择 ${group.minRequired} 项，最多选择 ${group.maxAllowed} 项`
              : group.minRequired === 1
              ? 'Required'
              : group.maxAllowed === 1
              ? ' (Choose up to 1)'
              : group.maxAllowed === 2
              ? ' (Choose up to 2)'
              : group.maxAllowed === 3
              ? ' (Choose up to 3)'
              : `Min: ${group.minRequired}, Max: ${group.maxAllowed}`}
          </Text>
        </View>

        {group.modifiers.map((modifier) => (
          <TouchableOpacity
  key={modifier.id}
  style={[
    styles.optionRow,
    selectedModifiers.some((m) => m.id === modifier.id) && styles.selectedOption,
  ]}
  onPress={() => toggleModifier(modifier, group)} // 傳遞 group 以確認 maxAllowed 限制
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
    height: 400,
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
    borderBottomWidth: 1, // 設置為 2 讓它更粗
    borderBottomColor: '#999', // 設置顏色，可以根據需求改變
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
    backgroundColor: '#fff',  // 背景顏色，避免遮擋內容
    paddingVertical: 12,  // 垂直內邊距
    paddingHorizontal: 20, // 左右間距
    borderTopWidth: 1,
    borderTopColor: '#ddd', // 增加頂部邊框
  },
  backButtonContainer: {
    position: 'absolute',
    top: 10, // 根據需要調整
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
