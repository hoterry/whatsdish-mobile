import React, { useState, useContext } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useCart } from '../context/CartContext'; // 引入购物车上下文
import { LanguageContext } from '../context/LanguageContext';  // 引入语言上下文

const ProductDetailScreen = ({ route, navigation }) => {
  const { menuItem, restaurantId } = route.params;  // 确保从上个页面传递了 restaurantId
  const { addToCart } = useCart();  // 获取 addToCart 方法
  const [selectedOption, setSelectedOption] = useState(null);
  const [selectedModifiers, setSelectedModifiers] = useState([]);  // New state for selected modifiers
  const { language } = useContext(LanguageContext);  // 获取当前语言

  const options = [
    { id: 1, name: language === 'ZH' ? '小号' : 'Small', price: menuItem.price },
    { id: 2, name: language === 'ZH' ? '中号' : 'Medium', price: menuItem.price + 2 },
    { id: 3, name: language === 'ZH' ? '大号' : 'Large', price: menuItem.price + 4 },
  ];

  const modifiers = [
    { id: 1, name: language === 'ZH' ? '额外奶酪' : 'Extra Cheese', price: 1.5 },
    { id: 2, name: language === 'ZH' ? '培根' : 'Bacon', price: 2 },
    { id: 3, name: language === 'ZH' ? '鳄梨' : 'Avocado', price: 1.8 },
  ];

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
      <Text style={styles.name}>{language === 'ZH' ? menuItem.name_zh : menuItem.name}</Text>
      <Text style={styles.description}>{language === 'ZH' ? menuItem.description_zh : menuItem.description}</Text>
      <Text style={styles.price}>${selectedOption ? selectedOption.price + selectedModifiers.reduce((total, modifier) => total + modifier.price, 0) : menuItem.price}</Text>

      <View style={styles.optionsContainer}>
        <Text style={styles.optionsTitle}>{language === 'ZH' ? '选择大小' : 'Select Size'}:</Text>
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
        <Text style={styles.modifiersTitle}>{language === 'ZH' ? '选择修改器' : 'Select Modifiers'}:</Text>
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
        <Text style={styles.addToCartButtonText}>{language === 'ZH' ? '加入购物车' : 'Add to Cart'}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};
  
  const styles = StyleSheet.create({
  categoryHeader: {
    fontSize: 20,
    fontFamily: 'Urbanist-ExtraBold',
    fontWeight: 'bold',
    marginVertical: 10,
    paddingHorizontal: 15,
    marginBottom: 5,
  },
  name: {
    fontSize: 18,
    fontFamily: 'Quicksand-Bold',
    marginBottom: 5,
    maxWidth: 240,
  },
  description: {
    fontSize: 16,
    color: '#555',
    marginBottom: 5,
    lineHeight: 20,
    maxHeight: 48, // 限制最大高度，防止过长的描述
    maxWidth: 240,
    overflow: 'hidden', // 超出部分隐藏
    textOverflow: 'ellipsis', // 添加省略号
    whiteSpace: 'nowrap', // 防止换行，保持单行显示
  },
  price: {
    fontSize: 16,
    color: '#000',
    marginBottom: 10,
  },
  menuItem: {
    flexDirection: 'row',  // 保持左右排布
    padding: 15,
    marginBottom: 0,
    backgroundColor: '#fff',
    borderRadius: 10,
    alignItems: 'center', // 确保内容垂直居中
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    height: 130,  // 固定高度，确保图片和文字在同一高度
    justifyContent: 'space-between',  // 让内容分布在两端
    width: '100%',  // 确保占满屏幕宽度
  },
  info: {
    flex: 1,  // 让文本占用剩余空间
    marginRight: 15,  // 保持与图片的间距
    justifyContent: 'center',  // 确保文本垂直居中
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: 10,
    resizeMode: 'cover',
  },
  categoryList: {
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  categoryItem: {
    marginRight: 20,
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  selectedCategory: {
    borderBottomWidth: 2.5,
    borderBottomColor: 'black',
  },
  categoryText: {
    fontSize: 18,
    color: '#333',
    lineHeight: 29,
    textAlignVertical: 'center',
  },
  flatList: {
    marginBottom: '180%',
  },
  addButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',  // 半透明的黑色背景
    width: 30,  // 按钮宽度
    height: 30, // 按钮高度
    borderRadius: 50,  // 圆形按钮
    position: 'absolute',
    bottom: 15,
    right: 15,
    justifyContent: 'center',  // 垂直居中
    alignItems: 'center',  // 水平居中
  },
  addButtonText: {
    color: '#fff',
    fontSize: 20,  // 增大“+”符号的字体大小
    fontWeight: 'bold', // 加粗
  },
  viewCartButton: {
    position: 'absolute',
    top: '38%',
    left: 20,
    backgroundColor: '#000',
    padding: 10,
    borderRadius: 5,
    zIndex: 999,
    width: '90%',
    height: '4%',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  viewCartButtonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
});

  
export default MenuSection;
