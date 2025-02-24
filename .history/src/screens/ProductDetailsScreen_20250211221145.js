import React, { useState, useContext } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useCart } from '../context/CartContext'; // 引入购物车上下文
import { LanguageContext } from '../context/LanguageContext';  // 引入语言上下文

const ProductDetailScreen = ({ route, navigation }) => {
  const { menuItem, restaurantId } = route.params;  // 确保从上个页面传递了 restaurantId
  const { addToCart } = useCart();  // 获取 addToCart 方法
  const [selectedOption, setSelectedOption] = useState(null);
  const [selectedModifiers, setSelectedModifiers] = useState([]);  // 用于存储选中的修改器
  const { language } = useContext(LanguageContext);  // 获取当前语言

  const options = [
    { id: 1, name: language === 'ZH' ? '小号' : 'Small', price: menuItem.price },
    { id: 2, name: language === 'ZH' ? '中号' : 'Medium', price: menuItem.price + 2 },
    { id: 3, name: language === 'ZH' ? '大号' : 'Large', price: menuItem.price + 4 },
  ];

  // 确保 menuItem 的 modifier_groups 是存在且有效的
  const modifiers = (menuItem.modifier_groups || []).flatMap(group =>
    group.modifier_items ? group.modifier_items.map(item => ({
      id: item.id,
      name: language === 'ZH' ? item.name_zh : item.name,
      price: item.price,
    })) : []
  );

  const handleAddToCart = () => {
    if (selectedOption) {
      const totalModifiersPrice = selectedModifiers.reduce((total, modifier) => total + modifier.price, 0);
      const itemWithOptionAndModifiers = {
        ...menuItem,
        selectedOption,
        selectedModifiers,
        price: selectedOption.price + totalModifiersPrice,  // 包括修改器的价格
        uniqueId: `${menuItem.id}-${selectedOption.id}-${selectedModifiers.map(m => m.id).join('-')}`, // 生成唯一的 uniqueId
      };
  
      addToCart(restaurantId, itemWithOptionAndModifiers, 1); // 添加到购物车
      console.log('Added to Cart:', itemWithOptionAndModifiers);
      navigation.goBack();
    } else {
      alert(language === 'ZH' ? '请选择一个选项' : 'Please select an option.');
    }
  };

  const toggleModifier = (modifier) => {
    setSelectedModifiers((prevModifiers) => {
      if (prevModifiers.some((m) => m.id === modifier.id)) {
        return prevModifiers.filter((m) => m.id !== modifier.id); // 如果已经选择过，则取消选择
      } else {
        return [...prevModifiers, modifier]; // 否则，添加到选中的修改器列表
      }
    });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={28} color="black" />
      </TouchableOpacity>

      <Image source={{ uri: menuItem.image_url }} style={styles.largeImage} />
      <Text style={styles.name}>{language === 'ZH' ? menuItem.name_zh : menuItem.name}</Text>
      <Text style={styles.description}>{language === 'ZH' ? menuItem.description_zh : menuItem.description}</Text>
      <Text style={styles.price}>${selectedOption ? selectedOption.price + selectedModifiers.reduce((total, modifier) => total + modifier.price, 0) : menuItem.price}</Text>

      <View style={styles.optionsContainer}>
        <Text style={styles.optionsTitle}>{language === 'ZH' ? '选择大小' : 'Select Size'}:</Text>
        {options.map((option) => (
          <TouchableOpacity
            key={option.id}
            style={[styles.optionRow, selectedOption?.id === option.id && styles.selectedOption]}
            onPress={() => setSelectedOption(option)}
          >
            <Text style={styles.optionText}>{option.name} (${option.price})</Text>
            <View style={[styles.radioButton, selectedOption?.id === option.id && styles.selectedRadio]} />
          </TouchableOpacity>
        ))}
      </View>

      {/* 确保 modifiers 数据存在并正确渲染 */}
      {modifiers.length > 0 && (
        <View style={styles.modifiersContainer}>
          <Text style={styles.modifiersTitle}>{language === 'ZH' ? '选择修改器' : 'Select Modifiers'}:</Text>
          {modifiers.map((modifier) => (
            <TouchableOpacity
              key={modifier.id}
              style={[styles.optionRow, selectedModifiers.some((m) => m.id === modifier.id) && styles.selectedOption]}
              onPress={() => toggleModifier(modifier)}
            >
              <Text style={styles.optionText}>
                {modifier.name} (+${modifier.price})
              </Text>
              <View style={[styles.radioButton, selectedModifiers.some((m) => m.id === modifier.id) && styles.selectedRadio]} />
            </TouchableOpacity>
          ))}
        </View>
      )}

      <TouchableOpacity style={styles.addToCartButton} onPress={handleAddToCart}>
        <Text style={styles.addToCartButtonText}>{language === 'ZH' ? '加入购物车' : 'Add to Cart'}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
